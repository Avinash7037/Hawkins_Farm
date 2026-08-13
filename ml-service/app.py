import os

# =====================================================
# TensorFlow CPU Configuration
# =====================================================

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"

import json
from pathlib import Path

import numpy as np
import tensorflow as tf

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image


# =====================================================
# Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "crop_model_49.keras"
LABELS_PATH = BASE_DIR / "labels.json"


# =====================================================
# Flask Application
# =====================================================

app = Flask(__name__)

# Allow frontend requests
CORS(app)


# =====================================================
# Crop Categories
# =====================================================

CROP_CATEGORIES = {

    # Fruits
    "Apple": "Fruits",
    "Dragon_Fruits": "Fruits",
    "Grapes": "Fruits",
    "Mango": "Fruits",
    "Orange": "Fruits",
    "Papaya": "Fruits",
    "Pomegranate": "Fruits",

    # Vegetables
    "Bitter_Gourd": "Vegetables",
    "Brinjal": "Vegetables",
    "Broccoli": "Vegetables",
    "Cabbage": "Vegetables",
    "Capsicum": "Vegetables",
    "Carrot": "Vegetables",
    "Cauliflower": "Vegetables",
    "Cucumber": "Vegetables",
    "Potato": "Vegetables",
    "Pumpkin": "Vegetables",
    "Radish": "Vegetables",
    "Tomato": "Vegetables",
    "Bean": "Vegetables",

    # Grains
    "rice": "Grains",
    "wheat": "Grains",

    # Pulses
    "chaana_dal": "Pulses",
    "chole": "Pulses",
    "harbara": "Pulses",
    "masur_dal": "Pulses",
    "matki": "Pulses",
    "moong": "Pulses",
    "tur_dal": "Pulses",

    # Spices
    "Asafoetida": "Spices",
    "Bay Leaf": "Spices",
    "Black Cardamom": "Spices",
    "Black Pepper": "Spices",
    "Caraway seeds": "Spices",
    "Cinnamom stick": "Spices",
    "Cloves": "Spices",
    "Coriander Seeds": "Spices",
    "Cubeb Pepper": "Spices",
    "Cumin seeds": "Spices",
    "Dry Ginger": "Spices",
    "Dry red Chilly": "Spices",
    "Fennel seeds": "Spices",
    "Green Cardamom": "Spices",
    "Mace": "Spices",
    "Nutmeg": "Spices",
    "Poppy Seeds": "Spices",
    "Star Anise": "Spices",
    "Stone Flowers": "Spices",

    # Oilseeds
    "peanut": "Oilseeds",
}


# =====================================================
# Get Crop Category
# =====================================================

def get_crop_category(crop_name):
    return CROP_CATEGORIES.get(crop_name, "Other")


# =====================================================
# Load Labels
# =====================================================

print("Loading crop labels...")

if not LABELS_PATH.exists():
    raise RuntimeError(
        f"Labels file not found at: {LABELS_PATH}"
    )

with open(
    LABELS_PATH,
    "r",
    encoding="utf-8",
) as file:
    labels = json.load(file)

print(f"Loaded {len(labels)} crop labels.")


# =====================================================
# Validate Labels
# =====================================================

if not isinstance(labels, list):
    raise RuntimeError(
        "labels.json must contain a JSON array."
    )

if len(labels) == 0:
    raise RuntimeError(
        "labels.json contains no crop labels."
    )

if len(set(labels)) != len(labels):
    raise RuntimeError(
        "labels.json contains duplicate crop labels."
    )


# =====================================================
# Load Model
# =====================================================

print("Loading crop recognition model...")

if not MODEL_PATH.exists():
    raise RuntimeError(
        f"Crop model not found at: {MODEL_PATH}"
    )

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False,
)

print("Crop recognition model loaded successfully.")


# =====================================================
# Model Information
# =====================================================

print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)


# =====================================================
# Validate Model / Labels
# =====================================================

try:
    expected_classes = int(model.output_shape[-1])

except (TypeError, ValueError):
    raise RuntimeError(
        "Unable to determine the number of output classes."
    )


if expected_classes != len(labels):
    raise RuntimeError(
        f"Model outputs {expected_classes} classes, "
        f"but labels.json contains {len(labels)} labels."
    )

print(
    f"Model and labels successfully matched: "
    f"{expected_classes} classes."
)


# =====================================================
# Model Input Validation
# =====================================================

model_input_shape = model.input_shape

if len(model_input_shape) != 4:
    raise RuntimeError(
        "Expected model input shape like "
        "(None, height, width, channels)."
    )

input_height = model_input_shape[1]
input_width = model_input_shape[2]
input_channels = model_input_shape[3]

if input_height is None or input_width is None:
    raise RuntimeError(
        "Model input height/width must be defined."
    )

if input_channels != 3:
    raise RuntimeError(
        f"Expected 3 input channels, "
        f"but model expects {input_channels}."
    )

print(
    f"Image input size: "
    f"{input_width} x {input_height} x {input_channels}"
)


# =====================================================
# TensorFlow Warm-Up
# =====================================================

print("Warming up TensorFlow model...")

try:

    dummy_image = np.zeros(
        (
            1,
            int(input_height),
            int(input_width),
            3,
        ),
        dtype=np.float32,
    )

    # Direct model call is faster for single-image inference
    _ = model(
        dummy_image,
        training=False,
    ).numpy()

    print("TensorFlow model warm-up completed.")

except Exception as error:

    print(
        "Model warm-up failed:",
        str(error),
    )


# =====================================================
# Health Check
# =====================================================

@app.get("/")
def health_check():

    return jsonify(
        {
            "success": True,
            "message":
                "Hawkins Farm Crop Recognition API Running",
            "model_loaded":
                model is not None,
            "classes":
                len(labels),
            "input_size":
                {
                    "width":
                        int(input_width),
                    "height":
                        int(input_height),
                    "channels":
                        int(input_channels),
                },
        }
    )


# =====================================================
# Crop Prediction
# =====================================================

@app.post("/predict")
def predict_crop():

    print("Prediction request received.")

    # =================================================
    # Validate Image
    # =================================================

    if "image" not in request.files:

        return jsonify(
            {
                "success": False,
                "message": "No image uploaded.",
            }
        ), 400

    image_file = request.files["image"]

    if (
        not image_file
        or image_file.filename == ""
    ):

        return jsonify(
            {
                "success": False,
                "message":
                    "Please select an image.",
            }
        ), 400

    try:

        print("Opening image...")

        # =============================================
        # Open Image
        # =============================================

        image = Image.open(image_file)

        # =============================================
        # Convert RGB
        # =============================================

        image = image.convert("RGB")

        # =============================================
        # Resize
        # =============================================

        image = image.resize(
            (
                int(input_width),
                int(input_height),
            ),
            Image.Resampling.BILINEAR,
        )

        # =============================================
        # Convert To NumPy
        # =============================================

        image_array = np.asarray(
            image,
            dtype=np.float32,
        )

        # =============================================
        # Validate Image
        # =============================================

        expected_shape = (
            int(input_height),
            int(input_width),
            3,
        )

        if image_array.shape != expected_shape:

            return jsonify(
                {
                    "success": False,
                    "message":
                        "Invalid image dimensions.",
                }
            ), 400

        # =============================================
        # Add Batch Dimension
        # =============================================

        image_array = np.expand_dims(
            image_array,
            axis=0,
        )

        print("Running model inference...")

        # =============================================
        # Model Prediction
        # =============================================

        # Direct model call instead of model.predict()
        predictions = model(
            image_array,
            training=False,
        ).numpy()

        probabilities = predictions[0]

        print("Model inference completed.")

        # =============================================
        # Validate Prediction Output
        # =============================================

        if len(probabilities) != len(labels):

            raise RuntimeError(
                f"Model returned "
                f"{len(probabilities)} predictions, "
                f"but labels.json contains "
                f"{len(labels)} labels."
            )

        # =============================================
        # Best Prediction
        # =============================================

        predicted_index = int(
            np.argmax(probabilities)
        )

        confidence = float(
            probabilities[predicted_index] * 100
        )

        predicted_crop = labels[predicted_index]

        predicted_category = get_crop_category(
            predicted_crop
        )

        # =============================================
        # Top 3 Predictions
        # =============================================

        top_count = min(
            3,
            len(probabilities),
        )

        top_indices = np.argsort(
            probabilities
        )[-top_count:][::-1]

        top_predictions = []

        for index in top_indices:

            index = int(index)

            crop_name = labels[index]

            crop_category = get_crop_category(
                crop_name
            )

            top_predictions.append(
                {
                    "crop":
                        crop_name,

                    "category":
                        crop_category,

                    "confidence":
                        round(
                            float(
                                probabilities[index] * 100
                            ),
                            2,
                        ),
                }
            )

        # =============================================
        # Response
        # =============================================

        response = {
            "success": True,

            "prediction": {
                "crop":
                    predicted_crop,

                "category":
                    predicted_category,

                "confidence":
                    round(confidence, 2),
            },

            "topPredictions":
                top_predictions,

            "classes":
                len(labels),
        }

        print(
            "Prediction:",
            predicted_crop,
            f"({confidence:.2f}%)",
        )

        return jsonify(response)

    except Exception as error:

        print(
            "Crop prediction error:",
            str(error),
        )

        return jsonify(
            {
                "success": False,

                "message":
                    "Failed to process crop image.",

                "error":
                    str(error),
            }
        ), 500


# =====================================================
# Start Server
# =====================================================

if __name__ == "__main__":

    print(
        "Starting Hawkins Farm Crop Recognition API..."
    )

    app.run(
        host="0.0.0.0",
        port=int(
            os.environ.get(
                "PORT",
                8001,
            )
        ),
        debug=False,
    )