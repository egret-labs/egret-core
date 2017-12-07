import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";

export class SpriteSheetPlugin implements Plugin {

    constructor() {
        console.error("spritesheet plugin is not implemented now !")
    }

    async onFile(file: File): Promise<File | null> {
        return file;

    }
    onFinish(param: PluginContext): void | Promise<void> {
        generateSpriteSheet("assets/spritesheet.sheet", 'assets')
    }


}

async function generateSpriteSheet(spriteSheetFileName: string, dirname: string) {
    let texture_merger_path = await getTextureMergerPath()
    let cmd = "\"" + texture_merger_path + "\"";
    const projectRoot = egret.args.projectDir;
    let folder = path.join(projectRoot, "resource", dirname);
    let p = "\"" + folder + "\"";
    let o = "\"" + spriteSheetFileName + "\"";
    await shell(cmd, ["-p", p, "-o", o]);
}


function getTextureMergerPath() {
    return `C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe`
}