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
// This is required for real-time notifications.
//

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
// This must be the LAST middleware.
//

app.use(errorHandler);

// =====================================================
// Start Server
// =====================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
