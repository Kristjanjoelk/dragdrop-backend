const socketIO = require('socket.io-client');
const socketURL = 'http://0.0.0.0:3000';
const socket = socketIO.connect(socketURL);

console.log(socketIO);
socket.on('connection', function (data) {
    console.log('on data: ', data);
});