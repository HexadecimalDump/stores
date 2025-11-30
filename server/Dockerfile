# Stage 1: Build the application
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Prepare the application
FROM node:22-alpine AS runtime
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
COPY --from=build /app/dist ./dist
EXPOSE ${PORT}

