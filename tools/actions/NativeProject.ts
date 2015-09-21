﻿
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import childProcess = require("child_process");
import CompileTemplate = require('../actions/CompileTemplate');
import CopyFilesCommand = require("../commands/copyfile");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

class NativeProject {
    public static copyNativeTemplate = copyNativeTemplate;
    public static copyOutputToNative = copyOutputToNative;

    public static build(platform?: string) {
        console.log("----native build-----")


        CompileTemplate.compileNativeRequire(egret.args);

        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();

        var config = egret.args.properties;
        var nativePath;
        if (nativePath = egret.args.properties.getNativePath("android")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
            var tempurl2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game-temp");
            if (FileUtil.exists(tempurl2)) {
                FileUtil.remove(tempurl2);
            }

            try {
                FileUtil.rename(url2, tempurl2);

                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();

                FileUtil.remove(tempurl2);
            }
            catch(e) {
                FileUtil.remove(url2);
                FileUtil.remove(tempurl2);

                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }

            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android");
            entrance.execute();
        }

        if (nativePath = egret.args.properties.getNativePath("ios")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.ios");
            url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");
            var tempurl2 = FileUtil.joinPath(nativePath, "Resources", "egret-game-temp");
            if (FileUtil.exists(tempurl2)) {
                FileUtil.remove(tempurl2);
            }

            try {
                FileUtil.rename(url2, tempurl2);

                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();

                FileUtil.remove(tempurl2);
            }
            catch(e) {
                FileUtil.remove(url2);
                FileUtil.remove(tempurl2);

                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }

            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "ios");
            entrance.execute();
        }

        return;
        copyOutputToNative(platform);
        var platformFolders = getPlatformFolders(platform);
        console.log(platformFolders)
        platformFolders.forEach(folder=> exec(FileUtil.joinPath(folder, "commands/build"), [], code=> console.log("Native build exit with: " + code)));
    }

    public static run(platform?: string) {

    }
    public static emulate(platform?: string) {

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