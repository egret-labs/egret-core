
/// <reference path="../lib/types.d.ts" />

import http = require("http");
import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import exml = require('../actions/EXMLAction');
import ServiceSocket = require('../service/ServiceSocket');
import FileUtil = require('../lib/FileUtil');
import CopyFiles = require('../actions/CopyFiles');
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


    private _lastExitCode = 0;
    private _lastMessages: string[] = [];
    private _request: ServiceSocket = null;
    private _scripts: string[];
    private _lastBuildTime = Date.now();

    buildProject() {
        var exitCode = 0;
        var options = egret.args;
        utils.clean(options.debugDir);
        var compileProject = new CompileProject();
        var _scripts = this._scripts || [];
        var result = compileProject.compileProject(options);
        this.compileProject = compileProject;
        CopyFiles.copyProjectFiles();
        _scripts = result.files.length > 0 ? result.files : _scripts;
        CompileTemplate.compileTemplates(options, _scripts);
        exml.updateSetting(false);
        this._scripts = result.files;
        this._lastExitCode = result.exitStatus;
        this._lastMessages = result.messages;
        this.sendCommand();
        global.gc && global.gc();
        return exitCode;
    }

    buildChanges(filesChanged: string[]) {
        this._lastBuildTime = Date.now();
        if (!this.compileProject)
            return this.buildProject();
        var codes: string[] = [];
        var others: string[] = [];

        filesChanged.forEach(f=> {
            if (/\.ts$/.test(f))
                codes.push(f);
            else
                others.push(f);
        });
        this.buildChangedRes(others);
        if (codes.length) {
            var result = this.buildChangedTS(codes);
            if (result.files && result.files.length > 0 && this._scripts.length != result.files.length) {
                this._scripts = result.files;
                this.onTemplateIndexChanged();
            }
            this._lastExitCode = result.exitStatus;
            this._lastMessages = result.messages;
        }
        this.sendCommand();
        global.gc && global.gc();
        return this._lastExitCode;
    }

    private buildChangedTS(filesChanged: string[]) {
        filesChanged = filesChanged.map(f=> f.replace(FileUtil.escapePath(process.cwd() + "/"), ""));
        return this.compileProject.compileProject(egret.args, filesChanged);
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
            if (fileName.indexOf('.exml') >= 0)
                exml.updateSetting(false);
        });
    }


    private onTemplateIndexChanged(): number {
        var index = FileUtil.joinPath(egret.args.templateDir, "index.html");
        index = FileUtil.escapePath(index);
        console.log('Compile Template: ' + index);
        CompileTemplate.compileTemplates(egret.args, this._scripts);
        return 0;
    }

    private onEXMLChanged(): number {
        exml.updateSetting(false);
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
            var msg = this._lastMessages;
            cmd = {
                command: 'buildResult',
                exitCode: this._lastExitCode,
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