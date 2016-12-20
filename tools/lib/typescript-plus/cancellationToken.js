"use strict";
var fs = require("fs");
function createCancellationToken(args) {
    var cancellationPipeName;
    for (var i = 0; i < args.length - 1; i++) {
        if (args[i] === "--cancellationPipeName") {
            cancellationPipeName = args[i + 1];
            break;
        }
    }
    if (!cancellationPipeName) {
        return { isCancellationRequested: function () { return false; } };
    }
    return {
        isCancellationRequested: function () {
            try {
                fs.statSync(cancellationPipeName);
                return true;
            }
            catch (e) {
                return false;
            }
        }
    };
}
module.exports = createCancellationToken;

//# sourceMappingURL=cancellationToken.js.map
