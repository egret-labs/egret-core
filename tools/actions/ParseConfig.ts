/**
 * Created by yanjiaqi on 15/8/31.
 */
/// <reference path="../lib/types.d.ts" />

//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
//import config = require('../ProjectConfig');
//import globals = require("../Globals");

class ParseConfigCommand implements egret.Command {
    private htmlTxt:string;
    private requireTxt:string;

    public execute(callback?:(exitCode:number)=>void):number {
        this.htmlTxt = file.read(file.joinPath(egret.args.projectDir, "index.html"));
        this.requireTxt = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "native_require.js"));

        this.read("data-entry-class", "entryClassName", true, '"Main"');
        this.read("data-frame-rate", "frameRate", false, "60");
        this.read("data-scale-mode", "scaleMode", true, '"showAll"');
        this.read("data-content-width", "contentWidth", false, "480");
        this.read("data-content-height", "contentHeight", false, "800");
        this.read("data-show-paint-rect", "showPaintRect", false, 'false');
        this.read("data-show-fps", "showFPS", false, 'false');
        this.read("data-show-fps-style", "fpsStyles", true, '""');
        this.read("data-show-log", "showLog", false, 'false');
        this.read("data-log-filter", "logFilter", true, '""');
        this.read("texture-scale-factor", "textureScaleFactor", false, "1");
        this.read("data-multi-fingered", "maxTouches", false, "2");

        //file.save(file.joinPath(egret.args.projectDir, "launcher", "native_require.js"), this.requireTxt);
        return 0;
    }

    private read(name:string, replaceName:string, isString:boolean, defaultValue:string):void {
        var result:string;
        var index:number = this.htmlTxt.indexOf(name);
        if(index != -1) {
            var str:string = this.htmlTxt.slice(index + name.length + 2, this.htmlTxt.length);
            var index2:number = str.indexOf('"');
            result = str.slice(0, index2);
            if (isString) {
                result = '"' + result + '"';
            }
        }
        else {
            result = defaultValue;
        }
        this.requireTxt = this.requireTxt.replace('"' + replaceName + '"', result);
    }
}

export = ParseConfigCommand;