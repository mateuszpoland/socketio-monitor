FROM node:16

WORKDIR /usr/src/app

COPY ../node-client/package*.json .

RUN npm install

COPY ../node-client .

CMD ["node", "index.js"]
