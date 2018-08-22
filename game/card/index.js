var Card = function() {
    var cardObject = this;


    cardObject.info = {
        year: -1
    };
    cardObject.init = _init;
    cardObject.getYear = _getYear;

    function _init(_year) {
        this.info.year = _year;
    }

    function _getYear() {
        return this.info.year;
    }

    return cardObject;
};

function c() {
    return new Card();
}

module.exports = c;