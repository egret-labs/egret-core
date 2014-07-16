var fs = require('fs');
var path = require('path');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require('../core/file.js');


var CREATE_APP = "create_app.json";
var PREFERENCES = "egretProperties.json";


function run(dir, args, opts) {
	var app_name = args[0];
    var template_path = opts["-t"];
	var h5_path = opts["-f"];
	if (!app_name || !h5_path || !template_path) {
		globals.exit(1601);
	}
    globals.log("> compile html project to android/ios ...");
    // egert build h5_project -e --runtime native
    var cmd = "egret build " + path.resolve(h5_path[0]) + " --runtime native -e";
    var cp_exec = require('child_process').exec;
    var build = cp_exec(cmd);
    build.stderr.on("data", function(data) {
        console.log(data);
    });
    build.on("exit", function(result) {
        if (result == 0) {
            create_app_from(path.resolve(app_name), path.resolve(h5_path[0]), path.resolve(template_path[0]));
        } else {
            globals.exit(1604);
        }
    });
}


function create_app_from(app_name, h5_path, template_path) {
    var preferences = read_json_from(path.join(h5_path, PREFERENCES));
    if (!preferences || !preferences["native"] || !preferences["native"]["path_ignore"]) {
        globals.exit(1602);
    }
    var app_data = read_json_from(path.join(template_path, CREATE_APP));
    if (!app_data) {
        globals.exit(1603);
    }

    // copy from project template
    globals.log("> copy from project template ...");
    app_data.template.source.forEach(function(source) {
        file.copy(path.join(template_path, source), path.join(app_name, source));
    });

    // replace keyword in content
    globals.log("> replace all configure elements ...");
    app_data.rename_tree.content.forEach(function(content) {
        var target_path = path.join(app_name, content);
        var c = file.read(target_path);
        c = c.replace(new RegExp(app_data.template_name, "g"), path.basename(app_name));
        file.save(target_path, c);
    });

    // rename keyword in project name
    globals.log("> rename project name ...");
    app_data.rename_tree.file_name.forEach(function(f) {
        var str = path.join(app_name, f);
        fs.renameSync(str, str.replace(app_data.template_name, path.basename(app_name)));
    });

    // copy h5 res into here
    globals.log("> copy h5 resources into " + app_name + " ...");
    if (preferences["native"]["support_path"] === undefined) {
        preferences["native"]["support_path"] = [];
    }
    var target_list = [];
    app_data.game.target.forEach(function(target) {
        target_list.push(path.join(app_name, target));
    });
    preferences["native"]["support_path"] = preferences["native"]["support_path"].concat(target_list);
    file.save(path.join(h5_path, PREFERENCES), JSON.stringify(preferences, null, '\t'));

    build_copy(h5_path, preferences["native"]["path_ignore"], target_list);
    target_list.forEach(function(target) {
        file.remove(path.join(target, "egret-game/.gitignore"));
    });
}

function read_json_from(json_file) {
    if (!fs.existsSync(json_file)) {
        return null;
    } else {
        return JSON.parse(file.read(json_file));
    }
}

function build_copy(h5_path, ignore_list, target_path_list) {
    target_path_list.forEach(function(target) {
        var copy_tree = file.getDirectoryListing(h5_path);
        copy_tree.forEach(function(branch) {
            branch = path.basename(branch);
            if (ignore_list.indexOf(branch) == -1) {
                file.copy(path.join(h5_path, branch), path.join(target, branch));
            }
        });
    });
}

function build_copy_from(h5_path) {
    var preferences = read_json_from(path.join(h5_path, PREFERENCES));
    if (!preferences ||
        preferences["native"] === undefined ||
        preferences["native"]["path_ignore"] === undefined ||
        preferences["native"]["support_path"] === undefined) {
        return;
    }
    build_copy(h5_path, preferences["native"]["path_ignore"], preferences["native"]["support_path"]);
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
exports.build_copy_from = build_copy_from;