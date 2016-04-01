
/// <reference path="../lib/types.d.ts" />

import doT = require('../lib/doT');
import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import project = require('../actions/Project');
import htmlparser = require("../lib/htmlparser");
import tsclark = require("../lib/typescript/tsclark");
import FileAutoChange = require("../actions/FileAutoChange");

class CompileTemplate {

    static modifyIndexHTML(scripts:string[]){
        //修改 native_require.js
        var autoChange = new FileAutoChange();
        var options = egret.args;
        var list = FileUtil.getDirectoryListing(options.projectDir);
        for (var key in list) {
            var filepath = list[key];
            if (FileUtil.getExtension(filepath) == "html") {
                autoChange.refreshDebugHtml(filepath, scripts);
            }
        }
    }

    public static modifyNativeRequire() {
        var options = egret.args;
        var index = FileUtil.joinPath(options.projectDir, "index.html");

        //修改 native_require.js
        var autoChange = new FileAutoChange();
        autoChange.refreshNativeRequire(index, true);
    }
}

export = CompileTemplate;
