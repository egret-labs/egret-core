
import * as path from 'path';
import { Plugin, File, PluginContext } from './index';
import * as FileUtil from '../lib/FileUtil';
import * as utils from '../lib/utils'
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
        list.forEach(item => {
            FileUtil.remove(item)
        })
        console.log(1)
        await utils.sleep(1000)
        // await Promise.all(list.map((item) => {
        //     console.log(item)
        //     return 
        // }))
        // process.exit(0)
        console.log(2)
    }
}
