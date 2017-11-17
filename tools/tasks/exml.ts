import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as exml from '../actions/exml';
import * as path from 'path';

const res = require('../lib/resourcemanager');

const debug = {
    "name": "exml-debug",
    onFile: async (file) => {
        return file;
    },
    onFinish: (pluginContext) => {
        try {
            const result = exml.publishEXML('path');
            result.forEach(item => {
                const filename = path.relative(pluginContext.projectRoot, item.path).split("\\").join("/");
                pluginContext.createFile(filename, new Buffer(item.content))
            })
        }
        catch (e) {
            console.log(e)
        }

    }
};

const publish = {
    "name": "exml",
    onFile: async (file) => {
        return file;

    },
    onFinish: (pluginContext) => {
        try {
            const result = exml.publishEXML();
            result.forEach(item => {
                const filename = path.relative(pluginContext.projectRoot, item.path).split("\\").join("/");
                pluginContext.createFile(filename, new Buffer(item.content))
            })
        }
        catch (e) {
            console.log(e)
        }

    }
};

export default { debug, publish }