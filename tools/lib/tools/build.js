/**
 * 将TypeScript编译为JavaScript
 */
var path = require("path");
var fs = require("fs");
var async = require('../core/async');
var crc32 = require('../core/crc32');
var cp_exec = require('child_process').exec;
var CRC32BuildTS = "buildTS.local";
var libs = require("../core/normal_libs");
var param = require("../core/params_analyze.js");
var currDir_global;
function run(currDir, args, opts) {
    var u = opts["-u"];
    if (u && u.length > 0) {
        currDir = u[0];
    }
    currDir_global = currDir;


    var clearTS = function (callback) {
        var outPath = path.join(currDir, "output");
        var allFileList = generateAllTypeScriptFileList(outPath);
        for (var i = 0; i < allFileList.length; i++) {
            var fileToDelete = path.join(outPath, allFileList[i]);
            libs.deleteFileSync(fileToDelete);
            callback();
        }
    }

    var copyExample = function (callback) {
        var engine_root = param.getEgretPath();
        var target_src = path.join(currDir, "output", "examples");
        var source_src = path.join(engine_root, "examples");
        libs.copy(source_src, target_src);
        callback();
    }

    var tasks = [
        function (callback) {
            buildAllFile(path.join(param.getEgretPath(), "src"), path.join(currDir, "output/egret/src"), callback);
        }
    ];

    var game_path = args[0];
    if (game_path) {
        tasks.push(

            function (callback) {
                buildAllFile(path.join(currDir, game_path), path.join(currDir, "output", game_path), callback);
            }

        )
    }

    tasks.push(copyExample);
    tasks.push(clearTS);

    async.series(tasks
    )
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

function buildAllFile(source, output, buildOver) {
    var checkTypeScriptCompiler = "tsc";
    var tsc = cp_exec(checkTypeScriptCompiler);
    tsc.on('exit', function (code) {
        if (code == 0) {
            libs.copy(source, output);
            var allFileList = generateAllTypeScriptFileList(output);
            var crc32Data = getLocalContent();
            compileAllTypeScript(crc32Data, allFileList, output, output, buildOver);
        }
        else {
            libs.exit(2);
        }
    });
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
        if (data.indexOf("error TS1") >= 0 ||
            data.indexOf("error TS5") >= 0 ||
            data.indexOf("error TS2105") >= 0) {
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
function compileAllTypeScript(crc32Data, allFileList, source, output, buildOver) {
    async.forEachSeries(allFileList, function (file, callback) {
        //console.log(path);
        var fullname = path.join(source, file)
        var content = fs.readFileSync(fullname, "utf8");
        var data = crc32(content);
        if (crc32Data[fullname] == data) {
            //不需要重新编译
            callback(null, file);
        }
        else {
            crc32Data[fullname] = data;
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