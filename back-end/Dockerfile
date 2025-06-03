FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Force install dependencies without checks
RUN npm install --force

# Copy the rest of the application
COPY . .

# Force build without validations
ENV NODE_ENV=production
RUN npm run build --force

EXPOSE 1337

# Start in development mode without checks
CMD ["npm", "run", "develop", "--no-lint"] 