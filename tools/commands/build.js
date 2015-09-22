/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var Native = require('../actions/NativeProject');
var CopyFiles = require('../actions/CopyFiles');
var Compiler = require('../actions/Compiler');
var Build = (function () {
    function Build() {
    }
    Build.prototype.execute = function (callback) {
        callback = callback || defaultBuildCallback;
        var options = egret.args;
        var packageJson;
        if (packageJson = FileUtil.read(FileUtil.joinPath(options.projectDir, "package.json"))) {
            packageJson = JSON.parse(packageJson);
            this.buildLib(packageJson);
            return 0;
        }
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        if (FileUtil.exists(FileUtil.joinPath(options.srcDir, 'libs/egret/')) == false) {
            CopyFiles.copyLark();
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
            for (var j = 0; j < module.files.length; j++) {
                var file = module.files[j];
                if (file.indexOf(".d.ts") != -1) {
                    FileUtil.copy(FileUtil.joinPath(options.projectDir, module.root, file), FileUtil.joinPath(options.projectDir, outDir, module.name, file));
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
    if (cmd.exitCode > 10000) {
        console.log(utils.tr(cmd.exitCode));
    }
    if (egret.args.runtime == "native") {
        Native.build();
    }
    if (!cmd.exitCode && egret.args.platform) {
        setTimeout(function () { return callback(0); }, 500);
    }
    else
        callback(cmd.exitCode || 0);
}
function defaultBuildCallback(code) {
    utils.exit(code);
}
module.exports = Build;

//# sourceMappingURL=../commands/build.js.map