import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as exml from '../actions/exml';
import * as path from 'path';

import { PluginContext, Plugin } from './';

class ExmlPlugin implements Plugin {

    name = 'exml';

    constructor(public publishPolicy: string) {

    }
    async onFile(file) {
        return file;
    }

    async onFinish(pluginContext) {
        const result = exml.publishEXML(this.publishPolicy);
        result.forEach(item => {
            const filename = path.relative(pluginContext.projectRoot, item.path).split("\\").join("/");
            pluginContext.createFile(filename, new Buffer(item.content))
        })
    }
}

export default ExmlPlugin;