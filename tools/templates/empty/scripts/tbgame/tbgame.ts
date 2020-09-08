import * as fs from 'fs';
import * as path from 'path';
export class TbgamePlugin implements plugins.Command {

    constructor() {
    }
    async onFile(file: plugins.File) {
        if (file.extname == '.js') {
            const filename = file.origin;
            if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                return null;
            }
            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content = `var global = $global;var egret_stages = [];` + content;
                content += `;$global.window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                file.contents = new Buffer(content);
            }
            else {
                let content = file.contents.toString();
                let addScript = "var global = $global; var window = $global.window;var egret = window.egret;"
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
                }
                if (filename == "libs/particle/bin/particle/particle.js" || filename == 'libs/particle/bin/particle/particle.min.js') {
                    content += ";window.particle = particle;"
                }
                if (filename == "libs/modules/game/game.js" || filename == 'libs/modules/game/game.min.js') {
                    addScript += "var navigator = window.navigator;"
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content = content.replace(`    define(["dragonBones"], function () { return dragonBones; });`, `    // define(["dragonBones"], function () { return dragonBones; });`);
                    content = content.replace(`{define(["dragonBones"],function(){return dragonBones})}`, `{/*define(["dragonBones"],function(){return dragonBones})*/}`);
                    content += ';window.dragonBones = dragonBones';
                }
                if(filename == "resource/default.thm.js"){
                    addScript += `var eui = window.eui;\nvar generateEUI = {};\n`
                    content += "\n;window.generateEUI = generateEUI;"
                }
                if (filename == 'main.js') {
                    addScript += `
var eui = window.eui;\n
var generateEUI = window.generateEUI\n
var RES = window.RES;\n
var particle = window.particle;\n
var dragonBones = window.dragonBones;\n`
                    content += "\n;window.Main = Main;"
                }
                content = addScript + content
                file.contents = new Buffer(content);
            }
        }
        return file;
    }
    async onFinish(pluginContext: plugins.CommandContext) {
        //同步 index.html 配置到 game.js
        const gameJSPath = path.join(pluginContext.outputDir, "pages/index/index.js");
        if (!fs.existsSync(gameJSPath)) {
            console.log(`${gameJSPath}不存在，请先使用 Launcher 发布淘宝小游戏`);
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
    }
}
