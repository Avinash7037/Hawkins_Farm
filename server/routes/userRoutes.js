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
  getProfile,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/userController");

// =====================================================
// Public Authentication
// =====================================================

router.post("/register", registerValidation, registerUser);

router.post("/login", loginValidation, loginUser);

// =====================================================
// Authenticated User
// =====================================================

router.get("/profile", protect, getProfile);

// =====================================================
// Admin User Management
// =====================================================

// Get all users
router.get("/admin/users", protect, authorize("admin"), getAllUsers);

// Activate / Deactivate user
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

module.exports = router;
