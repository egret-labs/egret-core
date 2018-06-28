import * as plugin from './';
import { Plugin } from './';
import * as zlib from 'zlib';

type MergeJSONOption = {
    nameSelector: (p: string) => string;
    mergeSelector: (p: string) => string | null;
}

export class MergeJSONPlugin implements Plugin {
    private mergeList: { [filename: string]: { filename: string, content: string }[] } = {};

    constructor(private options: MergeJSONOption) {
    }

    async onFile(file: plugin.File) {
        const mergeResult = this.options.mergeSelector(file.origin);
        /**合并 */
        if (mergeResult) {
            if (!this.mergeList[mergeResult]) {
                this.mergeList[mergeResult] = [];
            }
            const filename = this.options.nameSelector(file.origin.replace("resource/", ""))
            this.mergeList[mergeResult].push({ filename, content: file.contents.toString() })
            return null;
        }
        else {
            return file;
        }
    }
//加上subkeys
    async onFinish(commandContext: plugin.PluginContext) {
        for (let mergeFilename in this.mergeList) {
            const mergeItem = this.mergeList[mergeFilename];
            const json = {};

            mergeItem.forEach((item) => {
                json[item.filename] = JSON.parse(item.content)
            })
            const content = JSON.stringify(json, null, '\t');
            const jsonBuffer = await zip(content)
            commandContext.createFile(mergeFilename, jsonBuffer, { type: "zipjson",subkeys:"" })
        }
    }
}



type MergeBinaryOption = {
    mergeSelector: (p: string) => string | null;
}

export class MergeBinaryPlugin implements Plugin {
    private mergeList: { [filename: string]: { filename: string, content: Buffer }[] } = {};

    constructor(private options: MergeBinaryOption) {
    }

    async onFile(file: plugin.File) {
        const mergeResult = this.options.mergeSelector(file.origin)
        if (mergeResult) {
            if (!this.mergeList[mergeResult]) {
                this.mergeList[mergeResult] = [];
            }
            this.mergeList[mergeResult].push({ filename: file.origin.replace("resource/", ""), content: file.contents })
            // return null;
        }

        return file;
    }

    async onFinish(commandContext: plugin.PluginContext) {
        for (let mergeFilename in this.mergeList) {
            const mergeItem = this.mergeList[mergeFilename];

            let totalLength = 0;
            const json = {};
            mergeItem.forEach((item) => {
                json[item.filename] = { s: totalLength, l: item.content.byteLength }
                totalLength += item.content.byteLength;
            })
            const bufferList = mergeItem.map(item => item.content);
            const b = Buffer.concat(bufferList);

            const indexJson = JSON.stringify(json);
            const indexJsonBuffer = await zip(indexJson);

            const gltfContent = await zip(b);

            commandContext.createFile(mergeFilename + ".zipjson", indexJsonBuffer, { type: "zipjson" });
            commandContext.createFile(mergeFilename, gltfContent, { type: "bin" });
        }
    }
}



function zip(input: any) {
    return new Promise<Buffer>((resolve, reject) => {

        zlib.deflate(input, (err, buffer) => {
            if (!err) {
                resolve(buffer)
            } else {
                reject(err)
            }
        });
    })

}