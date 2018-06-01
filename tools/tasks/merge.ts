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