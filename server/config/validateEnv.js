const requiredEnv = [
  // Server
  "PORT",

  // Database
  "MONGO_URI",

  // Authentication
  "JWT_SECRET",

  // Frontend
  "CLIENT_URL",

  // Cloudinary
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",

  // Razorpay
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",

  // Email
  "EMAIL_USER",
  "EMAIL_PASS",
];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing Environment Variables:", missing.join(", "));

    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};

module.exports = validateEnv;
