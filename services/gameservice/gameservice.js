var Game = require('../../game/index.js');
const logService = require('../logservice/index.js');

var logInfo = {
    location: 'gameService',
    function: '',
    error: '',
    type: 0,
    message: ''
}

var gameService = function(userService, cardService) {
    var gameServiceObject = this;

    gameServiceObject.createGame = _createGame;
    gameServiceObject.joinGame = _joinGame;
    gameServiceObject.getRandomCards = _getRandomCards;
    gameServiceObject.gameList = [];

    function _createGame(requesterID) {

        logInfo.function = 'createGame';
        var self = this;
        var _owner = userService.getUserById(requesterID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payLoad;
        });
        
        if(!_owner) {
            return -1;
        }
        var newGame = new Game;

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
        var _joiner = userService.getUserById(requesterID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payLoad;
        });
        if(!_joiner) {
            return -1;
        }
        var gameFound = false;
        this.gameList.map((game) => {
            console.log('game.ID', game.ID);
            if(parseInt(game.ID) === parseInt(gameID)) {
                if(game.getUserCount() > 3) {
                    logInfo.type = 2;
                    logInfo.error = 'User ' + _joiner.name + ' tried to join game with ID ' + gameID + ' but game is full';
                } else {
                    game.addUser(_joiner);
                    gameFound = true;
                }
            }
        });

        if(!gameFound) {
            if(logInfo.type !== 2) {
                logInfo.type = 3;
                logInfo.error = 'User ' + _joiner.name + ' tried to join game with ID ' + gameID + ' but game was not found in ' + this.gameList.length + ' games';
            }
            logService.handleResult(logInfo, null);
            return -1;
        }
        logInfo.message = 'User ' + _joiner.name + ' joined game with ID ' + gameID;
        logService.handleResult(null, logInfo);

        return 1;
    }
    // maybe game service doesnt have to know about the user getting cards?
    // instead we could ask cardService for cards straight
    // 
    // we need to check if this user already has 1, 2, etc. cards and if he can have more
    function _getRandomCards(requesterID) {
        var _player = userService.getUserObjectById(requesterID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            return res.payLoad;
        });
        if(!_player) {
            return -1;
        }
        var cards = cardService.getRandomCard(true);
        
        return ;
    }

    return gameServiceObject;
}

function g(userService, cardService) {
    return new gameService(userService, cardService);
}
module.exports = g;
