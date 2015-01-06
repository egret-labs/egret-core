/**
 * Created by huanghaiying on 14/12/4.
 */
var path = require("path");
var param = require("../core/params_analyze.js");
var file = require("../core/file.js");
var globals = require("../core/globals");
var compile = require("../tools/compile.js");

function getFileList(file_list) {
    var js_content = file.read(file_list);
    js_content = js_content.match(/\[[^\]]*\]/)[0];
    return JSON.parse(js_content);
}

function getAllFileList(currDir, runtime) {
    var egret_file;
    if (runtime == "html5") {
        egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    }
    else {
        egret_file = path.join(currDir, "bin-debug/lib/egret_file_list_native.js");
    }
    var egretFileList = getFileList(egret_file).map(function(item) {
        return path.join(currDir, "libs", item);
    });

    var game_file = path.join(currDir, "bin-debug/src/game_file_list.js");
    var gameFileList = getFileList(game_file).map(function(item) {
        return path.join(currDir, "bin-debug", "src", item);
    });

    return egretFileList.concat(gameFileList);
}

exports.getAllFileList = getAllFileList;