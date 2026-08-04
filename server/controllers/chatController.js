const Chat = require("../models/chatModel");

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Chat.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadMessages: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getChatHistory,
  getUnreadCount,
};
