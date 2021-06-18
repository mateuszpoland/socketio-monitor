FROM node:16

WORKDIR /srv/app

COPY ../node-server/package*.json .

RUN npm install

COPY ../node-server .

EXPOSE 8181

CMD ["node", "servers.js"]
