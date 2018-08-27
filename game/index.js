
var Game = function(userService) {

    var gameObject = this;

    gameObject.init = _init;


    
    function _init() {
        var socket = {
            emit: function() {
                console.log('test function emit thingamagagic');
            }
        }
        userService.createUser('Joel', socket);
        // userService.createUser();
    }


    return gameObject;
};

function g(userService) {
    return new Game(userService);
}
module.exports = g;
