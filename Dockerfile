# FROM nginx:1.17.1-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /dist/angular /usr/share/nginx/html

### STAGE 1: Build ###
FROM node:12.7-alpine AS build
ARG env
ARG build
COPY build.sh .
RUN ./build.sh
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/angular /usr/share/nginx/html

