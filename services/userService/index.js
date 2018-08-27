const User = require('../../game/user/index.js');
const logService = require('../logservice/index.js');
var userService = function() {
    var userServiceObject = this;

    userServiceObject.userList = [];


    userServiceObject.count = _count;
    userServiceObject.addUser = _addUser;
    userServiceObject.createUser = _createUser;
    userServiceObject.getInfo = _getInfo;

    function _addUser(user) {
        this.userList.push(user);
    }

    function _createUser(_name, socket) {
        socket.emit('test', 'nice that works..');
        var newUser = new User();
        var self = this;
        return newUser.init(_name, self.count(), function(err, res) {
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

    function _getInfo() {
        var userNameList = this.userList.map((user) => {
            return user.info.name;
        });
        return {
            userList: userNameList
        }
    }

    return userServiceObject;
}

module.exports = new userService;