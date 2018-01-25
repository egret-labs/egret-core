
import * as path from 'path';
import { Plugin, File } from './index';

const manifest = {
    initial: [],
    game: [],
    // configURL: ""
}



type ManifestPluginOptions = {

    output: string,

    verbose?: boolean

    hash?: "crc32"
}

export class ManifestPlugin {

    private verboseInfo: { filename: string, new_file_path: string }[] = [];

    constructor(private options: ManifestPluginOptions) {
        if (!this.options) {
            this.options = { output: "manifest.json" }
        }
    }

    async onFile(file: File) {



        const filename = file.relative;
        const extname = path.extname(filename);
        // if (filename === "config.res.js") {
        //     const crc32 = globals.getCrc32();
        //     const crc32_file_path = crc32(file.contents);
        //     const origin_path = file.original_relative;
        //     const new_file_path = "js/" + origin_path.substr(0, origin_path.length - file.extname.length) + "_" + crc32_file_path + file.extname;
        //     file.path = path.join(file.base, new_file_path);
        //     manifest.configURL = new_file_path;
        // }
        if (extname == ".js") {
            let new_file_path;
            const basename = path.basename(filename);
            if (this.options.hash == 'crc32') {
                const crc32 = globals.getCrc32();
                const crc32_file_path = crc32(file.contents);
                new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32_file_path + file.extname;

            }
            else {
                new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + file.extname;

            }
            file.path = path.join(file.base, new_file_path);

            const relative = file.relative.split("\\").join('/');

            if (file.origin.indexOf('libs/') >= 0) {
                manifest.initial.push(relative);
            }
            else {
                manifest.game.push(relative);
            }

            if (this.options.verbose) {
                this.verboseInfo.push({ filename, new_file_path })
            }
        }
        return file;
    }
    async onFinish(pluginContext) {
        const output = this.options.output;
        const extname = path.extname(output);
        let contents = '';
        switch (extname) {
            case ".json":
                contents = JSON.stringify(manifest, null, '\t');
                break;
            case ".js":
                contents = manifest.initial.concat(manifest.game).map((fileName) => `require("${fileName}")`).join("\n")
                break;
        }
        pluginContext.createFile(this.options.output, new Buffer(contents));
        if (this.options.verbose) {
            this.verboseInfo.forEach((item) => {
                console.log(`manifest-plugin: ${item.filename} => ${item.new_file_path}`)
            });
        }


    }



}