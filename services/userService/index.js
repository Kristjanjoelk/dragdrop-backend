var userService = function() {
    var userServiceObject = this;

    userServiceObject.userList = [];


    userServiceObject.count = _count;
    userServiceObject.addUser = _addUser;

    function _addUser(user) {
        this.userList.push(user);
    }

    function _count() {
        return this.userList.length;
    }

    return userServiceObject;
}

module.exports = new userService;