const Notification = require("../models/notificationModel");

// =====================================================
// Create Notification
// =====================================================

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  order = null,
  product = null,
  auction = null,
  io = null,
}) => {
  // ===================================================
  // Validation
  // ===================================================

  if (!recipient) {
    throw new Error("Notification recipient is required");
  }

  if (!type) {
    throw new Error("Notification type is required");
  }

  if (!title?.trim()) {
    throw new Error("Notification title is required");
  }

  if (!message?.trim()) {
    throw new Error("Notification message is required");
  }

  // ===================================================
  // Save Notification
  // ===================================================

  const notification = await Notification.create({
    recipient,

    type,

    title: title.trim(),

    message: message.trim(),

    order,

    product,

    auction,
  });

  // ===================================================
  // Populate Notification
  // ===================================================

  const populatedNotification = await Notification.findById(notification._id)

    // -------------------------------------------------
    // Order
    // -------------------------------------------------

    .populate({
      path: "order",

      populate: [
        {
          path: "product",
          select: "name price unit",
        },

        {
          path: "buyer",
          select: "name email",
        },

        {
          path: "farmer",
          select: "name email",
        },
      ],
    })

    // -------------------------------------------------
    // Product
    // -------------------------------------------------

    .populate({
      path: "product",

      select: "name price unit quantity lowStockThreshold",
    })

    // -------------------------------------------------
    // Auction
    // -------------------------------------------------

    .populate({
      path: "auction",

      select:
        "cropName quantity unit basePrice currentPrice status startsAt endsAt result",
    });

  // ===================================================
  // Real-Time Notification
  // ===================================================

  if (io) {
    io.to(recipient.toString()).emit("notification", populatedNotification);
  }

  return populatedNotification;
};

// =====================================================
// Auction Started Notification
// =====================================================

const createAuctionStartedNotification = async ({
  buyerId,
  auctionId,
  productId,
  productName,
  quantity,
  unit,
  basePrice,
  io = null,
}) => {
  if (!buyerId) {
    throw new Error("Buyer ID is required");
  }

  if (!auctionId) {
    throw new Error("Auction ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  // ===================================================
  // Prevent Duplicate
  // ===================================================

  const existingNotification = await Notification.findOne({
    recipient: buyerId,

    type: "AUCTION_STARTED",

    auction: auctionId,
  });

  if (existingNotification) {
    return existingNotification;
  }

  // ===================================================
  // Create
  // ===================================================

  return createNotification({
    recipient: buyerId,

    type: "AUCTION_STARTED",

    title: "New Auction Started",

    message:
      `A new auction for ${productName.trim()} has started. ` +
      `Quantity: ${quantity} ${unit || "units"}. ` +
      `Starting price: ₹${basePrice}/${unit || "unit"}.`,

    product: productId,

    auction: auctionId,

    io,
  });
};

// =====================================================
// Auction Won Notification
// =====================================================

const createAuctionWonNotification = async ({
  buyerId,
  auctionId,
  productId,
  productName,
  quantity,
  unit,
  winningPrice,
  totalValue,
  io = null,
}) => {
  if (!buyerId) {
    throw new Error("Buyer ID is required");
  }

  if (!auctionId) {
    throw new Error("Auction ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  // ===================================================
  // Prevent Duplicate
  // ===================================================

  const existingNotification = await Notification.findOne({
    recipient: buyerId,

    type: "AUCTION_WON",

    auction: auctionId,
  });

  if (existingNotification) {
    return existingNotification;
  }

  // ===================================================
  // Create
  // ===================================================

  return createNotification({
    recipient: buyerId,

    type: "AUCTION_WON",

    title: "🎉 You Won the Auction",

    message:
      `Congratulations! You won the ${productName.trim()} auction. ` +
      `Winning price: ₹${winningPrice}/${unit || "unit"}. ` +
      `Quantity: ${quantity} ${unit || "units"}. ` +
      `Total value: ₹${totalValue}.`,

    product: productId,

    auction: auctionId,

    io,
  });
};

// =====================================================
// Auction Ended Notification
// Farmer
// =====================================================

const createAuctionEndedNotification = async ({
  farmerId,
  auctionId,
  productId,
  productName,
  quantity,
  unit,
  winningPrice,
  totalValue,
  winnerName,
  totalBids,
  io = null,
}) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }

  if (!auctionId) {
    throw new Error("Auction ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  // ===================================================
  // Prevent Duplicate
  // ===================================================

  const existingNotification = await Notification.findOne({
    recipient: farmerId,

    type: "AUCTION_ENDED",

    auction: auctionId,
  });

  if (existingNotification) {
    return existingNotification;
  }

  // ===================================================
  // Create
  // ===================================================

  return createNotification({
    recipient: farmerId,

    type: "AUCTION_ENDED",

    title: "Auction Completed",

    message:
      `Your ${productName.trim()} auction has ended. ` +
      `Winner: ${winnerName || "Buyer"}. ` +
      `Winning price: ₹${winningPrice}/${unit || "unit"}. ` +
      `Quantity: ${quantity} ${unit || "units"}. ` +
      `Total value: ₹${totalValue}. ` +
      `Total bids: ${totalBids || 0}.`,

    product: productId,

    auction: auctionId,

    io,
  });
};

// =====================================================
// Auction Unsold Notification
// Farmer
// =====================================================

const createAuctionUnsoldNotification = async ({
  farmerId,
  auctionId,
  productId,
  productName,
  quantity,
  unit,
  totalBids,
  io = null,
}) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }

  if (!auctionId) {
    throw new Error("Auction ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  // ===================================================
  // Prevent Duplicate
  // ===================================================

  const existingNotification = await Notification.findOne({
    recipient: farmerId,

    type: "AUCTION_UNSOLD",

    auction: auctionId,
  });

  if (existingNotification) {
    return existingNotification;
  }

  // ===================================================
  // Create
  // ===================================================

  return createNotification({
    recipient: farmerId,

    type: "AUCTION_UNSOLD",

    title: "Auction Ended Without Bids",

    message:
      `Your ${productName.trim()} auction ended without any bids. ` +
      `${quantity} ${unit || "units"} have been returned to your stock. ` +
      `Total bids: ${totalBids || 0}.`,

    product: productId,

    auction: auctionId,

    io,
  });
};

// =====================================================
// Create Low Stock Notification
// =====================================================

const createLowStockNotification = async ({
  farmerId,
  productId,
  productName,
  quantity,
  unit,
  threshold,
  orderId = null,
  io = null,
}) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  return createNotification({
    recipient: farmerId,

    type: "LOW_STOCK",

    title: "Low Stock Alert",

    message:
      `Your ${productName.trim()} stock is running low. ` +
      `Only ${quantity} ${unit || "units"} remaining ` +
      `(low-stock threshold: ${threshold}).`,

    order: orderId,

    product: productId,

    io,
  });
};

// =====================================================
// Create Stock Empty Notification
// =====================================================

const createStockEmptyNotification = async ({
  farmerId,
  productId,
  productName,
  orderId,
  io = null,
}) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!productName?.trim()) {
    throw new Error("Product name is required");
  }

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // ===================================================
  // Prevent Duplicate
  // ===================================================

  const existingNotification = await Notification.findOne({
    recipient: farmerId,

    type: "STOCK_EMPTY",

    order: orderId,

    product: productId,
  });

  if (existingNotification) {
    return existingNotification;
  }

  return createNotification({
    recipient: farmerId,

    type: "STOCK_EMPTY",

    title: "Stock Empty",

    message:
      `Your ${productName.trim()} stock is now empty. ` +
      "Please restock the product to make it available again.",

    order: orderId,

    product: productId,

    io,
  });
};

// =====================================================
// Get User Notifications
// =====================================================

const getUserNotifications = async (userId) => {
  return Notification.find({
    recipient: userId,
  })
    .populate({
      path: "order",

      populate: {
        path: "product",

        select: "name price unit",
      },
    })

    .populate({
      path: "product",

      select: "name price unit quantity lowStockThreshold",
    })

    .populate({
      path: "auction",

      select:
        "cropName quantity unit basePrice currentPrice status startsAt endsAt result",
    })

    .sort({
      createdAt: -1,
    })

    .limit(50);
};

// =====================================================
// Get Unread Notification Count
// =====================================================

const getUnreadNotificationCount = async (userId) => {
  return Notification.countDocuments({
    recipient: userId,

    isRead: false,
  });
};

// =====================================================
// Mark One Notification As Read
// =====================================================

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,

    recipient: userId,
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;

    notification.readAt = new Date();

    await notification.save();
  }

  return notification;
};

// =====================================================
// Mark All Notifications As Read
// =====================================================

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany(
    {
      recipient: userId,

      isRead: false,
    },

    {
      $set: {
        isRead: true,

        readAt: new Date(),
      },
    },
  );

  return true;
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  createNotification,

  createAuctionStartedNotification,

  createAuctionWonNotification,

  createAuctionEndedNotification,

  createAuctionUnsoldNotification,

  createLowStockNotification,

  createStockEmptyNotification,

  getUserNotifications,

  getUnreadNotificationCount,

  markNotificationAsRead,

  markAllNotificationsAsRead,
};
