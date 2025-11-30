# Next.js v15 & Node.js v25.1.0 用 Dockerfile
FROM node:25.1.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
