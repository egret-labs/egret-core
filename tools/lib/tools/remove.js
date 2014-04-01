
var path = require("path");
var libs = require("../core/normal_libs");
var fs = require("fs");
var rm = require('rm-r');

function run(currDir, args, opts) {
    var projName = args[0];

    //有无指定地址
    if (opts["-u"] && opts["-u"].length > 0) {
        if (!fs.existsSync(opts["-u"][0])) {
            console.log("指定目录不存在");
            process.exit(1);
        }
        currDir = opts["-u"][0];
    }

    var configPath = path.join(currDir, "config.json");
    var callback = function () {
        var txt = fs.readFileSync(configPath, "utf8");
        var gameData = JSON.parse(txt);
        delete(gameData["game"][projName]);

        var str = JSON.stringify(gameData, "\t", "\r");
        fs.writeFile(configPath, str, function (err) {
            if (err) throw err;
        });
    }
    
    if (fs.existsSync(configPath)) {
        callback();
    }

    var projPath = path.join(currDir, projName);
    console.log(projPath);
    rm.dir(projPath);

    console.log("删除成功!");
}

exports.run = run;