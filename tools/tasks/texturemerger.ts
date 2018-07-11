import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";
import { launcher } from "../project/index";
import { tmpdir } from "os";
import * as FileUtil from '../lib/FileUtil';

type TextureMergerOptions = {
    textureMergerRoot: string[];
}

export class TextureMergerPlugin implements Plugin {

    private tmprojects: string[] = [];

    private removedList: {} = {};

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
                if (fileOrigin.indexOf(path.normalize(root)) >= 0) {
                    isRes = true;
                }
            }
        }
        if (!isRes) {
            return;
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
        const options = this.options;
        let texture_merger_path = await getTextureMergerPath()
        let projectRoot = egret.args.projectDir;
        const tempDir = path.join(tmpdir(), 'egret/texturemerger', Math.random().toString());
        FileUtil.createDirectory(tempDir);
        for (let tmprojectFilePath of this.tmprojects) {
            const imageList = this.configs[tmprojectFilePath];
            let tmprojectDir = path.dirname(tmprojectFilePath);
            tmprojectDir = tmprojectDir.replace(projectRoot, "");
            const filename = path.basename(tmprojectFilePath, ".tmproject");
            const jsonPath = path.join(tempDir, filename + ".json");
            const pngPath = path.join(tempDir, filename + ".png");
            try {
                const result = await shell(texture_merger_path, ["-cp", tmprojectFilePath, "-o", tempDir]);
                const jsonBuffer = await FileUtil.readFileAsync(jsonPath, null) as any as NodeBuffer;
                const pngBuffer = await FileUtil.readFileAsync(pngPath, null) as any as NodeBuffer;
                pluginContext.createFile(path.join(pluginContext.outputDir, tmprojectDir, filename + ".json"), jsonBuffer, { type: "sheet", subkeys: imageList });
                pluginContext.createFile(path.join(pluginContext.outputDir, tmprojectDir, filename + ".png"), pngBuffer);
            }
            catch (e) {
                if (e.code) {
                    console.error(`TextureMerger 执行错误，错误码：${e.code}`);
                    console.log(`${e.message}`)
                    // console.error(`执行命令:${e.path} ${e.args.join(" ")}`)
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

    const toolsList = launcher.getLauncherLibrary().getInstalledTools();
    const tm = toolsList.filter(m => {
        return m.name == "Texture Merger";
    })[0];
    if (!tm) {
        throw '请安装 Texture Merger'; //i18n
    }
    const isUpperVersion = globals.compressVersion(tm.version, "1.7.0");
    if (isUpperVersion < 0) {
        throw '请将 Texture Merger 升级至 1.7.0 以上版本';
    }
    switch (process.platform) {
        case 'darwin':
            return tm.path + "/Contents/MacOS/TextureMerger";
            break;
        case 'win32':
            return tm.path + "/TextureMerger.exe";
            break;
    }
    throw '不支持的平台'
}