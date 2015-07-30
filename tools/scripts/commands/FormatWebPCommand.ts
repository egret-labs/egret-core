/// <reference path="../lib/types.d.ts" />

import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import globals = require("../Globals");

var execFile = require("child_process").execFile;
var binPath = require("../../lib/webp-bin/webp-bin").path;

class FormatWebPCommand implements egret.Command {
    private path:string;
    initOptions(options:any):void {
        this.path = options.path;
    }

    execute(callback?:()=>void):number {
        var needWebP = params.getOption("-webp");
        if (needWebP) {
            //替换发布文件中对webp格式判断
            var str = 'var img = new Image();\n' +
                '    img.onload = function (){\n' +
                '        egret.web.Html5Capatibility._WebPSupport = true;\n' +
                '    };\n' +
                '    img.src = "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACyAgCdASoBAAEALy2Wy2WlpaWlpYEsSygABc6zbAAA/upgAAA=";';
            var txt = file.read(file.join(this.path, "index.html"));
            txt = txt.replace("//WebP_replace",str);
            file.save(file.join(this.path, "index.html"), txt);
            //图片转webp
            var list = file.getDirectoryAllListing(file.join(this.path, "resource"));
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
    }


}

export = FormatWebPCommand;