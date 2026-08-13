import axios from "axios";

// =====================================================
// ML API URL
// =====================================================

const ML_API_URL = import.meta.env.VITE_ML_API_URL || "http://localhost:8001";

// =====================================================
// Predict Crop From Image
// =====================================================

export const predictCrop = async (imageFile) => {
  if (!imageFile) {
    throw new Error("Please select an image.");
  }

  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await axios.post(`${ML_API_URL}/predict`, formData, {
    timeout: 180000,
  });

  return response.data;
};
