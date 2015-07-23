/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');

class CompressJsonCommand implements egret.Command {
    private sourcePath:string;
    initOptions(options:Object):void {
        console.log(options);
        this.sourcePath = file.join((params.getObjectOption(options, '--source')) || "");
    }

    execute():number {
        //扫描json数据
        this.compress(this.sourcePath);
        return 0;
    }

    private clone(obj) {
        for (var key in obj) {
            if (typeof(obj[key]) == "object") {
                this.clone(obj[key]);
            }
            else {
                if (obj[key] === true || obj[key] === false) {

                }
                else if (typeof(obj[key]) == "string") {

                }
                else if (typeof(obj[key] == "number")) {
                    obj[key] = Number(obj[key].toFixed(4));
                }
            }
        }
    }

    private compress(realPath) {
        var fileList = file.getDirectoryListing(realPath, true);
        for (var key in fileList) {
            var fileName = fileList[key];

            if (file.isDirectory(file.join(realPath, fileName))) {
                this.compress(file.join(realPath, fileName))
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
                if (typeof(config) == "object") {
                    this.clone(config);
                    this.saveFile(fileUrl, config);
                }
            }
        }
    }

    private saveFile(fileName, json) {
        file.save(fileName, JSON.stringify(json, null, ""));
    }

    private readFile(fileName) {
        var fileData = file.read(fileName);
        return fileData;
    }
}

export = CompressJsonCommand;