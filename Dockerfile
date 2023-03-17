FROM node:18-alpine3.17
COPY . /demo
WORKDIR /demo
RUN npm install
ENTRYPOINT npm start
