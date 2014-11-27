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
    var lostUrls = [];//排除在外的文件

    var useUrls = [];
    if (!file.exists(path.join(resourcePath, "resource.json"))) {
        return;
    }
    var resourceJson = JSON.parse(file.read(path.join(resourcePath, "resource.json")));
    for (var key in resourceJson.resources) {
        var info = resourceJson.resources[key];
        if (info["subUrls"]) {
            if (info["subUrls"][platform]) {
                lostUrls.push(info["url"]);
                info["url"] = info["subUrls"][platform];
            }

            for (var subKey in info["subUrls"]) {
                if (subKey != platform) {
                    lostUrls.push(info["subUrls"][subKey]);
                }
            }

            delete info["subUrls"];
        }

        useUrls.push([info["url"]]);
    }

    for (var i = 0; i < lostUrls.length; i++) {
        var url = lostUrls[i];
        if (useUrls.indexOf(url) < 0) {//没有使用
            var fileUrl = path.join(resourcePath, url);
            if (file.exists(fileUrl)) {
                file.remove(fileUrl);
            }
        }
    }

    file.save(path.join(resourcePath, "resource.json"), JSON.stringify(resourceJson));
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
