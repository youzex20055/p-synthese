FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 