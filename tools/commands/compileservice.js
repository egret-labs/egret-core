/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var service = require('../service/index');
var FileUtil = require('../lib/FileUtil');
var Native = require('../actions/NativeProject');
var exmlActions = require('../actions/exml');
var state = require('../lib/DirectoryState');
var CompileProject = require('../actions/CompileProject');
var CompileTemplate = require('../actions/CompileTemplate');
var parser = require('../parser/Parser');
var AutoCompileCommand = (function () {
    function AutoCompileCommand() {
        this.exitCode = [0, 0];
        this.messages = [[], []];
        this._request = null;
        this._lastBuildTime = Date.now();
        this.sourceMapStateChanged = false;
    }
    AutoCompileCommand.prototype.execute = function () {
        var _this = this;
        this._request = service.execCommand({
            command: "init",
            path: egret.args.projectDir,
            option: egret.args
        }, function (m) { return _this.onServiceMessage(m); }, false);
        this._request.once('end', function () { return process.exit(); });
        this._request.once('close', function () { return process.exit(); });
        setInterval(function () {
            _this.sendCommand({
                command: "status",
                status: process.memoryUsage(),
                path: egret.args.projectDir,
                option: egret.args
            });
            _this.exitAfter5Minutes();
        }, 60000);
        this.dirState = new state.DirectoryState();
        this.dirState.path = egret.args.projectDir;
        this.dirState.init();
        setTimeout(function () { return _this.buildProject(); }, 20);
        return DontExitCode;
    };
    AutoCompileCommand.prototype.buildProject = function () {
        var exitCode = 0;
        var options = egret.args;
        var compileProject = new CompileProject();
        this.compileProject = compileProject;
        var _scripts = this._scripts || [];
        //预处理
        utils.clean(options.debugDir);
        exmlActions.beforeBuild();
        //编译
        var exmlresult = exmlActions.build();
        this.exitCode[0] = exmlresult.exitCode;
        this.messages[0] = exmlresult.messages;
        var result = compileProject.compileProject(options);
        //操作其他文件
        _scripts = result.files.length > 0 ? result.files : _scripts;
        CompileTemplate.modifyIndexHTML(_scripts);
        CompileTemplate.modifyNativeRequire();
        exmlActions.afterBuild();
        Native.build();
        this.dirState.init();
        this._scripts = result.files;
        this.exitCode[1] = result.exitStatus;
        this.messages[1] = result.messages;
        this.sendCommand();
        global.gc && global.gc();
        return exitCode;
    };
    AutoCompileCommand.prototype.buildChanges = function (filesChanged) {
        var _this = this;
        this._lastBuildTime = Date.now();
        if (!this.compileProject)
            return this.buildProject();
        var codes = [];
        var exmls = [];
        var others = [];
        filesChanged = filesChanged || this.dirState.checkChanges();
        filesChanged.forEach(function (f) {
            if (_this.shouldSkip(f.fileName)) {
                return;
            }
            if (/\.ts$/.test(f.fileName))
                codes.push(f);
            else if (/\.exml$/.test(f.fileName))
                exmls.push(f);
            else
                others.push(f);
        });
        if (exmls.length) {
            exmlActions.beforeBuildChanges(exmls);
        }
        var exmlTS = this.buildChangedEXML(exmls);
        this.buildChangedRes(others);
        codes = codes.concat(exmlTS);
        if (codes.length || this.sourceMapStateChanged) {
            this.sourceMapStateChanged = false;
            var result = this.buildChangedTS(codes);
            console.log("result.files:", result.files);
            if (result.files && result.files.length > 0 && this._scripts.length != result.files.length) {
                this._scripts = result.files;
                this.onTemplateIndexChanged();
            }
            this.exitCode[1] = result.exitStatus;
            this.messages[1] = result.messages;
        }
        if (exmls.length) {
            exmlActions.afterBuildChanges(exmls);
        }
        Native.build();
        this.dirState.init();
        this.sendCommand();
        global.gc && global.gc();
        return this.exitCode[0] || this.exitCode[1];
    };
    AutoCompileCommand.prototype.buildChangedTS = function (filesChanged) {
        console.log("changed ts:", filesChanged);
        return this.compileProject.compileProject(egret.args, filesChanged);
    };
    AutoCompileCommand.prototype.buildChangedEXML = function (filesChanges) {
        if (!filesChanges || filesChanges.length == 0)
            return [];
        var result = exmlActions.buildChanges(filesChanges.map(function (f) { return f.fileName; }));
        this.exitCode[0] = result.exitCode;
        this.messages[0] = result.messages;
        var exmlTS = [];
        filesChanges.forEach(function (exml) {
            var ts = exml.fileName.replace(/\.exml$/, ".g.ts");
            if (FileUtil.exists(ts))
                exmlTS.push({
                    fileName: ts,
                    type: exml.type
                });
        });
        return exmlTS;
    };
    AutoCompileCommand.prototype.buildChangedRes = function (fileNames) {
        var _this = this;
        var src = egret.args.srcDir, temp = egret.args.templateDir, proj = egret.args.larkPropertiesFile, start = "index.html";
        fileNames.forEach(function (f) {
            var fileName = f.fileName;
            if (fileName == proj) {
                _this.buildProject();
            }
            if (fileName.indexOf(src) < 0 /* && fileName.indexOf(temp) < 0*/) {
                return;
            }
            var relativePath = fileName.replace(src, '').replace(temp, '');
            var output = FileUtil.joinPath(egret.args.debugDir, relativePath);
            if (FileUtil.exists(fileName)) {
                FileUtil.copy(fileName, output);
                console.log('Copy: ', fileName, "\n  to: ", output);
            }
            else {
                FileUtil.remove(output);
                console.log('Remove: ', output);
            }
            if (fileName.indexOf(start) >= 0)
                return _this.onTemplateIndexChanged();
        });
    };
    AutoCompileCommand.prototype.onTemplateIndexChanged = function () {
        var index = FileUtil.joinPath(egret.args.templateDir, "index.html");
        index = FileUtil.escapePath(index);
        console.log('Compile Template: ' + index);
        CompileTemplate.modifyIndexHTML(this._scripts);
        CompileTemplate.modifyNativeRequire();
        return 0;
    };
    AutoCompileCommand.prototype.onServiceMessage = function (msg) {
        if (msg.command == 'build' && msg.option) {
            this.sourceMapStateChanged = msg.option.sourceMap != egret.args.sourceMap;
            var props = egret.args.properties;
            egret.args = parser.parseJSON(msg.option);
            egret.args.properties = props;
        }
        if (msg.command == 'build')
            this.buildChanges(msg.changes);
        if (msg.command == 'shutdown')
            utils.exit(0);
    };
    AutoCompileCommand.prototype.sendCommand = function (cmd) {
        if (!cmd) {
            var msg = this.messages[0].concat(this.messages[1]);
            cmd = {
                command: 'buildResult',
                exitCode: this.exitCode[0] || this.exitCode[1],
                messages: msg,
                path: egret.args.projectDir,
                option: egret.args
            };
        }
        this._request.send(cmd);
    };
    AutoCompileCommand.prototype.exitAfter5Minutes = function () {
        var now = Date.now();
        var timespan = (now - this._lastBuildTime) / 1000 / 60;
        if (timespan > 5)
            process.exit(0);
    };
    AutoCompileCommand.prototype.shouldSkip = function (file) {
        if (file.indexOf("exml.g.d.ts") >= 0)
            return true;
        return false;
    };
    return AutoCompileCommand;
})();
module.exports = AutoCompileCommand;

//# sourceMappingURL=../commands/compileservice.js.map