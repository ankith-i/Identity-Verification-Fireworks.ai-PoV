# Identity Verification with Fireworks.ai

## Introduction

Welcome to the **Identity Verification with Fireworks.ai** project! This application streamlines the Know Your Customer (KYC) process by allowing users to upload identification documents such as Driver's Licenses or Passports. Leveraging advanced Vision-Language Models (VLM) from Fireworks.ai, the application automatically corrects the orientation of uploaded images, extracts relevant KYC information, and presents it in a structured JSON format. This ensures high accuracy and efficiency in verifying user identities.

## Features

- **Document Upload:** Users can easily upload images of their Driver's Licenses or Passports.
- **Automated Image Rotation:** An ML model automatically corrects the orientation of uploaded documents to ensure they are centered and properly aligned.
- **Manual Adjustment:** If the automated rotation fails, users can manually adjust the image orientation using intuitive rotation controls.
- **KYC Information Extraction:** Extracts critical KYC details such as Document ID, First Name, Last Name, Address, Sex, and Date of Birth.
- **User-Friendly Interface:** Designed with a clean and responsive UI for seamless user experience.
- **Containerized Deployment:** Dockerized application for easy setup and consistent environment across different machines.

## Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Python, Flask
- **Machine Learning:** TensorFlow, Fireworks.ai - VLM
- **Containerization:** Docker

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Docker:** Ensure Docker is installed on your system. You can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).
- **Git:** Install Git to clone the repository. Download it from [Git's official website](https://git-scm.com/downloads).

## Installation

Follow these steps to set up and run the project on your local machine.

### 1. Clone the Repository

Open your terminal or command prompt and run the following command to clone the repository:

```bash
git clone https://github.com/ankith-i/Identity-Verification-Fireworks.ai-PoV.git
```
### 2. Navigate to the Project Directory

```bash
cd Identity-Verification-Fireworks.ai-PoV
```

### 3. Configuration

- **Obtain Fireworks.ai API Key:** Create an Account: Sign up at [Fireworks.ai](https://fireworks.ai/login) to obtain your API key for the Vision-Language Model.
- **Update config.py file at back-end directory:** Replace the API Key palceholder with Fireworks ai API Key
- **Download and Place the saved Rotation Model:** Download the [rotation_model3.h5](https://drive.google.com/file/d/1-1EFSU0cm_ueswb0_9nEb_kFtm3ZZ_qJ/view?usp=drive_link) file and move the downloaded rotation_model3.h5 file into the backend directory.

### 4. Running Application

- **Start Docker Compose:** This command will build the Docker images and start the containers. Ensure that ports 5173 (frontend) and 5000 (backend) are not being used by other applications.

```bash
docker compose up
```
- **Access the Application:** Open your web browser and navigate to:
```bash
http://localhost:5173
```
## Usage

Once the application is up and running, follow these steps to use the application.

### Uploading Documents

#### Upload Your Document

Upon accessing the application, you will be prompted to upload the identification document. This can be either a **Driver's License** or a **Passport**.

![Upload Document Screenshot](path/to/upload_screenshot.png)

### Auto Rotation

#### Automated Image Rotation

After uploading, the ML model will automatically analyze and correct the orientation of your document. The corrected image will be displayed to ensure it is centered and properly aligned.

### Manual Rotation

#### Manual Adjustment (If Necessary)

If the automated rotation does not properly center your document, use the rotation arrows provided to manually adjust the image's orientation.

- **Rotate Left:** Click the left arrow to rotate the image 90 degrees counterclockwise.
- **Rotate Right:** Click the right arrow to rotate the image 90 degrees clockwise.

![Rotation UI Screenshot](path/to/manual_rotation_screenshot.png)

### Extracted KYC Information

#### View Extracted Information

Once you are satisfied with the document's orientation, submit the image for processing. The application will display the extracted KYC information in a structured JSON format.

![Extracted KYC Information Screenshot](path/to/extracted_kyc_screenshot.png)

## Contact
If you have any questions, please reach out to **Ankith Indrakumar** at [ankithindrakumar@gmail.com](mailto:ankithindrakumar@gmail.com).

