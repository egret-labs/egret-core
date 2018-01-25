import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');
import * as EgretProject from '../project';
class CreateLib implements egret.Command {

    async execute() {
        const option = egret.args;
        if (FileUtil.exists(option.projectDir)) {
            console.log(utils.tr(1002));
            return 0;
        }
        const moduleName = FileUtil.basename(option.projectDir);
        const project = EgretProject.projectData;
        const libraryTemplate = FileUtil.joinPath(egret.root, "tools/templates/library");
        FileUtil.copy(libraryTemplate, project.getProjectRoot());

        type Package_JSON = { name: string, compilerVersion: string };

        type TSCONFIG_JSON = {
            compilerOptions: {
                outFile: string;
            }
        };

        await convert<Package_JSON>(project.getFilePath("package.json"),
            (data) => {
                data.name = moduleName;
                data.compilerVersion = egret.version;
                return data
            });

        await convert<TSCONFIG_JSON>(project.getFilePath("tsconfig.json"),
            (data) => {
                data.compilerOptions.outFile = `bin/${moduleName}.js`;
                return data;
            });
    }
}


async function convert<T>(filePath: string, processor: (from: T) => T) {
    const data: T = await FileUtil.readJSONAsync(filePath);
    const result = processor(data);
    const content = JSON.stringify(result, null, "\t");
    FileUtil.save(filePath, content);
}


export = CreateLib;
