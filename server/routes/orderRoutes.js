const express = require("express");

const router = express.Router();

const { placeOrder } = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("buyer"), placeOrder);

module.exports = router;
