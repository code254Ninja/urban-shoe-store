# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy server files
COPY server/ ./server/

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 5001

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/server.js"]
