const socketIO = require('socket.io-client');
const socketURL = 'http://0.0.0.0:3000';
const socket = socketIO.connect(socketURL);


var response = function (data) {
    console.log(data);
}

socket.on('connect', function (data) {
    console.log('Test client connected');
    var data = {
        data: {
            option: {
                name: 'JoelTest'
            }
        }
    };
    data.type = 'setUserName';
    socket.emit('messagefromapp', data, function (res) {
        if (!res) {
            console.log('could not set username for some reason');
        } else {
            console.log('successfully set user name');
        }
    });

    data.type = 'getInfo';
    socket.emit('messagefromapp', data, function (res) {
        if (!res) {
            console.log('could not set username for some reason');
        } else {
            console.log('getinfo: ', res);

            setTimeout(function() {
                console.log('creating game.... ');
                data.type = 'creategame';
                socket.emit('messagefromapp', data, function (res) {
                    if(!res) {
                        console.log('error creating game');
                    } else {
                        console.log('successfully created game');
                        setTimeout(function() {
                            console.log('joining game.... ');
                            data.type = 'joingame';
                            data.payload = 0;
                            socket.emit('messagefromapp', data, function (res) {
                                if(!res) {
                                    console.log('error joining game');
                                } else {
                                    console.log('successfully joined game');
                                    setTimeout(function() {
                                        console.log('get random cards... ');
                                        data.type = 'getrandomcards';
                                        socket.emit('messagefromapp', data, function (res) {
                                            if(!res) {
                                                console.log('error getting random cards');
                                            } else {
                                                console.log('successfully got random cards', res);
                                                setTimeout(function() {
                                                    console.log('addCardToBoard!! ');
                                                    data.type = 'addcardtoboard';
                                                    data.payload = 0;
                                                    socket.emit('messagefromapp', data, function (res) {
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


