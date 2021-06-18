const net = require('net');

const client = net.createConnection({
    port: 8083,
});

client.on('data', (data) => {
    console.log('data received: ' + data);
});
