# Front-End Dockerfile

# Use an official Node.js image as the base
FROM node:20.11.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on (5173 for Vite)
EXPOSE 5173

# Set environment variables (if needed)
ENV VITE_API_URL=$VITE_API_URL

# Start the application with the host flag
CMD ["npm", "run", "dev", "--", "--host"]
