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
        let packageJsonContent
        if (packageJsonContent = FileUtil.read(project.projectData.getFilePath("package.json"))) {
            let packageJson: project.Package_JSON = JSON.parse(packageJsonContent);
            if (packageJson.modules) {//通过有modules来识别是egret库项目
                globals.log(1119);
                globals.exit(1120);
                return 0;
            }
            if (FileUtil.exists(project.projectData.getFilePath("tsconfig.json"))) {
                this.buildLib2(packageJson);
                return 0;
            }


        }
        utils.checkEgret();
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

    private buildLib2(packageJson: project.Package_JSON) {
        let projectDir = egret.args.projectDir;
        let compiler = new Compiler.Compiler();
        let { options, fileNames } = compiler.parseTsconfig(projectDir, egret.args.publish);
        options.emitReflection = true;
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

    private buildLib(packageJson: project.Package_JSON) {

        var options = egret.args;
        var libFiles = FileUtil.search(FileUtil.joinPath(options.projectDir, "libs"), "d.ts");
        var outDir = "bin";
        var compiler = new Compiler.Compiler();
        utils.clean(FileUtil.joinPath(options.projectDir, outDir));
        for (let m of packageJson.modules) {
            var files: string[];
            var length = m.files.length;
            if (length > 0) {
                files = m.files
                    .filter(file => file.indexOf(".ts") != -1)
                    .map(file => FileUtil.joinPath(options.projectDir, m.root, file))
            }
            else {
                //todo exml
                files = FileUtil.search(FileUtil.joinPath(options.projectDir, m.root), "ts");
            }
            //解决根目录没文件编译异常问题
            var tmpFilePath = FileUtil.joinPath(options.projectDir, m.root, "tmp.ts");
            var hasTmpTsFile = false;
            if (!FileUtil.exists(tmpFilePath)) {
                hasTmpTsFile = true;
                FileUtil.save(tmpFilePath, "");
            }
            else if (FileUtil.read(tmpFilePath) == "") {
                hasTmpTsFile = true;
            }

            let compilerOptions: ts.CompilerOptions = {
                target: ts.ScriptTarget.ES5,
                out: FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".js"),
                declaration: true
            };
            var compileFiles = libFiles.concat(files);
            if (hasTmpTsFile) {
                compileFiles.push(tmpFilePath);
            }

            var result = compiler.compile(compilerOptions, compileFiles)

            if (hasTmpTsFile) {
                FileUtil.remove(tmpFilePath);
            }

            var minPath = FileUtil.joinPath(options.projectDir, outDir, m.name, m.name + ".min.js");
            utils.minify(compilerOptions.out, minPath);
        }
    }
}


export = Build;
