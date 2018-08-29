// const Card = require('./card/index.js');
const mockData = require('./mockdata.js');

var cardService = function() {
    var cardServiceObject = this;

    cardServiceObject.getRandomCard = _getRandomCard;
    cardServiceObject.cardsInPlay = -1;
    cardServiceObject.cardsInPlayList = [];

    function _getRandomCard(initial) {
        var self = this;
        if(initial) {
            var results = [];
            mockData.data.map((card) => {
                if(!self.cardsInPlay) {
                    self.cardsInPlay = {};
                    self.cardsInPlay[card.id] = true;
                    results.push(card);
                }
                else if(!self.cardsInPlay[card.id] && results.length < 5) {
                    self.cardsInPlay[card.id] = true;
                    results.push(card);
                }
            });
            return results;
        } else {
            var result = null;
            for(let i = 0; i < mockData.data.length; i++) {
                let card = mockData.data[i];
                if(!self.cardInPlay[card.id] && !result) {
                    self.cardsInPlay[card.id] = true;
                    result = card;
                }
            }
            return result;
        }
    }

    return cardServiceObject;
}

// function g() {
//     return new cardService();
// }

module.exports = new cardService();