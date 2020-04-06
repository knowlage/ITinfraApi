FROM node:13.12.0-alpine3.10
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install nodemon -g
COPY . /app
EXPOSE 8000