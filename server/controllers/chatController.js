const mongoose = require("mongoose");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// =====================================================
// Helpers
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// Send Message
// =====================================================

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // -------------------------------------------------
    // Validate Message
    // -------------------------------------------------

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

    // -------------------------------------------------
    // Validate Receiver ID
    // -------------------------------------------------

    if (!isValidObjectId(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    // -------------------------------------------------
    // Prevent Self Messaging
    // -------------------------------------------------

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a message to yourself",
      });
    }

    // -------------------------------------------------
    // Validate Message Length
    // -------------------------------------------------

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters",
      });
    }

    // -------------------------------------------------
    // Find Receiver
    // -------------------------------------------------

    const receiver = await User.findById(receiverId).select(
      "_id name email role",
    );

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // -------------------------------------------------
    // Buyer ↔ Farmer Communication
    //
    // Buyers can message farmers.
    // Farmers can message buyers.
    // -------------------------------------------------

    const allowedRoles = ["buyer", "farmer"];

    if (
      !allowedRoles.includes(req.user.role) ||
      !allowedRoles.includes(receiver.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Chat is only available between buyers and farmers",
      });
    }

    if (req.user.role === receiver.role) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with the opposite user role",
      });
    }

    // -------------------------------------------------
    // Create Message
    // -------------------------------------------------

    const chat = await Chat.create({
      sender: req.user._id,
      receiver: receiverId,
      message: trimmedMessage,
      isRead: false,
    });

    // -------------------------------------------------
    // Populate Message
    // -------------------------------------------------

    const populatedChat = await Chat.findById(chat._id)
      .populate("sender", "name role")
      .populate("receiver", "name role");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat: populatedChat,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
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

    // -------------------------------------------------
    // Validate User ID
    // -------------------------------------------------

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -------------------------------------------------
    // Prevent Self Chat
    // -------------------------------------------------

    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat user",
      });
    }

    // -------------------------------------------------
    // Find Other User
    // -------------------------------------------------

    const user = await User.findById(userId).select("_id name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // Validate Buyer/Farmer Chat
    // -------------------------------------------------

    const allowedRoles = ["buyer", "farmer"];

    if (
      !allowedRoles.includes(req.user.role) ||
      !allowedRoles.includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Chat is only available between buyers and farmers",
      });
    }

    if (req.user.role === user.role) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with the opposite user role",
      });
    }

    // -------------------------------------------------
    // Mark Received Messages As Read
    // -------------------------------------------------

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

    // -------------------------------------------------
    // Fetch Conversation
    // -------------------------------------------------

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
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);

    return res.status(500).json({
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
      // -------------------------------------------------
      // Messages involving current user
      // -------------------------------------------------

      {
        $match: {
          $or: [
            {
              sender: userId,
            },
            {
              receiver: userId,
            },
          ],
        },
      },

      // -------------------------------------------------
      // Latest messages first
      // -------------------------------------------------

      {
        $sort: {
          createdAt: -1,
        },
      },

      // -------------------------------------------------
      // Group by other user
      // -------------------------------------------------

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

      // -------------------------------------------------
      // Get Other User
      // -------------------------------------------------

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

      // -------------------------------------------------
      // Return Safe User Fields
      // -------------------------------------------------

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

      // -------------------------------------------------
      // Latest Conversation First
      // -------------------------------------------------

      {
        $sort: {
          lastMessageAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get My Conversations Error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      unreadMessages: count,
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error);

    return res.status(500).json({
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

    // -------------------------------------------------
    // Validate User ID
    // -------------------------------------------------

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -------------------------------------------------
    // Prevent Self
    // -------------------------------------------------

    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat user",
      });
    }

    // -------------------------------------------------
    // Mark Messages
    // -------------------------------------------------

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

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark Messages As Read Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  sendMessage,
  getChatHistory,
  getUnreadCount,
  markMessagesAsRead,
  getMyConversations,
};
