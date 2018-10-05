import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";
import { launcher } from "../project/index";
import { tmpdir } from "os";
import utils = require('../lib/utils');
import * as FileUtil from '../lib/FileUtil';

type TextureMergerOptions = {

    textureMergerRoot: string[];
}

type TextureMergerProjectConfig = {

    textureMergerRoot: string[];

}

export class TextureMergerPlugin implements Plugin {

    private tmprojects: string[] = [];

    private removedList: string[] = [];

    private configs: { [tmprojectFilename: string]: string[] } = {};
    /** 要打包的文件夹 */
    private resourceDirs: { [filename: string]: boolean } = {};
    constructor(private options: TextureMergerOptions) {
        for (let res of this.options.textureMergerRoot) {
            if (res.indexOf(egret.args.projectDir) > -1) {
                this.resourceDirs[path.normalize(res)] = true;
            } else {
                this.resourceDirs[path.join(egret.args.projectDir, res)] = true;
            }
        }
    }
    onStart(pluginContext: PluginContext) {
        let projectDir = pluginContext.projectRoot;
        this.tmprojects = []
        let tmprojectDirs = FileUtil.search(projectDir, 'tmproject');
        for (let tmpUrl of tmprojectDirs) {
            for (let resourceDir in this.resourceDirs) {
                if (path.normalize(tmpUrl).indexOf(resourceDir) > -1) {
                    this.tmprojects.push(tmpUrl);
                }
            }
        }
        for (let temprojectUrl of this.tmprojects) {
            let temProject = FileUtil.readJSONSync(temprojectUrl);
            const tmprojectDir = path.dirname(temprojectUrl);
            const imageFiles = temProject.files.map(f => {
                const globalPath = path.resolve(pluginContext.projectRoot, tmprojectDir, f);
                let pa = path.relative(pluginContext.projectRoot, globalPath).split("\\").join("/");
                this.removedList[pa] = true;
                return pa;
            })
            this.configs[temprojectUrl] = imageFiles;
        }
    }
    async onFile(file: File): Promise<File | null> {
        let isRes = false;
        for (let root in this.resourceDirs) {
            let fileOrigin = path.normalize(file.origin);
            //绝对路径
            if (fileOrigin.indexOf(path.join(egret.args.projectDir)) >= 0) {
                if (fileOrigin.indexOf(path.join(egret.args.projectDir, root)) >= 0) {
                    isRes = true;
                }
            }
            //相对路径
            else {
                if (path.join(egret.args.projectDir, fileOrigin).indexOf(path.normalize(root)) >= 0) {
                    isRes = true;
                }
            }
        }
        if (!isRes) {
            return file;
        }
        const extname = file.extname;
        if (this.removedList[file.origin] || extname == ".tmproject") {
            return null;
        }
        else {
            return file;
        }
    }

    async onFinish(pluginContext: PluginContext): Promise<void> {
        let texture_merger_path = await getTextureMergerPath()
        const tempDir = path.join(tmpdir(), 'egret/texturemerger', Math.random().toString());
        FileUtil.createDirectory(tempDir);
        for (let tmprojectFilePath of this.tmprojects) {
            const imageList = this.configs[tmprojectFilePath];
            await this.checkTmproject(tmprojectFilePath);
            const tmprojectDir = path.dirname(tmprojectFilePath);
            const filename = path.basename(tmprojectFilePath, ".tmproject");
            const jsonPath = path.join(tempDir, filename + ".json");
            const pngPath = path.join(tempDir, filename + ".png");
            try {
                await shell(texture_merger_path, ["-cp", tmprojectFilePath, "-o", tempDir]);
                const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                pluginContext.createFile(path.join(tmprojectDir.split(egret.args.projectDir)[1], filename + ".json"), jsonBuffer, { type: "sheet", subkeys: imageList });
                pluginContext.createFile(path.join(tmprojectDir.split(egret.args.projectDir)[1], filename + ".png"), pngBuffer);
            }
            catch (e) {
                if (e.code) {
                    console.error(utils.tr(1423, e.code));
                    console.error(utils.tr(1424, e.path, e.args.join(" ")));
                }
                else {
                    console.error(e);
                }

            }
        }
        FileUtil.remove(tempDir);

    }

    private async checkTmproject(url: string) {
        const data = FileUtil.readFileSync(url, 'utf-8');
        let tmp = JSON.parse(data);
        if (tmp["options"]["useExtension"] == 1) {
            return;
        }
        else {
            tmp["options"]["useExtension"] = 1;
            console.log(utils.tr(1425, url));
        }
        await FileUtil.writeFileAsync(url, JSON.stringify(tmp), 'utf-8')
    }
}



function getTextureMergerPath() {

    const toolsList = launcher.getLauncherLibrary().getInstalledTools();
    const tm = toolsList.filter(m => {
        return m.name == "Texture Merger";
    })[0];
    if (!tm) {
        throw utils.tr(1426);
    }
    const isUpperVersion = globals.compressVersion(tm.version, "1.7.0");
    if (isUpperVersion < 0) {
        throw utils.tr(1427);
    }
    switch (process.platform) {
        case 'darwin':
            return tm.path + "/Contents/MacOS/TextureMerger";
            break;
        case 'win32':
            return tm.path + "/TextureMerger.exe";
            break;
    }
    throw utils.tr(1428);
}