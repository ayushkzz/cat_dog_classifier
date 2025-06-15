# Cat-Dog Classifier Backend

## Setup & Run

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   python app.py
   ```

- The backend will start on `http://localhost:5001` (or as configured in `app.py`).
- Make sure the model file (`dogs_vs_cats_mobilenetv2.h5`) is present in this folder.

## API
- `POST /predict` with an image file (form-data, key: `image`) returns the prediction and confidence.
