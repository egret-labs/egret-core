import net = require('net');
import url = require('url');
import path = require('path');
import fs = require('fs');
import http = require('http');
import cp = require('child_process');
import os = require('os');
import events = require('events');
import ServiceSocket = require('../service/ServiceSocket');
import watch = require("../lib/watch");
import FileUtil = require("../lib/FileUtil");
import utils = require("../lib/utils");
import Server = require('../server/server');
import service = require('../service/index');

type StartServerPluginOptions = {
    target?: string;
    watch?: boolean;
    port?: number;
    serverOnly?: boolean;
}

export class StartServerPlugin {

    private projectDir: string = "";

    /**
     * 
     * @param target 
     * @param port 
     * @param serverOnly 
     */
    constructor(private options: StartServerPluginOptions) {
        if (!this.options) {
            this.options = {};
        }
        if (!this.options.target) {
            this.options.target = "web"
        }
        if (!this.options.watch) {
            this.options.watch = true;
        }
        if (!this.options.port) {
            this.options.port = 3000;
        }
        if (!this.options.serverOnly) {
            this.options.serverOnly = false;
        }
    }

    async onFile(file) {
        return file;
    }

    async onFinish(commandContext) {
        this.projectDir = commandContext.projectRoot;
        await this.execute();
    }

    async execute() {
        const target = this.options.target;
        this._params = this.genParams(this.projectDir);

        switch (target) {
            case "web":
                const _port = await utils.getAvailablePort(this.options.port);
                this.initServer(_port);
                return DontExitCode;
            case "wxgame":
                return (await runWxIde());


        }
    }
    private getStartURL(host: string, port: number) {
        var url = "http://" + host + ':' + port + '/index.html';
        return url;
    }


    private initServer(port: number) {
        var addresses = utils.getNetworkAddress();
        let startUrl = this.getStartURL(addresses[0], port);
        let serverOnly = this.options.serverOnly;
        let openWithBrowser = !serverOnly;
        let server = new Server();
        server.use(Server.fileReader(this.projectDir))

        server.start(this.projectDir, port, this.wrapByParams(startUrl), openWithBrowser);
        if (serverOnly) {
            console.log("Url:" + this.wrapByParams(startUrl));
        } else {
            console.log('\n');
            console.log("    " + utils.tr(10013, ''));
            console.log('\n');
            console.log('        ' + this.wrapByParams(startUrl));
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + this.wrapByParams(this.getStartURL(addresses[i], port)));
            }
            console.log('\n');
        }

        if (this.options.watch) {
            console.log('    ' + utils.tr(10010));
            this.watchFiles(FileUtil.joinPath(this.projectDir, "src/"));
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

    private sendBuildCMD(file: string, type: string) {
        file = FileUtil.escapePath(file);
        egret.args[type] = [file];
        service.client.execCommand({
            command: "build",
            path: this.projectDir,
            option: egret.args
        },
            (cmd: { exitCode: number; messages: string[]; }) => {
                if (!cmd.exitCode)
                    console.log('    ' + "自动编译完成.");
                else
                    console.log('    ' + "自动编译失败，请参考下面的错误信息：");
                if (cmd.messages) {
                    cmd.messages.forEach(m => console.log(m));
                }
            });
    }

    private shutDown(file: string, type: string) {
        globals.log(10022, file);
        service.client.execCommand({
            path: this.projectDir,
            command: "shutdown",
            option: egret.args
        }, function () { return process.exit(0); }, true);
    }

    private wrapByParams(url: string): string {
        return url + this._params;
    }

    private _params: string = "";
    private genParams(projectDir) {
        let result = "";
        let propertyFilePath = FileUtil.joinPath(projectDir, "egretProperties.json");
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
