var state = require('./state');
var cprocess = require('child_process');
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var Project = (function () {
    function Project() {
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
            setInterval(function () { return _this._buildPort.send({}); }, 15000);
        },
        enumerable: true,
        configurable: true
    });
    Project.prototype.init = function () {
        var stat = new state.DirectoryState();
        stat.path = this.path;
        stat.init();
        this.state = stat;
    };
    Project.prototype.fileChanged = function (socket, path, changeType) {
        var _this = this;
        if (this.pendingRequest)
            this.pendingRequest.end({ command: "build", exitCode: 0 });
        this.pendingRequest = socket;
        if (path && changeType) {
            this.initChanges();
            this.changes[changeType].push(path);
        }
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(function () { return _this.build(); }, 200);
    };
    Project.prototype.build = function () {
        this.timer = null;
        if (this.changes == null) {
            this.changes = this.state.checkChanges();
        }
        if (this.showBuildWholeProject()) {
            this.buildWholeProject();
        }
        else {
            this.buildWithExistBuildService();
        }
        this.state.init();
        this.changes = null;
    };
    Project.prototype.buildWholeProject = function () {
        var _this = this;
        this.shutdown(11);
        var egretPath = FileUtil.joinPath(utils.getEgretRoot(), 'tools/bin/egret');
        var build = cprocess.spawn(process.execPath, ['--expose-gc', egretPath, 'autocompile'], {
            detached: true,
            cwd: this.path
        });
        build.on('exit', function (code, signal) { return _this.onBuildServiceExit(code, signal); });
        this.buildProcess = build;
    };
    Project.prototype.buildWithExistBuildService = function () {
        if (!this.buildProcess) {
            this.buildWholeProject();
            return;
        }
        console.log('buildWithExistBuildService');
        console.log(this.changes);
        this.sendCommand({
            command: "build",
            changes: this.changes.added.concat(this.changes.modified).concat(this.changes.removed)
        });
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
            this.buildProcess = null;
            this.sendCommand({ command: 'shutdown' });
            if (this.buildProcess) {
                this.buildProcess.removeAllListeners('exit');
                this.buildProcess.kill();
                this.buildProcess = null;
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
        console.log("Build service exit with", code, signal);
        this.buildProcess = null;
    };
    Project.prototype.showBuildWholeProject = function () {
        var tsAddorRemove = this.changes.added.concat(this.changes.removed).filter(function (f) { return /\.ts/.test(f); });
        console.log(tsAddorRemove);
        return tsAddorRemove.length > 0;
    };
    Project.prototype.initChanges = function () {
        if (this.changes)
            return;
        this.changes = {
            added: [],
            modified: [],
            removed: []
        };
    };
    return Project;
})();
module.exports = Project;
