/// <reference path="../lib/types.d.ts" />

import os = require('os');
import crypto = require('crypto');
import file = require('../lib/FileUtil');

class EgretProperties implements egret.EgretPropertiesClass {
    properties: Object = {};
    modulesConfig: Object = {};

    projectRoot:string = "";
    init(projectRoot: string) {
        this.projectRoot = projectRoot;
        this.reload();
    }

    reload() {
        this.properties = {};
        this.modulesConfig = {};
        if (file.exists(file.joinPath(this.projectRoot, "egretProperties.json"))) {
            this.properties = JSON.parse(file.read(file.joinPath(this.projectRoot, "egretProperties.json")));
            for (var key in this.properties["modules"]) {
                this.modulesConfig[this.properties["modules"][key]["name"]] = this.properties["modules"][key];
            }
            //this.modulesConfig["html5"] = { "name": "html5" };
            //this.modulesConfig["native"] = { "name": "native" };
        }

        if (this.modulesConfig["eui"] != null && this.modulesConfig["gui"] != null) {
            globals.log2(8);

            process.exit(1);
        }
    }

    /**
     * 是否有swan
     */
    hasEUI(): boolean {
        return this.modulesConfig["eui"] != null;
    }

    /**
     * 获取项目的根路径
     * @returns {*}
     */
    getProjectRoot(): string {
        return egret.args.projectDir;
    }

    /**
     * 获取项目使用的egret版本号
     * @returns {any}
     */
    getVersion(): string {
        return this.properties["egret_version"];
    }

    /**
     * 发布路径的根目录
     * @returns {string}
     */
    getReleaseRoot(): string {
        var p = "bin-release";
        if (globals.hasKeys(this.properties, ["publish", "path"])) {
            p = this.properties["publish"]["path"];
        }

        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    }

    //获得egret_file_list
    private getFileList(file_list): Array<any> {
        var js_content = file.read(file_list);
        js_content = js_content.match(/\[[^\]]*\]/)[0];
        return JSON.parse(js_content);
    }

    /**
     * 获取已经生成的js文件列表
     * @param runtime
     * @returns {string[]|T[]}
     */
    getAllFileList(runtime): Array<any> {
        var egret_file;
        var currDir = this.getProjectRoot();
        if (runtime == "html5") {
            egret_file = file.joinPath(currDir, "bin-debug/lib/egret_file_list.js");
        }
        else {
            egret_file = file.joinPath(currDir, "bin-debug/lib/egret_file_list_native.js");
        }
        var egretFileList:any = this.getFileList(egret_file).map(function (item) {
            return file.joinPath(currDir, "libs", item);
        });

        var game_file = file.joinPath(currDir, "bin-debug/src/game_file_list.js");
        var gameFileList = this.getFileList(game_file).map(function (item) {
            return file.joinPath(currDir, "bin-debug", "src", item);
        });

        return egretFileList.concat(gameFileList);
    }

    getVersionCode(runtime) {
        if (globals.hasKeys(this.properties, ["publish", "baseVersion"])) {
            return this.properties["publish"]["baseVersion"];
        }
        return 1;
    }

    getIgnorePath(): Array<any> {
        if (globals.hasKeys(this.properties, ["native", "path_ignore"])) {
            return this.properties["native"]["path_ignore"];
        }
        return [];
    }

    getNativePath(platform) {
        if (globals.hasKeys(this.properties, ["native", platform + "_path"])) {
            return file.joinPath(this.getProjectRoot(), this.properties["native"][platform + "_path"]);
        }

        return null;
    }

    getModulePath(moduleName) {
        if (this.modulesConfig[moduleName]) {
            return this.modulesConfig[moduleName]["path"] || null;
        }
        return null;
    }

    getModuleConfig(moduleName) {
        var moduleJsonPath;
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            moduleJsonPath = file.joinPath(egret.root, "tools/lib/manifest", moduleName + ".json");
        }
        else {
            moduleJsonPath = file.joinPath(egret.args.projectDir, modulePath, moduleName + ".json");
        }
        var content = file.read(moduleJsonPath);
        if (!content) {
            globals.exit(8003, moduleJsonPath);
        }

        return JSON.parse(content);
    }

    //绝对路径
    getModuleOutput(moduleName) {
        var output = this.getModuleConfig(moduleName)["output"] || moduleName;
        return file.joinPath(this.getProjectRoot(), "libs", output);
    }

    getModuleFileList(moduleName) {
        return this.getModuleConfig(moduleName)["file_list"].concat();
    }

    getModuleFileListWithAbsolutePath(moduleName) {
        var list = this.getModuleConfig(moduleName)["file_list"].concat();
        var prefix = this.getModulePrefixPath(moduleName);
        var source = this.getModuleSourcePath(moduleName);

        return list.map(function (item) {
            return file.joinPath(prefix, source, item);
        })
    }

    getModulePrefixPath(moduleName) {
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            return file.joinPath(egret.root);
        }
        else {
            return file.joinPath(this.getProjectRoot(), modulePath);
        }
    }

    getModuleSourcePath(moduleName) {
        return this.getModuleConfig(moduleName)["source"] || "";
    }

    getModuleDependenceList(moduleName) {
        return (this.getModuleConfig(moduleName)["dependence"] || []).concat();
    }

    getAllModuleNames() {
        var names = [];
        for (var key in this.properties["modules"]) {
            names.push(this.properties["modules"][key]["name"]);
            if (this.properties["modules"][key]["name"] == "core") {
                //names.push("html5");
                //names.push("native");
            }
        }

        //for (var key in this.modulesConfig) {
        //    names.push(key);
        //}
        return names;
    }

    getModuleDecouple(moduleName) {
        return this.getModuleConfig(moduleName)["decouple"] == "true" || this.getModuleConfig(moduleName)["decouple"] == true;
    }

    //获取项目需要的所有模块的.d.ts文件
    getModulesDts() {
        var libs = [];
        for (var moduleName in this.modulesConfig) {
            var moduleConfig = this.modulesConfig[moduleName];
            var output = this.getModuleOutput(moduleName);
            var dtsFile = file.joinPath(output, moduleConfig.name + ".d.ts");
            libs.push(dtsFile);
        }
        return libs;
    }

    getModuleReferenceInfo() {
        var fileList = [];
        var moduleNames = this.getAllModuleNames();
        moduleNames.map((moduleName) => {
            var file_list = this.getModuleFileList(moduleName);
            var prefix = this.getModulePrefixPath(moduleName);
            var source = this.getModuleSourcePath(moduleName);
            file_list.map(function (item) {
                var tsFile = file.joinPath(prefix, source, item);
                var ext = file.getExtension(tsFile).toLowerCase();
                if (ext == "ts" && item.indexOf(".d.ts") == -1) {
                    fileList.push(tsFile);
                }
            })
        });

        //todo
        var create_manifest = require("../../lib/tools/create_manifest.js");
        var referenceInfo = create_manifest.getModuleReferenceInfo(fileList);
        return referenceInfo;
    }

    getResourceName() {
        if (this.properties["resource"]) {
            return this.properties["resource"];
        }
        return "resource";
    }

    getPublishType(runtime:string):number {
        if (globals.hasKeys(this.properties, ["publish", runtime])) {
            return this.properties["publish"][runtime];
        }

        return 0;
    }

    getResources():Array<string> {
        if (globals.hasKeys(this.properties, ["publish", "resource"])) {
            return this.properties["publish"]["resource"];
        }

        return ["resource"];
    }
}

var config: EgretProperties = config || new EgretProperties();
export = config;