# backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY backend/package.json backend/package-lock.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend .

# Expose the backend API port
EXPOSE 3000

# Start the backend
CMD ["node", "index.js"]