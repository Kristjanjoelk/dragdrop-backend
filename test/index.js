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

            setTimeout(function() {
                console.log('creating game.... ');
                socket.emit('creategame', function (res) {
                    if(!res) {
                        console.log('error creating game');
                    } else {
                        console.log('successfully created game');
                        setTimeout(function() {
                            console.log('joining game.... ');
                            socket.emit('joingame', 0, function (res) {
                                if(!res) {
                                    console.log('error joining game');
                                } else {
                                    console.log('successfully joined game');
                                    setTimeout(function() {
                                        console.log('get random cards... ');
                                        socket.emit('getrandomcards', function (res) {
                                            if(!res) {
                                                console.log('error getting random cards');
                                            } else {
                                                console.log('successfully got random cards', res);
                                                setTimeout(function() {
                                                    console.log('addCardToBoard!! ');
                                                    socket.emit('addcardtoboard', 0, function (res) {
                                                        if(!res) {
                                                            console.log('error adding card to board');
                                                        } else {
                                                            console.log('successfully added card to bard', res);
                                                        }
                                                    });
                                                }, 500);
                                            }
                                        });
                                    }, 500);
                                }
                            });
                        }, 500);
                    }
                })
            }, 500);
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


