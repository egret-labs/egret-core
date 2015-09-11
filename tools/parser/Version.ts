/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');

var ENGINES_ROOT_PARAM = "--engines-root:"

export interface VersionCheckResult {
    projectVersionMatch: boolean;
    toolVersionMatch: boolean;
    hasTargetEngine: boolean;
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
    if (process.env.EGRET_PATH) {
        process.env.EGRET_PATH = root;
    }
    require(root +"tools/bin/egret");
}