/// <reference path="../lib/types.d.ts" />
var utils = require("../lib/utils");
// import fileUtil = require('../lib/FileUtil');
var watch = require("../lib/watch");
var path = require("path");
var Build = require("./build");
var Server = require("../server/server");
var FileUtil = require("../lib/FileUtil");
var service = require("../service/index");
var Run = (function () {
    function Run() {
        var _this = this;
        this.serverStarted = false;
        this.initVersion = ""; //初始化的 egret 版本，如果版本变化了，关掉当前的进程
        this.onBuildFinish = function (exitCode) {
            if (_this.serverStarted)
                return;
            if (exitCode != 0) {
                process.exit(exitCode);
            }
            if (egret.args.platform == undefined || egret.args.platform == 'web') {
                utils.getAvailablePort(function (port) { return _this.onGotPort(port); }, egret.args.port);
            }
            else {
                process.exit(0);
            }
        };
    }
    Run.prototype.execute = function () {
        var build = new Build();
        build.execute(this.onBuildFinish);
        return DontExitCode;
    };
    Run.prototype.onGotPort = function (port) {
        egret.args.port = port;
        var addresses = utils.getNetworkAddress();
        if (addresses.length > 0) {
            egret.args.host = addresses[0];
        }
        this.serverStarted = true;
        var openWithBrowser = !egret.args.serverOnly;
        var server = new Server();
        var projectDir = egret.args.projectDir;
        server.use(Server.fileReader(projectDir));
        server.start(projectDir, port, this.wrapByParams(egret.args.startUrl), openWithBrowser);
        if (egret.args.serverOnly) {
            console.log("Url:" + this.wrapByParams(egret.args.startUrl));
        }
        else {
            console.log('\n');
            console.log("    " + utils.tr(10013, ''));
            console.log('\n');
            console.log('        ' + this.wrapByParams(egret.args.startUrl));
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + this.wrapByParams(egret.args.getStartURL(addresses[i])));
            }
            console.log('\n');
        }
        if (egret.args.autoCompile) {
            console.log('    ' + utils.tr(10010));
            this.watchFiles(egret.args.srcDir);
            //this.watchFiles(egret.args.templateDir);
        }
        else if (!egret.args.serverOnly) {
            console.log('    ' + utils.tr(10012));
        }
    };
    Run.prototype.watchFiles = function (dir) {
        var _this = this;
        watch.createMonitor(dir, { persistent: true, interval: 2007, filter: function (f, stat) { return !f.match(/\.g(\.d)?\.ts/); } }, function (m) {
            m.on("created", function (f) { return _this.sendBuildCMD(f, "added"); })
                .on("removed", function (f) { return _this.sendBuildCMD(f, "removed"); })
                .on("changed", function (f) { return _this.sendBuildCMD(f, "modified"); });
        });
        /*//监听build文件夹的变化
        watch.createMonitor(path.join(egret.root,'build'), { persistent: true, interval: 2007, filter: function (f, stat) {
            return true;
        } }, function (m) {
            m.on("created", (f) => this.shutDown(f, "added"))
                .on("removed", (f) => this.shutDown(f, "removed"))
                .on("changed", (f) => this.shutDown(f, "modified"));
        });*/
        watch.createMonitor(path.dirname(dir), {
            persistent: true, interval: 2007, filter: function (f, stat) {
                if (path.basename(f) == "egretProperties.json") {
                    _this.initVersion = _this.getVersion(f);
                    return true;
                }
                else {
                    return false;
                }
            }
        }, function (m) {
            m.on("created", function (f) { return _this.shutDown(f, "added"); })
                .on("removed", function (f) { return _this.shutDown(f, "removed"); })
                .on("changed", function (f) { return _this.shutDown(f, "modified"); });
        });
    };
    Run.prototype.shutDown = function (file, type) {
        file = FileUtil.escapePath(file);
        var isShutdown = false;
        if (path.basename(file) == 'egretProperties.json') {
            var nowVersion = this.getVersion(file);
            if (this.initVersion != nowVersion) {
                isShutdown = true;
            }
        }
        else {
            isShutdown = true;
        }
        if (isShutdown) {
            service.client.execCommand({
                path: egret.args.projectDir,
                command: "shutdown",
                option: egret.args
            }, function () { return process.exit(0); }, true);
        }
    };
    Run.prototype.sendBuildCMD = function (file, type) {
        file = FileUtil.escapePath(file);
        egret.args[type] = [file];
        service.client.execCommand({ command: "build", path: egret.args.projectDir, option: egret.args }, function (cmd) {
            if (!cmd.exitCode)
                console.log('    ' + utils.tr(10011));
            else
                console.log('    ' + utils.tr(10014), cmd.exitCode);
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
        });
    };
    Run.prototype.getVersion = function (filePath) {
        var jsstr = FileUtil.read(filePath);
        var js = JSON.parse(jsstr);
        return js["egret_version"];
    };
    Run.prototype.wrapByParams = function (url) {
        if (!this.__tempP) {
            this.__tempP = this.genParams();
        }
        return url + this.__tempP;
    };
    Run.prototype.genParams = function () {
        var ret = "";
        var propertyFilePath = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
        if (FileUtil.exists(propertyFilePath)) {
            var urlParams = JSON.parse(FileUtil.read(propertyFilePath)).urlParams;
            if (urlParams) {
                var hasParams = false;
                for (var key in urlParams) {
                    hasParams = true;
                    ret += key + "=" + urlParams[key] + "&";
                }
                if (hasParams) {
                    ret = "?" + ret.substr(0, ret.length - 1);
                }
            }
        }
        return ret;
    };
    return Run;
}());
module.exports = Run;
