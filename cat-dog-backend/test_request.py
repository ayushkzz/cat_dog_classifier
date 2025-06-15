import requests

url = "http://127.0.0.1:5001/predict"
image_path = "jack.jpg"

with open(image_path, "rb") as img:
    response = requests.post(url, files={"image": img})

print("Status Code:", response.status_code)
print("Response:", response.json())