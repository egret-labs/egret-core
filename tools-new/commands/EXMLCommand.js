/// <reference path="../lib/types.d.ts" />
var exml = require('../actions/EXMLAction');
var EXML = (function () {
    function EXML() {
    }
    EXML.prototype.execute = function () {
        exml.updateSetting(false);
        return 0;
    };
    return EXML;
})();
module.exports = EXML;
