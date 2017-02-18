import * as solution from '../solution';
import * as project from '../solution/TypeScritpProject';
import * as file from '../lib/FileUtil';
import * as path from 'path';
export = class StartUp {

    execute() {
        let root = egret.args.projectDir;
        if (file.exists(path.join(root, "egret.solution"))) {
            console.log('solution startup')
            solution.run();
        }
        else {
            console.log('project startup')
            project.run();
        }
        return DontExitCode;
    }

}