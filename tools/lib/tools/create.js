var path = require("path");
var libs = require("../core/normal_libs");
var fs = require("fs");

/**
 * 创建新项目
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currentDir, args, opts) {
    var source = path.join(__dirname, "../../templates");
    var projectName = args[0];
    if (!projectName) {
        libs.exit(1001);
        return;
    }

//    更改导出文件夹，此功能暂时屏蔽
//    if (opts["-u"] && opts["-u"].length > 0) {
//        if (!fs.existsSync(opts["-u"][0])) {
//            fs.mkdirSync(opts["-u"][0]);
//        }
//        currentDir = opts["-u"][0];
//    }


    var engine = opts["-e"] || opts["-engine"];

    generateConfigJson(currentDir,engine,projectName);


    copyEngine(currentDir,engine);

    var projPath = path.join(currentDir, projectName);
    //创建 游戏目录
    libs.copy(path.join(source, "game"), projPath);
    console.log("创建成功!");
}


function copyEngine(currentDir,engine){
    //创建 引擎目录
    if (engine && engine.length > 0) {
        var engine_root = path.join(currentDir, "egret");
        if (fs.existsSync(engine_root)){
            console.error("当前目录下已存在引擎文件夹");
            process.exit(1);
        }
        fs.mkdirSync(engine_root);
        var target_src = path.join(engine_root, "src");
        var source_src = path.join(engine[0], "src");
        libs.copy(source_src, target_src);
    }
}

/**
 * 生成config.json文件
 * @param currentDir
 * @param engine
 * @param projectName
 */
function generateConfigJson(currentDir,engine,projectName) {
    var configPath = path.join(currentDir, "config.json");
    if (!fs.existsSync(configPath)) {
        var gameData = {};
        gameData.game = {};
        gameData.engine = "";
    }
    else {
        var txt = fs.readFileSync(configPath, "utf8");
        try{
            var gameData = JSON.parse(txt);
        }
        catch(e){
            console.log ("config.json解析失败，重新生成...");
            var gameData = {};
            gameData.game = {};
            gameData.engine = "";
        }

    }
    gameData["game"][projectName] = projectName + "/";
    if (engine && engine.length > 0) {
        gameData["engine"] = engine;
    }
    else if (!gameData["engine"]){
        gameData["engine"] = "egret/src/";
    }

    var str = JSON.stringify(gameData, "\t", "\r");
    fs.writeFile(configPath, str, function (err) {
        if (err) throw err;
    });
}

exports.run = run;