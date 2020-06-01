import * as utils from '../lib/utils';
import * as  service from '../service/index';
import * as FileUtil from '../lib/FileUtil';
import * as project from '../project';
import * as Compiler from '../actions/Compiler';
import * as tasks from '../tasks';
import * as path from 'path';
import * as parseConfig from '../actions/ParseConfig'
import { launcher } from '../project';
import { buildBefore } from '../actions/TargetAction';

console.log(utils.tr(1004, 0));

class Build implements egret.Command {
    @utils.measure
    async execute() {
        const options = egret.args;
        let packageJsonContent;
        //以package.json判断是否第三方库？
        if (packageJsonContent = FileUtil.read(project.projectData.getFilePath("package.json"))) {
            let packageJson: project.Package_JSON = JSON.parse(packageJsonContent);
            if (packageJson.modules) {//通过有modules来识别是egret库项目
                globals.log(1119);
                globals.exit(1120);
                return 0;
            }
            if (FileUtil.exists(project.projectData.getFilePath("tsconfig.json"))) {
                this.buildLib(packageJson);
                return 0;
            }
        }
        
        utils.checkEgret();
        utils.checkPlugin();
        if (!FileUtil.exists(FileUtil.joinPath(options.projectDir, 'libs/modules/egret/'))) {
            project.manager.copyToLibs();
        }


        const res = require('../lib/resourcemanager');
        const command = "build";
        const projectRoot = egret.args.projectDir;
        tasks.run();
        const target = egret.args.target;
        const projectConfig = parseConfig.parseConfig();
        await res.build({ projectRoot, debug: true, command, target, projectConfig }, buildBefore);
        return global.exitCode;
    }

    /**
     * 以编译第三方库的形式编译egret项目
     * @param packageJson 包含变异这个项目使用的egret的引擎版本
     */
    private buildLib(packageJson: project.Package_JSON) {
        let projectDir = egret.args.projectDir;
        let compiler = new Compiler.Compiler();
        let { options, fileNames } = compiler.parseTsconfig(projectDir, egret.args.publish);
        options.emitReflection = true;
        if (options.outDir) {
            console.log(utils.tr(1124))
        }
        // outFile 不存在就直接退出
        let outFile = options.outFile;
        if (!outFile) {
            globals.exit(1122);
        }
        compiler.compile(options, fileNames);
        let outDir = path.dirname(outFile);
        let outFileName = path.basename(outFile);
        let minFile = path.join(outDir, outFileName.replace(".js", ".min.js"));
        options.outFile = minFile;
        options.defines["DEBUG"] = false;
        options.defines["RELEASE"] = true;
        options.declaration = false;
        compiler.compile(options, fileNames);
        utils.minify(minFile, minFile);
        if (options.allowJs) {
            if (packageJson.typings) {
                FileUtil.copy(
                    path.join(projectDir, packageJson.typings),
                    path.join(outDir, path.basename(packageJson.typings))
                )
            }
            else {
                globals.log(1119);
                globals.exit(1121);
            }
        }
    }
}


export = Build;
