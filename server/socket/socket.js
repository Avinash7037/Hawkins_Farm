const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Auction = require("../models/auctionModel");

// =====================================================
// Online Users
// =====================================================

const onlineUsers = new Map();

// =====================================================
// Auction Room Helper
// =====================================================

const getAuctionRoom = (auctionId) => {
  return `auction:${auctionId}`;
};

// =====================================================
// Initialize Socket
// =====================================================

const initializeSocket = (io) => {
  // ===================================================
  // Socket Authentication
  // ===================================================

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
      console.error("Socket authentication error:", error.message);

      next(new Error("Socket authentication failed"));
    }
  });

  // ===================================================
  // Connection
  // ===================================================

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    console.log(`Socket connected: ${socket.user.name} (${userId})`);

    // -------------------------------------------------
    // Store Socket
    // -------------------------------------------------

    onlineUsers.set(userId, socket.id);

    // -------------------------------------------------
    // Personal Room
    // -------------------------------------------------

    socket.join(userId);

    // -------------------------------------------------
    // Notify All Clients
    // -------------------------------------------------

    io.emit("onlineUsers", [...onlineUsers.keys()]);

    // =================================================
    // CHAT
    // =================================================

    // =================================================
    // Typing
    // =================================================

    socket.on("typing", (receiverId) => {
      try {
        if (!receiverId) {
          return;
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
          return;
        }

        io.to(receiverId).emit("typing", {
          senderId: userId,
        });
      } catch (error) {
        console.error("Typing socket error:", error.message);
      }
    });

    // =================================================
    // Stop Typing
    // =================================================

    socket.on("stopTyping", (receiverId) => {
      try {
        if (!receiverId) {
          return;
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
          return;
        }

        io.to(receiverId).emit("stopTyping", {
          senderId: userId,
        });
      } catch (error) {
        console.error("Stop typing socket error:", error.message);
      }
    });

    // =================================================
    // Send Message
    // =================================================

    socket.on("sendMessage", async (data, callback) => {
      try {
        const { receiver, message } = data || {};

        // -------------------------------------------------
        // Validate Receiver
        // -------------------------------------------------

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

        // -------------------------------------------------
        // Validate Message
        // -------------------------------------------------

        if (typeof message !== "string" || !message.trim()) {
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

        const trimmedMessage = message.trim();

        // -------------------------------------------------
        // Message Length
        // -------------------------------------------------

        if (trimmedMessage.length > 2000) {
          const error = {
            success: false,
            message: "Message cannot exceed 2000 characters",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Prevent Self Messaging
        // -------------------------------------------------

        if (receiver.toString() === userId.toString()) {
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

        // -------------------------------------------------
        // Find Receiver
        // -------------------------------------------------

        const receiverUser = await User.findById(receiver).select(
          "_id name email role",
        );

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

        // -------------------------------------------------
        // Buyer ↔ Farmer Only
        // -------------------------------------------------

        const allowedRoles = ["buyer", "farmer"];

        if (
          !allowedRoles.includes(socket.user.role) ||
          !allowedRoles.includes(receiverUser.role)
        ) {
          const error = {
            success: false,
            message: "Chat is only available between buyers and farmers",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Prevent Same Role Chat
        // -------------------------------------------------

        if (socket.user.role === receiverUser.role) {
          const error = {
            success: false,
            message: "You can only chat with the opposite user role",
          };

          socket.emit("messageError", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Save Message
        // -------------------------------------------------

        const chat = await Chat.create({
          sender: socket.user._id,
          receiver,
          message: trimmedMessage,
          isRead: false,
        });

        // -------------------------------------------------
        // Populate Message
        // -------------------------------------------------

        const populatedChat = await Chat.findById(chat._id)
          .populate("sender", "name role")
          .populate("receiver", "name role");

        // -------------------------------------------------
        // Send Message To Receiver
        // -------------------------------------------------

        io.to(receiver).emit("receiveMessage", populatedChat);

        // -------------------------------------------------
        // Send Message Back To Sender
        // -------------------------------------------------

        socket.emit("receiveMessage", populatedChat);

        // -------------------------------------------------
        // Success Callback
        // -------------------------------------------------

        if (callback) {
          callback({
            success: true,
            message: "Message sent successfully",
            chat: populatedChat,
          });
        }
      } catch (error) {
        console.error("Socket message error:", error);

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

    // =================================================
    // AUCTION
    // =================================================

    // =================================================
    // Join Auction Room
    // =================================================

    socket.on("auction:join", async (auctionId, callback) => {
      try {
        // -------------------------------------------------
        // Validate Auction ID
        // -------------------------------------------------

        if (!auctionId || !mongoose.Types.ObjectId.isValid(auctionId)) {
          const error = {
            success: false,
            message: "Invalid auction ID",
          };

          socket.emit("auction:error", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Find Auction
        // -------------------------------------------------

        const auction = await Auction.findById(auctionId)
          .populate("product", "name images price unit")
          .populate("farmer", "name");

        if (!auction) {
          const error = {
            success: false,
            message: "Auction not found",
          };

          socket.emit("auction:error", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Only Live Auctions Can Be Joined
        // -------------------------------------------------

        if (auction.status !== "LIVE") {
          const error = {
            success: false,
            message: `Auction is ${auction.status}`,
          };

          socket.emit("auction:error", error);

          if (callback) {
            callback(error);
          }

          return;
        }

        // -------------------------------------------------
        // Join Room
        // -------------------------------------------------

        const room = getAuctionRoom(auctionId);

        socket.join(room);

        // -------------------------------------------------
        // Current Auction State
        // -------------------------------------------------

        const auctionState = {
          auctionId: auction._id,

          status: auction.status,

          product: auction.product,

          farmer: auction.farmer,

          cropName: auction.cropName,

          quantity: auction.quantity,

          unit: auction.unit,

          basePrice: auction.basePrice,

          currentPrice: auction.currentPrice,

          highestBidder: auction.highestBidder,

          highestBidderName: auction.highestBidderName,

          bidCount: auction.bidCount,

          startsAt: auction.startsAt,

          endsAt: auction.endsAt,
        };

        socket.emit("auction:state", auctionState);

        // -------------------------------------------------
        // Notify Room
        // -------------------------------------------------

        socket.to(room).emit("auction:participantJoined", {
          auctionId,
          userId,
          userName: socket.user.name,
        });

        // -------------------------------------------------
        // Success Callback
        // -------------------------------------------------

        if (callback) {
          callback({
            success: true,
            message: "Joined auction successfully",
            auction: auctionState,
          });
        }
      } catch (error) {
        console.error("Auction join socket error:", error);

        const response = {
          success: false,
          message: "Failed to join auction",
        };

        socket.emit("auction:error", response);

        if (callback) {
          callback(response);
        }
      }
    });

    // =================================================
    // Leave Auction Room
    // =================================================

    socket.on("auction:leave", (auctionId, callback) => {
      try {
        if (!auctionId || !mongoose.Types.ObjectId.isValid(auctionId)) {
          const error = {
            success: false,
            message: "Invalid auction ID",
          };

          if (callback) {
            callback(error);
          }

          return;
        }

        const room = getAuctionRoom(auctionId);

        socket.leave(room);

        socket.to(room).emit("auction:participantLeft", {
          auctionId,
          userId,
          userName: socket.user.name,
        });

        if (callback) {
          callback({
            success: true,
            message: "Left auction successfully",
          });
        }
      } catch (error) {
        console.error("Auction leave socket error:", error.message);

        if (callback) {
          callback({
            success: false,
            message: "Failed to leave auction",
          });
        }
      }
    });

    // =================================================
    // Get Current Auction State
    // =================================================

    socket.on("auction:getState", async (auctionId, callback) => {
      try {
        if (!auctionId || !mongoose.Types.ObjectId.isValid(auctionId)) {
          const error = {
            success: false,
            message: "Invalid auction ID",
          };

          if (callback) {
            callback(error);
          }

          return;
        }

        const auction = await Auction.findById(auctionId)
          .populate("product", "name images price unit")
          .populate("farmer", "name");

        if (!auction) {
          const error = {
            success: false,
            message: "Auction not found",
          };

          if (callback) {
            callback(error);
          }

          return;
        }

        const auctionState = {
          auctionId: auction._id,

          status: auction.status,

          product: auction.product,

          farmer: auction.farmer,

          cropName: auction.cropName,

          quantity: auction.quantity,

          unit: auction.unit,

          basePrice: auction.basePrice,

          currentPrice: auction.currentPrice,

          highestBidder: auction.highestBidder,

          highestBidderName: auction.highestBidderName,

          bidCount: auction.bidCount,

          startsAt: auction.startsAt,

          endsAt: auction.endsAt,
        };

        if (callback) {
          callback({
            success: true,
            auction: auctionState,
          });
        }
      } catch (error) {
        console.error("Auction state socket error:", error);

        if (callback) {
          callback({
            success: false,
            message: "Failed to fetch auction state",
          });
        }
      }
    });

    // =================================================
    // Disconnect
    // =================================================

    socket.on("disconnect", () => {
      // -------------------------------------------------
      // Remove Only This Socket
      // -------------------------------------------------

      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
      }

      // -------------------------------------------------
      // Update Online Users
      // -------------------------------------------------

      io.emit("onlineUsers", [...onlineUsers.keys()]);

      console.log(`Socket disconnected: ${socket.user.name} (${userId})`);
    });
  });
};

// =====================================================
// Export
// =====================================================

module.exports = initializeSocket;
