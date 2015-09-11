/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');

var ENGINES_ROOT_PARAM = "--engines-root:"

export interface VersionCheckResult {
    /** 当前项目的引擎是否跟当前的引擎版本一致 */
    projectVersionMatch: boolean;
    
    /** 用户通过命令行参数指定的引擎是否跟当前的引擎版本一致 */
    toolVersionMatch: boolean;
    
    /** 是否已经安装了需要的引擎 */
    hasTargetEngine: boolean;
    
    /** 需要引擎的根目录 */
    targetEngineRoot: string;
}

export function check(): VersionCheckResult {

    var result: VersionCheckResult = {
        projectVersionMatch: false,
        toolVersionMatch: false,
        hasTargetEngine: false,
        targetEngineRoot: null
    }

    var projectVersion = egret.args.properties.getVersion();
    var requestVersion = egret.args.egretVersion || projectVersion;

    result.toolVersionMatch = egret.args.egretVersion == undefined || egret.args.egretVersion == egret.version;
    result.projectVersionMatch = projectVersion == undefined || projectVersion == egret.version

    if (result.toolVersionMatch && result.projectVersionMatch) {
        return result;
    }
    var enginesRootParams = process.argv.filter(a=> a.indexOf(ENGINES_ROOT_PARAM) >= 0);
    if (enginesRootParams.length == 0) {
        return result;
    }

    var enginesRoot = enginesRootParams[0].substr(ENGINES_ROOT_PARAM.length);
    enginesRoot = file.escapePath(enginesRoot);
    var targetEngineBin = `${enginesRoot}/node_modules/egret/${requestVersion}/tools/bin/egret`;
    if (!file.exists(targetEngineBin)) {
        return result;
    }

    result.hasTargetEngine = true;
    result.targetEngineRoot = `${enginesRoot}/node_modules/egret/${requestVersion}/`;
    return result;
}

export function execute(root: string) {
    //覆盖 EGRET_PATH 环境变量，兼容老版本引擎
    if (process.env.EGRET_PATH) {
        process.env.EGRET_PATH = root;
    }
    require(root +"tools/bin/egret");
}