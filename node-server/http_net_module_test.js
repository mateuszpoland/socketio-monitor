const net = require('net');

const server = net.createServer();
server.listen({
    host: 'localhost',
    port: 8083
});

server.on('connection', (client) => {
    console.log('client connected');
    client.write('Welcome to the node-server');
});
