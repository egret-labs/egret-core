
/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>


import { UglifyPlugin, IncrementCompilePlugin, CompilePlugin, ManifestPlugin, ExmlPlugin } from 'built-in';

const config: ResourceManagerConfig = {

    configPath: 'config.res.js',

    resourceRoot: () => "resource",

    buildConfig: (params) => {

        const target = params.target;
        const command = params.command;
        const projectName = params.projectName;
        const version = params.version;

        if (params.command == 'build') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    // new ExmlPlugin('debug'),
                    new IncrementCompilePlugin(),
                ]
            }
        }
        else if (params.command == 'publish') {
            const outputDir = target == "web" ? `bin-release/${version}` : `../${projectName}_${target}`;
            return {
                outputDir,
                commands: [
                    // new ExmlPlugin('default'),
                    new CompilePlugin(),
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }]),
                    new ManifestPlugin()
                    // "zip",
                    // "spritesheet",
                    // "convertFileName",
                    // "emitConfigFile",
                    // "manifest"
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
