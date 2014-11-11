/**
 * Created by wander on 14-11-4.
 */

var path = require("path");
var fs = require("fs");
var param = require("../core/params_analyze.js");
var child_process = require("child_process");
var globals = require("../core/globals");
var file = require("../core/file.js");
var compile = require("./compile.js");
var crc32 = require("../core/crc32.js");



/**
 * 生成指定目录下文件的版本信息manifest文件
 * 不包括html和css文件
 */
function createManifest(currDir){
    var basePath = currDir + "/base.manifest";
    var versionPath = currDir + "/version.manifest";
    var oldVersion;
    if(file.exists(basePath)) {
        oldVersion = JSON.parse(file.read(basePath));
    }

    var list = file.search(path.join(currDir, "resource"));
    var currVersion = {};
    var length = list.length;

    for(var i = 0 ; i < length ; i++) {
        var filePath = list[i];
        if(filePath.indexOf(".html") != -1 || filePath.indexOf(".css") != -1 || filePath == basePath || filePath == versionPath) {
            continue;
        }
        var txt = file.read(filePath);
        var txtCrc32 = crc32(txt);
        console.log (filePath,txtCrc32)
        var savePath = path.relative(currDir, filePath);
        var crcstr = null;
        if(oldVersion) {
            if(oldVersion[savePath] == undefined || oldVersion[savePath] != txtCrc32) {
                crcstr = txtCrc32;
            }
        }
        else {
            crcstr = txtCrc32;
        }
        if (oldVersion && crcstr) {
            crcstr = [crcstr, fs.statSync(filePath).size];
        }
        if (crcstr) {
            currVersion[savePath] = crcstr;
        }
    }

    var str = JSON.stringify(currVersion);
    str = str.replace(/\\\\/g,"/");
    if(oldVersion) {
        console.log (versionPath)
        file.save(versionPath, str);
    }
    else {
        file.save(basePath, str);
        file.save(versionPath, "{}");
    }
}

function run(currDir,args,opts){
    var currentPath = args[0];
    if (!currentPath){
        console.log ("请确定执行路径")
        return;
    }
    createManifest(currentPath);
}


exports.run = run;