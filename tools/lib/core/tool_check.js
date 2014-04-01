
var path = require("path");
var fs = require("fs");

function getTool(name){
	var fileName;
	switch (name) {
		case "c":
		case "create":
		case "-c":
		case "-create":
			fileName = "create";
			break;
		case "b":
		case "build":
		case "-b":
		case "-build":
			fileName = "build";
			break;
		case "r":
		case "remove":
		case "-r":
		case "-remove":
			fileName = "remove";
			break;
		case "-h":
		case "-help":
		case "h":
		case "help":
			fileName = "help";
			break;
		case "export_font":
			fileName = "export_bitmapfont";
			break;
		case "export_ccb":
			fileName = "export_cocos_builder";
			break;
		case "export_packer":
			fileName = "export_texture_packer";
			break;
		default:
			fileName = "help";
	}

    var pluginPath = path.join(__dirname, "../tools", fileName + ".js");
    if(!fs.existsSync(pluginPath)) return null;
    return require(pluginPath);
}

function run(option){
    var tool = getTool(option.name);
    
    tool.run(option.currDir, option.args, option.opts);
}

exports.run = run;