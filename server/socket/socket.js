const Chat = require("../models/chatModel");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async (data) => {
      const chat = await Chat.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
      });

      io.to(data.receiver).emit("receiveMessage", chat);

      io.to(data.sender).emit("receiveMessage", chat);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
};

module.exports = initializeSocket;
