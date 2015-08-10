/// <reference path="../lib/types.d.ts" />
var Compiler = require('./Compiler');
var FileUtil = require('../lib/FileUtil');
var exmlc = require("../../lib/exml/exmlc.js");
var CompileProject = (function () {
    function CompileProject() {
    }
    CompileProject.prototype.generateExmlDTS = function (option) {
        var srcPath = option.srcDir;
        var projectPath = option.projectDir;
        var sourceList = FileUtil.search(srcPath, "exml");
        srcPath = srcPath.split("\\").join("/");
        if (srcPath.charAt(srcPath.length - 1) != "/") {
            srcPath += "/";
        }
        var length = sourceList.length;
        var dts = "";
        for (var i = 0; i < length; i++) {
            var p = sourceList[i];
            if (!FileUtil.exists(p)) {
                continue;
            }
            var ext = FileUtil.getExtension(p).toLowerCase();
            if (ext == "exml") {
                var className = p.substring(srcPath.length, p.length - 5);
                className = className.split("/").join(".");
                var index = className.lastIndexOf(".");
                if (index == -1) {
                    dts += "declare class " + className + " extends egret.gui.Skin{\n}\n";
                }
                else {
                    var moduleName = className.substring(0, index);
                    className = className.substring(index + 1);
                    dts += "declare module " + moduleName + "{\n\tclass " + className + " extends egret.gui.Skin{\n\t}\n}\n";
                }
            }
        }
        //保存exml
        var exmlDtsPath = FileUtil.join(projectPath, "libs", "exml.d.ts");
        if (dts != "") {
            FileUtil.save(exmlDtsPath, dts);
        }
        else {
            FileUtil.remove(exmlDtsPath);
        }
        return dts;
    };
    CompileProject.prototype.compileProject = function (option, files) {
        if (files && this.recompile) {
            files = files.map(function (f) { return f.replace(option.projectDir, ""); });
            var result = this.recompile(files);
            return result;
        }
        var compiler = new Compiler();
        //编译exml
        var exmlList = FileUtil.search(option.srcDir, "exml");
        exmlList.forEach(function (item) {
            exmlc.compile(item, option.srcDir);
        });
        var tsList = FileUtil.search(option.srcDir, "ts");
        //加入.d.ts
        var projectProperties = require("../../lib/core/projectProperties.js");
        projectProperties.init(option.projectDir);
        var libs = projectProperties.getModulesDts().concat();
        //console.log(libs)
        //加入gui皮肤的.d.ts相关编译代码
        var dts = this.generateExmlDTS(option);
        //if (dts != "") {//有gui皮肤
        //    libs.push(path.join(option.projectDir, "libs", "exml.d.ts"));
        //}
        tsList = tsList.concat(libs);
        var compileResult = compiler.compile({
            args: option,
            files: tsList,
            out: option.out,
            outDir: option.outDir
        });
        //删除exml编译的ts文件
        exmlList.forEach(function (p) {
            var tsPath = p.substring(0, p.length - 4) + "ts";
            FileUtil.remove(tsPath);
        });
        var files = GetJavaScriptFileNames(compileResult.files, /^src\//);
        compileResult.files = files;
        this.recompile = compileResult.compileWithChanges;
        return compileResult;
    };
    return CompileProject;
})();
function GetJavaScriptFileNames(tsFiles, root, prefix) {
    var files = [];
    tsFiles.forEach(function (f) {
        if (!f)
            return;
        if (/\.d\.ts$/.test(f))
            return;
        f = FileUtil.escapePath(f);
        f = f.replace(root, '').replace(/\.ts$/, '.js').replace(/^\//, '');
        if (prefix) {
            f = prefix + f;
        }
        files.push(f);
    });
    return files;
}
module.exports = CompileProject;
