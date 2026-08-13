import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { predictCrop } from "../cropRecognitionService";

function CropPredictionCard() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // Cleanup Preview URL
  // =====================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // =====================================================
  // Select Image
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    setPrediction(null);

    // ===================================================
    // Validate File Type
    // ===================================================

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setSelectedImage(null);

      setPreviewUrl("");

      setError("Please upload a JPG, JPEG, PNG or WEBP image.");

      event.target.value = "";

      return;
    }

    // ===================================================
    // Validate File Size
    // ===================================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedImage(null);

      setPreviewUrl("");

      setError("Image must be smaller than 5 MB.");

      event.target.value = "";

      return;
    }

    // ===================================================
    // Revoke Previous URL
    // ===================================================

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // ===================================================
    // Create Preview
    // ===================================================

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedImage(file);

    setPreviewUrl(newPreviewUrl);
  };

  // =====================================================
  // Predict Crop
  // =====================================================

  const handlePredict = async () => {
    if (!selectedImage) {
      setError("Please select a crop image first.");

      return;
    }

    setLoading(true);

    setError("");

    setPrediction(null);

    try {
      const result = await predictCrop(selectedImage);

      if (!result?.success) {
        throw new Error(result?.message || "Crop prediction failed.");
      }

      setPrediction(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to identify the crop. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Add Crop
  // =====================================================

  const handleAddCrop = () => {
    const predictedCrop = prediction?.prediction?.crop;

    const predictedCategory = prediction?.prediction?.category;

    if (!predictedCrop) {
      return;
    }

    const formattedCrop = predictedCrop.replaceAll("_", " ");

    navigate("/farmer/products", {
      state: {
        predictedCrop: formattedCrop,

        predictedCategory: predictedCategory || "Other",
      },
    });
  };

  // =====================================================
  // Clear Image
  // =====================================================

  const handleClear = () => {
    if (loading) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);

    setPreviewUrl("");

    setPrediction(null);

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <section
      className="
        px-4
        py-12
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-emerald-100
            bg-gradient-to-br
            from-emerald-50
            via-white
            to-green-50
            shadow-sm

            dark:border-emerald-900
            dark:from-emerald-950
            dark:via-gray-900
            dark:to-green-950
          "
        >
          <div
            className="
              grid
              gap-8
              p-6
              md:p-10
              lg:grid-cols-2
              lg:items-center
            "
          >
            {/* =================================================
                Left Information
            ================================================= */}

            <div>
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-emerald-100
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-emerald-700

                  dark:bg-emerald-900
                  dark:text-emerald-300
                "
              >
                <Sparkles size={16} />
                AI Crop Recognition
              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-4xl

                  dark:text-white
                "
              >
                Identify Your Crop
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-base
                  leading-7
                  text-gray-600
                  sm:text-lg

                  dark:text-gray-300
                "
              >
                Upload a clear photo of your crop and let Hawkins Farm&apos;s
                AI-powered recognition system identify it for you.
              </p>

              <div
                className="
                  mt-6
                  space-y-3
                  text-sm
                  text-gray-600

                  dark:text-gray-300
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="
                      shrink-0
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  />

                  <span>Upload a clear crop image</span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="
                      shrink-0
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  />

                  <span>Get crop, category and confidence</span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="
                      shrink-0
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  />

                  <span>Use the result to create your product</span>
                </div>
              </div>
            </div>

            {/* =================================================
                Right Prediction Panel
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6

                dark:border-gray-700
                dark:bg-gray-900
              "
            >
              {/* =================================================
                  Empty State
              ================================================= */}

              {!previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    flex
                    min-h-72
                    w-full
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    border-gray-300
                    px-6
                    text-center
                    transition
                    hover:border-emerald-500
                    hover:bg-emerald-50

                    dark:border-gray-600
                    dark:hover:border-emerald-500
                    dark:hover:bg-emerald-950/40
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-100
                      text-emerald-600

                      dark:bg-emerald-900
                      dark:text-emerald-400
                    "
                  >
                    <ImagePlus size={30} />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      text-gray-900

                      dark:text-gray-100
                    "
                  >
                    Upload Crop Image
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-sm
                      text-sm
                      text-gray-500

                      dark:text-gray-400
                    "
                  >
                    JPG, JPEG, PNG or WEBP. Maximum file size: 5 MB.
                  </p>

                  <span
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-emerald-600
                      px-5
                      py-3
                      font-semibold
                      text-white
                      transition
                      hover:bg-emerald-700
                    "
                  >
                    <Upload size={18} />
                    Choose Image
                  </span>
                </button>
              )}

              {/* =================================================
                  Preview
              ================================================= */}

              {previewUrl && (
                <div>
                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-2xl
                      bg-gray-100

                      dark:bg-gray-800
                    "
                  >
                    <img
                      src={previewUrl}
                      alt="Selected crop"
                      className="
                        h-72
                        w-full
                        object-cover
                      "
                    />

                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={loading}
                      className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        bg-black/60
                        p-2
                        text-white
                        transition
                        hover:bg-black/80
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      aria-label="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* =================================================
                      Buttons
                  ================================================= */}

                  {!prediction && (
                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                      "
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="
                          inline-flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-gray-300
                          px-5
                          py-3
                          font-semibold
                          text-gray-700
                          transition
                          hover:bg-gray-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          dark:border-gray-600
                          dark:text-gray-300
                          dark:hover:bg-gray-800
                        "
                      >
                        <Camera size={18} />
                        Change Image
                      </button>

                      <button
                        type="button"
                        onClick={handlePredict}
                        disabled={loading}
                        className="
                          inline-flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-emerald-600
                          px-5
                          py-3
                          font-semibold
                          text-white
                          transition
                          hover:bg-emerald-700
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        {loading ? (
                          <>
                            <Loader2
                              size={18}
                              className="
                                animate-spin
                              "
                            />
                            Identifying...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Identify Crop
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* =================================================
                      Prediction Result
                  ================================================= */}

                  {prediction?.prediction && (
                    <div
                      className="
                        mt-5
                        rounded-2xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        p-5

                        dark:border-emerald-800
                        dark:bg-emerald-950/50
                      "
                    >
                      {/* =============================================
                          Crop + Confidence
                      ============================================= */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <p
                            className="
                              text-sm
                              font-medium
                              text-emerald-700

                              dark:text-emerald-300
                            "
                          >
                            Predicted Crop
                          </p>

                          <h3
                            className="
                              mt-1
                              text-3xl
                              font-bold
                              text-gray-900

                              dark:text-white
                            "
                          >
                            {prediction.prediction.crop.replaceAll("_", " ")}
                          </h3>
                        </div>

                        {/* Confidence */}

                        <div
                          className="
                            rounded-xl
                            bg-white
                            px-4
                            py-3
                            text-center
                            shadow-sm

                            dark:bg-gray-800
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-medium
                              text-gray-500

                              dark:text-gray-400
                            "
                          >
                            Confidence
                          </p>

                          <p
                            className="
                              mt-1
                              text-xl
                              font-bold
                              text-emerald-600

                              dark:text-emerald-400
                            "
                          >
                            {prediction.prediction.confidence}%
                          </p>
                        </div>
                      </div>

                      {/* =============================================
                          Category
                      ============================================= */}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-emerald-200
                          bg-white
                          px-4
                          py-3

                          dark:border-emerald-800
                          dark:bg-gray-800
                        "
                      >
                        <div>
                          <p
                            className="
                              text-xs
                              font-medium
                              text-gray-500

                              dark:text-gray-400
                            "
                          >
                            Category
                          </p>

                          <p
                            className="
                              mt-1
                              text-lg
                              font-bold
                              text-gray-900

                              dark:text-white
                            "
                          >
                            {prediction.prediction.category || "Other"}
                          </p>
                        </div>

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-100
                            text-emerald-600

                            dark:bg-emerald-900
                            dark:text-emerald-400
                          "
                        >
                          <Sparkles size={19} />
                        </div>
                      </div>

                      {/* =============================================
                          Top Predictions
                      ============================================= */}

                      {prediction.topPredictions?.length > 0 && (
                        <div className="mt-5">
                          <p
                            className="
                              mb-3
                              text-sm
                              font-semibold
                              text-gray-700

                              dark:text-gray-300
                            "
                          >
                            Top Predictions
                          </p>

                          <div className="space-y-2">
                            {prediction.topPredictions.map((item, index) => (
                              <div
                                key={`${item.crop}-${index}`}
                                className="
                                    rounded-lg
                                    bg-white
                                    px-4
                                    py-3

                                    dark:bg-gray-800
                                  "
                              >
                                <div
                                  className="
                                      flex
                                      items-center
                                      justify-between
                                      gap-3
                                    "
                                >
                                  <span
                                    className="
                                        font-medium
                                        text-gray-800

                                        dark:text-gray-200
                                      "
                                  >
                                    {index + 1}.{" "}
                                    {item.crop.replaceAll("_", " ")}
                                  </span>

                                  <span
                                    className="
                                        text-sm
                                        font-semibold
                                        text-gray-600

                                        dark:text-gray-400
                                      "
                                  >
                                    {item.confidence}%
                                  </span>
                                </div>

                                <p
                                  className="
                                      mt-1
                                      text-xs
                                      text-gray-500

                                      dark:text-gray-400
                                    "
                                >
                                  Category: {item.category || "Other"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* =============================================
                          Add Crop
                      ============================================= */}

                      <button
                        type="button"
                        onClick={handleAddCrop}
                        className="
                          mt-5
                          w-full
                          rounded-lg
                          bg-emerald-600
                          px-5
                          py-3
                          font-semibold
                          text-white
                          transition
                          hover:bg-emerald-700
                        "
                      >
                        Add This Crop
                      </button>

                      <p
                        className="
                          mt-2
                          text-center
                          text-xs
                          text-gray-500

                          dark:text-gray-400
                        "
                      >
                        You can review and complete the product details before
                        adding it to your marketplace.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================
                  Error
              ================================================= */}

              {error && (
                <div
                  className="
                    mt-4
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    text-sm
                    text-red-700

                    dark:border-red-900
                    dark:bg-red-950/50
                    dark:text-red-300
                  "
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  Hidden Input
              ================================================= */}

              <input
                ref={fileInputRef}
                type="file"
                accept="
                  image/jpeg,
                  image/jpg,
                  image/png,
                  image/webp
                "
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CropPredictionCard;
