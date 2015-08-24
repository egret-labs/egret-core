/// <reference path="../lib/types.d.ts" />
var InfoCommand = (function () {
    function InfoCommand() {
    }
    InfoCommand.prototype.execute = function () {
        console.log("当前Egret版本：" + egret.manifest.version);
        console.log('Egret安装路径：' + egret.args.larkRoot);
        return 0;
    };
    return InfoCommand;
})();
module.exports = InfoCommand;
