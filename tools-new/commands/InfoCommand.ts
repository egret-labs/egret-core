/// <reference path="../lib/types.d.ts" />


class InfoCommand implements egret.Command {
    execute(): number {
        console.log("当前Egret版本：" + egret.manifest.version);
        console.log('Egret安装路径：' + egret.args.larkRoot);
        return 0;
    }
}

export = InfoCommand;