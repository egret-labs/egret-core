/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var fileUtil = require('../lib/FileUtil');
var watch = require("../lib/watch");
var path = require('path');
var Build = require('./build');
var server = require('../server/server');
var FileUtil = require('../lib/FileUtil');
var service = require('../service/index');
var Run = (function () {
    function Run() {
        var _this = this;
        this.serverStarted = false;
        this.initVersion = "";
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
        //watch.createMonitor(path.join(egret.root,'build'), { persistent: true, interval: 2007, filter: function (f, stat) {
        //    return true;
        //} }, function (m) {
        //    m.on("created", function (f) { return _this.shutDown(f, "added"); })
        //        .on("removed", function (f) { return _this.shutDown(f, "removed"); })
        //        .on("changed", function (f) { return _this.shutDown(f, "modified"); });
        //});
        watch.createMonitor(path.dirname(dir), { persistent: true, interval: 2007, filter: function (f, stat) {
            if(path.basename(f)=="egretProperties.json"){
                _this.initVersion = _this.getVersion(f);
                return true;
            }else{
                return false;
            }
        } }, function (m) {
            m.on("created", function (f) { return _this.shutDown(f, "added"); })
                .on("removed", function (f) { return _this.shutDown(f, "removed"); })
                .on("changed", function (f) { return _this.shutDown(f, "modified"); });
        });
    };
    Run.prototype.shutDown = function (file, type) {
        var _this = this;
        file = FileUtil.escapePath(file);
        var isShutdown = false;
        if(path.basename(file) == 'egretProperties.json'){
            var nowVersion = _this.getVersion(file);
            if(_this.initVersion != nowVersion){
                isShutdown = true;
            }
        }else{
            isShutdown = true;
        }
        if(isShutdown){
            service.execCommand({
                path: egret.args.projectDir,
                command: "shutdown",
                option: egret.args
            }, function () { return process.exit(0); }, true);
        }
    }
    Run.prototype.sendBuildCMD = function (file, type) {
        var _this = this;
        file = FileUtil.escapePath(file);
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
    Run.prototype.getVersion = function (filePath) {
        var jsstr = fileUtil.read(filePath);
        var js  = JSON.parse(jsstr);
        return js["egret_version"];
    }
    return Run;
})();
module.exports = Run;

//# sourceMappingURL=run.js.map
