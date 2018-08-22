var User = function() {
    var userObject = this;


    userObject.info = {
        name: 'not set'
    };
    userObject.init = _init;
    userObject.getName = _getName;


    function _init(_name) {
        this.info.name = _name;
    }

    function _getName() {
        return this.info.name;
    }

    return userObject;
};

function u() {
    return new User();
}

module.exports = u;