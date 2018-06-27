import * as FileUtil from '../lib/FileUtil';


let htmlTxt: string;

let config: any = {};

export function parseConfig() {
    htmlTxt = FileUtil.read(FileUtil.joinPath(egret.args.projectDir, "index.html"));
    read("data-entry-class", "entryClassName", true, '"Main"');
    read("data-orientation", "orientation", true, '"auto"');
    read("data-frame-rate", "frameRate", false, "60");
    read("data-scale-mode", "scaleMode", true, '"showAll"');
    read("data-content-width", "contentWidth", false, "480");
    read("data-content-height", "contentHeight", false, "800");
    read("data-show-paint-rect", "showPaintRect", false, 'false');
    read("data-show-fps", "showFPS", false, 'false');
    read("data-show-fps-style", "fpsStyles", true, '""');
    read("data-show-log", "showLog", false, 'false');
    read("data-log-filter", "logFilter", true, '""');
    read("texture-scale-factor", "textureScaleFactor", false, "1");
    read("data-multi-fingered", "maxTouches", false, "2");
    return config;
}

function read(name: string, replaceName: string, isString: boolean, defaultValue: string): void {
    var result: string;
    var index: number = htmlTxt.indexOf(name);
    if (index != -1) {
        var str: string = htmlTxt.slice(index + name.length + 2, htmlTxt.length);
        var index2: number = str.indexOf('"');
        result = str.slice(0, index2);
        if (isString) {
            result = '"' + result + '"';
        }
    }
    else {
        result = defaultValue;
    }
    config[replaceName] = result;
}
