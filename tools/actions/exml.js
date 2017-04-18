/// <reference path="../lib/types.d.ts" />
var exmlGUI = require("./exml.gui");
var exmlEUI = require("./exml.eui");
var EgretProject = require("../parser/EgretProject");
var hasSwan = EgretProject.utils.hasEUI();
var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;
module.exports = exmlHandlers;
