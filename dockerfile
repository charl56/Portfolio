# docker build -t studi0426/charles:frontend .
# docker run -p 127.0.0.1:8081:80 -d studi0426/charles:frontend

#####
##### Docker multi-stage build : Node.js build image
#####
FROM node:lts-alpine AS build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# Copy project files and restore as distinct layers
COPY package.json ./

# install project dependencies
RUN npm install

# Copy everything else for build
COPY src/ ./src
COPY vite.config.js ./
COPY index.html ./

# build app for production with minification
RUN npm run build

COPY images/ /app/dist/images

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]