
/// <reference path="../lib/types.d.ts" />

import http = require("http");
import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import ServiceSocket = require('../service/ServiceSocket');
import FileUtil = require('../lib/FileUtil');
import Native = require('../actions/NativeProject');
import CopyFiles = require('../actions/CopyFiles');
import exmlActions = require('../actions/exml');
import state = require('../lib/DirectoryState');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import parser = require('../parser/Parser');

class AutoCompileCommand implements egret.Command {
    private compileProject: CompileProject;
    private dirState: state.DirectoryState;
    execute(): number {
        this._request = service.execCommand({
            command: "init",
            path: egret.args.projectDir,
            option: egret.args
        }, m=> this.onServiceMessage(m), false);
        this._request.once(
            'end',
            () => process.exit());
        this._request.once(
            'close',
            () => process.exit());

        setInterval(() => {
            this.sendCommand({
                command: "status",
                status: process.memoryUsage(),
                path: egret.args.projectDir,
                option: egret.args
            });
            this.exitAfter5Minutes();
        }, 60000);

        this.dirState = new state.DirectoryState();
        this.dirState.path = egret.args.projectDir;
        this.dirState.init();

        setTimeout(() => this.buildProject(), 20);

        return DontExitCode;
    }


    private exitCode: [number, number] = [0, 0];
    private messages: [string[], string[]] = [[], []];
    private _request: ServiceSocket = null;
    private _scripts: string[];
    private _lastBuildTime = Date.now();
    private sourceMapStateChanged = false;

    buildProject() {
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
    }

    buildChanges(filesChanged: egret.FileChanges) {
        this._lastBuildTime = Date.now();
        if (!this.compileProject)
            return this.buildProject();
        var codes: egret.FileChanges = [];
        var exmls: egret.FileChanges = [];
        var others: egret.FileChanges = [];

        filesChanged = filesChanged || this.dirState.checkChanges();

        filesChanged.forEach(f=> {
            if (this.shouldSkip(f.fileName)) {
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
    }

    private buildChangedTS(filesChanged: egret.FileChanges) {
        console.log("changed ts:", filesChanged);
        return this.compileProject.compileProject(egret.args, filesChanged);
    }

    private buildChangedEXML(filesChanges: egret.FileChanges): egret.FileChanges{

        if (!filesChanges || filesChanges.length == 0)
            return [];

        var result = exmlActions.buildChanges(filesChanges.map(f=> f.fileName));
        this.exitCode[0] = result.exitCode;
        this.messages[0] = result.messages;

        var exmlTS: egret.FileChanges = [];
        filesChanges.forEach(exml => {
            var ts = exml.fileName.replace(/\.exml$/, ".g.ts");
            if (FileUtil.exists(ts))
                exmlTS.push({
                    fileName: ts,
                    type: exml.type
                });
        });

        return exmlTS;
    }

    private buildChangedRes(fileNames: egret.FileChanges) {


        var src = egret.args.srcDir,
            temp = egret.args.templateDir,
            proj = egret.args.larkPropertiesFile,
            start = "index.html";


        fileNames.forEach(f => {
            var fileName = f.fileName;
            if (fileName == proj) {
                this.buildProject();
            }
            if (fileName.indexOf(src) < 0/* && fileName.indexOf(temp) < 0*/) {
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
                return this.onTemplateIndexChanged();
        });
    }


    private onTemplateIndexChanged(): number {
        var index = FileUtil.joinPath(egret.args.templateDir, "index.html");
        index = FileUtil.escapePath(index);
        console.log('Compile Template: ' + index);

        CompileTemplate.modifyIndexHTML(this._scripts);

        CompileTemplate.modifyNativeRequire();

        return 0;
    }

    private onServiceMessage(msg: egret.ServiceBuildCommand) {
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
    }

    private sendCommand(cmd?: egret.ServiceCommand) {
        if (!cmd) {
            var msg = this.messages[0].concat(this.messages[1]);
            cmd = {
                command: 'buildResult',
                exitCode: this.exitCode[0] || this.exitCode[1],
                messages: msg,
                path: egret.args.projectDir,
                option: egret.args
            }
        }
        this._request.send(cmd);
    }

    private exitAfter5Minutes() {
        var now = Date.now();
        var timespan = (now - this._lastBuildTime) / 1000 / 60;
        if (timespan > 5)
            process.exit(0);
    }

    private shouldSkip(file: string) {
        if (file.indexOf("exml.g.d.ts") >= 0)
            return true;
        return false;
    }
}

export = AutoCompileCommand;