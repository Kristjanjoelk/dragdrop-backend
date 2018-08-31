var clc = require("cli-color");
var logService = function() {
    var logServiceObject = this;

    logServiceObject.handleResult = _handleResult;
    // logServiceObject.handleError = _handleError;
    // logServiceObject.handleResultMessage = _handleResultMessage;
   //  var errorList = [];
    logServiceObject.allList = [];

    function _handleResult(err, res) {
        if(err) {
            handleError(err);
        } else {
            handleResultMessage(res);
        }
    }

    function handleError(err) {
        err.time = getTimeStamp();
        console.log(
            clc.green(err.time),
            clc.red('Error happened in'),
            clc.bgBlue(err.location),
            clc.red('running function'),
            clc.yellow(err.function),
            clc.red('Error: ' + err.error)
        );

        // this.errorList.push(err);
    }

    function handleResultMessage(res) {
        res.time = getTimeStamp();
        console.log(
            clc.green(res.time),
            clc.bgBlue(res.location),
            clc.yellow(res.function),
            clc.cyanBright(res.message)
        );
        // this.allList.push(res);
    }

    function getTimeStamp() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        if(m < 10) {
            m = '0' + m;
        }
        if(s < 10) {
            s = '0' + s;
        }
        return h + ':' + m + ':' + s;
    }

    return logServiceObject;
}

module.exports = new logService;