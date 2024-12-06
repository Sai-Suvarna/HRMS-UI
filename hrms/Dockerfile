# # Use Node.js as the base image
# FROM node:16-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "build", "-l", "3000"]


# # Use a Node.js base image
# FROM node:14 as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# FROM nginx:stable-alpine
# COPY --from=build-stage /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# # Use a Node.js base image
# FROM node:14.17.3-alpine as build

# # Set the working directory
# WORKDIR /app

# # Copy the package.json and package-lock.json files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy the rest of the application code
# COPY . .

# # Build the React application
# RUN npm run build

# # Use a lightweight web server to serve the built application
# FROM nginx:1.19.0-alpine

# # Copy the built application from the previous stage
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose the port that Nginx will listen on
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]





# Use a Node.js base image
FROM node:14.17.3-alpine as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight web server to serve the built application
FROM nginx:1.19.0-alpine

# Copy the built application from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will listen on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]