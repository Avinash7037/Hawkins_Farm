import json
from pathlib import Path
import tensorflow as tf
BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models" / "crop_model.keras"
CONFIG_PATH = MODEL_DIR / "config.json"
WEIGHTS_PATH = MODEL_DIR / "model.weights.h5"

OUTPUT_PATH = BASE_DIR / "models" / "crop_model_49.keras"


print("Loading model configuration...")
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    config = json.load(f)


print("Reconstructing model...")
model = tf.keras.models.model_from_json(
    json.dumps(config)
)

print("Loading model weights...")

model.load_weights(WEIGHTS_PATH)

print("Model reconstructed successfully.")

print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)

if model.output_shape[-1] != 49:
    raise RuntimeError(
        f"Expected 49 output classes, "
        f"but model has {model.output_shape[-1]}"
    )

print("Saving proper .keras model...")

model.save(OUTPUT_PATH)

print(f"49-class model saved to:")
print(OUTPUT_PATH)