const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// =====================================================
// Load Environment Variables
// =====================================================

dotenv.config();

// =====================================================
// Config
// =====================================================

const validateEnv = require("./config/validateEnv");
const connectDB = require("./config/db");

// =====================================================
// Validate Environment
// =====================================================

validateEnv();

// =====================================================
// Security Middleware
// =====================================================

const securityMiddleware = require("./middleware/securityMiddleware");

// =====================================================
// Socket
// =====================================================

const initializeSocket = require("./socket/socket");

// =====================================================
// Auction Scheduler
// =====================================================

const { startAuctionScheduler } = require("./services/auctionScheduler");

// =====================================================
// Routes
// =====================================================

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const qrRoutes = require("./routes/qrRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const addressRoutes = require("./routes/addressRoutes");

// =====================================================
// Auction Routes
// =====================================================

const auctionRoutes = require("./routes/auctionRoutes");

// =====================================================
// AI Routes
// =====================================================

const aiRoutes = require("./routes/aiRoutes");

// =====================================================
// Error Middleware
// =====================================================

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// =====================================================
// App
// =====================================================

const app = express();

// =====================================================
// Connect Database
// =====================================================

connectDB();

// =====================================================
// Security Middleware
// =====================================================

securityMiddleware(app);

// =====================================================
// Body Parser
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================================
// Home Route
// =====================================================

app.get("/", (req, res) => {
  res.send("Hawkins Farm API Running 🚜");
});

// =====================================================
// API Routes
// =====================================================

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/qr", qrRoutes);

// =====================================================
// Notification Routes
// =====================================================

app.use("/api/notifications", notificationRoutes);

// =====================================================
// Address Routes
// =====================================================

app.use("/api/addresses", addressRoutes);

// =====================================================
// Auction Routes
// =====================================================
//
// Public:
// GET  /api/auctions/live
// GET  /api/auctions/:id
//
// Farmer:
// POST /api/auctions
// GET  /api/auctions/farmer/my-auctions
// PUT  /api/auctions/:id/cancel
//
// Buyer:
// POST /api/auctions/:id/bid
//
// =====================================================

app.use("/api/auctions", auctionRoutes);

// =====================================================
// Hawkins AI Routes
// =====================================================
//
// POST /api/ai/ask
//
// Protected:
// Logged-in Hawkins Farm users can ask questions.
//
// =====================================================

app.use("/api/ai", aiRoutes);

// =====================================================
// Create HTTP Server
// =====================================================

const server = http.createServer(app);

// =====================================================
// Socket.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",

    methods: ["GET", "POST"],

    credentials: true,
  },
});

// =====================================================
// Make Socket.IO Available To Controllers
// =====================================================
//
// Controllers can access Socket.IO using:
//
// const io = req.app.get("io");
//
// =====================================================

app.set("io", io);

// =====================================================
// Initialize Socket
// =====================================================

initializeSocket(io);

// =====================================================
// 404 Middleware
// =====================================================
//
// IMPORTANT:
// This must come AFTER all API routes.
//

app.use(notFound);

// =====================================================
// Global Error Handler
// =====================================================
//
// IMPORTANT:
// This must be the LAST middleware.
//

app.use(errorHandler);

// =====================================================
// Start Server
// =====================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // ===================================================
  // Start Auction Scheduler
  // ===================================================

  startAuctionScheduler(io);
});
