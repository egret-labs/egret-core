/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var service = require("../service/index");
var FileUtil = require("../lib/FileUtil");
var CopyFiles = require("../actions/CopyFiles");
var APITestTool = require("../actions/APITest");
var CHILD_EXEC = require("child_process");
var APITestCommand = require("./apitest");
var project = require("../parser/EgretProject");
var Compiler = require("../actions/Compiler");
console.log(utils.tr(1004, 0));
var timeBuildStart = (new Date()).getTime();
var Build = (function () {
    function Build() {
    }
    Build.prototype.execute = function (callback) {
        callback = callback || defaultBuildCallback;
        //如果APITest未通过继续执行APITest
        if (!APITestTool.isTestPass(egret.args.projectDir)) {
            var apitest_command = new APITestCommand();
            apitest_command.execute(function () {
                globals.log2(1715); //项目检测成功
                //成功以后再次执行build
                var build = CHILD_EXEC.exec(globals.addQuotes(process.execPath) + " \"" +
                    FileUtil.joinPath(egret.root, '/tools/bin/egret') + '\" build \"' + egret.args.projectDir + "\"", {
                    encoding: 'utf8',
                    timeout: 0,
                    maxBuffer: 200 * 1024,
                    killSignal: 'SIGTERM',
                    cwd: process.cwd(),
                    env: process.env
                });
                build.stderr.on("data", function (data) {
                    console.log(data);
                });
                build.stdout.on("data", function (data) {
                    console.log(data);
                });
                build.on("exit", function (result) {
                    process.exit(result);
                });
                //返回true截断默认的exit操作
                return true;
            });
            //var build = CHILD_EXEC.exec(
            //    'node \"'+FileUtil.joinPath(egret.root,'/tools/bin/egret')+'\" apitest \"'+egret.args.projectDir+"\"",
            //    {
            //        encoding: 'utf8',
            //        timeout: 0,
            //        maxBuffer: 200*1024,
            //        killSignal: 'SIGTERM',
            //        cwd: process.cwd(),
            //        env: process.env
            //    });
            //build.stderr.on("data", (data) =>{
            //    console.log(data);
            //});
            //build.stdout.on("data",(data)=>{
            //    console.log(data);
            //});
            //build.on("exit", (result)=>{
            //    process.exit(result);
            //});
            return DontExitCode;
        }
        var options = egret.args;
        var packageJsonContent;
        if (packageJsonContent = FileUtil.read(project.utils.getFilePath("package.json"))) {
            var packageJson = JSON.parse(packageJsonContent);
            if (packageJson.modules) {
                this.buildLib(packageJson);
                return 0;
            }
        }
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/modules/egret/'))) {
            CopyFiles.copyToLibs();
        }
        service.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, function (cmd) { return onGotBuildCommandResult(cmd, callback); }, true);
        return DontExitCode;
    };
    Build.prototype.buildLib = function (packageJson) {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var outDir = "bin";
        var compiler = new Compiler();
        utils.clean(FileUtil.joinPath(options.projectDir, outDir));
        var _loop_1 = function (m) {
            files = [];
            length = m.files.length;
            if (length > 0) {
                files = m.files
                    .filter(function (file) { return file.indexOf(".ts") != -1; })
                    .map(function (file) { return FileUtil.joinPath(options.projectDir, m.root, file); });
            }
            else {
                //todo exml
                files = FileUtil.search(FileUtil.joinPath(options.projectDir, m.root), "ts");
            }
            //解决根目录没文件编译异常问题
            tmpFilePath = FileUtil.joinPath(options.projectDir, m.root, "tmp.ts");
            hasTmpTsFile = false;
            if (!FileUtil.exists(tmpFilePath)) {
                hasTmpTsFile = true;
                FileUtil.save(tmpFilePath, "");
            }
            else if (FileUtil.read(tmpFilePath) == "") {
                hasTmpTsFile = true;
            }
            options['compilerOptions'] = { target: "ES5" }; //ES5
            compileFiles = libFiles.concat(files);
            if (hasTmpTsFile) {
                compileFiles.push(tmpFilePath);
            }
            //编译js文件到临时目录
            result = compiler.compile({
                args: options,
                def: false,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp"),
                files: compileFiles,
                outDir: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp")
            });
            //编译dts文件
            compiler.compile({
                args: options,
                def: true,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"),
                files: compileFiles,
                outDir: FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp")
            });
            //兼容 Wing 用的旧版 TypeScript，删除 readonly 关键字
            var declareFile = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts");
            var dtsContent = FileUtil.read(declareFile);
            dtsContent = dtsContent.replace(/readonly /g, "");
            FileUtil.save(declareFile, dtsContent);
            if (hasTmpTsFile) {
                FileUtil.remove(tmpFilePath);
            }
            str = "";
            dtsStr = FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts"));
            if (length > 0) {
                for (var j = 0; j < m.files.length; j++) {
                    file = m.files[j];
                    if (file.indexOf(".d.ts") != -1) {
                        dtsStr += "\n";
                        dtsStr += FileUtil.read(FileUtil.joinPath(options.projectDir, m.root, file));
                    }
                    else if (file.indexOf(".ts") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp", file.replace(".ts", ".js")));
                        str += "\n";
                    }
                    else if (file.indexOf(".js") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, m.root, file.replace(".ts", ".js")));
                        str += "\n";
                    }
                }
            }
            else {
                for (var j = 0; j < result.files.length; j++) {
                    var file_1 = result.files[j];
                    if (file_1.indexOf(".ts") != -1) {
                        str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp", file_1.replace(m.root + "/", "").replace(".ts", ".js")));
                        str += "\n";
                    }
                }
            }
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".d.ts"), dtsStr);
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"), str);
            minPath = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".min.js");
            FileUtil.save(minPath, str);
            utils.minify(minPath, minPath);
            FileUtil.remove(FileUtil.joinPath(options.projectDir, outDir, m.name, "tmp"));
        };
        var files, length, tmpFilePath, hasTmpTsFile, compileFiles, result, str, dtsStr, file, minPath;
        for (var _i = 0, _a = packageJson.modules; _i < _a.length; _i++) {
            var m = _a[_i];
            _loop_1(m);
        }
    };
    return Build;
}());
function onGotBuildCommandResult(cmd, callback) {
    if (cmd.messages) {
        cmd.messages.forEach(function (m) { return console.log(m); });
    }
    if (!cmd.exitCode && egret.args.platform) {
        setTimeout(function () { return callback(0); }, 500);
    }
    else
        callback(cmd.exitCode || 0);
}
function defaultBuildCallback(code) {
    var timeBuildEnd = (new Date()).getTime();
    var timeBuildUsed = (timeBuildEnd - timeBuildStart) / 1000;
    console.log(utils.tr(1108, timeBuildUsed));
    utils.exit(code);
}
module.exports = Build;
