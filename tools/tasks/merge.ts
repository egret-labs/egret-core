import { Plugin, PluginContext, File } from "./index";
import * as path from 'path';
import { shell } from "../lib/utils";
import { launcher } from "../project/index";
import { tmpdir } from "os";
import * as FileUtil from '../lib/FileUtil';
import * as utils from '../lib/utils'
import * as os from 'os';
import * as fs from 'fs';




type MergeConfig = {

    mergeSelector: (p: string) => string
}

export class ZipPlugin implements Plugin {


    private _zipCollection: {
        [index: string]: string[]
    } = {};

    constructor(private options: MergeConfig) {
    }

    async onFile(file: File): Promise<File | null> {
        const zipFile = this.options.mergeSelector(file.origin);
        if (zipFile) {
            if (!this._zipCollection[zipFile]) {
                this._zipCollection[zipFile] = [];
            }
            this._zipCollection[zipFile].push(file.origin);
            return null;
        }
        else {
            return file;
        }
    }

    async onFinish(pluginContext: PluginContext): Promise<void> {


        for (let zipFile in this._zipCollection) {
            const files = this._zipCollection[zipFile]
            const buffer = await zip(files);
            pluginContext.createFile(zipFile, buffer, {
                subkeys: files
            })
        }



    }


}



async function zip(sourceFiles: string[]) {



    const tempSourceDir = path.join(os.tmpdir(), "egret_temp_" + Math.random());
    FileUtil.createDirectory(tempSourceDir);

    const tempDir2 = path.join(os.tmpdir(), "egret_temp_" + Math.random());
    FileUtil.createDirectory(tempDir2);

    for (let source of sourceFiles) {
        const output = path.join(tempSourceDir, source)
        FileUtil.copy(source, output);
    }
    const relativePath = path.relative(egret.args.projectDir, process.cwd());
    const zipLibraryPath = path.join(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.js");
    const outputPath = path.join(tempDir2, 'output.zip');
    // await utils.shell(process.execPath, [
    //     zipLibraryPath,
    //     "zip",
    //     outputPath,
    //     tempSourceDir
    // ], null, false)

    await utils.shell2("cross-zip", [
        tempSourceDir,
        outputPath
    ])
    const contentBuffer = fs.readFileSync(outputPath);
    FileUtil.remove(tempSourceDir);
    FileUtil.remove(outputPath);
    return contentBuffer;
}






type MergeEuiJsonPluginOptions = {

    mergeSelector?: (p: string) => string | null,

    createConfig?: boolean
}
export class MergeEuiJsonPlugin implements Plugin {
    private mergeList: { [filename: string]: { content: string }[] } = {};
    private jsonConfig = {};
    private defaultThm = {};
    private mergeSelector: (p: string) => string | null = (p: string) => {
        if (p.indexOf("_EUI.json") >= 0) {
            let paths = p.split("/");
            paths.pop();
            return paths.join("/") + "_EUI.json";
        } else {
            return null;
        }
    }
    constructor(private options?: MergeEuiJsonPluginOptions) {
        if (!this.options) {
            this.options = {};
        }
        if (!this.options.mergeSelector) {
            this.options.mergeSelector = this.mergeSelector;
        }
        if (this.options.createConfig) {
            this.options.createConfig = true;
        }
        else {
            this.options.createConfig = false;
        }
    }
    async onFile(file: File) {
        const mergeResult = this.options.mergeSelector(file.origin)
        if (mergeResult) {
            if (!this.mergeList[mergeResult]) {
                this.mergeList[mergeResult] = [];
            }
            this.mergeList[mergeResult].push({ content: file.contents.toString() })
            if (this.options.createConfig) {
                if (!this.jsonConfig[mergeResult]) {
                    this.jsonConfig[mergeResult] = []
                }
                this.jsonConfig[mergeResult].push(file.origin.replace("_EUI.json", ".exml"))
            }
            return null;
        }
        if (file.origin.indexOf("default.thm.json") > -1) {
            this.defaultThm = JSON.parse(file.contents.toString());
        }
        return file;
    }

    async onFinish(commandContext: PluginContext) {
        for (let mergeFilename in this.mergeList) {
            const mergeItem = this.mergeList[mergeFilename];
            const json = {};
            mergeItem.forEach((item) => {
                let itemjson = JSON.parse(item.content);
                for (let i in itemjson) {
                    json[i] = itemjson[i];
                }
            })
            const content = JSON.stringify(json, null, '\t');
            commandContext.createFile(mergeFilename, new Buffer(content))
        }
        if (this.options.createConfig) {
            this.defaultThm["merge"] = this.jsonConfig
            commandContext.createFile("resource/default.thm.json", new Buffer(JSON.stringify(this.defaultThm)));
        }
    }
}
