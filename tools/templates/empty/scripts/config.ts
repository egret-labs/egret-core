/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, IncrementCompilePlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin } from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { CustomPlugin } from './myplugin';

const config: ResourceManagerConfig = {

    configPath: 'config.res.js',

    resourceRoot: () => "resource",

    buildConfig: (params) => {



        const { target, command, projectName, version } = params;

        if (target == 'wxgame') {
            const outputDir = `../${projectName}_wxgame`;
            return {
                outputDir,
                commands: [
                    new CompilePlugin({ libraryType: "release" }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new WxgamePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }
                    ]),
                    new ManifestPlugin({ output: 'manifest.js' })
                ]
            }
        }

        if (command == 'build') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    // new EmitResConfigFilePlugin({
                    //     output: "resource/default.res.json",
                    //     typeSelector: config.typeSelector,
                    //     nameSelector: p => path.basename(p).replace(/\./gi, "_"),
                    //     groupSelector: p => "preload"
                    // }),
                    new ExmlPlugin('debug'), // 非 EUI 项目关闭此设置
                    new IncrementCompilePlugin(),
                ]
            }
        }
        else if (command == 'publish') {
            const outputDir = `bin-release/web/${version}`;
            return {
                outputDir,
                commands: [
                    new CustomPlugin(),
                    new CompilePlugin({ libraryType: "release" }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }]),
                    new ManifestPlugin({ output: "manifest.json", hash: "crc32" })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`
        }
    },

    mergeSelector: (path) => {
        if (path.indexOf("assets/bitmap/") >= 0) {
            return "assets/bitmap/sheet.sheet"
        }
        else if (path.indexOf("armature") >= 0 && path.indexOf(".json") >= 0) {
            return "assets/armature/1.zip";
        }
    },

    typeSelector: (path) => {
        const ext = path.substr(path.lastIndexOf(".") + 1);
        const typeMap = {
            "jpg": "image",
            "png": "image",
            "webp": "image",
            "json": "json",
            "fnt": "font",
            "pvr": "pvr",
            "mp3": "sound",
            "zip": "zip",
            "sheet": "sheet",
            "exml": "text"
        }
        let type = typeMap[ext];
        if (type == "json") {
            if (path.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (path.indexOf("movieclip") >= 0) {
                type = "movieclip";
            };
        }
        return type;
    }
}


export = config;
