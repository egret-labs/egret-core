/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');


export interface VersionCheckResult {
    /** 当前项目使用了其他版本的引擎 */
    projectUsingOtherVersion: boolean;
    
    /** 用户通过命令行参数指定了其他版本的引擎 */
    requestOtherVersion: boolean;
    
    /** 是否已经安装了需要的引擎 */
    hasTargetEngine: boolean;
    
    /** 需要引擎的根目录 */
    targetEngineRoot: string;

    /** 需要引擎的版本 */
    targetEngineVersion: string;
}

export interface EngineVersion {
    version: string;
    root: string;
}

export function check(): VersionCheckResult {

    var result: VersionCheckResult = {
        projectUsingOtherVersion: true,
        requestOtherVersion: true,
        hasTargetEngine: false,
        targetEngineRoot: null,
        targetEngineVersion: egret.version
    }

    var projectVersion = egret.args.properties.getVersion();
    var requestVersion = egret.args.egretVersion || projectVersion;
    result.targetEngineVersion = requestVersion;

    result.requestOtherVersion = egret.args.egretVersion != undefined && egret.args.egretVersion != egret.version;
    result.projectUsingOtherVersion = projectVersion != undefined && projectVersion != egret.version

    // 项目引擎与当前引擎一致
    if (!result.requestOtherVersion && !result.projectUsingOtherVersion) {
        return result;
    }

    var targetEnginePath = getEnginesRootPath() + requestVersion;
    
    //不存在指定的引擎
    if (!file.exists(targetEnginePath)) {
        return result;
    }
    result.hasTargetEngine = true;
    result.targetEngineRoot = targetEnginePath;
    return result;
}

export function execute(root: string) {
    //覆盖 EGRET_PATH 环境变量，兼容老版本引擎
    if (process.env.EGRET_PATH) {
        process.env.EGRET_PATH = root;
    }
    require(getBin(root));
}

function getEnginesRootPath(): string {
    var path:string;
    
    switch (process.platform) {
        case 'darwin':
            var user = process.env.NAME || process.env.LOGNAME;
            if(!user)
                return null;
            path = `/Users/${user}/Library/Application Support/Egret/engine/`;
            break;
        case 'win32':
            var appdata = process.env.AppData||`${process.env.USERPROFILE}/AppData/Roaming/`;
            path = file.escapePath(`${appdata}/Egret/engine/`);
            break;
        default:
            ;
    }
    if (file.exists(path))
        return path;
    return null;
}

function getBin(versionRoot: string) {
    return file.joinPath(versionRoot , "tools/bin/egret");
}

export function getEngineVersions(): EngineVersion[] {
    var root = getEnginesRootPath();
    var versions: EngineVersion[] = []
    versions.push({
        version: egret.version,
        root: egret.root
    });

    if (!root)
        return versions;

    var versionRoots = file.getDirectoryListing(root);
    versionRoots && versionRoots.forEach(versionRoot=> {
        versionRoot = file.escapePath(versionRoot);
        var bin = getBin(versionRoot);
        var exist = file.exists(bin);

        if (exist) {
            var version = file.getFileName(versionRoot);
            versions.push({
                root: versionRoot,
                version: version
            })
        }
    });
    return versions;
}
