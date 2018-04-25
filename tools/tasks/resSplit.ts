
import * as path from 'path';
import { Plugin, File } from './index';


const minimatch = require('../lib/resourcemanager').minimatch;

type ResSplitPluginOptions = {

    verbose?: boolean

    matchers: { from: string, to: string }[]
}

export class ResSplitPlugin {

    private verboseInfo: { filename: string, new_file_path: string }[] = [];

    constructor(private options: ResSplitPluginOptions) {
        if (!this.options) {
            this.options = { matchers: [] }
        }

    }

    async onFile(file: File) {
        for (let match of this.options.matchers) {
            if (minimatch(file.origin, match.from)) {
                file.outputDir = match.to;
                if (this.options.verbose) {
                    console.log(`ResSplitPlugin: ${file.relative} => ${file.outputDir}`)
                }
                break;
            }
        }
        return file;
    }
    async onFinish(pluginContext) {

    }



}

function generateCrc32Code(buffer: Buffer) {
    const crc32 = globals.getCrc32();
    const crc32code = crc32(buffer);
    return crc32code;
}