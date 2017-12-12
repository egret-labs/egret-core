
import * as path from 'path';
import * as FileUtil from '../lib/FileUtil';
type TargetTemplateConfig = {

    templatePath: string;

    scriptPath: string;

    projectType: string;
}


class Target implements egret.Command {

    async execute() {
        const option = egret.args;

        const projectName = path.basename(option.projectDir);
        const config: TargetTemplateConfig = await getTargetTemplateConfig();
        const projectRoot = path.resolve(option.projectDir, '../', projectName + "_" + config.projectType);
        FileUtil.copyAsync(config.templatePath, projectRoot)
        FileUtil.copyAsync(config.scriptPath, path.join(option.projectDir, 'scripts', config.projectType));
        console.log(config.templatePath, projectRoot)


        return 0;

    }
}


async function getTargetTemplateConfig(): Promise<TargetTemplateConfig> {
    const option = egret.args;
    const templatePath = option.templatePath;
    if (!templatePath) {
        throw '请传递 -t [target-template-folder] 参数';
    }
    const targetConfigPath = path.join(templatePath, 'target.json')
    const result: TargetTemplateConfig = await FileUtil.readJSONAsync(targetConfigPath);
    if (!result) {
        throw '找不到指定的目标模板 : ' + templatePath
    }
    result.templatePath = path.join(templatePath, 'template');
    result.scriptPath = path.join(templatePath, "scripts")
    return result;
}

export = Target;
