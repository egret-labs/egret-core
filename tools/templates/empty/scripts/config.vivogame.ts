/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, ResSplitPlugin, CleanPlugin } from 'built-in';
import { VivogamePlugin } from './vivogame/vivogame';
import * as defaultConfig from './config';

//是否使用引擎分离插件
const useVivoPlugin: boolean = true;
let pluginList: any[] = [[], [], [], [], []]
const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_vivogame/src`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["../engine/js", "../egret-library", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new VivogamePlugin(useVivoPlugin, pluginList),
                    new ManifestPlugin({ output: 'manifest.js', info: { target: 'vivogame' }, vivoPlugin: { use: useVivoPlugin, pluginList: pluginList } })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["../engine/js", "../egret-library", "resource"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new VivogamePlugin(useVivoPlugin, pluginList),
                    new UglifyPlugin([
                        // 使用 EUI 项目，要压缩皮肤文件，可以开启这个压缩配置
                        // {
                        //     sources: ["resource/default.thm.js"],
                        //     target: "default.thm.min.js"
                        // },
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }
                    ]),
                    new ManifestPlugin({ output: 'manifest.js', info: { target: 'vivogame' }, vivoPlugin: { use: useVivoPlugin, pluginList: pluginList } })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
