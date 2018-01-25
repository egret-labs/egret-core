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
        const outputDir = `../${projectName}_bricks/PublicBrickEngineGame/Res`;
        return {
            outputDir,
            commands: [
                new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                new ManifestPlugin({ output: 'manifest.json' }),
                new BricksPlugin()
            ]
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector
}



export = config;
