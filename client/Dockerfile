# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the app for production with minification
RUN npm run build

# Use the official nginx image to serve the built frontend files.
# https://hub.docker.com/_/nginx
FROM nginx:alpine

# Copy built assets from the previous stage
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]