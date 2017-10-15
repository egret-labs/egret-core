
/// 阅读 config.d.ts 查看文档
///<reference path="config.d.ts"/>

const config: ResourceManagerConfig = {

    configPath: 'config.res.js',

    resourceRoot: () => "resource",

    userConfigs: {

        build: {
            outputDir: "resource",

            plugin: [
                "emitConfigFile"
            ]
        },

        publish: {

            outputDir: "bin-release",

            plugin: [
                "zip",
                "spritesheet",
                "convertFileName",
                "emitConfigFile",
                "html"
            ]
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
            "mergeJson": "mergeJson",
            "sheet": "sheet"
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
