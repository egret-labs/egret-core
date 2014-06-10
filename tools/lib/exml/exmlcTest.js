
var fs = require("fs");
var xml = require("../core/xml.js");
var exmlc = require("./exmlc.js");

var str = fs.readFileSync("./src/code/skins/Panel.exml","utf-8");
var data = xml.parse(str);
var tsText = exmlc.compile(data,"code.skins.Panel","egret.d.ts","./src/");
fs.writeFileSync("./src/code/skins/Panel.ts",tsText,"utf-8");