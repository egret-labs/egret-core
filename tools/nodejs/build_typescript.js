/**
 * 将TypeScript编译为JavaScript
 * 会忽略TS2000+的错误，只会抛出TS1000+的错误
 * @example
 *   node build_typescript.js [source_path]
 */

var sourcePath = process.argv[2];
if (!sourcePath) {
    sourcePath = "../../src";
}
//console.log (__dirname)
sourcePath = __dirname +"/" + sourcePath;


var fileExtension = require("./FileExtension");
var _path = [];
fileExtension.run(sourcePath, function (path) {
    if (path.indexOf(".ts") == path.length - 3 && path.indexOf(".d.ts") == -1) {
        _path.push(path);
    }
});
var cp_exec = require('child_process').exec;
var async = require('async');
var crc32 = require("crc32");
var fs = require("fs");
var CRC32BuildTS = "BuildTS.local";
var crc32Data;
if (!fs.existsSync(CRC32BuildTS)) {
    crc32Data = {};
}
else {
    var txt = fs.readFileSync(CRC32BuildTS, "utf8");
    crc32Data = JSON.parse(txt);
}

var build = function (path, callback) {
    var cmd = "tsc " + path + " -t ES5";
    var ts = cp_exec(cmd);
    ts.stderr.on("data", function (data) {
        if (data.indexOf("error TS1") >= 0) {
            console.log(data);
        }
    })

    ts.on('exit', function (code) {
        console.log("[success]" + path);
        callback(null, path);
    });
}

async.forEachLimit(_path, 2, function (path, callback) {
    //console.log(path);
    var content = fs.readFileSync(path, "utf8");
    var data = crc32(content);
    if (crc32Data[path] == data) {
        //不需要重新编译
        callback(null, path);
    }
    else {
        crc32Data[path] = data;
        //需要重新编译一下
        build(path, callback);
    }
}, function (err) {
    if (err == undefined) {
        console.log("AllComplete");
    }
    else {
        console.log("出错了" + err);
    }
    //保存一下crc32文件
    txt = JSON.stringify(crc32Data);
    if (fs.existsSync(CRC32BuildTS)) {
        fs.unlinkSync(CRC32BuildTS);
    }
    fs.writeFileSync(CRC32BuildTS, txt);
});
