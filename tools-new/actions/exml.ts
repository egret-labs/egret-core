/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');

import exmlGUI = require("./exml.gui");
import exmlEUI = require("./exml.eui");

var hasSwan = egret.args.properties.hasSwan();

var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;

export = exmlHandlers;
