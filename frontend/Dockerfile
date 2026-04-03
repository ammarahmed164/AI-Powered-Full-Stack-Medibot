# ============================================
# MediBot Frontend Dockerfile
# ============================================
# Multi-stage build for React application
# ============================================

# -------------------------------------------
# Stage 1: Development
# -------------------------------------------
FROM node:20-alpine as development

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# -------------------------------------------
# Stage 2: Build
# -------------------------------------------
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm install

# Copy application code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL
ARG NODE_ENV=production

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_WS_URL=$REACT_APP_WS_URL \
    NODE_ENV=$NODE_ENV

# Build the application
RUN npm run build

# -------------------------------------------
# Stage 3: Production (Nginx)
# -------------------------------------------
FROM nginx:alpine as production

# Copy custom nginx configuration
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# -------------------------------------------
# Alternative: Serve with Node.js
# -------------------------------------------
FROM node:20-alpine as serve

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build

# Install serve package
RUN npm install -g serve

EXPOSE 3000

# Start production server
CMD ["serve", "-s", "build", "-l", "3000"]

# -------------------------------------------
# Build Instructions
# -------------------------------------------
# Development:
#   docker build -t medibot-frontend:dev --target development .
#
# Production:
#   docker build -t medibot-frontend:latest --target production .
#
# With build args:
#   docker build \
#     --build-arg REACT_APP_API_URL=https://api.medibot.com \
#     --build-arg NODE_ENV=production \
#     -t medibot-frontend:latest \
#     --target production .
#
# Run:
#   docker run -p 3000:80 medibot-frontend:latest
# ============================================
