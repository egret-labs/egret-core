/**
 * Created by apple on 14-7-16.
 */
var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var compiler = require("./compile.js");
var file = require("../core/file.js");
var code_util = require("../core/code_util.js");

function run(dir, args, opts) {
    var projectName = globals.joinEgretDir(dir, args[0]);
    var egretPropertiesPath = path.join(projectName, "egretProperties.json")
    var config = globals.getConfig(egretPropertiesPath);
    var moduleNames = opts["--module"];
    if (!config) {
        return;
    }

    moduleNames.forEach(function (moduleName) {
        if (!config.libs) {
            config.libs = [];
        }
        if (config.libs.indexOf(moduleName) == -1) {
            config.libs.push(moduleName);
        }
    })

    file.save(egretPropertiesPath, JSON.stringify(config, null, "\n"));
    update(null)


}


function update(callback) {


    var config = globals.getConfig(path.join(currDir, "egretProperties.json"));
    if (config && config.libs) {
        config.libs.forEach(function (libName) {
            var libConfigPath = path.join(currDir, "libs", libName, "libProperties.json")
            var libConfig = globals.getConfig(libConfigPath);
            var content = "var list = ";
            content += JSON.stringify(libConfig.file_list);
            content += ";\n";
            content += "egret_h5.preloadScript(list, \"{path}\");\n".replace("{path}", "libs/" + libName + "/")
            var indexHTMLpath = path.join(currDir, "launcher/index.html");
            var indexHTML = file.read(indexHTMLpath);

            var firstComment = "//start load module script"
            var first = indexHTML.indexOf(firstComment) + firstComment.length + 1;
            var last = indexHTML.indexOf("//end load module script")

            indexHTML = indexHTML.substring(0, first) + content + indexHTML.substring(last);
            file.save(indexHTMLpath, indexHTML);
        })
    }

    if (callback) {
        callback();
    }

}


exports.run = run;