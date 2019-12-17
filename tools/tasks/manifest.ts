
import * as path from 'path';
import * as fs from 'fs';
import { Plugin, File } from './index';
const manifest = {
    initial: [],
    game: [],
    // configURL: ""
}



type ManifestPluginOptions = {

    output: string,

    verbose?: boolean

    hash?: "crc32"

    info?: any

    useWxPlugin?: boolean  //use wechat engine plugin

    qqPlugin?: { use: boolean, pluginList: string[] } //use QQgame engine plugin
}

export class ManifestPlugin {

    private verboseInfo: { filename: string, new_file_path: string }[] = [];

    constructor(private options: ManifestPluginOptions) {
        if (!this.options) {
            this.options = { output: "manifest.json" }
        }

        if (options.hash) {
            console.log('ManifestPlugin 在未来的 5.3.x 版本中将不再支持 hash 参数，请使用 RenamePlugin 代替')
        }
        if (!this.options.useWxPlugin) {
            this.options.useWxPlugin = false;
        }
        if (!this.options.qqPlugin) {
            this.options.qqPlugin = { use: false, pluginList: [] };
        }
    }

    async onFile(file: File) {
        const filename = file.relative;
        const extname = path.extname(filename);
        if (extname == ".js") {
            let new_file_path;
            const basename = path.basename(filename);
            let { useWxPlugin, hash, verbose } = this.options;
            let new_basename = basename.substr(0, basename.length - file.extname.length)
            let isEngineJS = false;
            if (useWxPlugin) {
                //use the egret engine inside wechat
                let engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween']
                for (let i in engineJS) {
                    let jsName = engineJS[i]
                    let engine_path = jsName + '.min.js'
                    if (filename.indexOf(engine_path) > 0) {
                        isEngineJS = true;
                        break;
                    }
                }
            }
            if (isEngineJS) {
                new_file_path = "egret-library/" + new_basename + file.extname;
            } else if (hash == 'crc32') {
                const crc32 = globals.getCrc32();
                const crc32_file_path = crc32(file.contents);
                new_file_path = "js/" + new_basename + "_" + crc32_file_path + file.extname;
            } else {
                new_file_path = "js/" + new_basename + file.extname;
            }
            file.outputDir = "";
            file.path = path.join(file.base, new_file_path);
            if (this.options.info && this.options.info.target == 'vivogame') {
                file.path = path.join(file.base, '../', 'engine', new_file_path);
            }
            const relative = file.relative.split("\\").join('/');

            if (file.origin.indexOf('libs/') >= 0) {
                manifest.initial.push(relative);
            }
            else {
                manifest.game.push(relative);
            }
            if (verbose) {
                this.verboseInfo.push({ filename, new_file_path })
            }
        }
        return file;
    }
    async onFinish(pluginContext) {
        let { output, useWxPlugin, qqPlugin } = this.options
        const extname = path.extname(output);
        let contents = '';
        let target = pluginContext.buildConfig.target
        switch (extname) {
            case ".json":
                contents = JSON.stringify(manifest, null, '\t');
                break;
            case ".js":
                contents = manifest.initial.concat(manifest.game).map((fileName) => {
                    let result = `require("./${fileName}")`
                    if (target == 'vivogame') {
                        let configPath = path.join(pluginContext.outputDir, "../", "minigame.config.js")
                        if (!fs.existsSync(configPath)) {
                            //5.2.28版本，vivo更新了项目结构，老项目需要升级
                            fs.writeFileSync(path.join(pluginContext.outputDir, "../", "vivo更新了项目结构，请重新创建vivo小游戏项目.js"), "vivo更新了项目结构，请重新创建vivo小游戏项目");
                        }
                        let _name = path.basename(fileName)
                        result = `require("./js/${_name}")`
                    } else if (useWxPlugin) {
                        if (fileName.indexOf('egret-library') == 0) {
                            result = `requirePlugin("${fileName}")`
                        }
                    }
                    return result;
                }).join("\n")
                break;
        }
        if (qqPlugin.use) {
            contents = qqPlugin.pluginList.join("\n") + "\n" + contents;
        }
        pluginContext.createFile(output, new Buffer(contents));


        if (this.options.verbose) {
            this.verboseInfo.forEach((item) => {
                console.log(`manifest-plugin: ${item.filename} => ${item.new_file_path}`)
            });
        }
    }

}
