/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import BuildCommand = require("./BuildCommand");
import config = require("../lib/ProjectConfig");


class CreateCommand implements egret.Command {

    execute():number {
        var projectName = params.getCommandArgs()[0];
        if (!projectName) {
            globals.exit(1001);
        }
        var projectPath = file.resolve(projectName);

        var type = params.getOption("--type", ["core", "gui", "empty", "eui"]);
        var async = globals.getAsync();
        async.series([
            //创建新工程
            (callback)=> {
                globals.log(1003);
                //拷贝空模板
                this.copyFileDir(projectPath, "tools/templates/empty");

                if (type != "empty") {
                    //拷贝core模板
                    this.copyFileDir(projectPath, "tools/templates/game");

                    //gui 用gui覆盖刚拷贝的文件
                    if (type == "gui") {
                        //删除assets文件夹
                        file.remove(file.join(projectPath, "resource"));

                        this.copyFileDir(projectPath, "tools/templates/gui");
                    }
                    //gui 用gui覆盖刚拷贝的文件
                    else if (type == "eui") {
                        //删除assets文件夹
                        file.remove(file.join(projectPath, "resource"));

                        this.copyFileDir(projectPath, "tools/templates/eui");
                    }
                }

                //根据package.json写入项目配置文件中的egret版本号
                var currentVersion = params.getEgretVersion();
                var egretPropertiesTxt = file.read(file.join(projectPath, "egretProperties.json"));
                egretPropertiesTxt = egretPropertiesTxt.replace("{version_replace}", currentVersion);
                file.save(file.join(projectPath, "egretProperties.json"), egretPropertiesTxt);

                callback();
            },

            //编译工程
            function (callback) {
                globals.log2(1004);

                params.setArgv({
                    name: "build",
                    currDir: projectPath,
                    args: [],
                    opts: {"-e": []}
                });

                config.init();
                var build = new BuildCommand();
                build.execute();
            },

            function (callback) {
                globals.log(1005);
            }
        ]);
        return 0;
    }

    private copyFileDir(projectPath, dir) {
        file.copy(file.join(params.getEgretRoot(), dir),
            projectPath);
        if (process.platform != "win32") {
            var list = file.search(projectPath, "bat");
            list = list.concat(file.search(projectPath, "cmd"));
            for (var i = list.length - 1; i >= 0; i--) {
                file.remove(list[i]);
            }
        }
    }
}


export = CreateCommand;
