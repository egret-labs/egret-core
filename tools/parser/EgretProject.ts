/// <reference path="../lib/types.d.ts" />

import os = require('os');
import crypto = require('crypto');
import file = require('../lib/FileUtil');
import _utils = require('../lib/utils');
import path = require("path");



export class EgretProject implements egret.EgretPropertiesClass {
    properties: egret.EgretProperty = {
        modules: []
    };

    projectRoot = "";
    init(projectRoot: string) {
        this.projectRoot = projectRoot;
        this.reload();
    }

    public invalid(report?: boolean) {
        let result = !this.properties.modules ||
            this.properties.modules.length == 0;
        if (result && report) {
            console.log(_utils.tr(1602));//缺少egretProperties.json
        }
        return result;
    }

    hasEUI() {
        return this.properties.modules.some(m => m.name == "eui");
    }

    reload() {
        this.properties = { modules: [] };
        let egretPropertiesPath = file.joinPath(this.projectRoot, "egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            this.properties = JSON.parse(file.read(egretPropertiesPath));
            let useGUIorEUI = 0;
            for (let m of this.properties.modules) {
                //兼容小写
                if (m.name == "dragonbones" && !m.path) {
                    m.name = "dragonBones";
                }
                if (m.name == "gui" || m.name == "eui") {
                    useGUIorEUI++;
                }
            }
            if (useGUIorEUI >= 2) {
                globals.log2(8);
                process.exit(1);
            }
        }
    }

    /**
     * 获取项目的根路径
     */
    getProjectRoot() {
        return this.projectRoot;
    }

    public getFilePath(fileName: string) {
        return file.joinPath(this.getProjectRoot(), fileName)
    }

    /**
     * 获取项目使用的egret版本号
     * @returns {any}
     */
    getVersion(): string {
        return this.properties.egret_version;
    }

    /**
     * 发布路径的根目录
     * @returns {string}
     */
    getReleaseRoot(): string {
        var p = "bin-release";
        if (globals.hasKeys(this.properties, ["publish", "path"])) {
            p = this.properties.publish.path;
        }

        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    }

    getVersionCode(runtime) {
        if (globals.hasKeys(this.properties, ["publish", "baseVersion"])) {
            return this.properties["publish"]["baseVersion"];
        }
        return 1;
    }

    getIgnorePath(): Array<any> {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "path_ignore"])) {
            return this.properties[egret.args.runtime]["path_ignore"];
        }
        return [];
    }

    getCopyExmlList(): Array<string> {
        if (globals.hasKeys(this.properties, [egret.args.runtime, "copyExmlList"])) {
            return this.properties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    }

    getNativePath(platform) {
        if (globals.hasKeys(this.properties, ["native", platform + "_path"])) {
            return path.resolve(this.getProjectRoot(), this.properties.native[platform + "_path"]);
        }
        return null;
    }

    getModulePath(moduleName) {
        for (let m of this.properties.modules) {
            if (m.name == moduleName) {
                return m.path;
            }
        }
        return null;
    }

    private getModuleConfig(moduleName) {
        var moduleJsonPath;
        var modulePath = this.getModulePath(moduleName);
        if (modulePath == null) {
            moduleJsonPath = file.joinPath(egret.root, "tools/lib/manifest", moduleName + ".json");
        }
        else {
            moduleJsonPath = file.joinPath(this.projectRoot, modulePath, moduleName + ".json");
        }
        var content = file.read(moduleJsonPath);
        if (!content) {
            globals.exit(8003, moduleJsonPath);
        }

        return JSON.parse(content);
    }

    private getModuleSourcePath(moduleName) {
        return this.getModuleConfig(moduleName)["source"] || "";
    }


    getAllModuleNames() {
        return this.properties.modules.map(m => m.name);
    }

    getPublishType(runtime: string): number {
        if (globals.hasKeys(this.properties, ["publish", runtime])) {
            return this.properties["publish"][runtime];
        }

        return 0;
    }

    getResources(): string[] {
        if (globals.hasKeys(this.properties, ["resources"])) {
            return this.properties["resources"];
        }

        return ["resource"];
    }
}
export var utils = new EgretProject();


export type Package_JSON = {

    modules: PACKAGE_JSON_MODULE[]

}

export type PACKAGE_JSON_MODULE = {

    files: string[],

    name: string;

    root: string

}