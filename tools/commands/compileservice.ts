
/// <reference path="../lib/types.d.ts" />

import http = require("http");
import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import ServiceSocket = require('../service/ServiceSocket');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
import exmlActions = require('../actions/exml');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');
import parser = require('../parser/Parser');

class AutoCompileCommand implements egret.Command {
    private compileProject: CompileProject;

    execute(): number {
        this._request = service.execCommand({
            command: "init",
            path: egret.args.projectDir,
            option: egret.args
        }, m=> this.onServiceMessage(m), false);
        this._request.once('end', () => process.exit());
        this._request.once('close', () => process.exit());

        setInterval(() => {
            this.sendCommand({
                command: "status",
                status: process.memoryUsage(),
                path: egret.args.projectDir,
                option: egret.args
            });
            this.exitAfter5Minutes();
        }, 60000);

        setTimeout(() => this.buildProject(), 20);

        return DontExitCode;
    }


    private exitCode: [number, number] = [0, 0];
    private messages: [string[], string[]] = [[], []];
    private _request: ServiceSocket = null;
    private _scripts: string[];
    private _lastBuildTime = Date.now();

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
        CopyFiles.copyProjectFiles();
        _scripts = result.files.length > 0 ? result.files : _scripts;
        CompileTemplate.compileTemplates(options, _scripts);
        exmlActions.afterBuild();


        this._scripts = result.files;
        this.exitCode[1] = result.exitStatus;
        this.messages[1] = result.messages;
        this.sendCommand();
        global.gc && global.gc();
        return exitCode;
    }

    buildChanges(filesChanged: string[]) {
        this._lastBuildTime = Date.now();
        if (!this.compileProject)
            return this.buildProject();
        var codes: string[] = [];
        var exmls: string[] = [];
        var others: string[] = [];
        

        filesChanged.forEach(f=> {
            if (/\.ts$/.test(f))
                codes.push(f);
            else if (/\.exml$/.test(f))
                exmls.push(f);
            else
                others.push(f);
        });
        var exmlTS = this.buildChangedEXML(exmls);
        this.buildChangedRes(others);
        codes = codes.concat(exmlTS);
        if (codes.length) {
            var result = this.buildChangedTS(codes);
            if (result.files && result.files.length > 0 && this._scripts.length != result.files.length) {
                this._scripts = result.files;
                this.onTemplateIndexChanged();
            }
            this.exitCode[1] = result.exitStatus;
            this.messages[1] = result.messages;
            
        }
        if (exmls.length) {
            exmlActions.afterBuild();
        }
        this.sendCommand();
        global.gc && global.gc();
        return this.exitCode[0] || this.exitCode[1];
    }

    private buildChangedTS(filesChanged: string[]) {
        filesChanged = filesChanged.map(f=> f.replace(FileUtil.escapePath(process.cwd() + "/"), ""));
        return this.compileProject.compileProject(egret.args, filesChanged);
    }

    private buildChangedEXML(filesChanges: string[]): string[]{

        if (!filesChanges || filesChanges.length == 0)
            return [];

        var result = exmlActions.buildChanges(filesChanges);
        this.exitCode[0] = result.exitCode;
        this.messages[0] = result.messages;

        var exmlTS: string[] = [];
        filesChanges.forEach(exml => {
            var ts = exml.replace(/\.exml$/, ".ts");
            if (FileUtil.exists(ts))
                exmlTS.push(ts);
        });

        return exmlTS;
    }

    private buildChangedRes(fileNames: string[]) {


        var src = egret.args.srcDir,
            temp = egret.args.templateDir,
            proj = egret.args.larkPropertiesFile,
            start = "index.html";


        fileNames.forEach(fileName => {
            if (fileName == proj) {
                this.buildProject();
            }
            if (fileName.indexOf(src) < 0 && fileName.indexOf(temp) < 0) {
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
        CompileTemplate.compileTemplates(egret.args, this._scripts);
        return 0;
    }

    private onServiceMessage(msg: egret.ServiceBuildCommand) {
        console.log(msg);
        if (msg.command == 'build' && msg.option)
            egret.args = parser.parseJSON(msg.option);
        if (msg.command == 'build')
            this.buildChanges(msg.changes);
        if (msg.command == 'shutdown')
            process.exit(0);
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

}

export = AutoCompileCommand;