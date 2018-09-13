'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);


const userService = require('./services/userservice/index.js');
const gameService = require('./services/gameservice/gameservice.js')(userService);

// var game = require('./game/index.js')(userService);


// game.init();


/* 1. User connects
 *  a. Get user name
 *  b. send information about server status to user
 *    b1. game list
 * 
 * 2. User clicks create game
 *  a. initialize new game -> hold the game in a list
 * 
 */


 // TODO: change from multiple listeners to 1 listener with multiple blablabla..
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    userService.removeUser(socket.id);
  });
  
  socket.on('setusername', (data, cb) => {
    return cb(userService.createUser(data, socket.id));
  });

  socket.on('messagefromapp', (data, cb) => {
    console.log('received emit', data);
    switch (data.type) {
      case 'setUserName': {
        userService.createUser('testUser', 1337);
        gameService.test(1337);
        return cb(userService.createUser(data.data.option.name, socket.id));
      }
        break;
      case 'getInfo':
        return cb(gameService.getInfo(data));
        break;
      case 'createGame':
        return cb(gameService.createGame(socket.id));
      case 'joinGame':
        return cb(gameService.joinGame(socket.id, data));
      case 'addCardToBoard':
        return cb(gameService.addCardToBoard(data.payload, socket.id));
      case 'getRandomCards':
        return cb(gameService.getRandomCards(socket.id));
      default:
        return '404';
    };
  });
});


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);