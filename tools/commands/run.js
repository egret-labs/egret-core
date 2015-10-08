/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var watch = require("../lib/watch");
var Build = require('./build');
var server = require('../server/server');
var FileUtil = require('../lib/FileUtil');
var service = require('../service/index');
var Run = (function () {
    function Run() {
        var _this = this;
        this.serverStarted = false;
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
        server.startServer(egret.args, egret.args.startUrl);
        if (egret.args.serverOnly) {
            console.log("Url:" + egret.args.startUrl);
        }
        else {
            console.log('\n');
            console.log("    " + utils.tr(10013, ''));
            console.log('\n');
            console.log('        ' + egret.args.startUrl);
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + egret.args.getStartURL(addresses[i]));
            }
            console.log('\n');
        }
        if (egret.args.autoCompile) {
            console.log('    ' + utils.tr(10010));
            this.watchFiles(egret.args.srcDir);
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
    };
    Run.prototype.sendBuildCMD = function (file, type) {
        file = FileUtil.escapePath(file);
        console.log(type, file);
        egret.args[type] = [file];
        service.execCommand({ command: "build", path: egret.args.projectDir, option: egret.args }, function (cmd) {
            if (!cmd.exitCode)
                console.log('    ' + utils.tr(10011));
            else
                console.log('    ' + utils.tr(10014), cmd.exitCode);
            if (cmd.messages) {
                cmd.messages.forEach(function (m) { return console.log(m); });
            }
        });
    };
    return Run;
})();
module.exports = Run;

//# sourceMappingURL=../commands/run.js.map