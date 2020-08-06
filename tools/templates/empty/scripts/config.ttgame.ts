/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, CleanPlugin } from 'built-in';
import { TtgamePlugin } from './ttgame/ttgame';
import { CustomPlugin } from './myplugin';
import { WebpackBundlePlugin } from './plugins/webpack-plugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_ttgame`;
        if (command == 'build') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    // new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new WebpackBundlePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),//新的 Webpack 编译器
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new TtgamePlugin(),
                    new ManifestPlugin({ output: 'manifest.js' })
                ]
            }
        }
        else if (command == 'publish') {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    // new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new WebpackBundlePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),//新的 Webpack 编译器
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new TtgamePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }
                    ]),
                    new ManifestPlugin({ output: 'manifest.js' })
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
