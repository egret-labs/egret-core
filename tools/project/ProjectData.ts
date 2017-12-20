import os = require('os');
import crypto = require('crypto');
import file = require('../lib/FileUtil');
import _utils = require('../lib/utils');
import _path = require("path");
import cp = require('child_process');
import { cache, shell } from '../lib/utils';
import { version } from '../lib/doT';


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
    platform: egret.target.Type
}


class EgretProjectData {
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

    getVersion() {
        return this.egretProperties.egret_version || this.egretProperties.compilerVersion;
    }

    getIgnorePath(): Array<any> {
        if (globals.hasKeys(this.egretProperties, [egret.args.target, "path_ignore"])) {
            return this.egretProperties[egret.args.target]["path_ignore"];
        }
        return [];
    }

    getExmlRoots(): string[] {
        if (globals.hasKeys(this.egretProperties, ["eui", "exmlRoot"])) {
            let result = this.egretProperties.eui.exmlRoot;
            if (typeof result == "string") {
                return [_path.join(egret.args.projectDir, result)];
            }
            else {
                let temp: string[] = <string[]>this.egretProperties.eui.exmlRoot;
                return temp.reduce(function (previousValue: string[], currentValue: string) {
                    previousValue.push(_path.join(egret.args.projectDir, currentValue));
                    return previousValue;
                }, []);
            }
        }
        return [egret.args.projectDir];
    }

    getThemes(): string[] {
        if (globals.hasKeys(this.egretProperties, ["eui", "themes"])) {
            return this.egretProperties.eui.themes;
        }
        return null;
    }

    getExmlPublishPolicy(): string {
        if (globals.hasKeys(this.egretProperties, ["eui", "exmlPublishPolicy"])) {
            return this.egretProperties.eui.exmlPublishPolicy;
        }
        return "content";
    }

    getCopyExmlList(): Array<string> {
        if (globals.hasKeys(this.egretProperties, [egret.args.target, "copyExmlList"])) {
            return this.egretProperties[egret.args.target]["copyExmlList"];
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
            const engineVersion = this.egretProperties.engineVersion
            if (engineVersion) {
                const versions = engineData.getEgretToolsInstalledList();
                for (let version of versions) {
                    if (version.version == engineVersion) {
                        return version.path;
                    }
                }
                console.error(`找不到版本${engineVersion}`);
                return egret.root;
            }
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
        let name = m.name;
        if (this.isWasmProject()) {
            if (name == "egret" || name == "eui" || name == "dragonBones" || name == "game") {
                name += "-wasm";
            }
        }
        let searchPaths = [
            _path.join(modulePath, "bin", name),
            _path.join(modulePath, "bin"),
            _path.join(modulePath, "build", name),
        ];
        if (m.path) {
            searchPaths.push(modulePath)
        }
        if (this.isWasmProject()) {
            searchPaths.unshift(_path.join(modulePath, "bin-wasm"));
            searchPaths.unshift(_path.join(modulePath, "bin-wasm", name));
        }
        let dir = file.searchPath(searchPaths);
        if (!dir) {
            globals.exit(1050, name);
        }
        return dir;
    }

    getLibraryFolder() {
        return this.getFilePath('libs/modules');
    }

    @_utils.cache
    getModulesConfig(platform: egret.target.Type) {
        let result = this.egretProperties.modules.map(m => {
            let name = m.name;
            let sourceDir = this.getModulePath(m);
            let targetDir = _path.join(this.getLibraryFolder(), name);
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
        if (globals.hasKeys(this.egretProperties, ["wasm"])) {
            return true;
        }
        return false;
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

    hasModule(name: string): boolean {
        let result = false;
        this.egretProperties.modules.forEach(function (module: egret.EgretPropertyModule) {
            if (module.name == name || module.name == name) {
                result = true;
            }
        });
        return result;
    }
}


type LauncherAPI = {


    getAllEngineVersions(): any

    getInstalledTools(): { name: string, version: string, path: string }[];
}

class EngineData {

    private versions: egret.VersionInfo[] = [];


    private proxy: LauncherAPI;

    getEgretToolsInstalledList() {
        return this.versions;
    }


    getLauncherLibrary(): LauncherAPI {
        const egretjspath = file.joinPath(getEgretLauncherPath(), "egret.js");
        const m = require(egretjspath);
        const selector: LauncherAPI = m.selector;
        if (!this.proxy) {
            this.proxy = new Proxy(m.selector, {
                get: (target, p, receiver) => {
                    const result = target[p];
                    if (!result) {
                        throw `找不到 Launcher API: ${p},请升级最新的 Egret Launcher 以解决此问题`//i18n
                    }
                    return result;
                }
            });
        }
        return this.proxy;
    }

    async init() {

        const egretjs = this.getLauncherLibrary();
        const data = egretjs.getAllEngineVersions();
        for (let item in data) {
            const value = data[item];
            this.versions.push({ version: value.version, path: value.root })
        }
    }
}

function getAppDataPath() {
    var result: string;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            result = `${home}/Library/Application Support/`;//Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData || `${process.env.USERPROFILE}/AppData/Roaming/`;
            result = file.escapePath(appdata);
            break;
        default:
            ;
    }

    if (!file.exists(result)) {
        throw 'missing appdata path'
    }
    return result;
}


function getAppDataEnginesRootPath() {
    const result = file.joinPath(getAppDataPath(), "Egret/engine/");
    if (!file.exists(result)) {
        throw `找不到 ${result}，请在 Egret Launcher 中执行修复引擎`;//todo i18n
    }
    return result;
}

function getEgretLauncherPath() {
    let npmEgretPath;
    if (process.platform === 'darwin') {
        let basicPath = '/usr/local';
        if (!file.existsSync(basicPath)) {//some mac doesn't have path '/usr/local'
            basicPath = '/usr';
        }
        npmEgretPath = file.joinPath(basicPath, 'lib/node_modules/egret/EgretEngine');
    }
    else {
        npmEgretPath = file.joinPath(getAppDataPath(), 'npm/node_modules/egret/EgretEngine');

    }
    if (!file.exists(npmEgretPath)) {
        throw `找不到  ${npmEgretPath}，请在 Egret Launcher 中执行修复引擎`;//todo i18n
    }
    const launcherPath = file.joinPath(file.read(npmEgretPath), "../");
    return launcherPath;

}

export var projectData = new EgretProjectData();

export var engineData = new EngineData();

