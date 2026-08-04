const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { uploadImage } = require("../controllers/uploadController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("farmer"),
  upload.single("image"),
  uploadImage,
);

module.exports = router;
