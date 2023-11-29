# Use an official Node.js runtime as the base image with your specified version
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /app

# Install Ionic globally
RUN npm install -g @ionic/cli

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory into the container
COPY . .

# Expose port 80 for your Ionic project
EXPOSE 80

# Start the Ionic development server on port 80
CMD ["ionic", "serve", "--port", "80", "--host", "0.0.0.0"]
