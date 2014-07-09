var fs = require('fs');
var path = require('path');
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var file = require('../core/file.js');

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
            globals.exit(1603);
        }
    });
}


function create_app_from(app_name, h5_path, template_path) {
    var app_data = JSON.parse(file.read(path.join(template_path, "create_app.json")));
    if (!app_data) {
        globals.exit(1602);
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
    var preferences = get_preferences(h5_path);
        if (preferences["support_path"] === undefined) {
        preferences["support_path"] = [];
    }
    app_data.game.target.forEach(function(target) {
        preferences["support_path"].push(path.join(app_name, target));
        preferences["game_dir_tree"].forEach(function(branch) {
            var target_dir = path.join(app_name, target, branch);
            file.copy(path.join(h5_path, branch), path.join(target_dir));
            file.remove(path.join(target_dir, ".gitignore"));
        });
    });
    file.save(path.join(h5_path, "egretProperties.json"), JSON.stringify(preferences, null, '\t') + '\n');
}

function get_preferences(h5_path) {
    var preferences_file = path.join(h5_path, "egretProperties.json");
    var content = file.read(preferences_file);
    if (content == "") {
        return null;
    }
    var preferences = JSON.parse(file.read(content));
    if (!preferences) {
        globals.exit(1604);
    }
    return preferences;
}

function build_copy_from(h5_path) {
    var preferences = get_preferences(h5_path);
    if (preferences == null || preferences["support_path"] === undefined) {
        return;
    }
    preferences["support_path"].forEach(function(target) {
        preferences["game_dir_tree"].forEach(function(branch) {
           file.copy(path.join(h5_path, branch), path.join(target, branch));
        });
    });
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