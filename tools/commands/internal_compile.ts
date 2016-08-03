/// <reference path="../lib/types.d.ts" />

import CompileProject = require('../actions/CompileProject');
import FileUtil = require('../lib/FileUtil');
import path = require('path');

class InternalCompile implements egret.Command {
    execute(): number {

        var options = egret.args;
        options.releaseDir = path.resolve(egret.args.projectDir, options.fileName)
        options.minify = true;
        options.publish = true;
        var compileProject = new CompileProject();
        var result = compileProject.compile(options);
        return 0;

    }
}

export = InternalCompile;