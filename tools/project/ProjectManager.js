var ProjectData_1 = require("./ProjectData");
var FileUtil = require("../lib/FileUtil");
var manager;
(function (manager) {
    function copyToLibs() {
        var moduleDir = ProjectData_1.data.getLibraryFolder();
        FileUtil.remove(moduleDir);
        ProjectData_1.data.getModulesConfig("web").forEach(function (m) {
            FileUtil.copy(m.sourceDir, ProjectData_1.data.getFilePath(m.targetDir));
        });
    }
    manager.copyToLibs = copyToLibs;
})(manager = exports.manager || (exports.manager = {}));
