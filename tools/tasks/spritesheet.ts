import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";
import { engineData } from "../project/index";
import { tmpdir } from "os";
import * as FileUtil from '../lib/FileUtil';

export class SpriteSheetPlugin implements Plugin {

    constructor() {
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
            pluginContext.createFile("main2.js", new Buffer('111111'));
            // const 
            // console.log(jsonPath)

            let folder = path.join(projectRoot, "resource", dirname);
            try {
                pluginContext.createFile("main3.js", new Buffer('111111'));
                // await shell(texture_merger_path, ["-p", folder, "-o", jsonPath]);
                pluginContext.createFile("main4.js", new Buffer('111111'));
                // const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                pluginContext.createFile("main5.js", new Buffer('111111'));
                // const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                // console.log(jsonBuffer)
                pluginContext.createFile("main6.js", new Buffer('111111'));
                // pluginContext.createFile("main2.js", new Buffer('111111'));
                // param.createFile('111.png', pngBuffer);
            }
            catch (e) {
                console.log(e)
            }



        }

        // await engineData.getEgretToolsInstalledList()




        generateSpriteSheet("C:\\Users\\18571\\Desktop\\111.json", 'assets')
    }


}



function getTextureMergerPath() {
    return "C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe"
    // return `C:\\Program Files\\Egret\\TextureMerger\\TextureMerger.exe`
}