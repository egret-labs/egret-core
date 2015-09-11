/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var ENGINES_ROOT_PARAM = "--engines-root:";
function check() {
    var result = {
        projectVersionMatch: false,
        toolVersionMatch: false,
        hasTargetEngine: false,
        targetEngineRoot: null
    };
    var projectVersion = egret.args.properties.getVersion();
    var requestVersion = egret.args.egretVersion || projectVersion;
    result.toolVersionMatch = egret.args.egretVersion == undefined || egret.args.egretVersion == egret.version;
    result.projectVersionMatch = projectVersion == undefined || projectVersion == egret.version;
    if (result.toolVersionMatch && result.projectVersionMatch) {
        return result;
    }
    var enginesRootParams = process.argv.filter(function (a) { return a.indexOf(ENGINES_ROOT_PARAM) >= 0; });
    if (enginesRootParams.length == 0) {
        return result;
    }
    var enginesRoot = enginesRootParams[0].substr(ENGINES_ROOT_PARAM.length);
    enginesRoot = file.escapePath(enginesRoot);
    var targetEngineBin = enginesRoot + "/node_modules/egret/" + requestVersion + "/tools/bin/egret";
    if (!file.exists(targetEngineBin)) {
        return result;
    }
    result.hasTargetEngine = true;
    result.targetEngineRoot = enginesRoot + "/node_modules/egret/" + requestVersion + "/";
    return result;
}
exports.check = check;
function execute(root) {
    //覆盖 EGRET_PATH 环境变量，兼容老版本引擎
    if (process.env.EGRET_PATH) {
        process.env.EGRET_PATH = root;
    }
    require(root + "tools/bin/egret");
}
exports.execute = execute;

//# sourceMappingURL=../parser/Version.js.map