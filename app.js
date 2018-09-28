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
userService.createTestUser('testUser', 1337);
gameService.test(1337);


io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    userService.removeUser(socket.id, gameService);
  });
  
  socket.on('setusername', (data, cb) => {
    return cb(userService.createUser(data, socket.id));
  });

  socket.on('messagefromapp', (data, cb) => {
    console.log('received emit', data);
    switch (data.type) {
      case 'setUserName':
        return cb(userService.createUser(data, socket.id));
      case 'getInfo':
        return cb(gameService.getInfo(data));
      case 'createGame':
        return cb(gameService.createGame(socket.id));
      case 'joinGame':
        return cb(gameService.joinGame(socket.id, data));
      case 'addCardToBoard':
        return cb(gameService.addCardToBoard(data.payload, socket.id));
      case 'getRandomCards':
        return cb(gameService.getRandomCards(socket.id));
      case 'test':
        console.log('INSIDE APP TEST')
        return cb('nice!!! it worked');
      default:
        return '404';
    };
  });
});


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);