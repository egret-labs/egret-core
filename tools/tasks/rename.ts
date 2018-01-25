
import * as path from 'path';
import { Plugin, File } from './index';



type ManifestPluginOptions = {

    verbose?: boolean

    hash?: "crc32"
}

export class RenamePlugin {

    private verboseInfo: { filename: string, new_file_path: string }[] = [];

    constructor(private options: ManifestPluginOptions) {
        if (!this.options) {
            this.options = { hash: 'crc32' }
        }

    }

    async onFile(file: File) {


        var a = {
            matchers: [
                { from: "**/*.js", to: "js/[name]_[hash].js" },
                { from: "resource/**/**", to: "resource/[path][name]_[hash].[ext]" }
            ]
        }

        var minimatch = require('../lib/resourcemanager').minimatch;

        for (let match of a.matchers) {
            if (minimatch(file.origin, match.from)) {
                console.log(file.origin, match.to)
                break;
            } // true! 
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