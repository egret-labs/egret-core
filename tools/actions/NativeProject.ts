
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import childProcess = require("child_process");
import CompileTemplate = require('../actions/CompileTemplate');
import CopyFilesCommand = require("../commands/copyfile");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

import copyNative = require("../actions/CopyNativeFiles");

class NativeProject {
    public static copyNativeTemplate = copyNativeTemplate;
    public static copyOutputToNative = copyOutputToNative;

    public static build() {
        CompileTemplate.modifyNativeRequire();

        //拷贝项目到native工程中
        if (egret.args.runtime == "native") {
            console.log("----native build-----");

            copyNative.refreshNative(true);
        }
    }

    public static run(platform?: string) {

    }
}

export = NativeProject;


function copyOutputToNative(platform?: string) {
    var platformFolders = getPlatformFolders(platform);
    var templateDatas = platformFolders.map(t=> getNativeTemplateData(t));
    var targetFolders: string[] = [];
    templateDatas.forEach((data, i) => {
        if (!data)
            return;
        data.game.target.forEach(target=> {
            var path = FileUtil.joinPath(platformFolders[i], target);
            targetFolders.push(path);
        })
    });

    targetFolders.forEach(target=> {
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
    templates.forEach(t=> renameTemplateProjects(t));
}

function getPlatformFolders(platform?: string) {
    var targetTemplateFolder = FileUtil.joinPath(egret.args.projectDir, "platforms");
    if (platform) {
        var folder = FileUtil.joinPath(egret.args.projectDir, "platforms/" + platform);
        if (FileUtil.exists(folder))
            return [folder];
        return [];
    }
    else {
        var templates = FileUtil.getDirectoryListing(targetTemplateFolder);
        return templates && templates.filter(t=> FileUtil.isDirectory(t)) || [];
    }
}

function getNativeTemplateData(rootPath: string) {
    var projectName = FileUtil.getFileName(egret.args.projectDir);
    var templateFile = FileUtil.joinPath(rootPath, "template.json");
    if (!FileUtil.exists(templateFile))
        return null;
    var templateData: ILarkNativeTemplate = JSON.parse(FileUtil.read(templateFile));
    return templateData;
}

function renameTemplateProjects(rootPath: string) {
    var projectName = FileUtil.getFileName(egret.args.projectDir);
    var templateData = getNativeTemplateData(rootPath);
    if (!templateData)
        return;
    templateData.rename_tree.content.forEach(file=> replaceTextContents(rootPath, file, templateData.template_name, projectName));
    templateData.rename_tree.file_name.forEach(file=> renameFileOrFolder(rootPath, file, templateData.template_name, projectName));
}

function replaceTextContents(rootPath: string, path: string, placeholder: string, replacement: string) {
    var fullPath = FileUtil.joinPath(rootPath, path);
    var content = FileUtil.read(fullPath);
    content = content.split(placeholder).join(replacement);
    FileUtil.save(fullPath, content);
}

function renameFileOrFolder(rootPath: string, path: string, placeholder: string, replacement: string) {
    var newpath = path.split(placeholder).join(replacement);
    FileUtil.copy(FileUtil.joinPath(rootPath, path), FileUtil.joinPath(rootPath, newpath));
    FileUtil.remove(FileUtil.joinPath(rootPath, path));
}

function exec(command: string, params: string[], callback: Function) {
    params.forEach((param, i) => {
        if (param.match(/\s/)) {
            param = param.replace(/\"/ig, `""`);
            param = '"' + param + '"';
            params[i] = param;
        }
    });
    var command = command + " " + params.join(' ');
    console.log(command);
    var cdvProcess = childProcess.exec(command, {}, (e, stdout, stdin) => { e && console.log("EXEC callback:", e) });
    cdvProcess.stdout.on("data", data=> console.log("Build Native: " + data));
    cdvProcess.stderr.on("data", data=> console.log("Build Native: " + data));
    cdvProcess.on("close", code=> callback(code));
    cdvProcess.on("error", (ee) => console.log("error when build", ee));
}

interface ILarkNativeTemplate {
    template_name: string;
    template: {
        zip: string;
    };
    rename_tree: {
        content: string[];
        file_name: string[];
    };
    game: {
        target: string[];
    }
}