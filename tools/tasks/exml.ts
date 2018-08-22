import * as exml from '../actions/exml';
import { PluginContext, Plugin } from './';
export class ExmlPlugin implements Plugin {

    name = 'exml';

    exmls: { filename: string, contents: string }[] = [];

    constructor(private publishPolicy: string) {


    }
    async onFile(file) {
        const filename = file.origin;
        if (filename.indexOf('.exml') >= 0) {
            const contents = file.contents.toString()
            this.exmls.push({ filename, contents });
            if (this.publishPolicy != "debug") {
                return null;
            }
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
            pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents))
        }
        const result = exml.publishEXML(this.exmls, this.publishPolicy);
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
