/// <reference path="../lib/types.d.ts" />

import os = require('os');
import crypto = require('crypto');
import FileUtil = require('../lib/FileUtil');


class CompileOptions implements egret.ToolArgs {
    command: string;
    action: string;
    commands: string[];
    platform: string;
    projectDir: string;
    properties: egret.EgretPropertiesClass;

    get dirName(): string {
        return FileUtil.getFileName(this.projectDir);
    }

    get srcDir(): string {
        return FileUtil.joinPath(this.projectDir, "src/");
    }

    get libsDir(): string {
        return FileUtil.joinPath(this.projectDir, "libs/");
    }

    get larkPropertiesFile(): string {
        return FileUtil.joinPath(this.projectDir, "lark.json");
    }

    private _debugDir: string;
    get debugDir(): string {

        return this._debugDir || FileUtil.joinPath(this.projectDir, "bin-debug/");
    }
    set debugDir(value: string) {
        this._debugDir = value;
    }

    private _releaseDir: string;
    get releaseDir(): string {
        return this._releaseDir || FileUtil.joinPath(this.projectDir, "bin-release/");
    }
    set releaseDir(value: string) {
        this._releaseDir = value;
    }
    get releaseRootDir(): string {
        return FileUtil.joinPath(this.projectDir, "bin-release/");
    }


    get out(): string {
        var filename = this.publish ? FileUtil.joinPath(this.outDir, 'main.min.js') : undefined;
        return filename;
    }
    private _outDir: string = null;
    get outDir(): string {
        if (this._outDir)
            return this._outDir;
        return this.publish ? this.releaseDir : this.debugDir;
    }

    set outDir(value: string) {
        this._outDir = value;
    }

    get templateDir(): string {
        return FileUtil.joinPath(this.projectDir, "template/");
    }

    private _host: string = null;
    get host(): string {
        return this._host;
    }
    set host(value: string) {
        this._host = value;
    }
    private _port: number = NaN;
    get port(): number {
        return isNaN(this._port) ? this.getProject().port : this._port;
    }
    set port(value) {
        this._port = value;
    }
    get websocketUrl(): string {
        var url = "ws://" + (this.host || "localhost") + ':' + this.port;
        return url;
    }
    get manageUrl(): string {
        var url = "http://" + (this.host || "localhost") + ':' + this.port + '/$/';
        return url;
    }
    get startUrl(): string {
        var url = "http://" + (this.host || "localhost") + ':' + this.port + '/index.html';
        return url;
    }


    getStartURL(host: string) {

        var url = "http://" + host + ':' + this.port + '/index.html';
        return url;
    }

    
    egretVersion: string;
    publish: boolean;
    sourceMap: boolean;
    removeComments: boolean;
    esTarget: string = 'ES5';
    serverOnly: boolean;
    autoCompile: boolean;
    debug: boolean;
    fileName: string;
    modules: string[];
    platforms: string[];
    contentHeight: number;
    contentWidth: number;
    type: string;
    scaleMode: string;
    orientation: string;
    background: string;
    added: string[];
    removed: string[];
    modified: string[];
    runtime: string = "web";
    version: string;
    compile: boolean;
    password: string;
    keepEXMLTS: boolean;
    log: boolean;
    nativeTemplatePath: string;
    all: boolean;
    template: string;
    exmlGenJs:boolean;

    private _tmpDir = null;
    private _tmpProj: egret.ILarkProject;
    getTmpDir() {
        if (this._tmpDir == null) {
            var sha1 = crypto.createHash('sha1');
            sha1.update(this.projectDir);
            var folder = sha1.digest('hex');
            var systemTmp = os.tmpdir();
            var dir = FileUtil.joinPath(systemTmp, "lark/" + folder + "/");
            FileUtil.createDirectory(dir);
            this._tmpDir = dir;
        }
        return this._tmpDir;
    }

    getProject(empty = false):egret.ILarkProject {
        if (this._tmpProj == null) {
            var tmpFile = FileUtil.joinPath(this.getTmpDir(), "proj.json");
            if (empty || !FileUtil.exists(tmpFile))
                this._tmpProj = {
                    port: this._port || 3000,
                    type: this.type,
                    platforms: (this.platforms || []).map(p=> { return { name: p } }),
                    modules: (this.modules || []).map(m=> { return { name: m } }),
                    contentHeight: this.contentHeight,
                    contentWidth: this.contentWidth,
                    scaleMode: this.scaleMode,
                    orientationMode: this.orientation,
                    background: this.background
                };
            else {
                var content = FileUtil.read(tmpFile);
                this._tmpProj = JSON.parse(content);
            }
        }
        return this._tmpProj;
    }

    static parse(option: egret.ToolArgs) {
        var it = new CompileOptions();
        for (var p in option)
        {
            it[p] = option[p];
        }
        return it;
    }

    toJSON(): egret.ToolArgs {
        var options = this;
        var json: any = {};
        for (var k in this) {
            var disc = Object.getOwnPropertyDescriptor(options, k) || Object.getOwnPropertyDescriptor(CompileOptions.prototype, k);
            if (!disc)
                continue;
            if (disc.enumerable == false)
                continue;
            if (typeof disc.value == 'function')
                continue;
            json[k] = options[k]
        }
        return json;
    }
}

export = CompileOptions;