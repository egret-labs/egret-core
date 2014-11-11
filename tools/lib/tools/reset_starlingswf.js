/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 13-12-2
 * Time: PM11:55
 * To change this template use File | Settings | File Templates.
 */
var path = require("path");
var file = require("../core/file");
var plist = require('../core/plist');
var globals = require("../core/globals");

var readFile = function(fileName)
{
    var fileData = file.read(fileName);
    return fileData;
};

var saveFile = function (fileName, json)
{
    file.save(fileName, JSON.stringify(json, null, ""));
};

var clone = function (obj) {
    for (var key in obj) {
        if (typeof(obj[key]) == "object") {
            clone(obj[key]);
        }
        else {
            if (obj[key] === true || obj[key] === false) {

            }
            else if (typeof(obj[key]) == "string") {

            }
            else if (typeof(obj[key] == "number")) {
                obj[key] = Number(obj[key].toFixed(3));
            }
        }
    }
}

var getKey = function (count) {
    var codeStr = "abcdefghijklmnopqrstuvwxyz123456789";
    if (count < codeStr.length) {
        return codeStr.charAt(count);
    }

    var a = count % (26 + 9);
    var b = (count - a) / (26 + 9) - 1;
    return codeStr.charAt(b) + codeStr.charAt(a);
}

var compress = function(realPath) {
    var fileList = file.getDirectoryListing(realPath, true);
    for (var key in fileList) {
        var fileName = fileList[key];

        if (file.isDirectory(path.join(realPath, fileName))) {
            compress(path.join(realPath, fileName))
        }
        else {
            var fileUrl = path.join(realPath, fileName);
            var fileStr = readFile(fileUrl);
            try {
                var config = JSON.parse(fileStr);
            }
            catch(e) {
                continue;
            }

            if (config["k"]) {
                return;
            }

            var keyObj = {};
            var count = 0;
            function reSetKey(objKey) {
                if (config[objKey]) {
                    for (var key in config[objKey]) {
                        keyObj[getKey(count)] = key;
                        var reg = new RegExp("\"" + key + "\"", "g");
                        fileStr = fileStr.replace(reg, "\"" + getKey(count) + "\"");
                        count++;
                    }
                }
            }
            reSetKey("img");
            reSetKey("mc");
            reSetKey("spr");
            reSetKey("s9");
            reSetKey("btn");
            reSetKey("shapeImg");
            reSetKey("particle");
            reSetKey("comp");

            var newJson = JSON.parse(fileStr);

            for (var charKey in keyObj) {
                if (newJson["k"] == null) {
                    newJson["k"] = {};
                }
                newJson["k"][keyObj[charKey]] = charKey;
            }

            saveFile(fileUrl, newJson);
        }
    }
}


var run = function (dir, args, opts) {
    var currDir = dir;
    if (args[0]) {
        currDir = path.resolve(args[0]);
    }

    compress(currDir);
}

exports.run = run;
