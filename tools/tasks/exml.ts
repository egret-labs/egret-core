import * as exml from '../actions/exml';
import file = require('../lib/FileUtil');
import { PluginContext, Plugin, File } from './';
import FileUtil = require('../lib/FileUtil');
export class ExmlPlugin implements Plugin {

    name = 'exml';

    exmls: { filename: string, contents: string }[] = [];

    themeFilenames: string[] = [];

    constructor(private publishPolicy: string) {


    }
    async onFile(file: File) {
        const filename = file.origin;
        if (filename.indexOf('.exml') >= 0) {
            const contents = file.contents.toString()
            this.exmls.push({ filename, contents });
            if (this.publishPolicy != "debug") {
                return null;
            }
        } else if (filename.indexOf('.thm.json') >= 0) {
            this.themeFilenames.push(filename);
        }
        return file;
    }
    async onFinish(pluginContext) {
        if (this.exmls.length == 0) {
            return;
        }
        this.exmls = this.exmls.sort((a, b) => {
            return a.filename.localeCompare(b.filename)
        })
        if (this.publishPolicy == "debug") {
            const dtsContents = exml.generateExmlDTS(this.exmls);
            if (!FileUtil.exists('libs/exml.e.d.ts')) {
                pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents))
            } else {
                const exmlDTS = FileUtil.read('libs/exml.e.d.ts');
                if (dtsContents !== exmlDTS) {
                    pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents))
                }
            }
        }
        const themeDatas = this.themeFilenames.map(filename => {
            const content = file.read(file.joinPath(egret.args.projectDir, filename))
            const data: egret.EgretEUIThemeConfig = JSON.parse(content);
            data.path = filename;
            return data;
        });
        const result = exml.publishEXML(this.exmls, this.publishPolicy, themeDatas);
        //屏蔽其他编译机制
        if (result.EuiJson) {
            result.EuiJson.forEach(item => {
                const filename = item.path.split("\\").join("/");
                pluginContext.createFile(filename, new Buffer(item.json))
            })
        }
        //写入解析规则和定义
        result.files.forEach(item => {
            const filename = item.path.split("\\").join("/");
            pluginContext.createFile(filename, new Buffer(item.content))
        })
    }
}
