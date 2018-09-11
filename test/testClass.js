var Card = function() {
    var cardObject = this;


    cardObject.info = {
        year: -1
    };

    return cardObject;
};


Card.prototype._setYear = function (_year) {
    this.info.year = _year;
}

Card.prototype._getYear = function () {
    return this.info.year;
}

function c() {
    return new Card();
}

var test = c();

var testTwo = c();

console.log('created test class', test);
console.log('setting year');
test._setYear(2000);
console.log('afters setting year', test);
console.log('getting year', test._getYear());

console.log('created test class 2', testTwo);
console.log('setting year 2');
testTwo._setYear(1111);
console.log('afters setting year 2', testTwo);
console.log('getting year 2', testTwo._getYear());

console.log('%$$$$$$$$$$$$$');
console.log('created test class', test);
console.log('setting year');
test._setYear(2000);
console.log('afters setting year', test);
console.log('getting year', test._getYear());




