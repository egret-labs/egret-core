/**
 * 将TypeScript编译为JavaScript
 * 会忽略TS2000+的错误，只会抛出TS1000+的错误
 * @example
 *   node build_typescript.js [source_path]
 *
 * @param source_path:编译路径，默认为引擎代码
 */

var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var crc32 = require('../core/crc32');
var cp_exec = require('child_process').exec;
var CRC32BuildTS = "buildTS.local";
var libs = require("../core/normal_libs");

function run(currDir, args, opts) {
    var u = opts["-u"];
    if (u && u.length > 0) {
        currDir = u[0];
    }
    //获得需要编译的文件夹
    var dir = getAllDir(currDir, args, opts);
    var count = 0;
    var buildOver = function () {
        if (count >= dir.length) {
            clearTS();
            return;
        }
        var sourcePath = path.join(currDir, dir[count]);
        var outPath = path.join(currDir, "output", dir[count]);
        execute(sourcePath, outPath, buildOver);
        count++;
    }

    var clearTS = function () {
        for (var key in dir) {
            var outPath = path.join(currDir, "output", dir[key]);
            var allFileList = generateAllTypeScriptFileList(outPath);
            for (var i = 0; i < allFileList.length; i++) {
                var fileToDelete = path.join(outPath, allFileList[i]);
                libs.deleteFileSync(fileToDelete);
            }
        }
    }

    buildOver();
}

function getLocalContent() {
    var tempData;
    if (!fs.existsSync(CRC32BuildTS)) {
        tempData = {};
    }
    else {
        var txt = fs.readFileSync(CRC32BuildTS, "utf8");
        tempData = JSON.parse(txt);
    }
    return tempData;
}

function execute(source, output, buildOver) {

    libs.copy(source, output);
    var allFileList = generateAllTypeScriptFileList(output);
    var checkTypeScriptCompiler = "tsc";
    var tsc = cp_exec(checkTypeScriptCompiler);
    tsc.on('exit', function (code) {
        if (code == 0) {
            var crc32Data = getLocalContent();
            buildAllTypeScript(crc32Data, allFileList, output, output, buildOver);
        }
        else {
            console.log("TypeScript编译器尚未安装，请执行 npm install -g typescript 进行安装");
            process.exit(1);
        }
    });
}

function getAllDir(currDir, args, opts) {


    function addToDir(filePath) {

        if (!filePath) {
            console.log ("config.json中存在空编译路径，请检查");
            return;
        }
        var realPath = path.join(currDir, filePath);
        if (!fs.existsSync(realPath)) {
            throw new Error("config.json中存在错误的编译路径,无法编译：" + filePath);
        }

        gameArr.push(filePath);
    }

    var configPath = path.join(currDir, 'config.json');
    if (!fs.existsSync(configPath)) {
        var errorMessage = "配置文件不存在";
        console.log(errorMessage);
        process.exit([1]);
        return;
    }

    var configStr = fs.readFileSync(configPath, "utf-8");
    var configObj = JSON.parse(configStr);

    var gameArr = [];

    var needEngine = false;
    var needGame = false;

    if (opts["-e"]) {
        needEngine = true;
    }
    else if (opts["-g"]) {
        needGame = true;
    }
    else {
        needEngine = true;
        needGame = true;
    }

    if (needEngine) {//编译 引擎代码
        addToDir(configObj["engine"]);
    }

    if (needGame) {//编译 游戏代码
        var arr = opts["-g"];
        var gameObj = configObj["game"];
        if (!arr || arr.length == 0) {
            for (var key in gameObj) {
                addToDir(gameObj[key]);
            }
        }
        else {
            for (var key1 in arr) {
                addToDir(gameObj[arr[key1]]);
            }
        }
    }
    return gameArr;
}
/**
 * 编译单个TypeScript文件
 * @param file
 * @param callback
 */
function build(file, callback, source, output) {
    var source = path.join(source, file);
    var dirname = path.dirname(file);
    var out = path.join(output, dirname);
//    var target = path.join(output,file).replace(".ts",".js");
    var cmd = "tsc " + source + " -t ES5" //这个特性暂时关闭 //--outDir " +  out;

    var ts = cp_exec(cmd);
    ts.stderr.on("data", function (data) {
        if (data.indexOf("error TS1") >= 0) {
            console.log(data);
        }
    })

    ts.on('exit', function (code) {
        console.log("[success]" + file);
        callback(null, file);
    });
}

/**
 * 编译全部TypeScript文件
 * @param allFileList
 */
function buildAllTypeScript(crc32Data, allFileList, source, output, buildOver) {
    async.forEachLimit(allFileList, 2, function (file, callback) {
        //console.log(path);
        var content = fs.readFileSync(path.join(source, file), "utf8");
        var data = crc32(content);
        if (crc32Data[file] == data) {
            //不需要重新编译
            callback(null, file);
        }
        else {
            crc32Data[file] = data;
            //需要重新编译一下
            build(file, callback, source, output);
        }


    }, function (err) {
        if (err == undefined) {
            console.log(source + " AllComplete");
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

        buildOver();
    });

}


/**
 * 生成source下的所有TypeScript文件列表
 * @param source
 * @returns {Array}
 */

function generateAllTypeScriptFileList(source) {

    return libs.loopFileSync(source, filter);

    function filter(path) {
        return  path.indexOf(".ts") == path.length - 3 && path.indexOf(".d.ts") == -1
    }
}

exports.run = run;