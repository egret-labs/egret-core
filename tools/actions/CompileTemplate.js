/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var FileAutoChange = require("../actions/FileAutoChange");
function modifyIndexHTML(scripts) {
    var options = egret.args;
    var list = FileUtil.getDirectoryListing(options.projectDir).filter(function (filepath) { return FileUtil.getExtension(filepath) == "html"; });
    list.forEach(function (htmlFilePath) { return FileAutoChange.refreshDebugHtml(htmlFilePath, scripts); });
}
exports.modifyIndexHTML = modifyIndexHTML;
function modifyNativeRequire(isDebug) {
    var options = egret.args;
    var index = FileUtil.joinPath(options.projectDir, "index.html");
    return FileAutoChange.refreshNativeRequire(index, isDebug);
}
exports.modifyNativeRequire = modifyNativeRequire;
