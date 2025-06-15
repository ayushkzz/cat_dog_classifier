# model.py

import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow.keras.models import load_model
from tensorflow.keras import layers
from PIL import Image
import io

# Define the custom MobileNetv2 layer used during training
mobilenet_v2_layer = hub.KerasLayer(
    "https://tfhub.dev/google/tf2-preview/mobilenet_v2/classification/4",
    trainable=False
)

class MobileNetv2(layers.Layer):
    def call(self, inputs):
        return mobilenet_v2_layer(inputs)

# Load the trained model
model = load_model(
    'dogs_vs_cats_mobilenetv2.h5',
    custom_objects={'MobileNetv2': MobileNetv2, 'KerasLayer': hub.KerasLayer}
)

IMG_SIZE = (224, 224)

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize(IMG_SIZE)
    image_array = np.array(image)
    image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)
    return np.expand_dims(image_array, axis=0)

def predict_image(image_bytes):
    processed = preprocess_image(image_bytes)
    prediction = model.predict(processed)[0][0]
    prediction = np.clip(prediction, 0.0, 1.0)  # Ensure valid range

    label = "Cat" if prediction <= 0.5 else "Dog"
    confidence = prediction if label == "Dog" else 1 - prediction

    return {
        "label": label,
        "confidence": round(float(confidence) * 100, 2)
    }