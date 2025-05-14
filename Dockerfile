# Stage 1: Build
FROM node:23.11-alpine as build

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN npx tsc

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

