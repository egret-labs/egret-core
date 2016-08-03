/// <reference path="../lib/types.d.ts" />
var InternalCompile = (function () {
    function InternalCompile() {
    }
    InternalCompile.prototype.execute = function () {
        console.log("当前Egret版本：" + egret.version);
        console.log('Egret安装路径：' + egret.root);
        return 0;
    };
    return InternalCompile;
}());
module.exports = InternalCompile;
