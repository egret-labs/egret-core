/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var CopyFiles = require('../actions/CopyFiles');
var APITestTool = require('../actions/APITest');
var CHILD_EXEC = require('child_process');
var APITestCommand = require('./apitest');
var Compiler = require('../actions/Compiler');
console.log(utils.tr(1004, 0));
var timeBuildStart = (new Date()).getTime();
var Build = (function () {
    function Build() {
    }
    Build.prototype.execute = function (callback) {
        callback = callback || defaultBuildCallback;
        if (!APITestTool.isTestPass(egret.args.projectDir)) {
            var apitest_command = new APITestCommand();
            apitest_command.execute(function () {
                globals.log2(1715);
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
                return true;
            });
            return DontExitCode;
        }
        var options = egret.args;
        var packageJson;
        if (packageJson = FileUtil.read(FileUtil.joinPath(options.projectDir, "package.json"))) {
            packageJson = JSON.parse(packageJson);
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
        var compiler = new Compiler;
        for (var i = 0; i < packageJson.modules.length; i++) {
            var module = packageJson.modules[i];
            var files = [];
            for (var j = 0; j < module.files.length; j++) {
                var file = module.files[j];
                if (file.indexOf(".ts") != -1) {
                    files.push(FileUtil.joinPath(options.projectDir, module.root, file));
                }
            }
            compiler.compile({
                args: options,
                def: false,
                out: null,
                files: libFiles.concat(files),
                outDir: FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp")
            });
            compiler.compile({
                args: options,
                def: true,
                out: FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".js"),
                files: libFiles.concat(files),
                outDir: null
            });
            var str = "";
            var dtsStr = FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".d.ts"));
            for (var j = 0; j < module.files.length; j++) {
                var file = module.files[j];
                if (file.indexOf(".d.ts") != -1) {
                    dtsStr += "\n";
                    dtsStr += FileUtil.read(FileUtil.joinPath(options.projectDir, module.root, file));
                }
                else if (file.indexOf(".ts") != -1) {
                    str += FileUtil.read(FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp", file.replace(".ts", ".js")));
                    str += "\n";
                }
                else if (file.indexOf(".js") != -1) {
                    str += FileUtil.read(FileUtil.joinPath(options.projectDir, module.root, file.replace(".ts", ".js")));
                    str += "\n";
                }
            }
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".d.ts"), dtsStr);
            FileUtil.save(FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".js"), str);
            var minPath = FileUtil.joinPath(options.projectDir, outDir, module.name, module.name + ".min.js");
            FileUtil.save(minPath, str);
            utils.minify(minPath, minPath);
            FileUtil.remove(FileUtil.joinPath(options.projectDir, outDir, module.name, "tmp"));
        }
    };
    return Build;
})();
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
