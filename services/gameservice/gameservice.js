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
    gameServiceObject.getInfo = _getInfo;
    gameServiceObject.test = _test;

    gameServiceObject.getRandomCards = _getRandomCards;
    gameServiceObject.addCardToBoard = _addCardToBoard;
    gameServiceObject.removeUserFromGame = _removeUserFromGame;

    function _test(testUser) {
        var newCardService = new CardService();
        var newGame = new Game(newCardService);
        var self = this;
        var _owner = userService.getUserObjectById(testUser, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payload;
        });
        newGame.init(_owner, self.gameList.length, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            self.gameList.push(newGame);
            return 1;
        });
    }

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

    function _joinGame(requesterID, action) {
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

            console.log('joiner not found, returning');
            return -1;
        }
        var gameFound = false;
        this.gameList.map((game) => {
            if(parseInt(game.ID) === parseInt(action.gameNumber)) {
                if(game.getUserCount() > 3) {
                    logInfo.type = 2;
                    logInfo.error = 'User ' + _joiner.info.name + ' tried to join game with ID ' + action.gameNumber + ' but game is full';
                } else {
                    game.addUser(_joiner);
                    gameFound = game;
                }
            }
        });

        if(!gameFound) {

            console.log('game not found, returning');
            if(logInfo.type !== 2) {
                logInfo.type = 3;
                logInfo.error = 'User ' + _joiner.info.name + ' tried to join game with ID ' + action.gameNumber + ' but game was not found in ' + this.gameList.length + ' games';
            }
            logService.handleResult(logInfo, null);
            return -1;
        }
        logInfo.message = 'User ' + _joiner.info.name + ' joined game with ID ' + action.gameNumber;
        logService.handleResult(null, logInfo);

        return {
            userList: gameFound.userList,
            cardsOnBoard: gameFound.getCardsOnBoard()
        };
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
        console.log('inside getInfo');
        var self = this;
        logInfo.type = 1;
        logInfo.function = 'getInfo';
        return userService.getInfo(function(res) {
            console.log('returning from userservice getinfo');
            logInfo.message = 'Getting info ' + res;
            logService.handleResult(null, logInfo);
            return {   
                gameList: self.gameList,
                userList: res
            }
        });
    }

    function _removeUserFromGame(userID, gameID) {

        for(let i = 0; i < this.gameList.length; i++) {
            if(this.gameList[i].ID === gameID) {
                this.gameList[i].removeUser(userID);
            }
        }
    }

    return gameServiceObject;
}

function g(userService, cardService) {
    return new gameService(userService, cardService);
}
module.exports = g;
