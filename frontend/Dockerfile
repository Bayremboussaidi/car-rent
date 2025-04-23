# Stage 1: Build with Node.js
FROM node:20 AS build

WORKDIR /app

# Clean cache and upgrade npm first
RUN npm cache clean --force && \
    npm install -g npm@latest

# Copy package files
COPY package*.json ./

# Install dependencies with force
RUN npm install --legacy-peer-deps --force

# Copy source files
COPY . .

# Build Angular app
RUN npm run build -- --configuration=production

# Stage 2: Nginx server
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
