/// <reference path="../lib/types.d.ts" />

import os = require('os');
import crypto = require('crypto');
import file = require('../lib/FileUtil');
import _utils = require('../lib/utils');
import path = require("path");
import cprocess = require('child_process');

type SourceCode = {

    debug: string,
    release: string,
    platform: "web" | "native"
}

export class EgretProject {
    private egretProperties: egret.EgretProperty = {
        modules: []
    };

    private moduleConfig;

    projectRoot = "";
    init(projectRoot: string) {
        this.projectRoot = projectRoot;
        this.reload();
    }

    public invalid(report?: boolean) {
        let result = !this.egretProperties.modules ||
            this.egretProperties.modules.length == 0;
        if (result && report) {
            console.log(_utils.tr(1602));//缺少egretProperties.json
        }
        return result;
    }

    hasEUI() {
        return this.egretProperties.modules.some(m => m.name == "eui");
    }

    reload() {
        this.egretProperties = { modules: [] };
        let egretPropertiesPath = this.getFilePath("egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            this.egretProperties = JSON.parse(file.read(egretPropertiesPath));
            let useGUIorEUI = 0;
            for (let m of this.egretProperties.modules) {
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

    getFilePath(fileName: string) {
        return path.resolve(this.getProjectRoot(), fileName);
    }

    /**
     * 获取项目使用的egret版本号
     */
    getVersion() {
        return this.egretProperties.egret_version;
    }

    getReleaseRoot() {
        var p = "bin-release";
        if (globals.hasKeys(this.egretProperties, ["publish", "path"])) {
            p = this.egretProperties.publish.path;
        }

        return file.getAbsolutePath(p);
        //return file.joinPath(egret.args.projectDir, p);
    }

    getVersionCode(runtime) {
        if (globals.hasKeys(this.egretProperties, ["publish", "baseVersion"])) {
            return this.egretProperties["publish"]["baseVersion"];
        }
        return 1;
    }

    getIgnorePath(): Array<any> {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "path_ignore"])) {
            return this.egretProperties[egret.args.runtime]["path_ignore"];
        }
        return [];
    }

    getCopyExmlList(): Array<string> {
        if (globals.hasKeys(this.egretProperties, [egret.args.runtime, "copyExmlList"])) {
            return this.egretProperties[egret.args.runtime]["copyExmlList"];
        }
        return [];
    }

    getNativePath(platform) {
        if (globals.hasKeys(this.egretProperties, ["native", platform + "_path"])) {
            return path.resolve(this.getProjectRoot(), this.egretProperties.native[platform + "_path"]);
        }
        return null;
    }

    private getModulePath(m: egret.EgretPropertyModule, egretVersions: Array<egret.EgretVersion>) {
        let dir = "";
        if (m.path == null) {
            let root;
            if (m.version) {
                for (let version of egretVersions) {
                    if (version.version == m.version) {
                        root = version.path;
                    }
                }
                if (!root) {
                    globals.log(1118, m.version);
                    root = egret.root;
                }
            }
            else {
                root = egret.root;
            }
            dir = path.join(egret.root, "build", m.name);
        }
        else {
            let tempModulePath = file.getAbsolutePath(m.path);
            dir = path.join(tempModulePath, "bin", m.name);
            if (!file.exists(dir)) {
                dir = path.join(tempModulePath, "bin");
                if (!file.exists(dir)) {
                    dir = tempModulePath;
                }
            }
        }
        return dir;
    }

    getLibraryFolder() {
        return this.getFilePath('libs/modules');
    }



    getModulesConfig(platform: "web" | "native") {
        if (this.moduleConfig) {
            return this.moduleConfig;
        }
        var build = cprocess.spawnSync("egret", ["versions"], {
            encoding: "utf-8"
        });
        let versions;
        if (build && build.stdout) {
            versions = (<string><any>build.stdout).split("\n");
            //删除最后一行空格
            versions = versions.slice(0, versions.length - 1);
        }
        else {
            versions = [];
        }
        let egretVersions: Array<egret.EgretVersion> = versions.map(versionStr => {
            let egretVersion: string;
            let egretPath: string;
            const versionRegExp = /(\d+\.){2}\d+(\.\d+)?/g;
            let matchResultVersion = versionStr.match(versionRegExp);
            if (matchResultVersion && matchResultVersion.length > 0) {
                egretVersion = matchResultVersion[0];
            }
            const pathRegExp = /(?:[a-zA-Z]\:)?(?:[\\|\/][^\\|\/]+)+[\\|\/]?/g;
            let matchResult2 = versionStr.match(pathRegExp);
            if (matchResult2 && matchResult2.length > 0) {
                egretPath = path.join(matchResult2[0], '.');
            }
            return { version: egretVersion, path: egretPath };
        });
        this.moduleConfig = this.egretProperties.modules.map(m => {
            let name = m.name;
            let sourceDir = this.getModulePath(m, egretVersions);
            let targetDir = path.join(this.getLibraryFolder(), name)
            let relative = path.relative(this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !path.isAbsolute(relative)) { // source 在项目中
                targetDir = sourceDir;
            }
            targetDir = file.escapePath(path.relative(this.getProjectRoot(), targetDir)) + path.sep;
            let source = [
                file.joinPath(sourceDir, name + ".js"),
                file.joinPath(sourceDir, name + "." + platform + ".js")
            ].filter(file.exists);

            let target: SourceCode[] = source.map(s => {
                let debug = file.joinPath(targetDir, path.basename(s));
                let release = file.joinPath(targetDir, path.basename(s, '.js') + '.min.js');
                return {
                    debug,
                    release,
                    platform
                }
            });
            return { name, target, sourceDir, targetDir };
        })
        return this.moduleConfig;
    }

    getPublishType(runtime: string): number {
        if (globals.hasKeys(this.egretProperties, ["publish", runtime])) {
            return this.egretProperties["publish"][runtime];
        }

        return 0;
    }

    getResources(): string[] {
        if (globals.hasKeys(this.egretProperties, ["resources"])) {
            return this.egretProperties["resources"];
        }

        return ["resource"];
    }
}
export var utils = new EgretProject();


export type Package_JSON = {

    /**
     * 废弃属性
     */
    modules?: PACKAGE_JSON_MODULE[];

    typings: string | null;



}

export type PACKAGE_JSON_MODULE = {

    files: string[],

    name: string;

    root: string

}