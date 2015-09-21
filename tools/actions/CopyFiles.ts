
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');

var fileExtensionToIgnore = {
    "ts": true
};

class CopyFiles {
	static copyProjectFiles(){
		var targetFolder = egret.args.outDir;
        copyDirectory(egret.args.srcDir,targetFolder,srcFolderOutputFilter);
        copyDirectory(egret.args.templateDir,targetFolder);
	}
    

    static copyLark(): number {
        var options = egret.args;
        var moduleBin = FileUtil.joinPath(egret.root, "build");
        var targetFile = FileUtil.joinPath(options.srcDir, '/libs/');
        if (options.projectDir.toLowerCase() != egret.root.toLowerCase())
            FileUtil.copy(moduleBin, targetFile);
        return 0;
    }

    static copyOutputToNative() {

    }
}

function copyDirectory(from: string, to: string, filter?: (filename: string) => boolean) {
    var fileList: string[] = [];
    if (!filter)
        fileList = FileUtil.getDirectoryListing(from);
    else
        fileList = FileUtil.searchByFunction(from, filter);
    length = fileList.length;
    for (var i = 0; i < length; i++) {
        var path = fileList[i];
        var destPath = path.substring(from.length);
        destPath = FileUtil.joinPath(to, destPath);
        FileUtil.copy(path, destPath);
    }
}

function srcFolderOutputFilter(file: string) {
    var hasEUI:boolean = false;
    if (FileUtil.exists(FileUtil.joinPath(egret.args.projectDir, "egretProperties.json"))) {
        var properties = JSON.parse(FileUtil.read(FileUtil.joinPath(egret.args.projectDir, "egretProperties.json")));
        for (var key in properties["modules"]) {
            hasEUI = hasEUI || properties["modules"][key].name == "eui";
        }
    }


    var extension = FileUtil.getExtension(file);
    if (extension in fileExtensionToIgnore)
        return false;
    else if (extension == "exml" && !hasEUI)
        return false;
    return true;
}

export = CopyFiles;