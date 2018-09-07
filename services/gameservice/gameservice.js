var Game = require('../../game/index.js');
const CardService = require('../cardservice/index.js');
const logService = require('../logservice/index.js');

var logInfo = {
    location: 'gameService',
    function: '',
    error: '',
    type: 0,
    message: ''
}

var gameService = function(userService) {
    var gameServiceObject = this;

    gameServiceObject.createGame = _createGame;
    gameServiceObject.joinGame = _joinGame;
    gameServiceObject.findGameById = _findGameById;
    gameServiceObject.gameList = [];
    gameServiceObject.getInfo = [];


    gameServiceObject.getRandomCards = _getRandomCards;
    gameServiceObject.addCardToBoard = _addCardToBoard;

    function _createGame(requesterID) {

        logInfo.function = 'createGame';
        var self = this;
        var _owner = userService.getUserObjectById(requesterID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payload;
        });
        
        if(!_owner) {
            return -1;
        }
        var newCardService = new CardService();
        var newGame = new Game(newCardService);

        return newGame.init(_owner, self.gameList.length, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            self.gameList.push(newGame);
            return 1;
        });
    }

    function _joinGame(requesterID, gameID) {
        logInfo.type = 1;
        logInfo.function = 'joinGame';
        var _joiner = userService.getUserObjectById(requesterID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payload;
        });
        if(!_joiner) {
            return -1;
        }
        var gameFound = false;
        this.gameList.map((game) => {
            if(parseInt(game.ID) === parseInt(gameID)) {
                if(game.getUserCount() > 3) {
                    logInfo.type = 2;
                    logInfo.error = 'User ' + _joiner.info.name + ' tried to join game with ID ' + gameID + ' but game is full';
                } else {
                    game.addUser(_joiner);
                    gameFound = true;
                }
            }
        });

        if(!gameFound) {
            if(logInfo.type !== 2) {
                logInfo.type = 3;
                logInfo.error = 'User ' + _joiner.info.name + ' tried to join game with ID ' + gameID + ' but game was not found in ' + this.gameList.length + ' games';
            }
            logService.handleResult(logInfo, null);
            return -1;
        }
        logInfo.message = 'User ' + _joiner.info.name + ' joined game with ID ' + gameID;
        logService.handleResult(null, logInfo);

        return 1;
    }

    function _findGameById(_gameID, callback) {
        logInfo.type = 1;
        logInfo.function = 'findGameById';

        if(typeof _gameID === 'undefined' || _gameID < 0) {
            logInfo.type = 3;
            logInfo.error = 'The gameID is undefined';
            return callback(logInfo, null);
        }
        var gameFound = null;
        this.gameList.map((game) => {
            if(game.ID === _gameID) {
                gameFound = game;
            }
        });
        if(!gameFound) {
            logInfo.type = 3;
            logInfo.error = 'No game was found with ID: ' + _gameID;
            return callback(logInfo, null);
        }
        logInfo.message = 'Found game with ID: ' + _gameID;
        logInfo.payload = gameFound;
        return callback(null, logInfo);
    }


    // maybe game service doesnt have to know about the user getting cards?
    // instead we could ask cardService for cards straight
    // 
    // we need to check if this user already has 1, 2, etc. cards and if he can have more
    function _getRandomCards(requesterID) {
        var self = this;
        // 1. Find the user who is requesting the cards
        return userService.getUserObjectById(requesterID, function(err, player) {
            logService.handleResult(err, player);
            if(err) {
                return -1;
            }

            // 2. Find the game that the user is on
            return self.findGameById(player.payload.info.gameID, function(err, game) {
                logService.handleResult(err, game);
                if(err) {
                    return -1;
                } 
                // 3. set the cards to the player and return it to requester.
                return player.payload.setCards(game.payload.getRandomCards(), function(err, res) {
                    logService.handleResult(err, res);
                    if(err) {
                        return -1;
                    }
                    return res.payload;
                })
            });
        });
    }

    function _addCardToBoard(cardID, requesterID) {
        var self = this;
        // 1. Find the user who is adding the card
        return userService.getUserObjectById(requesterID, function(err, player) {
            logService.handleResult(err, player);
            if(err) {
                return -1;
            }

            // 2. Find the game that the user is on
            return self.findGameById(player.payload.info.gameID, function(err, game) {
                logService.handleResult(err, game);
                if(err) {
                    return -1;
                } 

                // 3. set the card on the board and remove it from player
                return game.payload.addCardToBoard(cardID, function(err, res) {
                    logService.handleResult(err, res);
                    if(err) {
                        return -1;
                    }
                    player.payload.removeCard(cardID, logService.handleResult); 
                    return 1;
                });
            });
        });        
    }

    function _getInfo() {
        var self = this;

        return userService.getInfo(function(res) {
            return {   
                gameList: self.gameList,
                userList: res
            }
            

        });
    }

    return gameServiceObject;
}

function g(userService, cardService) {
    return new gameService(userService, cardService);
}
module.exports = g;
