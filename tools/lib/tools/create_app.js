var fs = require('fs');
var path = require('path');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require('../core/file.js');

function run(dir, args, opts) {
    if(!args || !args[0] || !opts["-f"] || !opts["-t"]) {
        globals.exit(1601);
    }
	var arg_app_name = args[0];
    var template_path = opts["-t"][0];
	var arg_h5_path = opts["-f"][0];

    var startTime = Date.now();

    var app_data = read_json_from(path.join(template_path, "create_app.json"));
    if (!app_data) {
        globals.exit(1603);
    }

    var platform = "";

    if (file.exists(path.join(template_path, "proj.android"))) {//android
        platform = "android";
    }
    else if (file.exists(path.join(template_path, "proj.ios"))) {//ios
        platform = "ios";
    }
    else {
        globals.exit(1601);
    }

    var projectPath = path.join(arg_h5_path);
    var nativePath = path.join(arg_app_name);


    file.remove(nativePath);

    //生成native工程
    create_app_from(nativePath, template_path, app_data);

    //修改egretProperties.json文件路径
    var properties = JSON.parse(file.read(path.join(projectPath, "egretProperties.json")));
    if (properties["native"] == null) {
        properties["native"] = {};
    }
    properties["native"][platform + "_path"] = path.relative(projectPath, nativePath);
    file.save(path.join(projectPath, "egretProperties.json"), JSON.stringify(properties, null, "\t"));

    //拷贝项目到native工程中
    var cpFiles = require("../core/copyProjectFiles.js");
    cpFiles.copyFilesToNative(projectPath, nativePath, platform, properties["native"]["path_ignore"] || []);

    console.log("创建完毕，共计耗时：%d秒", (Date.now() - startTime) / 1000);
}

function create_app_from(app_path, template_path, app_data) {
    // copy from project template
    globals.log("> copy from project template ...");
    app_data["template"]["source"].forEach(function(source) {
        file.copy(path.join(template_path, source), path.join(app_path, source));
    });

    // replace keyword in content
    globals.log("> replace all configure elements ...");
    app_data["rename_tree"]["content"].forEach(function(content) {
        var target_path = path.join(app_path, content);
        var c = file.read(target_path);
        c = c.replace(new RegExp(app_data["template_name"], "g"), path.basename(app_path));
        file.save(target_path, c);
    });

    // rename keyword in project name
    globals.log("> rename project name ...");
    app_data["rename_tree"]["file_name"].forEach(function(f) {
        var str = path.join(app_path, f);
        var offset = app_data["template_name"].length;
        var index = str.lastIndexOf(app_data["template_name"]);
        if (index > 0) {
            var target_str = str.substring(0, index) + path.basename(app_path) + str.substring(index + offset);
            fs.renameSync(str, target_str);
        }
    });
}

function read_json_from(json_file) {
    if (!fs.existsSync(json_file)) {
        return null;
    } else {
        return JSON.parse(file.read(json_file));
    }
}


function help_title() {
    return "从h5游戏生成app\n";
}


function help_example() {
    return "egret create_app [app_name] -f [h5_game_path] -t [template_path]";
}


exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;