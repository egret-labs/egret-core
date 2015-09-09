/// <reference path="../lib/types.d.ts" />
var info = (function () {
    function info() {
    }
    info.prototype.execute = function () {
        console.log("当前Egret版本：" + egret.manifest.version);
        console.log('Egret安装路径：' + egret.args.larkRoot);
        return 0;
    };
    return info;
})();
module.exports = info;

//# sourceMappingURL=../commands/info.js.map