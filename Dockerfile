FROM node:20

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm ci

WORKDIR /app/frontend
RUN npm ci

WORKDIR /app

EXPOSE 3000
EXPOSE 5000