require('./npm').installDependencies(["@egret/egret-webpack-bundler"]);

import { EgretWebpackBundler, WebpackBundleOptions, WebpackDevServerOptions } from '@egret/egret-webpack-bundler';

/**
 * Webpack 插件
 * 允许在白鹭引擎中使用 webpack
 */
export class WebpackDevServerPlugin implements plugins.Command {

    constructor(private options: WebpackBundleOptions & WebpackDevServerOptions) {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    onFinish(commandContext: plugins.CommandContext) {
        return new Promise<void>((resolve, reject) => {
            const bundler = new EgretWebpackBundler(commandContext.projectRoot, commandContext.buildConfig.target);
            bundler.startDevServer(this.options)
        })
    }
}


export class WebpackBundlePlugin implements plugins.Command {

    constructor(private options: WebpackBundleOptions) {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    onFinish(commandContext: plugins.CommandContext) {

        const bundler = new EgretWebpackBundler(commandContext.projectRoot, commandContext.buildConfig.target);
        bundler.emitter = (filename, content) => {
            commandContext.createFile(filename, content);
        }
        return bundler.build(this.options);
    }
}