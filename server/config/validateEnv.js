const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing Environment Variables:", missing.join(", "));

    process.exit(1);
  }
};

module.exports = validateEnv;
