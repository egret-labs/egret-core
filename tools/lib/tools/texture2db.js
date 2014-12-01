/**
 * Created by huanghaiying on 14/11/9.
 */

var path = require("path");
var plist = require('../core/plist');
var file = require("../core/file");

function run(currDir, args, opts) {
    if (args[0]) {
        currDir = path.resolve(args[0]);
    }
    linkChildren(currDir);
}

function linkChildren(fileUrl) {
    if (file.isDirectory(fileUrl)) {
        var fileList = file.getDirectoryListing(fileUrl, true);

        for (var key in fileList) {
            var fileName = fileList[key];

            var tempFileUrl = path.join(fileUrl, fileName);
            linkChildren(tempFileUrl);
        }
        return;
    }

    try {
        var stuStr = file.read(fileUrl);
        var stuData = JSON.parse(stuStr);

        if (stuData["file"] == null || stuData["frames"] == null) {
            return;
        }
    }
    catch (e) {

        return;
    }

    var fileName = file.getFileName(fileUrl);
    var texture = {"imagePath":stuData["file"], "SubTexture":[], "name":fileName};

    for (var key in stuData["frames"]) {
        var frame = stuData["frames"][key];

        var temp = {};
        temp["width"] = frame["w"];
        temp["height"] = frame["h"];
        temp["x"] = frame["x"];
        temp["y"] = frame["y"];
        temp["name"] = key;

        texture["SubTexture"].push(temp);
    }

    file.save(fileUrl, JSON.stringify(texture, null, "\t"));
}

exports.run = run;