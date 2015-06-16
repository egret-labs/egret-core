/**
 * Created by huanghaiying on 15/1/6.
 */
var path = require("../core/path");
var file = require("../core/file.js");
var globals = require("../core/globals");

//projectPath html5工程绝对路径
//nativePath native工程绝对路径
//platform android还是ios
function copyFilesToNative(projectPath, nativePath, platform, ignorePathList) {
    var url;
    if (platform == "android") {
        url = path.join(nativePath, "proj.android/assets/egret-game");
    }
    else if (platform == "ios") {
        url = path.join(nativePath, "Resources/egret-game");
    }

    var startTime = Date.now();

    //1、清除文件夹
    file.remove(url);


    //2、拷贝文件
    //launcher
    file.copy(path.join(projectPath, "launcher/runtime_loader.js"), path.join(url, "launcher/runtime_loader.js"));
    file.copy(path.join(projectPath, "launcher/native_loader.js"), path.join(url, "launcher/native_loader.js"));
    file.copy(path.join(projectPath, "launcher/native_require.js"), path.join(url, "launcher/native_require.js"));

    //js
    file.copy(path.join(projectPath, "bin-debug/src"), path.join(url, "bin-debug/src"));
    file.copy(path.join(projectPath, "bin-debug/lib/egret_file_list_native.js"), path.join(url, "bin-debug/lib/egret_file_list.js"));

    //libs
    file.copy(path.join(projectPath, "libs"), path.join(url, "libs"));

    //resource
    if (file.exists(path.join(projectPath, "resource"))) {
        copyFilesWithIgnore(path.join(projectPath, "resource"), path.join(url, "resource"), ignorePathList);
    }

    //5、修改native入口文件
    if (platform == "android") {

    }
    else if (platform == "ios") {

    }

    globals.log2(7, (Date.now() - startTime) / 1000);
}


function copyFilesWithIgnore(sourceRootPath, desRootPath, ignorePathList) {
    ignorePathList = ignorePathList.map(function(item) {
        var reg = new RegExp(item);
        return reg;
    });

    var copyFilePathList = file.getDirectoryAllListing(path.join(sourceRootPath));
    var isIgnore = false;
    copyFilePathList.forEach(function(copyFilePath) {
        isIgnore = false;

        for (var key in ignorePathList) {//检测忽略列表
            var ignorePath = ignorePathList[key];

            if (copyFilePath.match(ignorePath)) {
                isIgnore = true;
                break;
            }
        }

        if(!isIgnore) {//不在忽略列表的路径，拷贝过去
            var copyFileRePath = path.relative(sourceRootPath, copyFilePath);
            file.copy(path.join(copyFilePath), path.join(desRootPath, copyFileRePath));
        }
    });
}

exports.copyFilesToNative = copyFilesToNative;