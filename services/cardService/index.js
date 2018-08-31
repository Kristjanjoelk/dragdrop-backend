// const Card = require('./card/index.js');
const mockData = require('./mockdata.js');
var logInfo = {
    location: 'cardService',
    function: '',
    error: '',
    type: 0,
    message: ''
}
var cardService = function() {
    var cardServiceObject = this;

    cardServiceObject.getRandomCard = _getRandomCard;
    cardServiceObject.addCardToBoard = _addCardToBoard;
    var cardsInPlay = -1;
    var cardsInPlayList = [];
    var cardsOnBoard = [];

    function _getRandomCard(initial) {
        if(initial) {
            var results = [];
            mockData.data.map((card) => {
                if(!cardsInPlay) {
                    cardsInPlay = {};
                    cardsInPlay[card.id] = true;
                    results.push(card);
                }
                else if(!cardsInPlay[card.id] && results.length < 5) {
                    cardsInPlay[card.id] = true;
                    results.push(card);
                }
            });
            cardsInPlayList = results;
            return results;
        } else {
            var result = null;
            for(let i = 0; i < mockData.data.length; i++) {
                let card = mockData.data[i];
                if(!cardsInPlay[card.id] && !result) {
                    cardsInPlay[card.id] = true;
                    result = card;
                }
            }
            cardsInPlayList.push(result);
            return result;
        }
    }

    function findCard(cardID) {
        for(let i = 0; i < cardsInPlay.length; i++) {
            let currCard = cardsInPlayList[i];
            if(cardID === currCard.id) {
                return currCard;
            }
        }
        return -1;
    }

    function _addCardToBoard(cardID, callback) {
        logInfo.type = 1;
        logInfo.function = 'addCardToBoard';
        let cardToAdd = findCard(cardID);
        if(!cardToAdd) {
            logInfo.type = 3;
            logInfo.error = 'card with ID: ' + cardID + ' was not found in the cards in play list';
            return callback(logInfo, null);
        }
        cardsOnBoard.push(cardToAdd);
        logInfo.message = 'added card with ID: ' + cardID + ' to cards on board list, there are now ' + cardsOnBoard.length + ' on the board';
        return callback(null, logInfo);
    }

    return cardServiceObject;
}

function g() {
    return new cardService();
}

module.exports = g;