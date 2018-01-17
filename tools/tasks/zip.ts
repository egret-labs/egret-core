import * as utils from '../lib/utils'
import * as FileUtil from '../lib/FileUtil'
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
export async function zip(sourcePath: string) {

    console.log(process.cwd())
    console.log(egret.args.projectDir);

    const relativePath = path.relative(egret.args.projectDir, process.cwd());
    console.log(relativePath)

    var compilerPath = path.join(egret.root, "tools/lib/zip/EGTZipTool_v1.0.2.js");

    const tempPath = path.join("", '1.zip');
    await utils.shell(process.execPath, [
        compilerPath,
        "zip",
        tempPath,
        sourcePath
    ], null, true)

    console.log(tempPath)

    let contentBuffer = fs.readFileSync(tempPath);

    FileUtil.remove(tempPath);
    console.log(tempPath)
    console.log(contentBuffer);
    return contentBuffer;
}