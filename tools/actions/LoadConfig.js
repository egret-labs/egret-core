var fs = require('fs');
var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
function loadTsConfig(url, compilerOptions) {
    var configStr = file.read(url);
    var configObj;
    var errLog = [];
    if (configStr) {
        try {
            configObj = JSON.parse(configStr);
        }
        catch (e) {
            errLog.push(utils.tr(1117));
        }
    }
    if (configObj) {
        var options = configObj["compilerOptions"];
        if (options) {
            for (var i in options) {
                switch (i) {
                    case "sourceMap":
                        compilerOptions.sourceMap = options[i];
                        break;
                    case "removeComments":
                        compilerOptions.removeComments = options[i];
                        break;
                    case "declaration":
                        compilerOptions.declaration = options[i];
                        break;
                    case "diagnostics":
                        compilerOptions.debug = options[i];
                        break;
                    default:
                        var error = utils.tr(1116, i);
                        errLog.push(error);
                        console.log(error);
                        break;
                }
            }
        }
    }
    compilerOptions.tsconfigError = errLog;
}
exports.loadTsConfig = loadTsConfig;
function loadProperties(url) {
    var obj = new ClassProperties();
    try {
        var properties = JSON.parse(fs.readFileSync(url).toString());
        obj.properties = properties;
        var modules = properties.modules;
        var modulesConfig = {};
        var lib;
        for (var i in modules) {
            lib = modules[i];
            modulesConfig[lib["name"]] = lib;
        }
        obj.modulesConfig = modulesConfig;
    }
    catch (e) {
    }
    return obj;
}
exports.loadProperties = loadProperties;
var ClassProperties = (function () {
    function ClassProperties() {
    }
    ClassProperties.prototype.getAllModuleNames = function () {
        var arr = [];
        var modules = this.properties.modules;
        for (var i in modules) {
            arr.push(modules[i]["name"]);
        }
        return arr;
    };
    ClassProperties.prototype.getModulePath = function (name) {
        return this.modulesConfig[name]["path"];
    };
    return ClassProperties;
})();
