/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 13-12-2
 * Time: PM11:55
 * To change this template use File | Settings | File Templates.
 */
var path = require("path");
var file = require("../core/file");
var param = require("../core/params_analyze.js");

var screeningFiles = function(resourcePath, platform) {
    var useUrls = [];
    if (!file.exists(path.join(resourcePath, "resource.json"))) {
        return;
    }
    var resourceJson = JSON.parse(file.read(path.join(resourcePath, "resource.json")));
    for (var key in resourceJson.resources) {
        var info = resourceJson.resources[key];
        if (info["subUrls"]) {
            if (info["subUrls"][platform]) {
                info["url"] = info["subUrls"][platform];
            }
            delete info["subUrls"];
        }

        useUrls.push(info["url"]);
    }

    function removeFiles(filePath) {
        if (file.isDirectory(filePath)) {
            var fileList = file.getDirectoryListing(filePath, true);
            for (var key in fileList) {
                removeFiles(path.join(filePath, fileList[key]));
            }
            return;
        }

        if (filePath == path.join(resourcePath, "resource.json")) {
            return;
        }

        var i = 0;
        for (; i < useUrls.length; i++) {
            if (filePath.indexOf(useUrls[i]) >= 0) {
                break;
            }
        }
        if (i == useUrls.length) {
            file.remove(filePath);
        }
    }

//    removeFiles(resourcePath);
    file.save(path.join(resourcePath, "resource.json"), JSON.stringify(resourceJson, null, "\t"));
};


var getUseFilelist = function(resourceFile, platform) {
    var useUrls = [];
    var resourceJson = JSON.parse(file.read(resourceFile));
    for (var key in resourceJson.resources) {
        var info = resourceJson.resources[key];
        if (info["subUrls"] && info["subUrls"][platform]) {
            useUrls.push(info["subUrls"][platform]);
        }
        else {
            useUrls.push(info["url"]);
        }
    }

    return useUrls;
}

var run = function (dir, args, opts) {
    var currDir = dir;
    if (args[0]) {
        currDir = path.resolve(args[0]);
    }

    var platform = param.getOption(opts, "--platform", ["ios", "android"]);

    screeningFiles(currDir, platform);
}

exports.run = run;
exports.getUseFilelist = getUseFilelist;
