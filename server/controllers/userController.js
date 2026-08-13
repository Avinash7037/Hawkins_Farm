const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

// =====================================================
// Register User
// =====================================================

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // -------------------------------------------------
  // Validate Required Fields
  // -------------------------------------------------

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  // -------------------------------------------------
  // Prevent Public Admin Registration
  // -------------------------------------------------

  const requestedRole = role === "farmer" ? "farmer" : "buyer";

  // -------------------------------------------------
  // Check Existing User
  // -------------------------------------------------

  const userExists = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // -------------------------------------------------
  // Hash Password
  // -------------------------------------------------

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  // -------------------------------------------------
  // Create User
  // -------------------------------------------------

  const user = await User.create({
    name: name.trim(),

    email: email.trim().toLowerCase(),

    password: hashedPassword,

    role: requestedRole,

    isActive: true,

    phone: "",

    farmName: "",

    farmDescription: "",
  });

  // -------------------------------------------------
  // Welcome Email
  // -------------------------------------------------

  try {
    await sendEmail({
      to: user.email,

      subject: "Welcome to Hawkins Farm 🌱",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            padding: 20px;
          "
        >
          <h2>
            Welcome to Hawkins Farm,
            ${user.name}! 👋
          </h2>

          <p>
            Thank you for registering with
            <strong>Hawkins Farm</strong>.
          </p>

          <p>
            Your account has been created successfully.
          </p>

          <h3>Account Details</h3>

          <ul>
            <li>
              <strong>Name:</strong>
              ${user.name}
            </li>

            <li>
              <strong>Email:</strong>
              ${user.email}
            </li>

            <li>
              <strong>Role:</strong>
              ${user.role}
            </li>
          </ul>

          <p>
            We are excited to have you onboard.
          </p>

          <p>
            Happy Farming! 🌾
          </p>

          <br />

          <p>
            <strong>Team Hawkins Farm</strong>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.log("Email Error:", error.message);
  }

  // -------------------------------------------------
  // Response
  // -------------------------------------------------

  res.status(201).json({
    success: true,

    message: "User Registered Successfully",

    token: generateToken(user._id),

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone,
      farmName: user.farmName,
      farmDescription: user.farmDescription,
    },
  });
});

// =====================================================
// Login User
// =====================================================

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // -------------------------------------------------
  // Validate Fields
  // -------------------------------------------------

  if (!email?.trim() || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // -------------------------------------------------
  // Find User
  // -------------------------------------------------

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // -------------------------------------------------
  // Check Account Status
  // -------------------------------------------------

  if (!user.isActive) {
    res.status(403);

    throw new Error(
      "Your account has been deactivated. Please contact support.",
    );
  }

  // -------------------------------------------------
  // Compare Password
  // -------------------------------------------------

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // -------------------------------------------------
  // Response
  // -------------------------------------------------

  res.status(200).json({
    success: true,

    message: "Login Successful",

    token: generateToken(user._id),

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone,
      farmName: user.farmName,
      farmDescription: user.farmDescription,
    },
  });
});

// =====================================================
// Forgot Password
// =====================================================

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // -------------------------------------------------
  // Validate Email
  // -------------------------------------------------

  if (!email?.trim()) {
    res.status(400);

    throw new Error("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // -------------------------------------------------
  // Find User
  // -------------------------------------------------

  const user = await User.findOne({
    email: normalizedEmail,
  });

  // -------------------------------------------------
  // Don't Reveal Whether User Exists
  // -------------------------------------------------

  if (!user) {
    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been generated.",
    });
  }

  // -------------------------------------------------
  // Generate Secure Random Token
  // -------------------------------------------------

  const resetToken = crypto.randomBytes(32).toString("hex");

  // -------------------------------------------------
  // Hash Token Before Storing
  // -------------------------------------------------

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // -------------------------------------------------
  // Token Valid For 15 Minutes
  // -------------------------------------------------

  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  // -------------------------------------------------
  // Development Reset URL
  // -------------------------------------------------

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  // -------------------------------------------------
  // Try Sending Email
  // -------------------------------------------------

  try {
    await sendEmail({
      to: user.email,

      subject: "Reset Your Hawkins Farm Password",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
          "
        >
          <h2>Reset Your Hawkins Farm Password</h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your Hawkins Farm password.
          </p>

          <p>
            This link will expire in
            <strong>15 minutes</strong>.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #059669;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 15px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 25px;">
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <p>
            Team Hawkins Farm 🌱
          </p>
        </div>
      `,
    });

    console.log("Password reset email sent to:", user.email);
  } catch (error) {
    console.log("Password Reset Email Error:", error.message);
  }

  // -------------------------------------------------
  // Development Response
  // -------------------------------------------------

  res.status(200).json({
    success: true,

    message: "Password reset link generated successfully.",

    // Development only
    resetUrl,
  });
});

// =====================================================
// Reset Password
// =====================================================

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  // -------------------------------------------------
  // Validate Token
  // -------------------------------------------------

  if (!token) {
    res.status(400);

    throw new Error("Reset token is required");
  }

  // -------------------------------------------------
  // Validate Password
  // -------------------------------------------------

  if (!password) {
    res.status(400);

    throw new Error("New password is required");
  }

  if (password.length < 6) {
    res.status(400);

    throw new Error("Password must be at least 6 characters");
  }

  // -------------------------------------------------
  // Hash Incoming Token
  // -------------------------------------------------

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // -------------------------------------------------
  // Find User With Valid Token
  // -------------------------------------------------

  const user = await User.findOne({
    resetPasswordToken: hashedToken,

    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  // -------------------------------------------------
  // Invalid / Expired Token
  // -------------------------------------------------

  if (!user) {
    res.status(400);

    throw new Error("Reset link is invalid or has expired");
  }

  // -------------------------------------------------
  // Hash New Password
  // -------------------------------------------------

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(password, salt);

  // -------------------------------------------------
  // Invalidate Reset Token
  // -------------------------------------------------

  user.resetPasswordToken = null;

  user.resetPasswordExpires = null;

  await user.save();

  // -------------------------------------------------
  // Response
  // -------------------------------------------------

  res.status(200).json({
    success: true,

    message:
      "Password reset successfully. You can now login with your new password.",
  });
});

// =====================================================
// Get Profile
// =====================================================

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,

    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
      phone: req.user.phone || "",
      farmName: req.user.farmName || "",
      farmDescription: req.user.farmDescription || "",
      createdAt: req.user.createdAt,
    },
  });
});

// =====================================================
// Admin - Get All Users
// =====================================================

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// =====================================================
// Admin - Update User Account Status
// =====================================================

const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    res.status(400);

    throw new Error("isActive must be a boolean");
  }

  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);

    throw new Error("You cannot change the status of your own account");
  }

  if (user.role === "admin" && isActive === false && user.isActive === true) {
    const activeAdminCount = await User.countDocuments({
      role: "admin",
      isActive: true,
    });

    if (activeAdminCount <= 1) {
      res.status(400);

      throw new Error("The last active admin cannot be deactivated");
    }
  }

  user.isActive = isActive;

  await user.save();

  res.status(200).json({
    success: true,

    message: isActive
      ? "User activated successfully"
      : "User deactivated successfully",

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone || "",
      farmName: user.farmName || "",
      farmDescription: user.farmDescription || "",
    },
  });
});

// =====================================================
// Update Profile
// =====================================================

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, farmName, farmDescription } = req.body;

  if (!name?.trim()) {
    res.status(400);

    throw new Error("Name is required");
  }

  if (name.trim().length < 2) {
    res.status(400);

    throw new Error("Name must be at least 2 characters");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  user.name = name.trim();

  user.phone = phone?.trim() || "";

  if (user.role === "farmer") {
    user.farmName = farmName?.trim() || "";

    user.farmDescription = farmDescription?.trim() || "";
  }

  await user.save();

  res.status(200).json({
    success: true,

    message: "Profile updated successfully",

    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone || "",
      farmName: user.farmName || "",
      farmDescription: user.farmDescription || "",
      createdAt: user.createdAt,
    },
  });
});

// =====================================================
// Change Password
// =====================================================

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);

    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);

    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400);

    throw new Error("Current password is incorrect");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    res.status(400);

    throw new Error(
      "New password must be different from your current password",
    );
  }

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({
    success: true,

    message: "Password changed successfully",
  });
});

// =====================================================
// Export
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  getAllUsers,
  updateUserStatus,
  changePassword,
  updateProfile,
};
