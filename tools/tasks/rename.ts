
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

        const filename = file.origin;
        const extname = path.extname(filename);
        let new_file_path
        if (extname == ".js") {

            const basename = path.basename(filename);
            if (this.options.hash == 'crc32') {
                const crc32code = generateCrc32Code(file.contents);
                new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32code + file.extname;
            }
        }
        else {
            let new_file_path;
            const basename = path.basename(filename);
            if (this.options.hash == 'crc32') {

                const crc32code = generateCrc32Code(file.contents);
                // file.dirname;
                new_file_path = "resource/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32code + file.extname;
            }
        }
        file.path = path.join(file.base, new_file_path);
        if (this.options.verbose) {
            this.verboseInfo.push({ filename, new_file_path })
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