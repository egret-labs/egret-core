/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
import FileUtil = require('../lib/FileUtil');
import * as fs from 'fs';
import * as path from 'path';
import CopyFilesCommand = require("../commands/copyfile");
import EgretProject = require('../project/EgretProject');
import ZipCommand = require("./ZipCommand");
import copyNative = require("./CopyNativeFiles");
import exml = require("./exml");

function publishResourceOrigin(projectDir: string, releaseDir: string) {
    var config = EgretProject.data;
    var cpFiles = new CopyFilesCommand();
    cpFiles.copyResources(projectDir, releaseDir, config.getIgnorePath());
    return 0;
}

function publishResourceWithVersion(projectDir: string, releaseDir: string) {
    var ignorePathList = EgretProject.data.getIgnorePath();
    var allPath = FileUtil.joinPath(releaseDir, "all.manifest");

    let resources = EgretProject.data.getResources();
    var list = [];
    for (let r of resources) {
        let tempList = FileUtil.search(FileUtil.joinPath(projectDir, r));
        list = list.concat(tempList);
    }
    ignorePathList = ignorePathList.map(function (item) {
        var reg = new RegExp(item);
        return reg;
    });
    var isIgnore = false;
    list = list.filter(function (copyFilePath) {
        isIgnore = false;
        for (var key in ignorePathList) {//检测忽略列表
            var ignorePath = ignorePathList[key];

            if (copyFilePath.match(ignorePath)) {
                isIgnore = true;
                break;
            }
        }

        if (copyFilePath.indexOf(".html") != -1 || copyFilePath.indexOf(".css") != -1) {
            return false;
        }

        if (!isIgnore) {//不在忽略列表的路径，拷贝过去
            return true;
        }

    });

    var allVersion = {};

    const copyExmlList = EgretProject.data.getCopyExmlList();
    for (let filePath of list) {
        if (copyExmlList.length && filePath.slice(filePath.lastIndexOf(".") + 1) == "exml") {
            var needCopy = false;
            for (var j = 0; j < copyExmlList.length; j++) {
                if (filePath.indexOf(copyExmlList[j]) != -1) {
                    needCopy = true;
                    break;
                }
            }
            if (!needCopy) {
                continue;
            }
        }
        var txt = FileUtil.read(filePath);

        var crc32 = globals.getCrc32();
        var txtCrc32 = crc32(txt);
        var savePath = FileUtil.relative(projectDir, filePath);

        allVersion[savePath] = { "v": txtCrc32, "s": fs.statSync(filePath).size };
    }

    FileUtil.save(allPath, JSON.stringify(allVersion));

    for (var tempPath in allVersion) {
        var outputFilePath = FileUtil.joinPath(releaseDir, "resource", allVersion[tempPath]["v"].substring(0, 2), allVersion[tempPath]["v"] + "_" + allVersion[tempPath]["s"] + "." + tempPath.substring(tempPath.lastIndexOf(".") + 1));

        FileUtil.copy(FileUtil.joinPath(projectDir, tempPath), outputFilePath);
    }
    return 0;

    ////删除原始资源文件
    //for (var key in resources) {
    //    FileUtil.remove(FileUtil.joinPath(releasePath, resources[key]));
    //}
    //
    //FileUtil.copy(FileUtil.joinPath(releasePath, "egretResourceRoot"), FileUtil.joinPath(releasePath, "resource"));
    //
    //FileUtil.remove(FileUtil.joinPath(releasePath, "egretResourceRoot"));

    //globals.debugLog(1408, (Date.now() - tempTime) / 1000);
}

async function publishWithResourceManager(projectDir: string, releaseDir: string): Promise<number> {
    publishResourceOrigin(projectDir, releaseDir);
    let res = require('../lib/res/res.js');
    let command = "publish";
    res.createPlugin({
        "name": "test",
        onFile: async (file) => {
            return file;
        },
        onFinish: () => {
            legacyPublishHTML5();
        }
    });
    res.createPlugin({
        "name": "cleanEXML",
        onFile: async (file) => {
            return file;
        },
        onFinish: () => {
            if (exml.updateSetting) {
                exml.updateSetting();
            }
        }
    })
    return await res.build({ projectRoot: releaseDir, debug: true, command });
}

export async function publishResource(version: string, runtime: "web" | "native") {
    //拷贝资源后还原default.thm.json bug修复 by yanjiaqi
    await publishResource_2(runtime);

}

function publishResource_2(runtime: "web" | "native") {

    let { releaseDir, projectDir } = egret.args;

    let publishType = EgretProject.data.getPublishType(runtime);
    switch (publishType) {
        case 0:
            return publishResourceOrigin(projectDir, releaseDir);
            break;
        case 1:
            return publishResourceWithVersion(projectDir, releaseDir);
            break;
        case 2:
            return publishWithResourceManager(projectDir, releaseDir);
            break;
        default:
            return 1;
    }



}


export function legacyPublishNative(versionFile: string) {
    let options = egret.args;
    let manifestPath = FileUtil.joinPath(options.releaseDir, "ziptemp", "manifest.json");
    EgretProject.manager.generateManifest(null, manifestPath, false, "native");
    EgretProject.manager.modifyNativeRequire(manifestPath);
    var allMainfestPath = FileUtil.joinPath(options.releaseDir, "all.manifest");
    if (FileUtil.exists(allMainfestPath)) {
        FileUtil.copy(allMainfestPath, FileUtil.joinPath(options.releaseDir, "ziptemp", "all.manifest"));
    }
    FileUtil.remove(allMainfestPath);

    //先拷贝 launcher
    FileUtil.copy(FileUtil.joinPath(options.templateDir, "runtime"), FileUtil.joinPath(options.releaseDir, "ziptemp", "launcher"));

    FileUtil.copy(FileUtil.joinPath(options.releaseDir, "main.min.js"), FileUtil.joinPath(options.releaseDir, "ziptemp", "main.min.js"));
    FileUtil.remove(FileUtil.joinPath(options.releaseDir, "main.min.js"));

    EgretProject.manager.copyLibsForPublish(manifestPath, FileUtil.joinPath(options.releaseDir, "ziptemp"), "native");

    //runtime  打包所有js文件以及all.manifest
    var zip = new ZipCommand(versionFile);
    zip.execute(function (code) {
        copyNative.refreshNative(false, versionFile);
    });
}

export function legacyPublishHTML5() {
    let options = egret.args;
    let manifestPath = FileUtil.joinPath(egret.args.releaseDir, "manifest.json");
    let indexPath = FileUtil.joinPath(egret.args.releaseDir, "index.html");
    EgretProject.manager.generateManifest(null, manifestPath, false, "web");
    if (!EgretProject.data.useTemplate) {
        FileUtil.copy(FileUtil.joinPath(options.projectDir, "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }
    else {
        FileUtil.copy(FileUtil.joinPath(options.templateDir, "web", "index.html"), indexPath);
        EgretProject.manager.modifyIndex(manifestPath, indexPath);
    }

    let copyAction = new CopyAction(options.projectDir, options.releaseDir);
    copyAction.copy("favicon.ico");

    EgretProject.manager.copyLibsForPublish(manifestPath, options.releaseDir, "web");
}

class CopyAction {

    constructor(private from, private to) {
    }

    public copy(resourcePath: string | string[]) {
        if (typeof resourcePath == 'string') {
            let fromPath = path.resolve(this.from, resourcePath);
            let toPath = path.resolve(this.to, resourcePath)
            if (FileUtil.exists(fromPath)) {
                FileUtil.copy(fromPath, toPath);
            }
        }
        else {
            resourcePath.forEach(this.copy.bind(this));
        }

    }

}