var Card = function() {
    var cardObject = this;


    cardObject.info = {
        year: -1
    };

    return cardObject;
};

Card.prototype._init = function(_year) {
    this.info.year = _year;
}

Card.prototype._getYear = function() {
    return this.info.year;
}

function c() {
    return new Card();
}

module.exports = c;