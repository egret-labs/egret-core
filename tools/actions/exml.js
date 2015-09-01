/// <reference path="../lib/types.d.ts" />
var exmlGUI = require("./exml.gui");
var exmlEUI = require("./exml.eui");
var hasSwan = egret.args.properties.hasSwan();
var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;
module.exports = exmlHandlers;
//# sourceMappingURL=exml.js.map