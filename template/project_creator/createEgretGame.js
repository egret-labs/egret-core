var fs = require("fs");
var STATE_GET_RESOLUTION = "getResolution";
var STATE_GET_PROJECT_NAME = "getProjectName";
var STATE_GET_PROGRAMMING_LANGUAGE = "getProgrammingLanguage";
var currentState;

process.stdin.on("data", function (chunk) {
    switch (currentState) {
        case STATE_GET_RESOLUTION:
            if (parseInt(chunk) == 0 || parseInt(chunk).toString() == "NaN") {
                process.stdout.write("您的输入不合法\n请重新输入游戏默认尺寸：");
            }
            else {
                defaultResolution = parseInt(chunk);
                currentState = null;
                process.stdout.write("您输入的游戏默认尺寸为：" + chunk);
                process.stdin.pause();
                getProjectName();
            }
            break;
        case STATE_GET_PROJECT_NAME:
            if (chunk == "") {
                process.stdout.write("您的输入不合法\n请输入项目名称：");
            }
            else if (fs.existsSync(chunk.replace("\n", "").replace("\r", ""))) {
                process.stdout.write("项目路径已存在，请重新输入\n请输入项目名称：");
            }
            else {
                projectName = chunk.replace("\n", "").replace("\r", "");
                currentState = null;
                process.stdout.write("您输入的项目名称为：" + chunk);
                process.stdin.pause();
                getProgrammingLanguage();
            }
            break;
        case STATE_GET_PROGRAMMING_LANGUAGE:
            if (parseInt(chunk) == 1 || parseInt(chunk) == 2) {
                porogrammingLanguage = parseInt(chunk);
                currentState = null;
                if (parseInt(chunk) == 1) {
                    process.stdout.write("您选择的编程语言为：TypeScript\n");
                }
                else {
                    process.stdout.write("您选择的编程语言为：JavaScript\n");
                }
                process.stdin.pause();
                createGame();
            }
            else {
                process.stdout.write("您的输入不合法\n请重新选择编程语言：1.TypeScript 2.JavaScript：");
            }
            break;
    }
});

var defaultResolution;
function getResolution() {
    currentState = STATE_GET_RESOLUTION;
    process.stdout.write("请输入游戏默认尺寸：");
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
}

var projectName;
function getProjectName() {
    currentState = STATE_GET_PROJECT_NAME;
    process.stdout.write("请输入项目名称：");
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
}

var porogrammingLanguage = 1;
function getProgrammingLanguage() {
    currentState = STATE_GET_PROGRAMMING_LANGUAGE;
    process.stdout.write("请选择编程语言：1.TypeScript 2.JavaScript：");
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
}

function createGame() {
    console.log("正在创建项目");

    mkdir(projectName);
    mkdir(projectName + "/game");
    mkdir(projectName + "/game/src");
    mkdir(projectName + "/game/assets");
    mkdir(projectName + "/game/assets/" + defaultResolution);
    mkdir(projectName + "/html5");

    cp("egret.js", projectName + "/game/");
    cp("game_file_list.js", projectName + "/game/");
    if (porogrammingLanguage == 1) {
        cp("GameLayer.ts", projectName + "/game/src/");
    }
    else {
        cp("GameLayer.js", projectName + "/game/src/");
    }
    cp("index.html", projectName + "/html5/");
    cp("egret_loader.js", projectName + "/html5/");
    cp("main.js", projectName + "/html5/");
    cp("daisy.png", projectName + "/game/assets/");

    console.log("创建完成");
}

function mkdir(path) {
    fs.mkdirSync(path);
}

function cp(fileName, toPath) {
    var txt = fs.readFileSync(fileName);
    fs.writeFileSync(toPath + fileName, txt);
}

getResolution();