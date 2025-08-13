# Use Node.js 20 as base image (required for NestJS 11)
FROM node:20-alpine

# Cache-busting label to force fresh rebuilds on Railway
LABEL cache_bust="redeploy-2025-08-13-01"

# Set working directory
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

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

# Docker-level healthcheck using PORT env
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD sh -c "curl -fsS http://localhost:${PORT:-4000}/health || exit 1"

# Start the application (root package.json will cd into server)
CMD ["npm", "start"]
