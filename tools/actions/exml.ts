/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');

import exmlGUI = require("./exml.gui");
import exmlEUI = require("./exml.eui");
import EgretProject = require('../project/EgretProject')

var hasSwan = EgretProject.data.hasEUI();
var exmlHandlers = hasSwan ? exmlEUI : exmlGUI;

export = exmlHandlers;
