var CreateAppCommand = /** @class */ (function () {
    function CreateAppCommand() {
    }
    CreateAppCommand.prototype.execute = function () {
        throw '白鹭引擎5.1.2版本开始不再支持 egret create_app 命令创建 iOS / Android 工程，请在 Egret Launcher 中创建 iOS / Android 项目';
        return 1;
    };
    return CreateAppCommand;
}());
module.exports = CreateAppCommand;
