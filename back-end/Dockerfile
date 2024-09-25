# Back-End Dockerfile

# Use the official Python image as the base
FROM python:3.11.4-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on (5000)
EXPOSE 5000

# Start the application
CMD ["python", "app.py"]
