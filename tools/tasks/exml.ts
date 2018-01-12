import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as exml from '../actions/exml';
import * as path from 'path';

import { PluginContext, Plugin } from './';

export class ExmlPlugin implements Plugin {

    name = 'exml';

    exmls: { filename: string, contents: string }[] = [];

    constructor(public publishPolicy: string) {


    }
    async onFile(file) {
        const filename = file.origin;
        if (filename.indexOf('.exml') >= 0) {
            const contents = file.contents.toString()
            this.exmls.push({ filename, contents })
        }
        return file;
    }

    async onFinish(pluginContext) {
        if (this.exmls.length == 0) {
            return;
        }

        if (this.publishPolicy == "debug") {
            const dtsContents = exml.generateExmlDTS(this.exmls);
            pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents))
        }
        const result = exml.publishEXML(this.exmls, this.publishPolicy);
        result.forEach(item => {
            const filename = item.path.split("\\").join("/");
            pluginContext.createFile(filename, new Buffer(item.content))
        })
    }
}
