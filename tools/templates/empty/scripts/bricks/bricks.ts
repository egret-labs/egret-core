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
        const filename = file.origin;
        if (filename == 'manifest.json') {
            const contents = file.contents.toString();
            const jsonData: ManifestConfig = JSON.parse(contents);

            let content = '';
            content += `BK.Script.loadlib("GameRes://js/promise.js");\n`;
            for (let item of jsonData.initial) {
                if (item != 'js/promise.js' && item != 'js/promise.min.js') {
                    content += `BK.Script.loadlib("GameRes://${item}");\n`
                }
                if (item == "js/egret.js" || item == 'js/egret.min.js') {
                    content += `BK.Script.loadlib("GameRes://egret.bricks.js");\n`
                }
            }
            for (let item of jsonData.game) {
                content += `BK.Script.loadlib("GameRes://${item}");\n`
            }
            file.path = file.dirname + '/manifest.js'
            file.contents = new Buffer(content);
        } else if (filename == 'main.js') {
            const content = file.contents.toString();
            let result = content.replace(/RES\.loadConfig\("resource\/default\.res\.json", "resource\/"\)/gm, 'RES.loadConfig("GameRes://resource/default.res.json", "GameRes://resource/")');
            result = result.replace(/eui\.Theme\("resource\/default\.thm\.json", _this\.stage\)/gm, 'eui.Theme("GameRes://resource/default.thm.json", _this.stage)');
            result += ";global.Main = Main;";
            file.path = file.dirname + '/main.js'
            file.contents = new Buffer(result);
        }
        return file;
    }
    async onFinish(pluginContext) {

    }
}