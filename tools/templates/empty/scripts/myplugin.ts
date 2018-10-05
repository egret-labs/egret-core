/**
 * 示例自定义插件，您可以查阅 http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/cmdExtensionPlugin/index.html
 * 了解如何开发一个自定义插件
 */
export class CustomPlugin implements plugins.Command {

    constructor() {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {

    }
}