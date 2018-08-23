const User = require('./user/index.js');
var userService = function() {
    var userServiceObject = this;

    userServiceObject.userList = [];


    userServiceObject.count = _count;
    userServiceObject.addUser = _addUser;

    function _addUser(user) {
        this.userList.push(user);
    }

    function _createUser(_name) {
        var newUser = new User();
        newUser.init(_name, this.count, function(err, res) {
            if(err)
        })
        this.
    }

    function _count() {
        return this.userList.length;
    }

    return userServiceObject;
}

module.exports = new userService;