var logInfo = {
    location: 'Game class',
    function: '',
    error: '',
    type: 1,
    message: ''
}

var Game = function(cardService) {

    var gameObject = this;

    gameObject.init = _init;
    gameObject.userList = [];
    gameObject.owner = -1;
    gameObject.ID = -1;

    gameObject.addUser = _addUser;
    gameObject.getRandomCards = _getRandomCards;
    gameObject.getUserCount = _getUserCount;

    gameObject.addCardToBoard = _addCardToBoard;
    
    function _init(_owner, _gameID, callback) {
        logInfo.function = 'init';
        if(!_owner.info.ID || !_owner.info.name) {
            logInfo.type = 3;
            logInfo.error = 'Either owner ID or name is not set, ID: ' +  _owner.info.ID + ' name: ' + _owner.info.name;
            return callback(logInfo, null);
        }
        this.owner = _owner;
        this.ID = _gameID;
        this.userList.push(_owner);
        _owner.joinGame(this.ID);
        logInfo.message = 'Created a new game with owner ' + _owner.info.name + ' ID: ' + _owner.info.ID; 
        return callback(null, logInfo);
    }

    function _addUser(user) {
        this.userList.push(user);
        user.joinGame(this.ID);
    }

    function _getUserCount() {
        return this.userList.length;
    }

    function _getRandomCards() {
        return cardService.getRandomCard(true);
    }

    function _addCardToBoard(cardID, callback) {
        return cardService.addCardToBoard(cardID, callback);
    }
 

    return gameObject;
};

function g(cardService) {
    return new Game(cardService);
}
module.exports = g;
