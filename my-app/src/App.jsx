import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction('');
      setShowUploadBox(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction('');
      setShowUploadBox(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!image) return;
    setShowUploadBox(false);
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5001/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(`${res.data.prediction} (${res.data.confidence}% confidence)`); 
    } catch (err) {
      setPrediction('❌ Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setPrediction('');
    setShowUploadBox(true);
    fileInputRef.current.value = null;
  };

  return (
    <div className="app-container">
      <div className="top-heading-container">
        <h2 className="top-heading" style={{ marginBottom: '0.5rem' }}>Cat-Dog-Classifier</h2>
        <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
          Upload a photo of a cat or dog to classify it.
        </div>
      </div>

      {showUploadBox && (
        <>
          <div className="dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
            <p>Drag & drop an image here</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <button type="button" className="upload-btn" onClick={handleUploadClick} style={{ marginTop: '20px' }}>
            Take Photo / Upload
          </button>
        </>
      )}

      {preview && (
        <img src={preview} alt="Uploaded preview" className="image-preview" />
      )}

      <div style={{ marginTop: '20px' }}>
        {image && (
          <>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Predicting...' : 'Predict'}
            </button>
            {!loading && (
              <button onClick={handleReset} style={{ marginLeft: '10px', backgroundColor: '#eee', color: '#333' }}>
                Clear
              </button>
            )}
          </>
        )}
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {prediction && <div className="result">Prediction: <strong>{prediction}</strong></div>}
    </div>
  );
}

export default App;