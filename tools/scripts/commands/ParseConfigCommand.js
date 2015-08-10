/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var ParseConfigCommand = (function () {
    function ParseConfigCommand() {
    }
    ParseConfigCommand.prototype.execute = function (callback) {
        this.htmlTxt = file.read(file.join(params.getProjectRoot(), "index.html"));
        this.requireTxt = file.read(file.join(params.getEgretRoot(), "tools", "templates", "empty", "launcher", "native_require.js"));
        this.read("data-entry-class", "entryClassName", true, '"Main"');
        this.read("data-frame-rate", "frameRate", false, "60");
        this.read("data-scale-mode", "scaleMode", true, '"showAll"');
        this.read("data-content-width", "contentWidth", false, "480");
        this.read("data-content-height", "contentHeight", false, "800");
        this.read("data-show-fps", "showFPS", false, 'false');
        this.read("data-show-fps-style", "fpsStyles", true, '""');
        this.read("data-show-log", "showLog", false, 'false');
        this.read("data-log-filter", "logFilter", true, '""');
        this.read("texture-scale-factor", "textureScaleFactor", false, "1");
        this.read("data-multi-fingered", "maxTouches", false, "2");
        file.save(file.join(params.getProjectRoot(), "launcher", "native_require.js"), this.requireTxt);
        return 0;
    };
    ParseConfigCommand.prototype.read = function (name, replaceName, isString, defaultValue) {
        var result;
        var index = this.htmlTxt.indexOf(name);
        if (index != -1) {
            var str = this.htmlTxt.slice(index + name.length + 2, this.htmlTxt.length);
            var index2 = str.indexOf('"');
            result = str.slice(0, index2);
            if (isString) {
                result = '"' + result + '"';
            }
        }
        else {
            result = defaultValue;
        }
        this.requireTxt = this.requireTxt.replace('"' + replaceName + '"', result);
    };
    return ParseConfigCommand;
})();
module.exports = ParseConfigCommand;
