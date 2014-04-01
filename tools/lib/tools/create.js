
var path = require("path");
var libs = require("../core/normal_libs");
var fs = require("fs");

function run(currDir, args, opts) {
    var source = path.join(__dirname, "../../templates");
    var projName = args[0];

    if (opts["-u"] && opts["-u"].length > 0) {
        if (!fs.existsSync(opts["-u"][0])) {
            fs.mkdirSync(opts["-u"][0]);
        }
        currDir = opts["-u"][0];
    }

    var configPath = path.join(currDir, "config.json");
    var engine = opts["-e"] || opts["-engine"];

    var callback = function () {
        var txt = fs.readFileSync(configPath, "utf8");
        var gameData = JSON.parse(txt);
        gameData["game"][projName] = path.join(projName, "/");
        if (engine && engine.length > 0) {
            gameData["engine"] = path.join("engine", "/");
        }

        var str = JSON.stringify(gameData, "\t", "\r");
        fs.writeFile(configPath, str, function (err) {
            if (err) throw err;
        });
    }
    
    if (!fs.existsSync(configPath)) {
        libs.copy(path.join(source, "config.json"), configPath, callback);
    }
    else {
        callback();
    }

    //创建 引擎目录
    if (engine && engine.length > 0) {
        libs.copy(engine[0], path.join(currDir, "engine"));
    }
    
    var projPath = path.join(currDir, projName);
    //创建 游戏目录
    libs.copy(path.join(source, "game1"), projPath); 
    

    console.log("创建成功!");
}

exports.run = run;