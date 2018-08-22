const Card = require('./card/index.js');
const User = require('./user/index.js');


var game = function() {

    var gameObject = this;

    gameObject.init = _init;
    

    function _init() {
        console.log('initializing game object');

        var newCard = new Card();
        newCard.init(1998);
        var newUser = new User();
        newUser.init('Johnson');
    }


    return gameObject;
};


var g = new game;

g.init();