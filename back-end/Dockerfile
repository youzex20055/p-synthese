FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with memory limit
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the application with memory limit
ENV NODE_ENV=production
RUN npm run build --force

EXPOSE 1337

# Start in development mode without checks
CMD ["npm", "run", "develop", "--no-lint"] 