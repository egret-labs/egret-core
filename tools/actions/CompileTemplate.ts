import FileUtil = require('../lib/FileUtil');
import FileAutoChange = require("../actions/FileAutoChange");
import EgretProject = require('../parser/EgretProject');

export function modifyIndexHTML(scripts?: string[]) {
    
    let projectDir = EgretProject.utils.getProjectRoot();
    let list = FileUtil.getDirectoryListing(projectDir).filter(filepath => FileUtil.getExtension(filepath) == "html");
    list.forEach(htmlFilePath => FileAutoChange.refreshDebugHtml(htmlFilePath, scripts));
}

export function modifyNativeRequire(isDebug: boolean) {
    let indexHTML = EgretProject.utils.getFilePath('index.html');
    return FileAutoChange.refreshNativeRequire(indexHTML, isDebug);
}

