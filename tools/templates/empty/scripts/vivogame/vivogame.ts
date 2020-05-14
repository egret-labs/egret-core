import * as fs from 'fs';
import * as path from 'path';
export class VivogamePlugin implements plugins.Command {
    private useVivoPlugin: boolean = false;
    private pluginList: any[] = [[], [], [], [], []];//vivo engine plugin
    constructor(useVivoPlugin: boolean, pluginList: any[]) {
        this.useVivoPlugin = useVivoPlugin
        this.pluginList = pluginList
    }
    async onFile(file: plugins.File) {
        if (file.extname == '.js') {
            const filename = file.origin;

            if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                return null;
            }
            let jsPlugin = false;//当前的js是否为插件
            if (this.useVivoPlugin) {
                const basename = file.basename
                //vivo 小游戏引擎插件，支持下列官方库
                let engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween']
                for (let i in engineJS) {
                    let jsName = engineJS[i]
                    if (basename == jsName + ".js" || basename == jsName + ".min.js") {
                        this.pluginList[0].push(basename)
                        this.pluginList[2].push(`requirePlugin("egret-library/${basename}")`)
                        this.pluginList[3].push(`require("egret-library/${basename}")`)
                        jsPlugin = true;
                        break;
                    }
                }
            }
            this.pluginList[1].push({ jsFile: file.basename, plugin: jsPlugin })

            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content += `;window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                file.contents = new Buffer(content);
            }
            else {
                let content = file.contents.toString();
                if (
                    filename == "libs/modules/res/res.js" ||
                    filename == 'libs/modules/res/res.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                    filename == 'libs/modules/assetsmanager/assetsmanager.js'
                ) {
                    content += ";window.RES = RES;"
                }
                if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                    content += ";window.eui = eui;"
                    if (filename == "libs/modules/eui/eui.js") {
                        content = content.replace("function getRepeatedIds", "window.getRepeatedIds=function getRepeatedIds");
                        content = content.replace("function getIds", "window.getIds=function getIds");
                        content = content.replace("function toXMLString", "window.toXMLString=function toXMLString");
                        content = content.replace("function checkDeclarations", "window.checkDeclarations=function checkDeclarations");
                        content = content.replace("function getPropertyStr", "window.getPropertyStr=function getPropertyStr");
                    }
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content += ';window.dragonBones = dragonBones';
                }
                content = "var egret = window.egret;" + content;

                if (filename == 'main.js') {
                    content += "\n;window.Main = Main;"
                }
                file.contents = new Buffer(content);
            }
        }
        return file;
    }
    async onFinish(pluginContext: plugins.CommandContext) {
        //同步 index.html 配置到 game.js
        const gameJSPath = path.join(pluginContext.outputDir, "game.js");
        if (!fs.existsSync(gameJSPath)) {
            console.log(`${gameJSPath}不存在，请先使用 Launcher 发布 Vivo 小游戏`);
            return;
        }
        let gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
        const projectConfig = pluginContext.buildConfig.projectConfig;
        const optionStr =
            `entryClassName: ${projectConfig.entryClassName},\n\t\t` +
            `orientation: ${projectConfig.orientation},\n\t\t` +
            `frameRate: ${projectConfig.frameRate},\n\t\t` +
            `scaleMode: ${projectConfig.scaleMode},\n\t\t` +
            `contentWidth: ${projectConfig.contentWidth},\n\t\t` +
            `contentHeight: ${projectConfig.contentHeight},\n\t\t` +
            `showFPS: ${projectConfig.showFPS},\n\t\t` +
            `fpsStyles: ${projectConfig.fpsStyles},\n\t\t` +
            `showLog: ${projectConfig.showLog},\n\t\t` +
            `maxTouches: ${projectConfig.maxTouches},`;
        const reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        const replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        gameJSContent = gameJSContent.replace(reg, replaceStr);
        fs.writeFileSync(gameJSPath, gameJSContent);

        //修改横竖屏
        let orientation;
        if (projectConfig.orientation == '"landscape"') {
            orientation = "landscape";
        }
        else {
            orientation = "portrait";
        }
        const gameJSONPath = path.join(pluginContext.outputDir, "manifest.json");
        let gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
        gameJSONContent.deviceOrientation = orientation;
        let engineVersion = this.readData(path.join(pluginContext.projectRoot, "egretProperties.json")).engineVersion
        if (!gameJSONContent.thirdEngine) gameJSONContent.thirdEngine = {}
        gameJSONContent.thirdEngine.egret = engineVersion
        if (!gameJSONContent.plugins) {
            gameJSONContent.plugins = {}
        }
        if (this.useVivoPlugin) {
            gameJSONContent.plugins = {
                "egret-library": {
                    "provider": "",
                    "version": engineVersion,
                    "path": "egret-library"
                }
            }
        } else {
            delete gameJSONContent.plugins
        }
        fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
        let isPublish = pluginContext.buildConfig.command == "publish" ? true : false;
        let configArr: any[] = []
        for (var i = 0, len = this.pluginList[1].length; i < len; i++) {
            let { jsFile, plugin } = this.pluginList[1][i];
            if (isPublish) {
                if (jsFile == "main.js") {
                    jsFile = 'main.min.js'
                }
                // else if (jsFile == "default.thm.js") {//如果在 UglifyPlugin 里压缩了皮肤，请开启该配置
                //     jsFile = "default.thm.min.js"
                // }
            }
            if (this.useVivoPlugin && plugin) {
                configArr.push(JSON.stringify({
                    module_name: `egret-library/${jsFile}`,
                    module_path: `egret-library/${jsFile}`,
                    module_from: `egret-library/${jsFile}`,
                }, null, "\t"))
            } else {
                configArr.push(JSON.stringify({
                    module_name: `./js/${jsFile}`,
                    module_path: `./js/${jsFile}`,
                    module_from: `engine/js/${jsFile}`,
                }, null, "\t"))
            }

        }
        const replaceConfigStr = '\/\/----auto option start----\n\t\t' + configArr.toString() + '\n\t\t\/\/----auto option end----';
        const minigameConfigPath = path.join(pluginContext.outputDir, "../", "minigame.config.js");
        if (!fs.existsSync(minigameConfigPath)) {
            //5.2.28版本，vivo更新了项目结构，老项目需要升级
            fs.writeFileSync(path.join(pluginContext.outputDir, "../", "vivo更新了项目结构，请重新创建vivo小游戏项目.js"), "vivo更新了项目结构，请重新创建vivo小游戏项目");
        } else {
            let configJSContent = fs.readFileSync(minigameConfigPath, { encoding: "utf8" });
            configJSContent = configJSContent.replace(reg, replaceConfigStr);
            fs.writeFileSync(minigameConfigPath, configJSContent);
        }

        if (this.useVivoPlugin) {
            let pluginJson = { "main": "egret.js" }
            if (isPublish) pluginJson.main = "egret.min.js"
            const pluginDir = path.join(pluginContext.outputDir, "../egret-library");
            const pluginJsonPath = path.join(pluginContext.outputDir, "../egret-library", "plugin.json");
            try {
                fs.mkdirSync(pluginDir)
            } catch (e) { }
            fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson));
        }
    }
    readData(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    }
}
