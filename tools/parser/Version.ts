/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');

var ENGINES_ROOT_PARAM = "--engines-root:"

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

    
    var enginesRootParams = process.argv.filter(a=> a.indexOf(ENGINES_ROOT_PARAM) >= 0);
    //当前引擎并不是使用一键安装包安装
    if (enginesRootParams.length == 0) {
        return result;
    }

    var enginesRoot = enginesRootParams[0].substr(ENGINES_ROOT_PARAM.length);
    enginesRoot = file.escapePath(enginesRoot);
    var targetEngineBin = `${enginesRoot}/node_modules/egret/${requestVersion}/tools/bin/egret`;
    
    //不存在指定的引擎
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