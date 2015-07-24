/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import BuildCommand = require("./BuildCommand");
import FileAutoChangeCommand = require("./FileAutoChangeCommand");
import config = require("../lib/ProjectConfig");
import CopyFilesCommand = require("./CopyFilesCommand");

var fs = require('fs');
var cp_exec = require('child_process').exec;


class CreateAppCommand implements egret.Command {

    execute():number {
        this.run();
        return 0;
    }
    private run() {
        if (!params.hasOption("-f") || !params.hasOption("-t")) {
            globals.exit(1601);
        }

        var arg_app_name = params.getCommandArgs()[0];
        var template_path = params.getOption("-t");
        var arg_h5_path = params.getOption("-f");

        var startTime = Date.now();

        var app_data = this.read_json_from(file.join(template_path, "create_app.json"));
        if (!app_data) {
            globals.exit(1603);
        }

        var platform = "";

        if (file.exists(file.join(template_path, "proj.android"))) {//android
            platform = "android";
        }
        else if (file.exists(file.join(template_path, "proj.ios"))) {//ios
            platform = "ios";
        }
        else {
            globals.exit(1601);
        }

        var projectPath = file.join(arg_h5_path);
        var nativePath = file.join(arg_app_name);


        file.remove(nativePath);

        //生成native工程
        this.create_app_from(nativePath, template_path, app_data);

        //修改egretProperties.json文件路径
        var properties = JSON.parse(file.read(file.join(projectPath, "egretProperties.json")));
        if (properties["native"] == null) {
            properties["native"] = {};
        }
        properties["native"][platform + "_path"] = file.relative(projectPath, nativePath);
        file.save(file.join(projectPath, "egretProperties.json"), JSON.stringify(properties, null, "\t"));

        params.setArgv({
            name: "create_app",
            currDir: projectPath,
            args: "",
            opts: {}
        });
        config.init();

        //修改文件
        var fileModify = new FileAutoChangeCommand();
        fileModify.needCompile = false;
        fileModify.debug = true;
        fileModify.execute();


        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android") {
            var url2 = file.join(nativePath, "proj.android/assets", "egret-game");
        }
        else if (platform == "ios") {
            url2 = file.join(nativePath, "Resources", "egret-game");
        }
        cpFiles.outputPath = url2;
        cpFiles.ignorePathList = config.getIgnorePath();
        cpFiles.execute();

        globals.log2(1606, (Date.now() - startTime) / 1000);
    }
    private create_app_from(app_path, template_path, app_data) {
        // copy from project template
        globals.log(1607);
        if (app_data["template"]["zip"]) {
            this.run_unzip(app_path, template_path, app_data);
        } else {
            app_data["template"]["source"].forEach(function(source) {
                file.copy(file.join(template_path, source), file.join(app_path, source));
            });
            this.rename_app(app_path, app_data);
        }
    }
    private rename_app(app_path, app_data) {
        // replace keyword in content
        globals.log(1608);
        app_data["rename_tree"]["content"].forEach(function(content) {
            var target_path = file.join(app_path, content);
            var c = file.read(target_path);
            c = c.replace(new RegExp(app_data["template_name"], "g"), file.basename(app_path));
            file.save(target_path, c);
        });

        // rename keyword in project name
        globals.log(1609);
        app_data["rename_tree"]["file_name"].forEach(function(f) {
            var str = file.join(app_path, f);
            var offset = app_data["template_name"].length;
            var index = str.lastIndexOf(app_data["template_name"]);
            if (index > 0) {
                var target_str = str.substring(0, index) + file.basename(app_path) + str.substring(index + offset);
                fs.renameSync(str, target_str);
            }
        });
    }
    private run_unzip(app_path, template_path, app_data) {
        var template_zip_path = file.join(template_path, app_data["template"]["zip"]);
        var cmd = "unzip -q " + globals.addQuotes(template_zip_path) + " -d " + globals.addQuotes(app_path);

        console.log(cmd);

        var build = cp_exec(cmd);
        build.stderr.on("data", function(data) {
            globals.log(data);
        });
        build.on("exit", function(result) {
            if (result == 0) {
                this.rename_app(app_path, app_data);
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
