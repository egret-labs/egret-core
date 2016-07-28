/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');
var UpgradeCommand_1_5_1 = (function () {
    function UpgradeCommand_1_5_1() {
        this.dragonbones_refactor_1_5_1 = {
            'dragonBones.geom': 'dragonBones',
            'dragonBones.events': 'dragonBones',
            'dragonBones.animation': 'dragonBones',
            'dragonBones.objects': 'dragonBones',
            'dragonBones.display': 'dragonBones',
            'dragonBones.textures': 'dragonBones',
            'dragonBones.factorys': 'dragonBones',
            'dragonBones.utils': 'dragonBones',
            'DataParser.parseSkeletonData': 'DataParser.parseDragonBonesData'
        };
    }
    UpgradeCommand_1_5_1.prototype.execute = function () {
        this.upgradeTo_1_5_1();
        return 0;
    };
    UpgradeCommand_1_5_1.prototype.upgradeTo_1_5_1 = function () {
        var extensionDir = file.joinPath(egret.args.projectDir, "src");
        var list = file.search(extensionDir, "ts");
        list.forEach(this.fixSingleTypeScriptFile151.bind(this));
    };
    UpgradeCommand_1_5_1.prototype.fixSingleTypeScriptFile151 = function (item) {
        var code_util = globals.getCodeUtil();
        var content = file.read(item);
        for (var key in this.dragonbones_refactor_1_5_1) {
            var value = this.dragonbones_refactor_1_5_1[key];
            while (content) {
                var index = code_util.getFirstVariableIndex(key, content);
                if (index == -1) {
                    break;
                }
                content = content.substring(0, index) + value + content.substring(index + key.length);
            }
        }
        file.save(item, content);
    };
    return UpgradeCommand_1_5_1;
})();
module.exports = UpgradeCommand_1_5_1;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_1_5_1.js.map