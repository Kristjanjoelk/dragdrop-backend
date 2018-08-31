
var Log = function(_function, _error, _type, _message) {
    this.location = 'User';
    this.function = _function;
    this.error = _error;
    this.type = _type;
    this.message = _message;
}

var User = function() {
    var userObject = this;

    userObject.info = {
        name: 'not set',
        inGame: false,
        gameID: -1,
        ID: -1
    };
    var cardList = [];
    
    userObject.init = _init;
    userObject.getName = _getName;
    userObject.setName = _setName;

    userObject.setCards = _setCards;
    userObject.setCard = _setCard;
    userObject.removeCard = _removeCard;

    userObject.joinGame = _joinGame;


    /**
	 * Initialize new user
	 *
	 * @param {String} _name - Name of the user
     * @param {number} _ID - The ID for the user, using length of current users online as new ID
	 * @returns {~callback} - Error/success
	 */
    function _init(_name, _ID, callback) {
        var logInfo = new Log('_init');
        if(!_name || typeof _ID === 'undefined') {
            logInfo.type = 3;
            logInfo.error = 'Name or ID are incorrect, name: ' + _name + ', ID: ' + _ID;
            return callback(logInfo, null);
        }
        this.info.name = _name;
        this.info.ID = _ID;
        logInfo.type = 1;
        logInfo.message = 'Initialized user, name: ' + _name + ', ID: ' + _ID;
        return callback(null, logInfo);
    }

    function _setName(_name) {
        this.info.name = _name;
    }

    function _getName() {
        return this.info.name;
    }

    function _setCard(_card, callback) {
        var logInfo = new Log('_setCard');
        if(!_card) {
            logInfo.type = 3;
            logInfo.error = 'Could not add cards to ' + this.info.name + ' card list because it is undefined';
            return callback(logInfo, null);
        } else if(cardList.length === 5) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because he has too many cards already.';
            return callback(logInfo, null);
        }
        cardList.push(_card);
        logInfo.type = 1;
        logInfo.message = 'Successfully added ' + _card.info.ID + ' to ' + this.info.name + ' list, he now has ' + cardList.length + ' cards';
        return callback(null, logInfo);

    }

    function _setCards(_cards, callback) {
        var logInfo = new Log('_setCards');
        if(!_cards) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because it is undefined';
            return callback(logInfo, null);
        } else if(cardList.length === 5) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because he has too many cards already.';
            return callback(logInfo, null);
        }
        cardList = _cards;
        logInfo.type = 1;
        logInfo.message = 'Successfully added ' + _cards.length + ' cards to ' + this.info.name + ' list, he now has ' + cardList.length + ' cards';
        logInfo.payload = _cards;
        return callback(null, logInfo);
    }

    function _removeCard(cardID, callback) {
        var logInfo = new Log('removeCard');
        logInfo.type = 1;
        let newList = cardList.filter((card) => {
            return parseInt(card.id) !== parseInt(cardID);
        });
        if(!newList.length) {
            logInfo.type = 3;
            logInfo.error = 'User tried to remove card with ID: ' + cardID + ' but it was not found in a list of ' + cardList.length + ' cards';
            return callback(logInfo, null);
        }

        cardList = newList;
        logInfo.message = 'User removed card with ID: ' + cardID + ' from his cardList, he has now ' + cardList.length + ' cards';
        return callback(null, logInfo);
        
    }


    function _joinGame(_gameID) {
        this.info.gameID = _gameID;
        this.info.inGame = true;
    }

    return userObject;
};

function u() {
    return new User();
}

module.exports = u;