/**
 * Created by yjtx on 15-5-27.
 */
var file = require("../../core/file.js");
var path = require("../../core/path");

exports.getVersionCtrName = function getVersionCtrName(projectPath) {
    var egretProperties = JSON.parse(file.read(path.join(projectPath, "egretProperties.json")));

    for (var i = 0; i < egretProperties["modules"].length; i++) {
        var module = egretProperties["modules"][i];
        if (module["name"] == "version" && !module["path"]) {
            return "newVersionCtr";
        }
        else if (module["name"] == "version_old" && !module["path"]) {
            return "oldVersionCtr";
        }
    }
    return "emptyVersionCtr";
};