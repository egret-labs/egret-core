/// <reference path="../lib/types.d.ts" />
//import globals = require("../globals");
//import params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var FileAutoChangeCommand = require("../actions/FileAutoChange");
//import config = require("../ProjectConfig");
var config = egret.args.properties;
var CopyFilesCommand = require("./copyfile");
var ParseConfigCommand = require("../actions/ParseConfig");
var fs = require('fs');
var cp_exec = require('child_process').exec;
var CreateAppCommand = (function () {
    function CreateAppCommand() {
    }
    CreateAppCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    CreateAppCommand.prototype.run = function () {
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
        if (!template_path || !arg_h5_path) {
            globals.exit(1601);
        }
        option.projectDir = arg_h5_path;
        var startTime = Date.now();
        var app_data = this.read_json_from(file.joinPath(template_path, "create_app.json"));
        if (!app_data) {
            globals.exit(1603);
        }
        var platform = "";
        if (file.exists(file.joinPath(template_path, "proj.android"))) {
            platform = "android";
        }
        else if (file.exists(file.joinPath(template_path, "proj.ios"))) {
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
        //params.setArgv({
        //    name: "create_app",
        //    currDir: projectPath,
        //    args: "",
        //    opts: {}
        //});
        config.init(arg_h5_path);
        //修改native项目配置
        new ParseConfigCommand().execute();
        //修改文件
        var fileModify = new FileAutoChangeCommand();
        fileModify.needCompile = false;
        fileModify.debug = true;
        fileModify.execute();
        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android") {
            var url2 = file.joinPath(nativePath, "proj.android/assets", "egret-game");
        }
        else if (platform == "ios") {
            url2 = file.joinPath(nativePath, "Resources", "egret-game");
        }
        cpFiles.outputPath = url2;
        cpFiles.ignorePathList = config.getIgnorePath();
        cpFiles.execute();
        globals.log2(1606, (Date.now() - startTime) / 1000);
    };
    CreateAppCommand.prototype.create_app_from = function (app_path, template_path, app_data) {
        // copy from project template
        globals.log(1607);
        if (app_data["template"]["zip"]) {
            this.run_unzip(app_path, template_path, app_data);
        }
        else {
            app_data["template"]["source"].forEach(function (source) {
                file.copy(file.joinPath(template_path, source), file.joinPath(app_path, source));
            });
            this.rename_app(app_path, app_data);
        }
    };
    CreateAppCommand.prototype.rename_app = function (app_path, app_data) {
        // replace keyword in content
        globals.log(1608);
        app_data["rename_tree"]["content"].forEach(function (content) {
            var target_path = file.joinPath(app_path, content);
            var c = file.read(target_path);
            c = c.replace(new RegExp(app_data["template_name"], "g"), file.basename(app_path));
            file.save(target_path, c);
        });
        // rename keyword in project name
        globals.log(1609);
        app_data["rename_tree"]["file_name"].forEach(function (f) {
            var str = file.joinPath(app_path, f);
            var offset = app_data["template_name"].length;
            var index = str.lastIndexOf(app_data["template_name"]);
            if (index > 0) {
                var target_str = str.substring(0, index) + file.basename(app_path) + str.substring(index + offset);
                fs.renameSync(str, target_str);
            }
        });
    };
    CreateAppCommand.prototype.run_unzip = function (app_path, template_path, app_data) {
        var template_zip_path = file.joinPath(template_path, app_data["template"]["zip"]);
        var cmd = "unzip -q " + globals.addQuotes(template_zip_path) + " -d " + globals.addQuotes(app_path);
        var build = cp_exec(cmd);
        build.stderr.on("data", function (data) {
            globals.log(data);
        });
        build.on("exit", function (result) {
            if (result == 0) {
                this.rename_app(app_path, app_data);
            }
            else {
                console.error("unzip出现异常！");
            }
        });
    };
    CreateAppCommand.prototype.read_json_from = function (json_file) {
        if (!fs.existsSync(json_file)) {
            return null;
        }
        else {
            return JSON.parse(file.read(json_file));
        }
    };
    return CreateAppCommand;
})();
module.exports = CreateAppCommand;

//# sourceMappingURL=../commands/create_app.js.map