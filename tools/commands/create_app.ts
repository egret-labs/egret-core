/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import BuildCommand = require("./build");
import FileAutoChangeCommand = require("../actions/FileAutoChange");
//import config = require("../ProjectConfig");
var config = egret.args.properties;
import CopyFilesCommand = require("./copyfile");
import ParseConfigCommand = require("../actions/ParseConfig");
import CompileTemplate = require('../actions/CompileTemplate');

var fs = require('fs');
var cp_exec = require('child_process').exec;

import copyNative = require("../actions/CopyNativeFiles");

class CreateAppCommand implements egret.Command {
    executeRes : number = 0;
    execute():number {
        this.run();
        return this.executeRes;
    }
    private run() {
        var option = egret.args;

        //if (!params.hasOption("-f") || !params.hasOption("-t")) {
        //    globals.exit(1601);
        //}
        //var arg_app_name = params.getCommandArgs()[0];
        //var template_path = params.getOption("-t");
        //var arg_h5_path = params.getOption("-f");
        var arg_app_name = option.projectDir;
        var template_path = option.nativeTemplatePath;
        var arg_h5_path = option.fileName;

        if(!arg_app_name){
            globals.exit(1610);
        }
        if(file.exists(arg_app_name)){
            globals.exit(1611);
        }
        if(!template_path || !arg_h5_path){
            globals.exit(1601);
        }
        //判断项目合法性
        var isEgretProject = false;
        var egretPropertiesPath = file.joinPath(arg_h5_path, "egretProperties.json");
        if(file.exists(egretPropertiesPath)){
            isEgretProject = true;
        }
        if(isEgretProject){
            var properties = JSON.parse(file.read(egretPropertiesPath));
            if (properties["egret_version"]) {
                isEgretProject = true;
            }else{
                isEgretProject = false;
            }
        }
        if(!isEgretProject){
            globals.exit(1602);
        }

        option.projectDir = arg_h5_path;

        var startTime = Date.now();

        var app_data = this.read_json_from(file.joinPath(template_path, "create_app.json"));
        if (!app_data) {
            globals.exit(1603);
        }

        var platform = "";

        if (file.exists(file.joinPath(template_path, "proj.android"))) {//android
            platform = "android";
        }
        else if (file.exists(file.joinPath(template_path, "proj.ios"))) {//ios
            platform = "ios";
        }
        else {
            globals.exit(1601);
        }

        var projectPath = file.joinPath(arg_h5_path);
        var nativePath = file.joinPath(arg_app_name);

        file.remove(nativePath);

        //生成native工程
        this.create_app_from(nativePath, template_path, app_data);

        //修改egretProperties.json文件路径
        var properties = JSON.parse(file.read(file.joinPath(projectPath, "egretProperties.json")));
        if (properties["native"] == null) {
            properties["native"] = {};
        }
        properties["native"][platform + "_path"] = file.relative(projectPath, nativePath);
        file.save(file.joinPath(projectPath, "egretProperties.json"), JSON.stringify(properties, null, "\t"));

        config.init(arg_h5_path);

        //修改native项目配置
        new ParseConfigCommand().execute();
        CompileTemplate.modifyNativeRequire();

        //拷贝项目到native工程中
        copyNative.refreshNative(true);

        globals.log2(1606, (Date.now() - startTime) / 1000);
    }

    private create_app_from(app_path, template_path, app_data) {
        // copy from project template
        globals.log(1607);
        if (app_data["template"]["zip"]) {
            this.run_unzip(app_path, template_path, app_data);
        } else {
            app_data["template"]["source"].forEach(function(source) {
                file.copy(file.joinPath(template_path, source), file.joinPath(app_path, source));
            });
            this.rename_app(app_path, app_data);
        }
    }

    private rename_app(app_path, app_data) {
        // replace keyword in content
        globals.log(1608);
        app_data["rename_tree"]["content"].forEach(function(content) {
            var target_path = file.joinPath(app_path, content);
            var c = file.read(target_path);
            c = c.replace(new RegExp(app_data["template_name"], "g"), file.basename(app_path));
            file.save(target_path, c);
        });

        // rename keyword in project name
        globals.log(1609);
        app_data["rename_tree"]["file_name"].forEach(function(f) {
            var str = file.joinPath(app_path, f);
            var offset = app_data["template_name"].length;
            var index = str.lastIndexOf(app_data["template_name"]);
            if (index > 0) {
                var target_str = str.substring(0, index) + file.basename(app_path) + str.substring(index + offset);
                fs.renameSync(str, target_str);
            }
        });
    }
    private run_unzip(app_path, template_path, app_data) {
        var template_zip_path = file.joinPath(template_path, app_data["template"]["zip"]);
        var cmd = "unzip -q " + globals.addQuotes(template_zip_path) + " -d " + globals.addQuotes(app_path);
        //执行异步方法必须指定返回值为DontExitCode
        this.executeRes = DontExitCode;
        var self = this;
        var build = cp_exec(cmd);
        build.stderr.on("data", function(data) {
            globals.log(data);
        });
        build.on("exit", function(result) {
            if (result == 0) {
                self.rename_app(app_path, app_data);
            } else {
                console.error("unzip出现异常！");
            }
        });
    }

    private read_json_from(json_file) {
        if (!fs.existsSync(json_file)) {
            return null;
        } else {
            return JSON.parse(file.read(json_file));
        }
    }

}


export = CreateAppCommand;
