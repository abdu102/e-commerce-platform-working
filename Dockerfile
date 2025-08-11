# Use Node.js 20 as base image (required for NestJS 11)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies only for root and server
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build only the server to ensure API availability
RUN cd server && npm run build

# Expose port
EXPOSE 4000

# Start the application (root package.json will cd into server)
CMD ["npm", "start"]
