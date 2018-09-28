var Card = function() {
    var cardObject = this;
    // this.id = option.id;
    // this.cLocation = option.cLocation;
    // this.pLocation = option.pLocation;
    // this.canCancel = option.canCancel;
    // this.dummy = option.dummy ? option.dummy : false;
    // this.color = option.color ? option.color : this.initColor();

    cardObject.id = -1;

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