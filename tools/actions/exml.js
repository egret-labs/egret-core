/// <reference path="../lib/types.d.ts" />
var exmlGUI = require("./exml.gui");
var exmlEUI = require("./exml.eui");
var hasSwan = egret.args.properties.hasEUI();
var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;
module.exports = exmlHandlers;

//# sourceMappingURL=../actions/exml.js.map