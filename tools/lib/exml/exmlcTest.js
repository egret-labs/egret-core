
var fs = require("fs");
var xml = require("../core/xml.js");
var exmlc = require("./exmlc.js");

var str = fs.readFileSync("./src/skins/Panel.exml","utf-8");
var data = xml.parse(str);
var tsText = exmlc.compile(data,"skins.Panel");
fs.writeFileSync("./src/skins/Panel.ts",tsText,"utf-8");