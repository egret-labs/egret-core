import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";
import { engineData } from "../project/index";
import { tmpdir } from "os";
import * as FileUtil from '../lib/FileUtil';


type TextureMergerOptions = {

    path: string;

    output: string;

}

export class TextureMergerPlugin implements Plugin {

    constructor(private options: TextureMergerOptions) {
        console.error("spritesheet plugin is not implemented now !")
    }

    async onFile(file: File): Promise<File | null> {
        return file;

    }
    async onFinish(pluginContext: PluginContext): Promise<void> {

        async function generateSpriteSheet(spriteSheetFileName: string, dirname: string) {
            let texture_merger_path = await getTextureMergerPath()
            const projectRoot = egret.args.projectDir;

            const tempDir = path.join(tmpdir(), Math.random().toString());
            FileUtil.createDirectory(tempDir);
            const jsonPath = path.join(tempDir, "temp.json");
            const pngPath = jsonPath.replace('.json', ".png");
            let folder = path.join(projectRoot, "resource", dirname);
            try {
                await shell(texture_merger_path, ["-p", folder, "-o", jsonPath]);
                const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                pluginContext.createFile("111.json", jsonBuffer);
                pluginContext.createFile('111.png', pngBuffer);
            }
            catch (e) {
                console.log(e)
            }



        }

        // await engineData.getEgretToolsInstalledList()




        await generateSpriteSheet("C:\\Users\\18571\\Desktop\\111.json", 'assets')
    }


}



function getTextureMergerPath() {
    return "C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe"
    // return `C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe`
}