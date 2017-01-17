
/// <reference path="../lib/types.d.ts" />

import FileUtil = require('../lib/FileUtil');
import FileAutoChange = require("../actions/FileAutoChange");

export function modifyIndexHTML(scripts: string[]) {
    var options = egret.args;
    var list = FileUtil.getDirectoryListing(options.projectDir).filter(filepath => FileUtil.getExtension(filepath) == "html");
    list.forEach(htmlFilePath => FileAutoChange.refreshDebugHtml(htmlFilePath, scripts));
}

export function modifyNativeRequire(isDebug: boolean) {
    var options = egret.args;
    var index = FileUtil.joinPath(options.projectDir, "index.html");
    return FileAutoChange.refreshNativeRequire(index, isDebug);
}

