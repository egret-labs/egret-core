var FileUtil = require("../lib/FileUtil");
var FileAutoChange = require("../actions/FileAutoChange");
var EgretProject = require("../parser/EgretProject");
function modifyIndexHTML(scripts) {
    var projectDir = EgretProject.utils.getProjectRoot();
    var list = FileUtil.getDirectoryListing(projectDir).filter(function (filepath) { return FileUtil.getExtension(filepath) == "html"; });
    list.forEach(function (htmlFilePath) { return FileAutoChange.refreshDebugHtml(htmlFilePath, scripts); });
}
exports.modifyIndexHTML = modifyIndexHTML;
function modifyNativeRequire(isDebug) {
    var indexHTML = EgretProject.utils.getFilePath('index.html');
    return FileAutoChange.refreshNativeRequire(indexHTML, isDebug);
}
exports.modifyNativeRequire = modifyNativeRequire;
