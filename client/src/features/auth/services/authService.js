import api from "../../../services/api";

// =====================================================
// Register
// =====================================================

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);

  return response.data;
};

// =====================================================
// Login
// =====================================================

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);

  return response.data;
};

// =====================================================
// Forgot Password
// =====================================================

export const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password", {
    email,
  });

  return response.data;
};

// =====================================================
// Reset Password
// =====================================================

export const resetPassword = async (token, password) => {
  const response = await api.post(`/users/reset-password/${token}`, {
    password,
  });

  return response.data;
};

// =====================================================
// Get Profile
// =====================================================

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

// =====================================================
// Update Profile
// =====================================================

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);

  return response.data;
};

// =====================================================
// Change Password
// =====================================================

export const changePassword = async (passwordData) => {
  const response = await api.put("/users/profile/password", passwordData);

  return response.data;
};
