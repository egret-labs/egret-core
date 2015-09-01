
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import server = require('../server/server');
import service = require('../service/index');
import FileUtil = require('../lib/FileUtil');
import exml = require('../actions/EXMLAction');
import CopyFiles = require('../actions/CopyFiles');
import CompileProject = require('../actions/CompileProject');
import CompileTemplate = require('../actions/CompileTemplate');

class Publish implements egret.Command {
    execute():number {
        var options = egret.args;
        if (FileUtil.exists(options.srcDir) == false ||
            FileUtil.exists(options.templateDir) == false) {
            utils.exit(10015, options.projectDir);
        }
        options.minify = true;
        options.publish = true;
                
        utils.clean(options.releaseDir);
        var compileProject = new CompileProject();
        var result = compileProject.compileProject(options);
        if(result.exitStatus)
            return result.exitStatus;
        utils.minify(options.out,options.out);
        CopyFiles.copyProjectFiles();
        exml.updateSetting(true);
        CompileTemplate.compileTemplates(options, result.files);
        
        return result.exitStatus;
    }
}

export = Publish;