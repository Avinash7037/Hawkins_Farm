const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const onlineUsers = new Map();

const initializeSocket = (io) => {
  // =====================================================
  // Socket Authentication
  // =====================================================

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  // =====================================================
  // Connection
  // =====================================================

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    console.log(`Socket connected: ${userId}`);

    // Store socket
    onlineUsers.set(userId, socket.id);

    // Join personal room
    socket.join(userId);

    // Notify everyone about online users
    io.emit("onlineUsers", [...onlineUsers.keys()]);

    // ===================================================
    // Typing
    // ===================================================

    socket.on("typing", (receiverId) => {
      if (!receiverId) return;

      io.to(receiverId).emit("typing", {
        senderId: userId,
      });
    });

    // ===================================================
    // Stop Typing
    // ===================================================

    socket.on("stopTyping", (receiverId) => {
      if (!receiverId) return;

      io.to(receiverId).emit("stopTyping", {
        senderId: userId,
      });
    });

    // ===================================================
    // Send Message
    // ===================================================

    socket.on("sendMessage", async (data, callback) => {
      try {
        const { receiver, message } = data;

        // Validate receiver
        if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
          const error = {
            success: false,
            message: "Invalid receiver ID",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // Validate message
        if (!message?.trim()) {
          const error = {
            success: false,
            message: "Message cannot be empty",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // Prevent self messaging
        if (receiver === userId) {
          const error = {
            success: false,
            message: "You cannot message yourself",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // Check receiver exists
        const receiverUser = await User.findById(receiver);

        if (!receiverUser) {
          const error = {
            success: false,
            message: "Receiver not found",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // Save message to MongoDB
        const chat = await Chat.create({
          sender: socket.user._id,
          receiver,
          message: message.trim(),
        });

        // Populate sender and receiver
        const populatedChat = await Chat.findById(chat._id)
          .populate("sender", "name role")
          .populate("receiver", "name role");

        // Send to receiver
        io.to(receiver).emit("receiveMessage", populatedChat);

        // Send back to sender
        socket.emit("receiveMessage", populatedChat);

        // Success callback
        if (callback) {
          callback({
            success: true,
            message: "Message sent successfully",
            chat: populatedChat,
          });
        }
      } catch (error) {
        console.error("Socket message error:", error.message);

        const response = {
          success: false,
          message: "Failed to send message",
        };

        socket.emit("messageError", response);

        if (callback) {
          callback(response);
        }
      }
    });

    // ===================================================
    // Disconnect
    // ===================================================

    socket.on("disconnect", () => {
      // Only remove this socket if it is still
      // the active socket for the user.
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
      }

      io.emit("onlineUsers", [...onlineUsers.keys()]);

      console.log(`Socket disconnected: ${userId}`);
    });
  });
};

module.exports = initializeSocket;
