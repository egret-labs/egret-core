
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
import * as os from 'os';
import * as parseConfig from '../actions/ParseConfig';
import * as tasks from '../tasks';
class Run implements egret.Command {

    private initVersion = "";//初始化的 egret 版本，如果版本变化了，关掉当前的进程
    async execute() {
        // 通过plugin执行run方法

        let exitCode = DontExitCode;
        try {
            exitCode = await this.runByPlugin();
        } catch (e) {
            console.log(e);
            return global.exitCode;
        }
        return DontExitCode;
        // if (exitCode == -1) {
        //     console.log("找不到 run 方法");
        //     try {
        //         exitCode = await new Build().execute();
        //     } catch (e) {
        //         console.log("build error@@@@@@@@");
        //         console.log(e);
        //         return exitCode;
        //     }
        //     const target = egret.args.target;
        //     switch (target) {
        //         case "web":
        //             const port = await utils.getAvailablePort(egret.args.port);
        //             this.initServer(port);
        //             return DontExitCode;
        //             break;
        //         case "wxgame":
        //             return (await runWxIde());
        //             break;
        //         case 'bricks':
        //             return (await runBricks());
        //             break;
        //     }
        // } else {
        //     return DontExitCode;
        // }
    }

    private async runByPlugin() {
        const res = require('../lib/resourcemanager');
        const command = "run";
        const projectRoot = egret.args.projectDir;
        tasks.run();
        const target = egret.args.target;
        const projectConfig = parseConfig.parseConfig();
        await res.build({ projectRoot, debug: true, command, target, projectConfig });
        return global.exitCode;
    }


    private initServer(port: number) {
        egret.args.port = port;
        var addresses = utils.getNetworkAddress();
        if (addresses.length > 0) {
            egret.args.host = addresses[0];
        }
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
        watch.createMonitor(path.dirname(dir), {
            persistent: true, interval: 2007, filter: (f, stat) => {
                if (path.basename(f) == "egretProperties.json" || path.basename(f) == "tsconfig.json") {
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
        globals.log(10022, file);
        service.client.execCommand({
            path: egret.args.projectDir,
            command: "shutdown",
            option: egret.args
        }, function () { return process.exit(0); }, true);
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


    private wrapByParams(url: string): string {
        return url + this.genParams();
    }

    @utils.cache
    private genParams() {
        let result = "";
        let propertyFilePath = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
        if (FileUtil.exists(propertyFilePath)) {
            let urlParams = JSON.parse(FileUtil.read(propertyFilePath)).urlParams;
            if (urlParams) {
                let hasParams = false;
                for (let key in urlParams) {
                    hasParams = true;
                    result += key + "=" + urlParams[key] + "&";
                }
                if (hasParams) {
                    result = "?" + result.substr(0, result.length - 1);
                }
            }
        }
        return result;
    }

}


export = Run;


async function runWxIde() {
    let wxPaths = [];
    switch (os.platform()) {
        case "darwin":
            const result = await utils.executeCommand("defaults read com.tencent.wechat.devtools LastRunAppBundlePath");
            if (result.stdout != '') {
                const stdout = result.stdout.replace(/\n/g, "");
                wxPaths = [FileUtil.joinPath(stdout, "/Contents/Resources/app.nw/bin/cli")];
            }
            // defaults read
            wxPaths.push("/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli");
            break;
        case "win32":
            // defaults read
            wxPaths = [
                "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat",
                "C:\\Program Files\\Tencent\\微信web开发者工具\\cli.bat"
            ];
            const iconv = require('../lib/iconv-lite');
            const encoding = 'cp936';
            const binaryEncoding = 'binary';
            const result2 = await utils.executeCommand('REG QUERY "HKLM\\SOFTWARE\\Wow6432Node\\Tencent\\微信web开发者工具"', { encoding: binaryEncoding });
            const stdout = iconv.decode(new Buffer(result2.stdout, binaryEncoding), encoding);
            if (stdout != '') {
                const stdoutArr = stdout.split("\r\n");
                let exePath: string = stdoutArr.find((path) => path.indexOf(".exe") != -1);
                exePath = exePath.split("  ").find((path) => path.indexOf(".exe") != -1);
                exePath = path.join(path.dirname(exePath), 'cli.bat');
                wxPaths.unshift(exePath);
            }
            break;
    }
    const wxpath = wxPaths.find((wxpath) => FileUtil.exists(wxpath));
    if (wxpath) {
        let projectPath = egret.args.projectDir;
        projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_wxgame");
        try {
            await utils.shell(wxpath, ["-o", projectPath, "-f", "egret"], null, true);
        }
        catch (e) {
            await utils.shell(wxpath, ["-o", projectPath], null, true);
        }
    }
    else {
        throw '请安装最新微信开发者工具'
    }
    return DontExitCode
}

async function runBricks() {
    switch (os.platform()) {
        case "darwin":
            let projectPath = egret.args.projectDir;
            projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_bricks", "PublicBrickEngineGame.xcodeproj");
            utils.open(projectPath);
            return 0;
            break;
        case "win32":
            throw '目前玩一玩仅支持 MacOS 平台开发';
            break;
    }
    return 1;
}
