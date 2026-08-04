const express = require("express");

const router = express.Router();

const { generateOrderQR } = require("../controllers/qrController");

const { protect } = require("../middleware/authMiddleware");

router.get("/:id", protect, generateOrderQR);

module.exports = router;
