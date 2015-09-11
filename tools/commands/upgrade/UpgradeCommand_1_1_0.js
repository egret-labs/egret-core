/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');
var UpgradeCommand_1_1_0 = (function () {
    function UpgradeCommand_1_1_0() {
    }
    UpgradeCommand_1_1_0.prototype.execute = function () {
        this.upgradeTo_1_1_0();
        return 0;
    };
    UpgradeCommand_1_1_0.prototype.upgradeTo_1_1_0 = function () {
        //替换 全部 html
        var projectDir = egret.args.projectDir;
        var reg1 = /<div(.|\n|\r)+\"gameDiv\"(.|\n|\r)*<canvas(.|\n|\r)+<\/canvas>[^<]*<\/div>/;
        var newDiv = '<div style="position:relative;" id="gameDiv">';
        var fileList = file.getDirectoryListing(file.joinPath(projectDir, "launcher"), true);
        for (var key in fileList) {
            var fileName = fileList[key];
            var filePath = file.joinPath(projectDir, "launcher", fileName);
            if (file.isDirectory(filePath)) {
            }
            else if (filePath.indexOf(".html") >= 0) {
                var fileContent = file.read(filePath);
                //替换Div
                var matchObj = fileContent.match(/<div[^<]*gameDiv/);
                if (matchObj == null || matchObj.index < 0) {
                    continue;
                }
                //保存副本
                file.save(file.joinPath(projectDir, "launcher", "copy_" + fileName), fileContent);
                var firstIndex = matchObj.index;
                var endIndex = firstIndex + 1;
                var lastIndex = fileContent.indexOf('</div>', endIndex);
                while (lastIndex >= 0) {
                    if (fileContent.indexOf("<div", endIndex) < lastIndex) {
                        endIndex = lastIndex;
                        lastIndex = fileContent.indexOf('</div>', endIndex + 1);
                    }
                    else {
                        endIndex = lastIndex;
                        lastIndex = -1;
                    }
                }
                fileContent = fileContent.substring(0, firstIndex) + newDiv + fileContent.substring(endIndex, fileContent.length);
                //是否存在egret_require.js
                if (fileContent.indexOf("launcher/egret_require.js") < 0) {
                    fileContent = fileContent.replace('<script src="launcher/egret_loader.js"', '<script src="launcher/egret_require.js"></script>\n<script src="launcher/egret_loader.js"');
                }
                file.save(filePath, fileContent);
            }
        }
        var loaderPath = file.joinPath(projectDir, "launcher", "egret_loader.js");
        var loaderContent = file.read(loaderPath);
        //保存副本
        file.save(file.joinPath(projectDir, "launcher", "copy_egret_loader.js"), loaderContent);
        //生成egret_loader.js样板
        var fileContent = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "egret_loader.js"));
        file.save(file.joinPath(projectDir, "launcher", "egret_loader.js"), fileContent);
        if (!file.exists(file.joinPath(projectDir, "launcher", "egret_require.js"))) {
            //生成require。js文件夹
            var reqContent = file.read(file.joinPath(egret.root, "tools", "templates", "empty", "launcher", "egret_require.js"));
            file.save(file.joinPath(projectDir, "launcher", "egret_require.js"), reqContent);
        }
        var open = globals.getOpen();
        open("https://github.com/egret-labs/egret-core/wiki/Egret_Upgrade/upgrade/index.html");
        globals.log(1703);
    };
    return UpgradeCommand_1_1_0;
})();
module.exports = UpgradeCommand_1_1_0;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_1_1_0.js.map