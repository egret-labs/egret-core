/// <reference path="../lib/types.d.ts" />

//import globals = require("../globals");
//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import BuildCommand = require("./build");
//import config = require("../ProjectConfig");
import EgretProject = require('../project/EgretProject');

import CopyFilesCommand = require("./copyfile");
import ParseConfigCommand = require("../actions/ParseConfig");

var fs = require('fs');
var cp_exec = require('child_process').exec;

import copyNative = require("../actions/CopyNativeFiles");

class CreateAppCommand implements egret.Command {
    executeRes: number = 0;

    execute(): number {
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
        var app_name = option.commands[1];
        var arg_app_name = option.projectDir;
        var template_path = option.nativeTemplatePath;
        var arg_h5_path = option.fileName;
        var reg = new RegExp("^[a-zA-Z]");
        if (!reg.test(app_name)) {
            globals.exit(1612);
        }
        if (!arg_app_name) {
            globals.exit(1610);
        }
        if (file.exists(arg_app_name)) {
            globals.exit(1611);
        }
        if (!template_path || !arg_h5_path) {
            globals.exit(1601);
        }
        //判断项目合法性
        var isEgretProject = false;
        var egretPropertiesPath = file.joinPath(arg_h5_path, "egretProperties.json");
        if (file.exists(egretPropertiesPath)) {
            isEgretProject = true;
        }
        if (isEgretProject) {
            var properties = JSON.parse(file.read(egretPropertiesPath));
            if (properties["egret_version"]) {
                isEgretProject = true;
            } else {
                isEgretProject = false;
            }
        }
        if (!isEgretProject) {
            globals.exit(1602);
        }

        option.projectDir = arg_h5_path;

        var startTime = Date.now();

        var app_data = this.read_json_from(file.joinPath(template_path, "create_app.json"));
        if (!app_data) {
            globals.exit(1603, template_path);
        }

        var platform = "";

        if (file.exists(file.joinPath(template_path, "proj.android"))) {//android
            if (file.isFile(file.joinPath(file.joinPath(template_path, "proj.android"), "build.gradle"))) {
                platform = "android_as";
            } else {
                platform = "android";
            }
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

        EgretProject.data.init(arg_h5_path);

        //修改native项目配置
        new ParseConfigCommand().execute();
        let manifestPath = file.joinPath(egret.args.projectDir, "manifest.json");
        EgretProject.manager.modifyNativeRequire(manifestPath);

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
            app_data["template"]["source"].forEach(function (source) {
                file.copy(file.joinPath(template_path, source), file.joinPath(app_path, source));
            });
            this.rename_app(app_path, app_data);

            if (file.isFile(file.joinPath(file.joinPath(app_path, "proj.android"), "build.gradle"))) {
                this.modifyAndroidStudioSupport(app_path);
                this.modifyLocalProperties(app_path);
            }
            else if (file.isFile(file.joinPath(file.joinPath(app_path, "proj.android"), "project.properties"))) {
                //修改ADT工程的
                this.modifyAndroidADTSupport(app_path);
            }
        }
    }

    private rename_app(app_path, app_data) {
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
    }

    private getBuildToolVersion(buildToolDir) {
        var propertiesFile = file.joinPath(buildToolDir, "source.properties");
        if (file.isFile(propertiesFile)) {
            var fileContent = file.read(propertiesFile, true);

            var lines = fileContent.split("\n");
            var index = -1;
            var version = "";
            for (var i = 0; i < lines.length; i++) {
                index = lines[i].indexOf("Revision");
                if (index != -1) {
                    version = lines[i].substring(lines[i].indexOf("=") + 1);
                    index = version.indexOf("\r");
                    if (index != -1) {
                        version = version.substring(0, index);
                    }
                    // console.log(version+":"+version.length+"; "+version.indexOf("\r")+" ; c = "+version.charCodeAt(version.length-1));
                    break;
                }
            }

            //console.log(propertiesFile + " : "+version);
            return version;
        } else {
            globals.log(1619, buildToolDir);
        }
        return "undefined";
    }

    private androidHomeWarnning = "请设置环境变量 ANDROID_HOME ，值为 Android SDK 的根目录。";

    private getAndroidBuildToolValue() {
        // check ANDROID_HOME
        var android_home = process.env.ANDROID_HOME
        if (!android_home) {
            console.error(this.androidHomeWarnning);
            globals.exit(1610);
        }

        //get Android build tool version
        var buildToolsPath = file.joinPath(android_home, "build-tools");
        if (!file.isDirectory(buildToolsPath)) {
            globals.log(1618, android_home);
            globals.exit(1611);
        }

        var files = file.getDirectoryListing(buildToolsPath, false);
        var length = files.length;

        var buildToolVersion = "undefined";
        var resultVersion = buildToolVersion;

        var versionValue = 0.0;
        var tempVersion = 0.0;
        for (var i = 0; i < length; i++) {
            if (files[i].charAt(0) == ".") {
                continue;
            }
            var path = files[i];
            if (file.isDirectory(path)) {
                buildToolVersion = this.getBuildToolVersion(path);
                if ("undefined" != buildToolVersion) {
                    versionValue = parseFloat(buildToolVersion);
                    if (versionValue > tempVersion) {
                        tempVersion = versionValue;
                        resultVersion = buildToolVersion;
                    }
                }
            }
        }
        //console.log("buildToolVersion = "+resultVersion);
        return resultVersion;
    };

    private getAndroidSDKAPILevel(platformDir) {
        var propertiesFile = file.joinPath(platformDir, "source.properties");
        //console.log("       >>> check source.properties = "+propertiesFile);
        if (file.isFile(propertiesFile)) {
            var fileContent = file.read(propertiesFile, true);

            var lines = fileContent.split("\n");
            var index = -1;
            var version = "";
            for (var i = 0; i < lines.length; i++) {
                index = lines[i].indexOf("AndroidVersion.ApiLevel");
                if (index != -1) {
                    version = lines[i].substring(lines[i].indexOf("=") + 1);
                    index = version.indexOf("\r");
                    if (index != -1) {
                        version = version.substring(0, index);
                    }
                    // console.log(version+":"+version.length+"; "+version.indexOf("\r")+" ; c = "+version.charCodeAt(version.length-1));
                    break;
                }
            }

            //console.log(propertiesFile + " : "+version);
            return version;
        } else {
            globals.log(1617, platformDir);
        }
        return "undefined";
    }

    private getAndroidSDKAPILevelValue(target_level?) {
        // check ANDROID_HOME
        var android_home = process.env.ANDROID_HOME
        if (!android_home) {
            console.error(this.androidHomeWarnning);
            globals.exit(1610);
        }

        //get Android build tool version
        var platformsPath = file.joinPath(android_home, "platforms");
        if (!file.isDirectory(platformsPath)) {
            globals.log(1616, android_home);
            globals.exit(1611);
        }

        var files = file.getDirectoryListing(platformsPath, false);
        var length = files.length;

        var platformVersion = "undefined";
        var resultVersion = platformVersion;

        var versionValue = 0.0;
        var tempVersion = 0.0;
        for (var i = 0; i < length; i++) {
            if (files[i].charAt(0) == ".") {
                continue;
            }
            var path = files[i];
            if (file.isDirectory(path)) {
                platformVersion = this.getAndroidSDKAPILevel(path);
                if ("undefined" != platformVersion) {
                    versionValue = parseInt(platformVersion);
                    //如果本地存在所需的SDK。直接返回
                    if ("undefined" != target_level && target_level == versionValue) {
                        resultVersion = target_level;
                        break;
                    }
                    if (versionValue > tempVersion) {
                        tempVersion = versionValue;
                        resultVersion = platformVersion;
                    }
                }
            }
        }
        //console.log("buildToolVersion = "+resultVersion);
        return resultVersion;
    };

    private modifyAndroidStudioSupport(app_path) {
        var buildToolVersion = this.getAndroidBuildToolValue();

        var platformVersion = this.getAndroidSDKAPILevelValue();
        //console.log("app_path:" + app_path);
        var buildGradleFile = file.joinPath(file.joinPath(file.joinPath(app_path, "proj.android"), "app"), "build.gradle");
        if (file.isFile(buildGradleFile)) {
            var c = file.read(buildGradleFile);
            c = c.replace(new RegExp("EGT_BUILD_TOOLS_VERSION", "g"), buildToolVersion);
            c = c.replace(new RegExp("EGT_ANDROID_SDK", "g"), platformVersion);
            file.save(buildGradleFile, c);
        } else {
            globals.log(1615, file.getAbsolutePath(app_path));
            globals.exit(1611);
        }

    };

    private modifyLocalProperties(app_path) {

        var android_home = process.env.ANDROID_HOME
        if (!android_home) {
            console.error(this.androidHomeWarnning);
            globals.exit(1612);
        }

        if (-1 != android_home.indexOf("\\")) {
            android_home = android_home.split("\\").join("\\\\");
        }

        var localPropertiesFile = file.joinPath(file.joinPath(app_path, "proj.android"), "local.properties");
        if (file.isFile(localPropertiesFile)) {
            var c = file.read(localPropertiesFile);
            c = c.replace(new RegExp("EGT_ANDROID_SDK_DIR", "g"), android_home);
            file.save(localPropertiesFile, c);
        } else {
            globals.exit(1614, file.getAbsolutePath(app_path));
        }

    };

    //获取当前ADT项目默认的Android API Level
    private getProjTargetAPILevel(app_path) {
        var projectPropertiesFile = file.joinPath(file.joinPath(app_path, "proj.android"), "project.properties");
        if (file.isFile(projectPropertiesFile)) {
            var fileContent = file.read(projectPropertiesFile, true);
            var lines = fileContent.split("\n");
            var index = -1;
            var index2 = -1;
            var version = "";
            for (var i = 0; i < lines.length; i++) {
                index = lines[i].indexOf("target");
                if (index != -1 && -1 != lines[i].indexOf("=")) {
                    version = lines[i].substring(lines[i].indexOf("-") + 1);

                    index = version.indexOf("\r");
                    if (index != -1) {
                        version = version.substring(0, index);
                    }
                    break;
                }
            }
            return version;
        }
        else {
            globals.log(1614, file.getAbsolutePath(app_path));
        }
        return "undefined";
    };

    //修正Android ADT Support 项目
    private modifyAndroidADTSupport(app_path) {
        var projTargetAPILevel = this.getProjTargetAPILevel(app_path);
        if (projTargetAPILevel == "undefined") {
            return;
        }
        var platformVersion = this.getAndroidSDKAPILevelValue(projTargetAPILevel);
        if (platformVersion == "undefined") {
            return;
        }

        if (parseInt(platformVersion) < parseInt(projTargetAPILevel)) {
            console.error("All installed platforms is lower then project target API level , project target API Levle is = " + projTargetAPILevel + "; app_path:" + app_path);
            return;
        }
        var projectPropertiesFile = file.joinPath(file.joinPath(app_path, "proj.android"), "project.properties");
        if (file.isFile(projectPropertiesFile)) {
            var fileContent = file.read(projectPropertiesFile);
            var lines = fileContent.split("\n");
            var len = lines.length;
            var i = 0;
            for (i = 0; i < len; i++) {
                let index = lines[i].indexOf("target");
                if (index != -1 && -1 != lines[i].indexOf("=")) {
                    let version = lines[i].substring(lines[i].indexOf("-") + 1);
                    index = version.indexOf("\r");
                    if (index != -1) {
                        version = version.substring(0, index);
                    }

                    var resultLine = lines[i].replace(new RegExp(version, "g"), platformVersion);
                    fileContent = fileContent.replace(new RegExp(lines[i], "g"), resultLine);

                    file.save(projectPropertiesFile, fileContent);
                    break;
                }
            }
        }
        else {
            globals.log(1614, file.getAbsolutePath(app_path));
            globals.exit(1611);
        }
    };

    private run_unzip(app_path, template_path, app_data) {
        var template_zip_path = file.joinPath(template_path, app_data["template"]["zip"]);
        var cmd = "unzip -q " + globals.addQuotes(template_zip_path) + " -d " + globals.addQuotes(app_path);
        //执行异步方法必须指定返回值为DontExitCode
        this.executeRes = DontExitCode;
        var self = this;
        var build = cp_exec(cmd);
        build.stderr.on("data", function (data) {
            globals.log(data);
        });
        build.on("exit", function (result) {
            if (result == 0) {
                self.rename_app(app_path, app_data);
            } else {
                globals.log(1613);
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
