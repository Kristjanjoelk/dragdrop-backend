var clc = require("cli-color");
var logService = function() {
    var logServiceObject = this;

    logServiceObject.handleResult = _handleResult;
    logServiceObject.handleError = _handleError;
    logServiceObject.handleResultMessage = _handleResultMessage;

    function _handleResult(err, res) {
        if(err) {
            this.handleError(err);
        } else {
            this.handleResultMessage(res);
        }
    }

    function _handleError(err) {
        console.log(
            clc.green(getTimeStamp()),
            clc.red('Error happened in'),
            clc.cyan(err.location),
            clc.red('running function'),
            clc.cyan(err.function),
            clc.red('Error: ' + err.error)
        );
    }

    function _handleResultMessage(res) {
        console.log(
            clc.green(getTimeStamp()),
            clc.cyanBright(res.message)
        );
    }

    function getTimeStamp() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        return h + ':' + m + ':' + s;
    }
}

module.exports = new logService;