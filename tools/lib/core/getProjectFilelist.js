/**
 * Created by huanghaiying on 14/12/4.
 */
var path = require("path");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var globals = require("../core/globals");
var compile = require("../tools/compile.js");

function getFileList(file_list) {
    if (file.exists(file_list)) {
        var js_content = file.read(file_list);
        eval(js_content);
        var varname = path.basename(file_list).split(".js")[0];
        return eval(varname);
    }
    else {
        globals.exit(1301, file_list);
    }
}

function getAllFileList(currDir){
    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var egretFileList = getFileList(egret_file);
    var html5FileList = compile.getModuleConfig("html5").file_list;
    var length = html5FileList.length;
    for (var i = 0; i < length; i++) {
        var filePath = html5FileList[i];
        filePath = filePath.replace(".ts", ".js");
        html5FileList[i] = filePath;
        var index = egretFileList.indexOf(filePath);
        if (index != -1) {
            egretFileList.splice(index, 1);
        }
    }

    var nativeFileList = compile.getModuleConfig("native").file_list;
    length = nativeFileList.length;
    for (i = 0; i < length; i++) {
        filePath = nativeFileList[i];
        if (filePath.indexOf(".d.ts") != -1) {
            nativeFileList.splice(i, 1);
            i--;
            length--;
            continue;
        }
        filePath = filePath.replace(".ts", ".js");
        nativeFileList[i] = filePath;
        index = egretFileList.indexOf(filePath);
        if (index != -1) {
            egretFileList.splice(index, 1);
        }
    }

    var egretHTML5FileList = egretFileList.concat(html5FileList);
    egretHTML5FileList = egretHTML5FileList.map(function (item) {
        return path.join(currDir, "libs/", item);
    });
    var egretNativeFileList = egretFileList.concat(nativeFileList);
    egretNativeFileList = egretNativeFileList.map(function (item) {
        return path.join(currDir, "libs/", item);
    });

    var game_file = path.join(currDir, "bin-debug/src/game_file_list.js");
    var gameFileList = getFileList(game_file);
    gameFileList = gameFileList.map(function (item) {
        return path.join(currDir + "/bin-debug/src/", item);
    });

    var totalHTML5FileList = egretHTML5FileList.concat(gameFileList);
    var totalNativeFileList = egretNativeFileList.concat(gameFileList);


    return {"html5":totalHTML5FileList, "native":totalNativeFileList};
}

exports.getAllFileList = getAllFileList;