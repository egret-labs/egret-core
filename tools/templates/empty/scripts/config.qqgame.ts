/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin } from 'built-in';
import { QQgamePlugin } from './qqgame/qqgame';
import { CustomPlugin } from './myplugin';
import * as defaultConfig from './config';
//是否使用QQ小游戏引擎插件
const useQQPlugin: boolean = false;
let pluginList: string[] = []
const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_qqgame`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new QQgamePlugin(useQQPlugin, pluginList),
                    new ManifestPlugin({ output: 'manifest.js', qqPlugin: { use: useQQPlugin, pluginList: pluginList } })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new QQgamePlugin(useQQPlugin, pluginList),
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
                    new ManifestPlugin({ output: 'manifest.js', qqPlugin: { use: useQQPlugin, pluginList: pluginList } })
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
