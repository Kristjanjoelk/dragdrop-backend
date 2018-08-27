const socketIO = require('socket.io-client');
const socketURL = 'http://0.0.0.0:3000';
const socket = socketIO.connect(socketURL);


var response = function (data) {
    console.log(data);
}

socket.on('connect', function (data) {
    console.log('Test client connected');
    var data = 'JoelTest';
    socket.emit('setusername', data, function (res) {
        if (!res) {
            console.log('could not set username for some reason');
        } else {
            console.log('successfully set user name');
        }
    });

    socket.emit('getinfo', data, function (res) {
        if (!res) {
            console.log('could not set username for some reason');
        } else {
            console.log('getinfo: ', res);
        }
    });

    socket.on('test', data, function (res) {
        if (!res) {
            console.log('could not set username for some reason');
        } else {
            console.log('test: ', res);
        }
    });
});


