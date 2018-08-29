var logInfo = {
    location: 'Game class',
    function: '',
    error: '',
    type: 1,
    message: ''
}

var Game = function() {

    var gameObject = this;

    gameObject.init = _init;
    gameObject.userList = [];
    gameObject.owner = -1;
    gameObject.ID = -1;

    gameObject.addUser = _addUser;
    gameObject.getUserCount = _getUserCount;
    
    function _init(_owner, _gameID, callback) {
        logInfo.function = 'init';
        if(!_owner.ID || !_owner.name) {
            logInfo.type = 3;
            logInfo.error = 'Either owner ID or name is not set, ID: ' +  _owner.ID + ' name: ' + _owner.name;
            return callback(logInfo, null);
        }
        this.owner = _owner;
        this.ID = _gameID;
        this.userList.push(_owner);
        logInfo.message = 'Created a new game with owner ' + _owner.name + ' ID: ' + _owner.ID; 
        return callback(null, logInfo);
    }

    function _addUser(user) {
        this.userList.push(user);
    }

    function _getUserCount() {
        return this.userList.length;
    }


    return gameObject;
};

function g() {
    return new Game();
}
module.exports = g;
