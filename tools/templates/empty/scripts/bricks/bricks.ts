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
        }
        return file;
    }
    async onFinish(pluginContext) {

    }
}