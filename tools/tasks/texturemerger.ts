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

    private tmprojects: string[] = [];

    constructor(private options: TextureMergerOptions) {
    }

    async onFile(file: File): Promise<File | null> {
        const extname = file.extname;
        if (extname == '.tmproject') {
            this.tmprojects.push(file.origin);
            return null;
        }
        else {
            return file;
        }


    }
    async onFinish(pluginContext: PluginContext): Promise<void> {

        const options = this.options;

        let texture_merger_path = await getTextureMergerPath()
        const projectRoot = egret.args.projectDir;
        const tempDir = path.join(tmpdir(), 'egret/texturemerger', Math.random().toString());
        FileUtil.createDirectory(tempDir);

        for (let tm of this.tmprojects) {
            const tmprojectFilePath = path.join(pluginContext.projectRoot, tm)//options.path;
            const tmprojectDir = path.dirname(tm);
            const filename = path.basename(tmprojectFilePath, ".tmproject");
            const jsonPath = path.join(tempDir, filename + ".json");
            const pngPath = path.join(tempDir, filename + ".png");
            try {
                // const result = await shell(texture_merger_path, ["-p", folder, "-o", jsonPath]);
                const result = await shell(texture_merger_path, ["-cp", tmprojectFilePath, "-o", tempDir]);
                const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                pluginContext.createFile(path.join(tmprojectDir, filename + ".json"), jsonBuffer);
                pluginContext.createFile(path.join(tmprojectDir, filename + ".png"), pngBuffer);
            }
            catch (e) {
                if (e.code) {
                    console.error(`TextureMerger 执行错误，错误码：${e.code}`);
                    console.error(`执行命令:${e.path} ${e.args.join(" ")}`)
                }
                else {
                    console.error(e);
                }

            }
        }
        FileUtil.remove(tempDir);

    }


}



function getTextureMergerPath() {

    const toolsList = engineData.getLauncherLibrary().getInstalledTools();
    const tm = toolsList.filter(m => {
        return m.name == "Texture Merger";
    })[0];
    if (!tm) {
        throw '请安装 Texture Merger'; //i18n
    }
    return tm.path + "/TextureMerger.exe"
}