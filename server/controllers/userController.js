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
    },
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

  // -------------------------------------------------
  // Validate Status
  // -------------------------------------------------

  if (typeof isActive !== "boolean") {
    res.status(400);

    throw new Error("isActive must be a boolean");
  }

  // -------------------------------------------------
  // Validate User ID
  // -------------------------------------------------

  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // -------------------------------------------------
  // Protect Current Admin
  //
  // An admin cannot deactivate their own account.
  // -------------------------------------------------

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);

    throw new Error("You cannot change the status of your own account");
  }

  // -------------------------------------------------
  // Protect The Last Active Admin
  //
  // Prevent the platform from ending up without
  // an active administrator.
  // -------------------------------------------------

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

  // -------------------------------------------------
  // Update Status
  // -------------------------------------------------

  user.isActive = isActive;

  await user.save();

  // -------------------------------------------------
  // Response
  // -------------------------------------------------

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
    },
  });
});

// =====================================================
// Export
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  updateUserStatus,
};
