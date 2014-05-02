var path = require("path");
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var fs = require("fs");

/**
 * 创建新项目
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currentDir, args, opts) {
    var projectName = args[0];
    if (!projectName) {
        libs.exit(1001);
    }

//    generateConfigJson(currentDir, engine, projectName);


    createNewProject(projectName);
    copyEngine();


}

//创建 游戏目录
function createNewProject(projectName) {
    var template = path.join(param.getEgretPath(), "tools/templates/game");
    var projPath = path.join(process.cwd(), projectName);
    libs.copy(template, projPath);
    console.log("创建成功!");
}


function copyEngine() {
    //创建 引擎目录
    var engine_root = path.join(process.cwd(), "egret");
    if (!fs.existsSync(engine_root)) {
        fs.mkdirSync(engine_root);
        var target_src = path.join(engine_root, "src");
        var source_src = path.join(param.getEgretPath(), "src");
        libs.copy(source_src, target_src);
    }
}

/**
 * 生成config.json文件
 * @param currentDir
 * @param engine
 * @param projectName
 */
function generateConfigJson(currentDir, engine, projectName) {
    var configPath = path.join(currentDir, "config.json");
    if (!fs.existsSync(configPath)) {
        var gameData = {};
        gameData.game = {};
        gameData.engine = "";
    }
    else {
        var txt = fs.readFileSync(configPath, "utf8");
        try {
            var gameData = JSON.parse(txt);
        }
        catch (e) {
            console.log("config.json解析失败，重新生成...");
            var gameData = {};
            gameData.game = {};
            gameData.engine = "";
        }

    }
    gameData["game"][projectName] = projectName + "/";
    if (engine && engine.length > 0) {
        gameData["engine"] = engine;
    }
    else if (!gameData["engine"]) {
        gameData["engine"] = "egret/src/";
    }

    var str = JSON.stringify(gameData, "\t", "\r");
    fs.writeFile(configPath, str, function (err) {
        if (err) throw err;
    });
}

exports.run = run;