/**
 * Created by wander on 14-11-4.
 */

var path = require("path");
var fs = require("fs");
var param = require("../core/params_analyze.js");
var globals = require("../core/globals");
var file = require("../core/file.js");
var compile = require("./compile.js");
var crc32 = require("../core/crc32.js");



/**
 * 生成指定目录下文件的版本信息manifest文件
 * 不包括html和css文件
 */
function createManifest(projectPath, outputPath, newCode){
    var basePath = path.join(outputPath, "base.manifest");
    var versionPath = path.join(outputPath, "version.manifest");
    var codePath = path.join(outputPath, "code.manifest");

    var oldVersion;
    if(file.exists(basePath)) {
        oldVersion = JSON.parse(file.read(basePath));
    }

    var oldCode = 1;
    if(file.exists(codePath)) {
        oldCode = JSON.parse(file.read(codePath))["code"] || 1;
    }
    else {
        file.save(codePath, JSON.stringify({code:oldCode}));
    }

    var list = file.search(path.join(projectPath, "resource"));
    var changeVersion = {};
    var currentVersion = {};

    var length = list.length;

    for(var i = 0 ; i < length ; i++) {
        var filePath = list[i];
        if(filePath.indexOf(".html") != -1 || filePath.indexOf(".css") != -1 || filePath == basePath || filePath == versionPath) {
            continue;
        }
        var txt = file.read(filePath);
        var txtCrc32 = crc32(txt);
        var savePath = path.relative(projectPath, filePath);
        savePath = savePath.replace(/(\\\\|\\)/g,"/");
        var crcstr = null;
        if(oldVersion) {
            if(oldVersion[savePath] == undefined || oldVersion[savePath]["v"] != txtCrc32) {
                crcstr = txtCrc32;
            }
        }
        else {
            crcstr = txtCrc32;
        }

        if (crcstr) {
            changeVersion[savePath] = {"v":crcstr, "s":fs.statSync(filePath).size};
        }

        currentVersion[savePath] = 1;
    }

    if (oldVersion == null || oldCode < newCode) {
        var changeStr = JSON.stringify(changeVersion);
        file.save(basePath, changeStr);
        file.save(codePath, JSON.stringify({code:newCode}));
        file.save(versionPath, "{}");

        file.copy(path.join(projectPath, "resource/resource.json"), path.join(outputPath, "resource.json"));
        return;
    }

    for (var key in oldVersion) {
        if (currentVersion[key] == null) {//文件已被删除
            changeVersion[key] = {"d":1};
        }
    }

    var str = JSON.stringify(changeVersion);
    if(oldVersion) {
        file.save(versionPath, str);
    }
}

function run(currDir, args, opts){
    var currentPath = args[0];
    if (!currentPath){
        console.log ("请确定执行路径");
        return;
    }
    createManifest(currentPath, currentPath);
}

function generate(projectPath, outputPath, newCode) {

    createManifest(projectPath, outputPath, newCode);
}

exports.generate = generate;
exports.run = run;