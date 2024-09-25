# app.py

# Import necessary libraries
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
from io import BytesIO
from PIL import Image
from pydantic import BaseModel, Field
import fireworks.client
from config import Config
import numpy as np
import re 
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS to accept requests from the frontend

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the rotation angles corresponding to the classes
angles = ['0', '90', '180', '270']  # Ensure this matches the angles used during training

# Parameters for the rotation model
img_height, img_width = 224, 224  # Input image dimensions for the model

# Load the saved rotation correction model once at startup
model_save_path = 'rotation_model3.h5'  # Adjust to the correct path where the model is saved
model = load_model(model_save_path)
logger.info("Rotation correction model loaded.")

class KYCResult(BaseModel):
    document_id: str = Field(alias='Document ID')
    first_name: str = Field(alias='First Name')
    last_name: str = Field(alias='Last Name')
    address: str = Field(alias='Address')
    sex: str = Field(alias='Sex')
    dob: str = Field(alias='Date of Birth')

def encode_image(image_data):
    """Encode image data to base64."""
    return base64.b64encode(image_data).decode('utf-8')

def correct_image_orientation_high_res_pil(image):
    """
    Takes a PIL Image object, predicts its rotation angle using the model,
    and returns the corrected high-resolution image.
    """
    try:
        # Keep the original image mode (e.g., RGB, RGBA)
        original_mode = image.mode

        # Preprocess the image for the model
        img = image.resize((img_width, img_height))

        # Convert image to RGB if not already in RGB mode
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Convert the image to array
        img_array = img_to_array(img) / 255.0
        img_array_expanded = np.expand_dims(img_array, axis=0)  # Shape: (1, 224, 224, 3)

        # Predict the rotation angle
        prediction = model.predict(img_array_expanded)
        predicted_class = np.argmax(prediction, axis=1)[0]
        rotation_angle = int(angles[predicted_class])

        # Rotate the original high-resolution image to correct orientation
        corrected_image = image.rotate(-rotation_angle, expand=True)

        # Ensure image is in RGB mode
        if corrected_image.mode != 'RGB':
            corrected_image = corrected_image.convert('RGB')

        return corrected_image
    except Exception as e:
        logger.error(f"Error in correct_image_orientation_high_res_pil: {e}")
        return image  # Return the original image if rotation fails

@app.route('/', methods=['POST'])
def rotate_image():
    if 'document' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['document']
    if file.filename == '' or not file.filename.lower().endswith(('png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ppm')):
        return jsonify({'error': 'Unsupported file type'}), 400

    try:
        # Load the image from the uploaded file
        image = Image.open(file.stream)

        # Correct the image orientation using the ML model
        image = correct_image_orientation_high_res_pil(image)

        # Ensure image is in RGB mode
        if image.mode in ("RGBA", "P", "LA"):
            image = image.convert("RGB")

        # Encode the image to base64 to send back to frontend
        buffered = BytesIO()
        image.save(buffered, format='JPEG', quality=85)
        image_data = buffered.getvalue()
        if len(image_data) > (5 * 1024 * 1024):  # 5 MB limit
            return jsonify({'error': 'Image size exceeds 5MB limit.'}), 413
        image_base64 = encode_image(image_data)

        return jsonify({'rotated_image': f"data:image/jpeg;base64,{image_base64}"}), 200

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/process', methods=['POST'])
def process_image():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        image_data = data['image']

        # Decode the base64 image
        header, encoded = image_data.split(',', 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(BytesIO(image_bytes))

        # Ensure image is in RGB mode
        if image.mode in ("RGBA", "P", "LA"):
            image = image.convert("RGB")

        # Encode the image to base64 for Fireworks AI
        buffered = BytesIO()
        image.save(buffered, format='JPEG', quality=85)
        image_data = buffered.getvalue()
        if len(image_data) > (5 * 1024 * 1024):  # 5 MB limit
            return jsonify({'error': 'Image size exceeds 5MB limit.'}), 413
        image_base64 = encode_image(image_data)

        fireworks.client.api_key = Config.API_KEY

        prompt_instructions = (
                    "You are an AI porwerful AI assistant to extract KYC information from images of US passports and driver's licenses.\n"
                    "The images can be rotated (it can be in different angles and it need not be in standard readable angle that is + 90 degree andgle) and can be a bit blury sometimes,"
                    "but you are an expert who can read any kind of image irrespective of orientation and quality and you always double check and re verify the things which you extract before you give the output"
                    "Especially once you find out that the images are rotated, you re-verify the extracted output and if you are confident over 90% then only you return the output or else you return NULL"
                    "Please focus on the following details and extract them accurately based on your above capabilities:\n"
                    "- Document ID (labeled as 'DL or 'DLN' or 'Passport No' or 'Passport Number' or equivalent in various languages or anything similar to it.)"
                    "- First Name (labeled as 'Given Name' or 'FN' or equivalent in various languages.)\n"
                    "- Last Name (labeled as 'Surname' or 'LN' or equivalent in various languages.)\n"
                    "- Address (specifically look for 'Place of Birth' or equivalent in various languages in passports. Address field might be explicilty written as Address or equivalent in various languages in Drivers Liciense or there might not be any explicit title for address in DL, you need to figure that out on your own.)\n"
                    "- Sex (convert any 'Male' to 'M' and 'Female' to 'F'; if already 'M' or 'F', keep it as it is)\n"
                    "- Date of Birth (recognize different date formats and convert them to 'mm/dd/yyyy'.)\n"
                    "Consider that documents might have fields without explicit titles, and information may be in different formats or languages. "
                    "Ensure to process the image correctly regardless of its orientation. Do not include any additional text or explanations.\n\n"
                    "Please ignore any additional text and extract only the required information in a structured JSON format without explanations.\n\n"
                    "Example Output:\n"
                    "{\n"
                    '  "First Name": "JOHN",\n'
                    '  "Last Name": "DOE",\n'
                    '  "Address": "123 Main St, Anytown, USA",\n'
                    '  "Sex": "M",\n'
                    '  "Date of Birth": "01/15/1980"\n'
                    "}\n"
                    "{\n"
                    '  "First Name": "Jay Cutler",\n'
                    '  "Last Name": "Joseph",\n'
                    '  "Address": "Texas, USA",\n'
                    '  "Sex": "M",\n'
                    '  "Date of Birth": "03/15/1999"\n'
                    "}\n"
                    "{\n"
                    '  "First Name": "Mark",\n'
                    '  "Last Name": "Anothny",\n'
                    '  "Address": " Province of Massachusetts Bay, USA",\n'
                    '  "Sex": "M",\n'
                    '  "Date of Birth": "01/15/1980"\n'
                    "}\n\n"
                    "Now, analyze the uploaded image and extract the KYC information."
                )
        
        messages = [{
            "role": "user",
            "content": [{
                "type": "text",
                "text": prompt_instructions
            }, {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_base64}"
                }
            }]
        }]

        response_format = {
            "type": "json_object",
            "schema": KYCResult.model_json_schema()
        }

        response = fireworks.client.ChatCompletion.create(
            model="accounts/fireworks/models/phi-3-vision-128k-instruct",
            messages=messages,
            response_format=response_format,
            temperature=0.1
        )

        output_data = json.loads(response.choices[0].message.content)
        # Post-process the data
        if 'Date of Birth' in output_data:
            dob = output_data['Date of Birth']
            date_formats = ["%d %b %Y", "%d %B %Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%B %d, %Y", "%b %d, %Y", "%d.%m.%Y"]
            for fmt in date_formats:
                try:
                    parsed_dob = datetime.strptime(dob, fmt)
                    output_data['Date of Birth'] = parsed_dob.strftime("%m/%d/%Y")
                    break
                except ValueError:
                    continue

        if 'Sex' in output_data:
            sex = output_data['Sex'].lower()
            if sex in ['male', 'm']:
                output_data['Sex'] = 'M'
            elif sex in ['female', 'f']:
                output_data['Sex'] = 'F'

        # Trim "DL" or "DLN" from Document ID using regex
        document_id = output_data.get('Document ID', '')
        document_id = re.sub(r'^(DLN?)[\s:]*', '', document_id, flags=re.IGNORECASE)
        output_data['Document ID'] = document_id

        return jsonify(output_data), 200

    except Exception as e:
        logger.error(f"Unexpected error in /process: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
