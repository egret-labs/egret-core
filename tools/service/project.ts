/// <reference path="../lib/types.d.ts" />

import os = require("os");
import http = require('http');
import cprocess = require('child_process')
import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import ServiceSocket = require('./ServiceSocket');

class Project {
    path: string;
    changes: egret.FileChanges;
    timer: NodeJS.Timer;
    buildProcess: cprocess.ChildProcess;
    buildProcessOutputs: string[] = [];
    _buildPort: ServiceSocket;
    pendingRequest: ServiceSocket;
    option: egret.ToolArgs;

    set buildPort(value: ServiceSocket) {
        if (this._buildPort) {
            this._buildPort.send({ command: "shutdown", path: this.path });
        }
        this._buildPort = value;
        this._buildPort.on('message', msg => this.onBuildServiceMessage(msg));
        this._buildPort.on('close', msg => {
            console.log("编译服务连接关闭:" + this.path);
            if (this.buildProcess) {
                this.buildProcess.kill('10020');
            }
            this._buildPort = null;
        });
        setInterval(() => this._buildPort && this._buildPort.send({}), 15000);
    }

    get buildPort() {
        return this._buildPort;
    }

    init() {

    }

    fileChanged(socket: ServiceSocket, task: egret.ServiceCommand, path?: string, changeType?: string) {
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
        this.timer = <any>setTimeout(() => this.build(), 200);
    }

    build() {
        this.buildProcessOutputs.length = 0;
        this.buildWithExistBuildService();
        this.changes = null;
    }

    buildWholeProject() {
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
        var build = cprocess.spawn(process.execPath, params , {
            detached: true,
            cwd: os.tmpdir()
        });
        build.on('exit', (code, signal) => this.onBuildServiceExit(code, signal));
        build.stdout.setEncoding("utf-8");
        build.stderr.setEncoding("utf-8");
        var handleOutput = msg=> {
            this.buildProcessOutputs.push(msg);
            console.log(msg);
        };
        build.stderr.on("data", handleOutput);
        build.stdout.on("data", handleOutput);

        this.buildProcess = build;
    }

    buildWithExistBuildService() {
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
    }

    private sendCommand(cmd: egret.ServiceCommand) {
        //this.buildProcess.stdin.write(JSON.stringify(cmd), 'utf8');
        this.buildPort && this.buildPort.send(cmd);
        //this.buildProcess.send(cmd);
    }

    public shutdown(retry = 0) {
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
            setTimeout(() => this.shutdown(retry++), 5000);
        }
    }

    onBuildServiceMessage(msg: egret.ServiceCommandResult) {
        if (this.pendingRequest) {
            this.pendingRequest.send(msg);
            this.pendingRequest = null;
        }
    }

    private onBuildServiceExit(code: number, signal:string) {
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
    }

    private showBuildWholeProject() {
        return false;
    }

    private initChanges() {
        if (this.changes)
            return;
        this.changes = []
    }
}

export = Project;

















