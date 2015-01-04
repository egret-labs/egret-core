/**
 * Created by huanghaiying on 15/1/4.
 */

var path = require("path");
var async = require('../core/async');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var create_manifest = require("../tools/create_manifest.js");

//获取自定义manifest.json文件
function getManifestJson(file_list, srcPath) {
    if (!file.exists(file_list)) {
        return [];
    }
    var content = file.read(file_list);
    try {
        var manifest = JSON.parse(content);
    }
    catch (e) {
        globals.exit(1304, file_list);
    }
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        manifest[i] = file.joinPath(srcPath, manifest[i]);
    }
    return manifest;
}

function createFileList(manifest, srcPath) {
    var gameList = [];
    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        var filePath = manifest[i];
        if (filePath.indexOf(".d.ts") != -1) {
            continue;
        }
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "ts" && globals.isInterface(filePath)) {
            continue;
        }
        gameList.push(filePath);
    }

    length = gameList.length;
    for (i = 0; i < length; i++) {
        filePath = gameList[i];
        filePath = filePath.substring(srcPath.length);
        var ext = file.getExtension(filePath).toLowerCase();
        if (ext == "exml") {
            filePath = filePath.substring(0, filePath.length - 4) + "js";
        }
        else if (ext == "ts") {
            filePath = filePath.substring(0, filePath.length - 2) + "js";
        }
        gameList[i] = filePath;
    }
    return gameList;
}

function generateGameFileList(projectPath) {
    var manifestPath = path.join(projectPath, "manifest.json");
    var srcPath = path.join(projectPath, "src/");
    var manifest;
    if (file.exists(manifestPath)) {
        manifest = getManifestJson(manifestPath, srcPath);
    }
    else {
        var referenceInfo;
        var referencePath = file.joinPath(srcPath, "../libs/module_reference.json");
        if (file.exists(referencePath)) {
            var text = file.read(referencePath);
            try {
                referenceInfo = JSON.parse(text);
            }
            catch (e) {
            }
        }
        manifest = create_manifest.create(srcPath, false, referenceInfo);
    }

    file.save(path.join(projectPath, "bin-debug/src/manifest.json"), JSON.stringify(manifest, null, "\t"));

    var gameList = createFileList(manifest, srcPath);
    var fileListText = "var game_file_list = " + JSON.stringify(gameList, null, "\t") + ";";

    file.save(path.join(projectPath, "bin-debug/src/game_file_list.js"), fileListText);
    return manifest;
}

exports.generateGameFileList = generateGameFileList;