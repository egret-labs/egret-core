/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
var service = require("../service/index");
var FileUtil = require("../lib/FileUtil");
var project = require("../project/EgretProject");
var ts = require("../lib/typescript-plus/lib/typescript");
var path = require("path");
var Compiler = require("../actions/Compiler");
console.log(utils.tr(1004, 0));
var timeBuildStart = (new Date()).getTime();
var Build = (function () {
    function Build() {
    }
    Build.prototype.execute = function (callback) {
        callback = callback || defaultBuildCallback;
        var options = egret.args;
        var packageJsonContent;
        if (packageJsonContent = FileUtil.read(project.data.getFilePath("package.json"))) {
            var packageJson = JSON.parse(packageJsonContent);
            if (packageJson.modules) {
                globals.log(1119);
                globals.exit(1120);
                return 0;
            }
            if (FileUtil.exists(project.data.getFilePath("tsconfig.json"))) {
                this.buildLib2(packageJson);
                return 0;
            }
        }
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/modules/egret/'))) {
            project.manager.copyToLibs();
        }
        service.client.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, function (cmd) { return onGotBuildCommandResult(cmd, callback); }, true);
        return DontExitCode;
    };
    Build.prototype.buildLib2 = function (packageJson) {
        var projectDir = egret.args.projectDir;
        var compiler = new Compiler.Compiler();
        var _a = compiler.parseTsconfig(projectDir, egret.args.publish), options = _a.options, fileNames = _a.fileNames;
        options.emitReflection = true;
        var outFile = options.outFile;
        if (!outFile) {
            globals.exit(1122);
        }
        compiler.compile(options, fileNames);
        var outDir = path.dirname(outFile);
        var outFileName = path.basename(outFile);
        var minFile = path.join(outDir, outFileName.replace(".js", ".min.js"));
        options.outFile = minFile;
        options.defines["DEBUG"] = false;
        options.defines["RELEASE"] = true;
        options.declaration = false;
        compiler.compile(options, fileNames);
        utils.minify(minFile, minFile);
        if (options.allowJs) {
            if (packageJson.typings) {
                FileUtil.copy(path.join(projectDir, packageJson.typings), path.join(outDir, path.basename(packageJson.typings)));
            }
            else {
                globals.log(1119);
                globals.exit(1121);
            }
        }
    };
    Build.prototype.buildLib = function (packageJson) {
        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var outDir = "bin";
        var compiler = new Compiler.Compiler();
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
            result = compiler.compile(compilerOptions, compileFiles);
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
