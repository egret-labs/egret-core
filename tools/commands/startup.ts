import * as solution from '../solution';
import * as project from '../solution/TypeScriptProject';
import * as file from '../lib/FileUtil';
import * as path from 'path';
export = class StartUp {

    execute() {
        let root = egret.args.projectDir;
        let solutionFile = path.join(root, "egret.json");
        if (file.exists(solutionFile)) {
            console.log('solution startup')
            solution.run(solutionFile);
        }
        return DontExitCode;
    }

}