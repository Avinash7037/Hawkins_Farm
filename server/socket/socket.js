const Chat = require("../models/chatModel");

const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });

    socket.on("typing", (receiverId) => {
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("typing");
      }
    });

    socket.on("stopTyping", (receiverId) => {
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping");
      }
    });

    socket.on("sendMessage", async (data) => {
      const chat = await Chat.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
      });

      const receiverSocket = onlineUsers.get(data.receiver);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", chat);
      }

      socket.emit("receiveMessage", chat);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      }

      io.emit("onlineUsers", [...onlineUsers.keys()]);

      console.log("Disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
