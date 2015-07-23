/// <reference path="../lib/types.d.ts" />
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var CompressJsonCommand = (function () {
    function CompressJsonCommand() {
    }
    CompressJsonCommand.prototype.initOptions = function (options) {
        console.log(options);
        this.sourcePath = file.join((params.getObjectOption(options, '--source')) || "");
    };
    CompressJsonCommand.prototype.execute = function () {
        //扫描json数据
        this.compress(this.sourcePath);
        return 0;
    };
    CompressJsonCommand.prototype.clone = function (obj) {
        for (var key in obj) {
            if (typeof (obj[key]) == "object") {
                this.clone(obj[key]);
            }
            else {
                if (obj[key] === true || obj[key] === false) {
                }
                else if (typeof (obj[key]) == "string") {
                }
                else if (typeof (obj[key] == "number")) {
                    obj[key] = Number(obj[key].toFixed(4));
                }
            }
        }
    };
    CompressJsonCommand.prototype.compress = function (realPath) {
        var fileList = file.getDirectoryListing(realPath, true);
        for (var key in fileList) {
            var fileName = fileList[key];
            if (file.isDirectory(file.join(realPath, fileName))) {
                this.compress(file.join(realPath, fileName));
            }
            else {
                var fileUrl = file.join(realPath, fileName);
                var fileStr = this.readFile(fileUrl);
                try {
                    var config = JSON.parse(fileStr);
                }
                catch (e) {
                    continue;
                }
                if (typeof (config) == "object") {
                    this.clone(config);
                    this.saveFile(fileUrl, config);
                }
            }
        }
    };
    CompressJsonCommand.prototype.saveFile = function (fileName, json) {
        file.save(fileName, JSON.stringify(json, null, ""));
    };
    CompressJsonCommand.prototype.readFile = function (fileName) {
        var fileData = file.read(fileName);
        return fileData;
    };
    return CompressJsonCommand;
})();
module.exports = CompressJsonCommand;
