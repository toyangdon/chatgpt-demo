FROM node:18
COPY . /demo
WORKDIR /demo
RUN npm install
ENTRYPOINT npm start
