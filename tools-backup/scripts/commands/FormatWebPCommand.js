/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var globals = require("../Globals");
var execFile = require("child_process").execFile;
var binPath = require("../../lib/webp/webp-bin").path;
var FormatWebPCommand = (function () {
    function FormatWebPCommand() {
        this.copyTestWebP = false;
    }
    FormatWebPCommand.prototype.initOptions = function (options) {
        this.path = options.path;
        this.resourcePath = options.resourcePath;
        this.copyTestWebP = options.copyTestWebP;
    };
    FormatWebPCommand.prototype.execute = function (callback) {
        var needWebP = params.getOption("-webp");
        if (needWebP) {
            //替换发布文件中对webp格式判断
            var str = "useWebP = true;";
            var txt = file.read(file.join(this.path, "index.html"));
            txt = txt.replace("//WebP_replace", str);
            file.save(file.join(this.path, "index.html"), txt);
            if (this.copyTestWebP) {
                file.copy(file.join(params.getEgretRoot(), "tools", "lib", "webp", "4x4.webp"), file.join(this.path, "4x4.webp"));
            }
            //图片转webp
            var list = file.getDirectoryAllListing(this.resourcePath);
            list = list.filter(function (item) {
                return item.indexOf(".png") != -1 || item.indexOf(".jpg") != -1;
            });
            var total = list.length;
            var webPFormat = function () {
                if (list.length) {
                    var item = list.shift();
                    globals.debugLog(1419, total - list.length, total);
                    var webpPath = item.replace(".png", ".webp").replace(".jpg", ".webp");
                    execFile(binPath, (item + ' -q 80 -o ' + webpPath).split(/\s+/), function (err, stdout, stderr) {
                        if (err) {
                            globals.log2(1418, item);
                        }
                        webPFormat();
                    });
                }
                else {
                    callback();
                }
            };
            webPFormat();
        }
        else {
            callback();
        }
        return 0;
    };
    return FormatWebPCommand;
})();
module.exports = FormatWebPCommand;
//# sourceMappingURL=FormatWebPCommand.js.map