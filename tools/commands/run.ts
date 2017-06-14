
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
// import fileUtil = require('../lib/FileUtil');
import watch = require("../lib/watch");
import path = require("path");
import Build = require('./build');
import Server = require('../server/server');
import FileUtil = require('../lib/FileUtil');
import service = require('../service/index');
import CompileProject = require('../actions/CompileProject');

class Run implements egret.Command {

    private serverStarted = false;
    private initVersion = "";//初始化的 egret 版本，如果版本变化了，关掉当前的进程
    execute(): number {
        var build = new Build();
        build.execute(this.onBuildFinish);
        return DontExitCode;
    }

    private onBuildFinish = (exitCode: number) => {
        if (this.serverStarted)
            return;
        if (exitCode != 0) {
            process.exit(exitCode);
        }
        if (egret.args.platform == undefined || egret.args.platform == 'web') {
            utils.getAvailablePort(port => this.onGotPort(port), egret.args.port);
        }
        else {
            process.exit(0);
        }
    }

    private onGotPort(port: number) {
        egret.args.port = port;
        var addresses = utils.getNetworkAddress();
        if (addresses.length > 0) {
            egret.args.host = addresses[0];
        }
        this.serverStarted = true;
        let openWithBrowser = !egret.args.serverOnly;
        let server = new Server();
        let projectDir = egret.args.projectDir;
        server.use(Server.fileReader(projectDir))
        server.start(projectDir, port, this.wrapByParams(egret.args.startUrl), openWithBrowser);
        if (egret.args.serverOnly) {
            console.log("Url:" + this.wrapByParams(egret.args.startUrl));
        } else {
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
    }

    private watchFiles(dir: string) {

        watch.createMonitor(dir, { persistent: true, interval: 2007, filter: (f, stat) => !f.match(/\.g(\.d)?\.ts/) }, m => {
            m.on("created", (f) => this.sendBuildCMD(f, "added"))
                .on("removed", (f) => this.sendBuildCMD(f, "removed"))
                .on("changed", (f) => this.sendBuildCMD(f, "modified"));
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
            persistent: true, interval: 2007, filter: (f, stat) => {
                if (path.basename(f) == "egretProperties.json") {
                    this.initVersion = this.getVersion(f);
                    return true;
                } else {
                    return false;
                }
            }
        }, (m) => {
            m.on("created", (f) => this.shutDown(f, "added"))
                .on("removed", (f) => this.shutDown(f, "removed"))
                .on("changed", (f) => this.shutDown(f, "modified"));
        });
    }
    private shutDown(file: string, type: string) {
        file = FileUtil.escapePath(file);
        var isShutdown = false;
        if (path.basename(file) == 'egretProperties.json') {
            var nowVersion = this.getVersion(file);
            if (this.initVersion != nowVersion) {
                isShutdown = true;
            }
        } else {
            isShutdown = true;
        }
        if (isShutdown) {
            service.client.execCommand({
                path: egret.args.projectDir,
                command: "shutdown",
                option: egret.args
            }, function () { return process.exit(0); }, true);
        }
    }
    private sendBuildCMD(file: string, type: string) {
        file = FileUtil.escapePath(file);
        egret.args[type] = [file];
        service.client.execCommand({ command: "build", path: egret.args.projectDir, option: egret.args }, (cmd: egret.ServiceCommandResult) => {
            if (!cmd.exitCode)
                console.log('    ' + utils.tr(10011));
            else
                console.log('    ' + utils.tr(10014), cmd.exitCode);
            if (cmd.messages) {
                cmd.messages.forEach(m => console.log(m));
            }
        });
    }
    private getVersion(filePath): string {
        var jsstr = FileUtil.read(filePath);
        var js = JSON.parse(jsstr);
        return js["egret_version"];
    }

    __tempP: string;
    private wrapByParams(url: string): string {
        if (!this.__tempP) {
            this.__tempP = this.genParams();
        }
        return url + this.__tempP;
    }

    private genParams(): string {
        var ret: string = "";
        var propertyFilePath = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
        if (FileUtil.exists(propertyFilePath)) {
            var urlParams = JSON.parse(FileUtil.read(propertyFilePath)).urlParams;
            if (urlParams) {
                var hasParams: boolean = false;
                for (let key in urlParams) {
                    hasParams = true;
                    ret += key + "=" + urlParams[key] + "&";
                }
                if (hasParams) {
                    ret = "?" + ret.substr(0, ret.length - 1);
                }
            }
        }
        return ret;
    }

}


export = Run;
