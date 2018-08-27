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


const userService = require('./services/userService/index.js');
var game = require('./game/index.js')(userService);


game.init();

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  
  socket.on('setusername', (data, cb) => {
    return cb(userService.createUser(data, socket));
  });

  socket.on('getinfo', (data, cb) => { 
    return cb(userService.getInfo(data));
  });

  io.on('message', (data, cb) => {
    console.log('Client emits setUserName', data);
    
  });
});


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);