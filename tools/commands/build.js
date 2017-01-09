/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var service = require("../service/index");
var FileUtil = require("../lib/FileUtil");
var CopyFiles = require("../actions/CopyFiles");
var APITestTool = require("../actions/APITest");
var CHILD_EXEC = require("child_process");
var APITestCommand = require("./apitest");
var project = require("../parser/EgretProject");
var ts = require("../lib/typescript-plus/lib/typescript");
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
            var compilerOptions = {
                target: ts.ScriptTarget.ES5,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"),
                declaration: true
            };
            compileFiles = libFiles.concat(files);
            if (hasTmpTsFile) {
                compileFiles.push(tmpFilePath);
            }
            result = compiler.compileGame(compilerOptions, compileFiles);
            if (hasTmpTsFile) {
                FileUtil.remove(tmpFilePath);
            }
            minPath = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".min.js");
            utils.minify(compilerOptions.out, minPath);
        };
        var files, length, tmpFilePath, hasTmpTsFile, compileFiles, result, minPath;
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
