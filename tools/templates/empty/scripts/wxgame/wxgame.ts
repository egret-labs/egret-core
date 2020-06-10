import * as fs from 'fs';
import * as path from 'path';
const crypto = require('crypto');
export class WxgamePlugin implements plugins.Command {
    private useWxPlugin:boolean = false;
    constructor(useWxPlugin:boolean) {
        this.useWxPlugin = useWxPlugin
    }
    md5Obj = {}
    md5(content) {
        let md5 = crypto.createHash('md5');
        return md5.update(content).digest('hex');
    }
    async onFile(file: plugins.File) {
        
        if (file.extname == '.js') {
            const filename = file.origin;
            if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                return null;
            }
            if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                let content = file.contents.toString();
                content += `;window.egret = egret;`;
                content = content.replace(/definition = __global/, "definition = window");
                this.md5Obj[path.basename(filename)] = this.md5(content)
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
                }
                if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                    content += ';window.dragonBones = dragonBones';
                }
                content = "var egret = window.egret;" + content;
                if (filename == 'main.js') {
                    content += "\n;window.Main = Main;"
                }
                this.md5Obj[path.basename(filename)] = this.md5(content)
                file.contents = new Buffer(content);
            }
        }
        return file;
    }
    async onFinish(pluginContext: plugins.CommandContext) {
        let { projectRoot, outputDir, buildConfig } = pluginContext
        //同步 index.html 配置到 game.js
        const gameJSPath = path.join(outputDir, "game.js");
        if (!fs.existsSync(gameJSPath)) {
            console.log(`${gameJSPath}不存在，请先使用 Launcher 发布微信小游戏`);
            return;
        }
        let gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
        const projectConfig = buildConfig.projectConfig;
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
        const gameJSONPath = path.join(outputDir, "game.json");
        let gameJSONContent = this.readData(gameJSONPath)
        gameJSONContent.deviceOrientation = orientation;
        if (buildConfig.command !== "publish" && gameJSONContent.plugins && gameJSONContent.plugins['egret-library']) {
            delete gameJSONContent.plugins["egret-library"]
        }
        this.writeData(gameJSONContent, gameJSONPath)

        //下面的流程是配置开启微信插件的功能
        let engineVersion = this.readData(path.join(projectRoot, "egretProperties.json")).engineVersion;
        if (!gameJSONContent.plugins) {
            gameJSONContent.plugins = {}
        }
        if(buildConfig.command == "publish" && this.useWxPlugin){
            gameJSONContent.plugins["egret-library"] = {
                "provider": "wx7e2186943221985d",
                "version": engineVersion,
                "path": "egret-library"
            }
        }else{
            gameJSONContent.plugins = {}
        }
        
        this.writeData(gameJSONContent, gameJSONPath)

        if (buildConfig.command !== "publish" || !this.useWxPlugin) {
            return
        }
        
        let libDir = path.join(outputDir, "egret-library")
        try{
            fs.mkdirSync(libDir)
        }catch(e){}
        let pluginData = { "main": "index.js" }
        this.writeData(pluginData, path.join(libDir, "plugin.json"))
        let engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween']
        let signatureData: any = {
            "provider": "wx7e2186943221985d",
            "signature": []
        }
        for (let i in engineJS) {
            let name = engineJS[i] + '.min.js'
            if (this.md5Obj[name]) {
                let jsInfo: any = {
                    "path": name,
                    "md5": this.md5Obj[name]
                }
                signatureData.signature.push(jsInfo)
            }
        }
        this.writeData(signatureData, path.join(libDir, "signature.json"))
        fs.writeFileSync(path.join(libDir, "index.js"), null);

    }

    readData(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    }
    writeData(data: object, filePath: string) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
    }
}
