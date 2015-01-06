/**
 * Created by huanghaiying on 15/1/6.
 */
var path = require("path");
var file = require("../core/file.js");

function copyFilesToNative(url, platform) {
    var startTime = Date.now();

    //1、清除文件夹
    file.remove(url);

    var projectPath = projectProperties.getProjectPath();

    //2、拷贝文件
    //launcher

    file.copy(path.join(projectPath, "launcher/native_loader.js"), path.join(url, "launcher/native_loader.js"));
    file.copy(path.join(projectPath, "launcher/native_require.js"), path.join(url, "launcher/native_require.js"));

    //js
    file.copy(path.join(projectPath, "bin-debug/src"), path.join(url, "bin-debug/src"));
    file.copy(path.join(projectPath, "bin-debug/lib/egret_file_list_native.js"), path.join(url, "bin-debug/lib/egret_file_list.js"));

    //resource
    copyFilesWithIgnore(path.join(projectPath, "resource"), path.join(url, "resource"));
    copyFilesWithIgnore(path.join(projectPath, "libs"), path.join(url, "libs"));

    //3、生成空版本控制文件
    //编译版本控制文件 生成2个空文件
    file.save(path.join(url, "base.manifest"), "{}");
    file.save(path.join(url, "version.manifest"), "{}");

    //4、修改native_require.js文件
    var native_require = file.read(path.join(url, "launcher/native_require.js"));
    native_require = native_require.replace(/var needCompile =.*/, "var needCompile = false;");
    file.save(path.join(url, "launcher/native_require.js"), native_require);

    //5、修改native入口文件
    if (platform == "android") {

    }
    else if (platform == "ios") {

    }

    console.log("native拷贝共计耗时：%d秒", (Date.now() - startTime) / 1000);
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