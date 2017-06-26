import os = require('os');
import crypto = require('crypto');
import file = require('../lib/FileUtil');
import _utils = require('../lib/utils');
import _path = require("path");
import cp = require('child_process');


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

type SourceCode = {

    debug: string,
    release: string,
    platform: "web" | "native"
}

export class EgretProjectData {
    private egretProperties: egret.EgretProperty = {
        modules: []
    };

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
                if (m.name == "dragonbones") {
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
        return _path.resolve(this.getProjectRoot(), fileName);
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
            return _path.resolve(this.getProjectRoot(), this.egretProperties.native[platform + "_path"]);
        }
        return null;
    }

    private getModulePath2(p: string) {
        if (!p) {
            return egret.root;
        }
        let egretLibs = getAppDataEnginesRootPath();
        let keyword = '${EGRET_APP_DATA}';
        if (p.indexOf(keyword) >= 0) {
            p = p.replace(keyword, egretLibs);
        }
        let keyword2 = '${EGRET_DEFAULT}';
        if (p.indexOf(keyword2) >= 0) {
            p = p.replace(keyword2, egret.root);
        }
        return p;

    }

    private getModulePath(m: egret.EgretPropertyModule) {
        let modulePath = this.getModulePath2(m.path)
        modulePath = file.getAbsolutePath(modulePath);
        let dir = file.searchPath([
            _path.join(modulePath, "bin", m.name),
            _path.join(modulePath, "bin"),
            _path.join(modulePath, "build", m.name),
            modulePath
        ])
        if (!dir) {
            globals.exit(1050, modulePath);
        }
        return dir;
    }

    getLibraryFolder() {
        return this.getFilePath('libs/modules');
    }

    getEgretVersionInfos() {
        var build = cp.spawnSync("egret", ["versions"], {
            encoding: "utf-8"
        });
        let versions: string[];
        if (build && build.stdout) {
            versions = build.stdout.toString().split("\n");
            //删除最后一行空格
            versions = versions.slice(0, versions.length - 1);
        }
        else {
            versions = [];
        }
        let result: egret.VersionInfo[] = versions.map(versionStr => {
            let version: string;
            let path: string;
            const versionRegExp = /(\d+\.){2}\d+(\.\d+)?/g;
            let matchResultVersion = versionStr.match(versionRegExp);
            if (matchResultVersion && matchResultVersion.length > 0) {
                version = matchResultVersion[0];
            }
            const pathRegExp = /(?:[a-zA-Z]\:)?(?:[\\|\/][^\\|\/]+)+[\\|\/]?/g;
            let matchResult2 = versionStr.match(pathRegExp);
            if (matchResult2 && matchResult2.length > 0) {
                path = _path.join(matchResult2[0], '.');
            }
            return { version, path };
        });
        return result;
    }


    @_utils.cache
    getModulesConfig(platform: "web" | "native") {

        let result = this.egretProperties.modules.map(m => {
            let name = m.name;
            let sourceDir = this.getModulePath(m);
            let targetDir = _path.join(this.getLibraryFolder(), name)
            let relative = _path.relative(this.getProjectRoot(), sourceDir);
            if (relative.indexOf("..") == -1 && !_path.isAbsolute(relative)) { // source 在项目中
                targetDir = sourceDir;
            }
            targetDir = file.escapePath(_path.relative(this.getProjectRoot(), targetDir)) + _path.sep;
            let source = [
                file.joinPath(sourceDir, name + ".js"),
                file.joinPath(sourceDir, name + "." + platform + ".js")
            ].filter(file.exists);

            let target: SourceCode[] = source.map(s => {
                let debug = file.joinPath(targetDir, _path.basename(s));
                let release = file.joinPath(targetDir, _path.basename(s, '.js') + '.min.js');
                return {
                    debug,
                    release,
                    platform
                }
            });
            return { name, target, sourceDir, targetDir };
        })
        return result;
    }

    isWasmProject(): boolean {
        let boo = false;
        this.getModulesConfig("web").forEach(m => {
            if (m.name == "egret-wasm") {
                boo = true;
            }
        });
        return boo;
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

    get useTemplate(): boolean {
        return this.egretProperties.template != undefined;
    }
}

export var data = new EgretProjectData();



function getAppDataEnginesRootPath(): string {
    var path: string;

    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            path = `${home}/Library/Application Support/Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || `${process.env.USERPROFILE}/AppData/Roaming/`;
            path = file.escapePath(`${appdata}/Egret/engine/`);
            break;
        default:
            ;
    }
    if (file.exists(path))
        return path;
    return null;
}