FROM node:20.18.0-bookworm-slim

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm ci --omit=dev

WORKDIR /app/frontend
RUN npm ci
RUN npm run build

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]
