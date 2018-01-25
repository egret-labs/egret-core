
import * as path from 'path';
import { Plugin, File, PluginContext } from './index';
import * as FileUtil from '../lib/FileUtil';

type CleanPluginOptions = {

    matchers: string[]
}

export class CleanPlugin {


    constructor(private options: CleanPluginOptions) {

    }

    async onFile(file: File) {
        return file;
    }
    async onFinish(pluginContext: PluginContext) {
        const output = pluginContext.outputDir;
        const res = require('../lib/resourcemanager');
        const matchers = this.options.matchers;
        const list = matchers.map((item) => path.join(output, item));
        Promise.all(list.map((item) => FileUtil.removeAsync(item)))
    }
}