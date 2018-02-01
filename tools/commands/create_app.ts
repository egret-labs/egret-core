class CreateAppCommand implements egret.Command {

    execute(): number {
        throw '白鹭引擎5.1.2版本开始不再支持 egret create_app 命令创建 iOS / Android 工程，请在 Egret Launcher 中创建 iOS / Android 项目'
        return 1;
    }
}

export = CreateAppCommand;
