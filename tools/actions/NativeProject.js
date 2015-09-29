/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var childProcess = require("child_process");
var CompileTemplate = require('../actions/CompileTemplate');
var copyNative = require("../actions/CopyNativeFiles");
var NativeProject = (function () {
    function NativeProject() {
    }
    NativeProject.build = function () {
        CompileTemplate.modifyNativeRequire();
        //拷贝项目到native工程中
        if (egret.args.runtime == "native") {
            console.log("----native build-----");
            copyNative.refreshNative(true);
        }
    };
    NativeProject.run = function (platform) {
    };
    NativeProject.copyNativeTemplate = copyNativeTemplate;
    NativeProject.copyOutputToNative = copyOutputToNative;
    return NativeProject;
})();
function copyOutputToNative(platform) {
    var platformFolders = getPlatformFolders(platform);
    var templateDatas = platformFolders.map(function (t) { return getNativeTemplateData(t); });
    var targetFolders = [];
    templateDatas.forEach(function (data, i) {
        if (!data)
            return;
        data.game.target.forEach(function (target) {
            var path = FileUtil.joinPath(platformFolders[i], target);
            targetFolders.push(path);
        });
    });
    targetFolders.forEach(function (target) {
        FileUtil.copy(egret.args.outDir, target);
    });
}
function copyNativeTemplate() {
    var nativeTemplateFolder = "../NativeTemplates";
    var nativeTemplateFullPath = FileUtil.joinPath(egret.root, nativeTemplateFolder);
    if (!FileUtil.exists(nativeTemplateFullPath)) {
        console.log(utils.tr(10019));
        process.exit(10019);
    }
    var targetTemplateFolder = FileUtil.joinPath(egret.args.projectDir, "platforms");
    FileUtil.copy(nativeTemplateFullPath, targetTemplateFolder);
    var templates = getPlatformFolders();
    templates.forEach(function (t) { return renameTemplateProjects(t); });
}
function getPlatformFolders(platform) {
    var targetTemplateFolder = FileUtil.joinPath(egret.args.projectDir, "platforms");
    if (platform) {
        var folder = FileUtil.joinPath(egret.args.projectDir, "platforms/" + platform);
        if (FileUtil.exists(folder))
            return [folder];
        return [];
    }
    else {
        var templates = FileUtil.getDirectoryListing(targetTemplateFolder);
        return templates && templates.filter(function (t) { return FileUtil.isDirectory(t); }) || [];
    }
}
function getNativeTemplateData(rootPath) {
    var projectName = FileUtil.getFileName(egret.args.projectDir);
    var templateFile = FileUtil.joinPath(rootPath, "template.json");
    if (!FileUtil.exists(templateFile))
        return null;
    var templateData = JSON.parse(FileUtil.read(templateFile));
    return templateData;
}
function renameTemplateProjects(rootPath) {
    var projectName = FileUtil.getFileName(egret.args.projectDir);
    var templateData = getNativeTemplateData(rootPath);
    if (!templateData)
        return;
    templateData.rename_tree.content.forEach(function (file) { return replaceTextContents(rootPath, file, templateData.template_name, projectName); });
    templateData.rename_tree.file_name.forEach(function (file) { return renameFileOrFolder(rootPath, file, templateData.template_name, projectName); });
}
function replaceTextContents(rootPath, path, placeholder, replacement) {
    var fullPath = FileUtil.joinPath(rootPath, path);
    var content = FileUtil.read(fullPath);
    content = content.split(placeholder).join(replacement);
    FileUtil.save(fullPath, content);
}
function renameFileOrFolder(rootPath, path, placeholder, replacement) {
    var newpath = path.split(placeholder).join(replacement);
    FileUtil.copy(FileUtil.joinPath(rootPath, path), FileUtil.joinPath(rootPath, newpath));
    FileUtil.remove(FileUtil.joinPath(rootPath, path));
}
function exec(command, params, callback) {
    params.forEach(function (param, i) {
        if (param.match(/\s/)) {
            param = param.replace(/\"/ig, "\"\"");
            param = '"' + param + '"';
            params[i] = param;
        }
    });
    var command = command + " " + params.join(' ');
    console.log(command);
    var cdvProcess = childProcess.exec(command, {}, function (e, stdout, stdin) { e && console.log("EXEC callback:", e); });
    cdvProcess.stdout.on("data", function (data) { return console.log("Build Native: " + data); });
    cdvProcess.stderr.on("data", function (data) { return console.log("Build Native: " + data); });
    cdvProcess.on("close", function (code) { return callback(code); });
    cdvProcess.on("error", function (ee) { return console.log("error when build", ee); });
}
module.exports = NativeProject;

//# sourceMappingURL=../actions/NativeProject.js.map