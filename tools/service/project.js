/// <reference path="../lib/types.d.ts" />
var os = require("os");
var cprocess = require('child_process');
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var Project = (function () {
    function Project() {
        this.buildProcessOutputs = [];
    }
    Object.defineProperty(Project.prototype, "buildPort", {
        get: function () {
            return this._buildPort;
        },
        set: function (value) {
            var _this = this;
            if (this._buildPort) {
                this._buildPort.send({ command: "shutdown", path: this.path });
            }
            this._buildPort = value;
            this._buildPort.on('message', function (msg) { return _this.onBuildServiceMessage(msg); });
            this._buildPort.on('close', function (msg) {
                console.log("编译服务连接关闭:" + _this.path);
                if (_this.buildProcess) {
                    _this.buildProcess.kill('10020');
                }
                _this._buildPort = null;
            });
            setInterval(function () { return _this._buildPort && _this._buildPort.send({}); }, 15000);
        },
        enumerable: true,
        configurable: true
    });
    Project.prototype.init = function () {
    };
    Project.prototype.fileChanged = function (socket, task, path, changeType) {
        var _this = this;
        if (this.pendingRequest)
            this.pendingRequest.end({ command: "build", exitCode: 0 });
        this.pendingRequest = socket;
        if (path && changeType) {
            this.initChanges();
            this.changes.push({
                fileName: path,
                type: changeType
            });
        }
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(function () { return _this.build(); }, 200);
    };
    Project.prototype.build = function () {
        this.buildProcessOutputs.length = 0;
        this.buildWithExistBuildService();
        this.changes = null;
    };
    Project.prototype.buildWholeProject = function () {
        var _this = this;
        console.log('启动编译进程:' + this.path);
        this.shutdown(11);
        var larkPath = FileUtil.joinPath(utils.getEgretRoot(), 'tools/bin/egret');
        var params = [
            '--expose-gc',
            larkPath,
            'compileservice', this.path,
            (this.option.sourceMap ? "-sourcemap" : "")
        ];
        if (this.option && this.option.runtime) {
            params.push("--runtime", this.option.runtime);
        }
        var build = cprocess.spawn(process.execPath, params, {
            detached: true,
            cwd: os.tmpdir()
        });
        build.on('exit', function (code, signal) { return _this.onBuildServiceExit(code, signal); });
        build.stdout.setEncoding("utf-8");
        build.stderr.setEncoding("utf-8");
        var handleOutput = function (msg) {
            _this.buildProcessOutputs.push(msg);
            console.log(msg);
        };
        build.stderr.on("data", handleOutput);
        build.stdout.on("data", handleOutput);
        this.buildProcess = build;
    };
    Project.prototype.buildWithExistBuildService = function () {
        if (!egret.args.debug && (!this.buildProcess || !this._buildPort)) {
            this.buildWholeProject();
            return;
        }
        console.log("项目文件改变:");
        console.log(this.changes);
        this.sendCommand({
            command: "build",
            changes: this.changes,
            option: this.option
        });
        global.gc && global.gc();
    };
    Project.prototype.sendCommand = function (cmd) {
        //this.buildProcess.stdin.write(JSON.stringify(cmd), 'utf8');
        this.buildPort && this.buildPort.send(cmd);
        //this.buildProcess.send(cmd);
    };
    Project.prototype.shutdown = function (retry) {
        var _this = this;
        if (retry === void 0) { retry = 0; }
        if (this.pendingRequest == null || retry >= 10) {
            this.sendCommand({
                command: 'shutdown',
                option: egret.args
            });
            if (this.buildProcess) {
                this.buildProcess.removeAllListeners('exit');
                this.buildProcess.kill();
                this.buildProcess = null;
                this._buildPort = null;
            }
        }
        else {
            setTimeout(function () { return _this.shutdown(retry++); }, 5000);
        }
    };
    Project.prototype.onBuildServiceMessage = function (msg) {
        if (this.pendingRequest) {
            this.pendingRequest.send(msg);
            this.pendingRequest = null;
        }
    };
    Project.prototype.onBuildServiceExit = function (code, signal) {
        console.log("编译服务退出:", code, signal);
        this.onBuildServiceMessage({
            exitCode: 10020,
            messages: this.buildProcessOutputs,
            command: "buildResult",
            path: this.path,
            option: null
        });
        this.buildProcess = null;
        this._buildPort = null;
    };
    Project.prototype.showBuildWholeProject = function () {
        return false;
    };
    Project.prototype.initChanges = function () {
        if (this.changes)
            return;
        this.changes = [];
    };
    return Project;
})();
module.exports = Project;

//# sourceMappingURL=../service/project.js.map