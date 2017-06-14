/// <reference path="../lib/types.d.ts" />
var exmlGUI = require("./exml.gui");
var exmlEUI = require("./exml.eui");
var EgretProject = require("../project/EgretProject");
var hasSwan = EgretProject.data.hasEUI();
var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;
module.exports = exmlHandlers;
