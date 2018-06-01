/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin } from 'built-in';
import { BricksPlugin } from './bricks/bricks';
import { CustomPlugin } from './myplugin';
import * as defaultConfig from './config';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_ios/assets/game`;
        return {
            outputDir,
            commands: [
                new CompilePlugin({ libraryType: "debug", defines: { DEBUG: false, RELEASE: true } }),
                new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                new UglifyPlugin([{
                    sources: ["main.js"],
                    target: "main.min.js"
                }]),
                new ManifestPlugin({ output: 'manifest.json' })
            ]
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
