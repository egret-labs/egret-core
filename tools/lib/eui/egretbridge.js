Object.defineProperty(exports, "__esModule", { value: true });
var egretbridge;
(function (egretbridge) {
    function $error(code, arg1, arg2, arg3, arg4) {
        console.error.apply(null, arguments);
    }
    egretbridge.$error = $error;
    function $warn(code, text, arg1, arg2, arg3, arg4) {
        console.warn.apply(null, arguments);
    }
    egretbridge.$warn = $warn;
})(egretbridge = exports.egretbridge || (exports.egretbridge = {}));
