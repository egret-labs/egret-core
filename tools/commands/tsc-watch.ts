import * as solution from '../solution';
import * as project from '../solution/TypeScriptProject';
import * as file from '../lib/FileUtil';
import * as path from 'path';
export = class TSC_Watch {

    execute() {
        let root = egret.args.projectDir;
        console.log('project startup')
        project.run(root);
        return DontExitCode;
    }

}