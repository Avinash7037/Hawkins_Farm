const express = require("express");

const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

router.get("/farmer-dashboard", protect, authorize("farmer"), (req, res) => {
  res.json({
    message: "Welcome Farmer!",
  });
});
module.exports = router;
