const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../validators/userValidator");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/userController");

// =====================================================
// Public Authentication
// =====================================================

router.post("/register", registerValidation, registerUser);

router.post("/login", loginValidation, loginUser);

// =====================================================
// Forgot Password
// =====================================================

router.post("/forgot-password", forgotPassword);

// =====================================================
// Reset Password
// =====================================================

router.post("/reset-password/:token", resetPassword);

// =====================================================
// Profile
// =====================================================

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/profile/password", protect, changePassword);

// =====================================================
// Admin User Management
// =====================================================

router.get("/admin/users", protect, authorize("admin"), getAllUsers);

router.put(
  "/admin/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus,
);

// =====================================================
// Legacy Farmer Dashboard Test Route
// =====================================================

router.get("/farmer-dashboard", protect, authorize("farmer"), (req, res) => {
  res.json({
    message: "Welcome Farmer!",
  });
});

// =====================================================
// Export
// =====================================================

module.exports = router;
