var path = require("../core/path");
var globals = require("../core/globals");
var param = require("../core/params_analyze.js");
var async = require('../core/async');
var compiler = require("./compile.js")
var file = require("../core/file.js");
var build = require("./build.js");

/**
 * 创建新项目
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currDir, args, opts) {
    var projectName = args[0];
    if (!projectName) {
        globals.exit(1001);
    }
    var projectPath = path.resolve(projectName);
    if(file.exists(projectPath)) {
        globals.exit(1002);
    }
    var type = param.getOption(opts, "--type", ["core", "gui", "empty"]);
    async.series([

        //创建新工程
        function (callback) {
            globals.log(1003);
            //拷贝空模板
            copyFileDir(projectPath, "tools/templates/empty");

            if (type != "empty") {
                //拷贝core模板
                copyFileDir(projectPath, "tools/templates/game");

                //gui 用gui覆盖刚拷贝的文件
                if (type == "gui") {
                    //删除assets文件夹
                    file.remove(path.join(projectPath, "resource"));

                    copyFileDir(projectPath, "tools/templates/gui");
                }
            }

            //根据package.json写入项目配置文件中的egret版本号
            var currentVersion = globals.getPackageJsonConfig().version;
            var egretPropertiesTxt = file.read(path.join(projectPath, "egretProperties.json"));
            egretPropertiesTxt = egretPropertiesTxt.replace("{version_replace}",currentVersion);
            file.save(path.join(projectPath, "egretProperties.json"), egretPropertiesTxt);

            callback();
        },

        //编译工程
        function (callback) {
            globals.log2(1004);
            build.run(currDir, [projectName], {"-e":[]});
        },

        function (callback) {
            globals.log(1005);
        }
    ])

}

function copyFileDir(projectPath, dir) {
    file.copy(path.join(param.getEgretPath(), dir),
        projectPath);
    if (process.platform != "win32") {
        var list = file.search(projectPath, "bat");
        list = list.concat(file.search(projectPath, "cmd"));
        for (var i = list.length - 1; i >= 0; i--) {
            file.remove(list[i]);
        }
    }
}

exports.run = run;