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
} = require("../controllers/userController");

router.post("/register", registerValidation, registerUser);

router.post("/login", loginValidation, loginUser);
router.get("/profile", protect, getProfile);

router.get("/farmer-dashboard", protect, authorize("farmer"), (req, res) => {
  res.json({
    message: "Welcome Farmer!",
  });
});
module.exports = router;
