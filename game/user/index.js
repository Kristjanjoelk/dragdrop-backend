const logInfo = {
    location: 'User',
    function: '',
    error: '',
    type: 0,
    message: ''
}

var User = function() {
    var userObject = this;

    userObject.info = {
        name: 'not set',
        inGame: false,
        ID: -1
    };
    userObject.cardList = [];
    
    userObject.init = _init;
    userObject.getName = _getName;
    userObject.setName = _setName;

    userObject.setCards = _setCards;
    userObject.setCard = _setCard;



    function _init(_name, _ID, callback) {
        logInfo.function = '_init';
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
        logInfo.function = '_setCard';
        if(!_card) {
            logInfo.type = 3;
            logInfo.error = 'Could not add cards to ' + this.info.name + ' card list because it is undefined';
            return callback(logInfo, null);
        } else if(this.cardList.length === 5) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because he has too many cards already.';
            return callback(logInfo, null);
        }
        this.cardList.push(_card);
        logInfo.type = 1;
        logInfo.message = 'Successfully added ' + _card.info.ID + ' to ' + this.info.name + ' list';
        return callback(null, logInfo);

    }

    function _setCards(_cards, callback) {
        logInfo.function = '_setCards';
        if(!_cards) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because it is undefined';
            return callback(logInfo, null);
        } else if(this.cardList.length === 5) {
            logInfo.type = 3;
            logInfo.error = 'Could not add card to ' + this.info.name + ' card list because he has too many cards already.';
            return callback(logInfo, null);
        }
        this.cardList.concat(_cards);
        logInfo.type = 1;
        logInfo.message = 'Successfully added ' + _cards.length + ' cards to ' + this.info.name + ' list';
        return callback(null, logInfo);
    }

    return userObject;
};

function u() {
    return new User();
}

module.exports = u;