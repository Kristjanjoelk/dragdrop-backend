const User = require('../../game/user/index.js');
const logService = require('../logservice/index.js');
var logInfo = {
    location: 'userService',
    function: '',
    error: '',
    type: 0,
    message: ''
}
var userService = function() {
    var userServiceObject = this;

    userServiceObject.userList = [];


    userServiceObject.count = _count;
    userServiceObject.addUser = _addUser;
    userServiceObject.createUser = _createUser;
    userServiceObject.removeUser = _removeUser;
    userServiceObject.getInfo = _getInfo;
    userServiceObject.getUserById = _getUserById;
    userServiceObject.getUserObjectById = _getUserObjectById;

    function _addUser(user) {
        this.userList.push(user);
    }

    function _createUser(_name, socketID) {
        // socket.emit('test', 'nice that works..');
        var newUser = new User();
        var self = this;
        return newUser.init(_name, socketID, function(err, res) {
            logService.handleResult(err, res);
            if(err) {
                return -1;
            }
            self.userList.push(newUser);
            return 1;
        });
    }

    function _count() {
        return this.userList.length;
    }

    function _getInfo(callback) {
        let result = this.userList.map((user) => {
            return user.info.name;
        });
        return callback(result);
    }

    function _getUserById(socketID, callback) {
        logInfo.type = 1;
        logInfo.function = 'getUserById';


        var userFound = null;

        this.userList.map((user) => {
            if(user.info.ID === socketID) {
                userFound = user.info;
            }
        });

        if(!userFound) {
            logInfo.type = 3;
            logInfo.error = 'User with id: ' + socketID + ' was not found in a list of ' + this.userList.length + ' users';
            return callback(logInfo, null);
        }

        logInfo.payload = userFound;
        logInfo.message = 'Found user ' + userFound.name + ' with ID: ' + userFound.ID; 
        return callback(null, logInfo);
    }

    function _getUserObjectById(socketID, callback) {
        logInfo.type = 1;
        logInfo.function = 'getUserObjectById';


        var userFound = null;

        this.userList.map((user) => {
            if(user.info.ID === socketID) {
                userFound = user;
            }
        });

        if(!userFound) {
            logInfo.type = 3;
            logInfo.error = 'User object with id: ' + socketID + ' was not found in a list of ' + this.userList.length + ' users';
            return callback(logInfo, null);
        }

        logInfo.payload = userFound;
        logInfo.message = 'Found user object ' + userFound.info.name + ' with ID: ' + userFound.info.ID; 
        return callback(null, logInfo);
    }

    function addCardsToUser(socketID) {
        
    }

    function _removeUser(socketID, gameService) {
        let before = this.userList.length;
        let userFound = null;
        let newList = this.userList.filter((user) => {
            if(user.info.ID === socketID) {
                userFound = user;
            }
            return user.info.ID !== socketID;
        });
        let extraMessage = '';
        if(userFound && userFound.info.inGame) {
            console.log(userFound);
            let copy = Object.assign({}, userFound.info);
            gameService.removeUserFromGame(copy.ID, copy.gameID);

            userFound.info.inGame = false;
            userFound.info.gameID = -1;
            extraMessage = ' and from game with ID: ' + copy.gameID;
        }
        this.userList = newList;
        logInfo.type = 1;
        logInfo.function = 'removeUser';
        logInfo.message = 'User disconnected with ID: ' + socketID + ', removing user ' + extraMessage + ', we were ' + before + ' but are now ' + this.userList.length;
        logService.handleResult(null, logInfo); 
    }

    return userServiceObject;
}

module.exports = new userService();