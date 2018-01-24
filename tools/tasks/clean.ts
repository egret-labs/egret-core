
import * as path from 'path';
import { Plugin, File, PluginContext } from './index';
import * as FileUtil from '../lib/FileUtil';

type CleanPluginOptions = {

    match: string[]
}



export class CleanPlugin {

    private verboseInfo: { filename: string, new_file_path: string }[] = [];

    constructor(private options: any) {

    }

    async onFile(file: File) {
        return file;
    }
    async onFinish(pluginContext: PluginContext) {
        const output
            = pluginContext.outputDir;
        const res = require('../lib/resourcemanager');

        const matches = ['**/*.js', 'resource/**'];

        const list = ['js', 'resource'].map((item) => path.join(output, item));
        Promise.all(list.map((item) => FileUtil.removeAsync(item)))
    }
}