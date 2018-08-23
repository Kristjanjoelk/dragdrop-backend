
const userService = require('../services/userService/index.js');

var Game = function() {

    var gameObject = this;

    gameObject.init = _init;


    // here we should initialize a new game;
    function _init() {
        // console.log('initializing game object');

        // var newCard = new Card();
        // newCard.init(1998);
        // var newUser = new User();
        // newUser.init('Johnson');

        // console.log('userlist length: ', userService.count());
        // userService.addUser(newUser);
        // console.log('userlist length: ', userService.count());
    }


    return gameObject;
};

module.exports = new Game;