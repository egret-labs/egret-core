/**
 * Created by yjtx on 15-5-27.
 */
var file = require("../lib/FileUtil");
var params = require("../ParamsParser");
function getVersionCtrName() {
    var projectPath = params.getProjectRoot();
    var egretProperties = JSON.parse(file.read(file.join(projectPath, "egretProperties.json")));
    var ctr = "emptyVersionCtr";
    for (var i = 0; i < egretProperties["modules"].length; i++) {
        var module = egretProperties["modules"][i];
        if (module["name"] == "version" && !module["path"]) {
            ctr = "newVersionCtr";
            break;
        }
        else if (module["name"] == "version_old" && !module["path"]) {
            ctr = "oldVersionCtr";
            break;
        }
    }
    return ctr;
}
exports.getVersionCtrName = getVersionCtrName;
function getVersionCtr() {
    return require('./' + getVersionCtrName());
}
exports.getVersionCtr = getVersionCtr;
