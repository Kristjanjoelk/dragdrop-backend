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
const cardService = require('./services/cardservice/index.js');
const gameService = require('./services/gameservice/gameservice.js')(userService, cardService);

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

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  
  socket.on('setusername', (data, cb) => {
    return cb(userService.createUser(data, socket.id));
  });

  socket.on('getinfo', (data, cb) => { 
    return cb(userService.getInfo(data));
  });

  socket.on('creategame', (cb) => { 
    return cb(gameService.createGame(socket.id));
  });

  socket.on('joingame', (data, cb) => { 
    return cb(gameService.joinGame(socket.id, data));
  });

  socket.on('getrandomcards', (cb) => { 
    return cb(gameService.getRandomCards(socket.id));
  });

  io.on('message', (data, cb) => {
    console.log('Client emits setUserName', data);
    
  });
});


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);