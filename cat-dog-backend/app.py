# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_image

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    try:
        result = predict_image(file.read())
        return jsonify({
            'prediction': result['label'],
            'confidence': result['confidence']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)