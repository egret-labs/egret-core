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
                obj[key] = Number(obj[key].toFixed(4));
            }
        }
    }
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
            if (typeof(config) == "object" ) {
                clone(config);
                saveFile(fileUrl, config);
            }
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
