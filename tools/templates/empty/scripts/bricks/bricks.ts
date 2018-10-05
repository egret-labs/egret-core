import * as fs from 'fs';
import * as path from 'path';


type ManifestConfig = {

    initial: string[],

    game: string[]

}

export class BricksPlugin implements plugins.Command {

    constructor() {
    }
    async onFile(file: plugins.File) {
        const filename = file.basename;
        if (filename == 'manifest.json') {
            const contents = file.contents.toString();
            const jsonData: ManifestConfig = JSON.parse(contents);

            let content = '';
            content += `BK.Script.loadlib("GameRes://js/promise.js");\n`;
            for (let item of jsonData.initial) {
                if (item != 'js/promise.js' && item != 'js/promise.min.js') {
                    content += `BK.Script.loadlib("GameRes://${item}");\n`
                }
            }
            for (let item of jsonData.game) {
                content += `BK.Script.loadlib("GameRes://${item}");\n`
            }
            content += `BK.Script.loadlib("GameRes://egret.bricks.js");\n`
            file.path = file.dirname + '/manifest.js'
            file.contents = new Buffer(content);
        } else if (filename == 'main.js') {
            const content = file.contents.toString();
            let result = content.replace(/RES\.loadConfig\("resource\/default\.res\.json", "resource\/"\)/gm, 'RES.loadConfig("GameRes://resource/default.res.json", "GameRes://resource/")');
            result = result.replace(/eui\.Theme\("resource\/default\.thm\.json", _this\.stage\)/gm, 'eui.Theme("GameRes://resource/default.thm.json", _this.stage)');
            result += ";global.Main = Main;";
            file.path = file.dirname + '/main.js'
            file.contents = new Buffer(result);
        } else if (filename == 'promise.js') {
            return null;
        }
        return file;
    }
    async onFinish(pluginContext: plugins.CommandContext) {
        //同步index.html 配置到main.js
        let mainJSPath = path.join(pluginContext.outputDir, 'main.js');
        let mainJSContent = fs.readFileSync(mainJSPath, { encoding: "utf8" });
        let projectConfig = pluginContext.buildConfig.projectConfig;

        mainJSContent = mainJSContent.replace(/frameRate: 30/gm, `frameRate: ${projectConfig.frameRate}`);
        mainJSContent = mainJSContent.replace(/contentWidth: 640/gm, `contentWidth: ${projectConfig.contentWidth}`);
        mainJSContent = mainJSContent.replace(/contentHeight: 1136/gm, `contentHeight: ${projectConfig.contentHeight}`);
        mainJSContent = mainJSContent.replace(/entryClassName: "Main"/gm, `entryClassName: ${projectConfig.entryClassName}`);
        mainJSContent = mainJSContent.replace(/scaleMode: "showAll"/gm, `scaleMode: ${projectConfig.scaleMode}`);
        mainJSContent = mainJSContent.replace(/orientation: "auto"/gm, `orientation: ${projectConfig.orientation}`);
        fs.writeFileSync(mainJSPath, mainJSContent);
    }
}

declare var egret;