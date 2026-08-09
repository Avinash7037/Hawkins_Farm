const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// =====================================================
// Send Message
// =====================================================

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    // Prevent messaging yourself
    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a message to yourself",
      });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const chat = await Chat.create({
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim(),
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat: populatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Chat History
// =====================================================

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat user",
      });
    }

    // Check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mark received messages as read first
    await Chat.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    // Fetch updated conversation
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

// =====================================================
// Get My Conversations
// =====================================================

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },

      // Get latest message for each conversation
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: ["$sender", userId],
              },
              "$receiver",
              "$sender",
            ],
          },

          lastMessage: {
            $first: "$message",
          },

          lastMessageAt: {
            $first: "$createdAt",
          },

          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: ["$receiver", userId],
                    },
                    {
                      $eq: ["$isRead", false],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      // Get other user's details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 0,

          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            role: "$user.role",
          },

          lastMessage: 1,
          lastMessageAt: 1,
          unreadCount: 1,
        },
      },

      {
        $sort: {
          lastMessageAt: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Unread Message Count
// =====================================================

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

// =====================================================
// Mark Chat Messages As Read
// =====================================================

const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await Chat.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getUnreadCount,
  markMessagesAsRead,
  getMyConversations,
};
