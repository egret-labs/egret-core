/// <reference path="../lib/types.d.ts" />


class info implements egret.Command {
    execute(): number {
        console.log("当前Egret版本：" + egret.version);
        console.log('Egret安装路径：' + egret.root);
        return 0;
    }
}

export = info;