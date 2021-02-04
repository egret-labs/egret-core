import file = require('../lib/FileUtil');
import service = require('../service/index');
import Project = require('../project');
import path = require('path');
import utils = require('../lib/utils')
import doT = require('../lib/doT');
import projectAction = require('../actions/Project');
import Clean = require('./clean');
type VersionInfo = {

    v: string,
    command?: { new(): egret.Command }
}

class UpgradeCommand implements egret.Command {

    constructor() {
    }

    execute(): number {

        utils.checkEgret();


        var version = Project.projectData.getVersion();
        const versionArr = version.split(".");
        let majorVersion = parseInt(versionArr[0]);
        let middleVersion = parseInt(versionArr[1]);
        if (majorVersion == 5 && middleVersion != 0) {
            this.run();
        }
        else {
            globals.exit(1719);
        }


        return DontExitCode
    }

    private async run() {
        var version = Project.projectData.getVersion();
        if (!version) {
            version = "5.1.0";
        }


        let upgradeConfigArr: VersionInfo[] = [
            { "v": "5.1.1", command: Upgrade_5_1_1 },
            { "v": "5.1.2", command: Upgrade_5_1_2 },
            { "v": "5.2.13", command: Upgrade_5_2_13 },
            { "v": "5.2.17", command: Upgrade_5_2_17 },
            { "v": "5.2.19", command: Upgrade_5_2_19 },
            { "v": "5.2.22", command: Upgrade_5_2_22 },
            { "v": "5.2.23", command: Upgrade_5_2_23 },
            { "v": "5.2.25", command: Upgrade_5_2_25 },
            { "v": "5.2.28", command: Upgrade_5_2_28 },
            { "v": "5.2.31", command: Upgrade_5_2_31 },
            { "v": "5.2.32", command: Upgrade_5_2_32 },
            { "v": "5.2.33", command: Upgrade_5_2_33 },
            { "v": "5.3.5", command: Upgrade_5_3_5 },
            { "v": "5.3.6", command: Upgrade_5_3_6 },
            { "v": "5.3.8", command: Upgrade_5_3_8 },
            { "v": "5.3.9", command: Upgrade_5_3_9 },
            { "v": "5.3.10", command: Upgrade_5_3_10 },
            { "v": "5.4.0", command: Upgrade_5_4_0 },
        ];

        try {
            await series(upgrade, upgradeConfigArr.concat())
            Project.projectData.save(upgradeConfigArr.pop().v);
            globals.log(1702);
            service.client.closeServer(Project.projectData.getProjectRoot())
            await new Clean().execute();
            let source = path.join(egret.root, "tools/templates/empty/scripts/api.d.ts");
            let target = path.join(egret.args.projectDir, "scripts/api.d.ts");
            file.copy(source, target);
            globals.exit(0);
        }
        catch (e) {
            globals.log(1717);
            console.log(e)
            globals.exit(1705);
        }
    }
}



let series = <T>(cb: (data: T, index?: number, result?: any) => PromiseLike<number>, arr: T[]) => {

    let parallel = 1;

    // allow default parallel count of 1 if array
    // passed as second param (this a good idea?)
    if (Array.isArray(parallel)) {
        arr = parallel;
        parallel = 1;
    }

    const results = [];
    const promises = [];

    for (var i = 0; i < parallel; i++)
        promises.push(Promise.resolve());

    arr.forEach((item, ix) => {

        const position = ix % parallel;
        const promise = promises[position];

        promises[position] = promise.then(() => {
            return Promise.resolve(cb(item, ix, results))
                .then(res => results.push(res));
        });
    });

    return Promise.all(promises)
        .then(() => results);
}

function upgrade(info: VersionInfo) {
    var version = Project.projectData.getVersion();
    var v = info.v;
    var command: egret.Command;
    if (info.command) {
        command = new info.command();
    }
    var result = globals.compressVersion(version, v);
    if (result < 0) {
        globals.log(1704, v);
        if (!command) {
            return Promise.resolve(0);
        } else {
            var commandPromise = command.execute();
            if (typeof commandPromise == 'number') {
                console.error('internal error !!!')
            }
            else {
                return commandPromise;
            }

        }

    } else {
        return Promise.resolve(0)
    }
}


class Upgrade_5_1_1 {
    async execute() {
        return 0;
    }
}

class Upgrade_5_1_2 {
    async execute() {
        console.log("【警告】: 如果您尝试发布到微信小游戏，建议您创建一个新项目，而不是使用 egret upgrade 命令")
        return 0;
    }
}

class Upgrade_5_2_13 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "baidugame"), path.join(egret.args.projectDir, "scripts", "baidugame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.baidugame.ts"), path.join(egret.args.projectDir, "scripts", "config.baidugame.ts"));
        return 0;
    }
}

class Upgrade_5_2_17 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qgame"), path.join(egret.args.projectDir, "scripts", "qgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qgame.ts"));
        return 0;
    }
}

class Upgrade_5_2_19 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "oppogame"), path.join(egret.args.projectDir, "scripts", "oppogame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.oppogame.ts"), path.join(egret.args.projectDir, "scripts", "config.oppogame.ts"));
        return 0;
    }
}

class Upgrade_5_2_22 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
        return 0;
    }
}

class Upgrade_5_2_23 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
        return 0;
    }
}

class Upgrade_5_2_25 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qqgame"), path.join(egret.args.projectDir, "scripts", "qqgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qqgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qqgame.ts"));

        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "mygame"), path.join(egret.args.projectDir, "scripts", "mygame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.mygame.ts"), path.join(egret.args.projectDir, "scripts", "config.mygame.ts"));
        return 0;
    }
}

class Upgrade_5_2_28 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
        return 0;
    }
}
class Upgrade_5_2_31 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "wxgame"), path.join(egret.args.projectDir, "scripts", "wxgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.wxgame.ts"), path.join(egret.args.projectDir, "scripts", "config.wxgame.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
        return 0;
    }
}
class Upgrade_5_2_32 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qqgame"), path.join(egret.args.projectDir, "scripts", "qqgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qqgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qqgame.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
        return 0;
    }
}
class Upgrade_5_2_33 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "mygame"), path.join(egret.args.projectDir, "scripts", "mygame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.mygame.ts"), path.join(egret.args.projectDir, "scripts", "config.mygame.ts"));
        return 0;
    }
}
class Upgrade_5_3_5 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qhgame"), path.join(egret.args.projectDir, "scripts", "qhgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qhgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qhgame.ts"));
        return 0;
    }
}

class Upgrade_5_3_6 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "wxgame"), path.join(egret.args.projectDir, "scripts", "wxgame"));
        return 0;
    }
}
class Upgrade_5_3_8 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "ttgame"), path.join(egret.args.projectDir, "scripts", "ttgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.ttgame.ts"), path.join(egret.args.projectDir, "scripts", "config.ttgame.ts"));
        return 0;
    }
}
class Upgrade_5_3_9 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "fastgame"), path.join(egret.args.projectDir, "scripts", "fastgame"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.fastgame.ts"), path.join(egret.args.projectDir, "scripts", "config.fastgame.ts"));
        return 0;
    }
}
class Upgrade_5_3_10 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "tbcreativeapp"), path.join(egret.args.projectDir, "scripts", "tbcreativeapp"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.tbcreativeapp.ts"), path.join(egret.args.projectDir, "scripts", "config.tbcreativeapp.ts"));
        return 0;
    }
}
class Upgrade_5_4_0 {
    async execute() {
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.ts"), path.join(egret.args.projectDir, "scripts", "config.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.wxgame.ts"), path.join(egret.args.projectDir, "scripts", "config.wxgame.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "plugins", "iconv-lite"), path.join(egret.args.projectDir, "scripts", "plugins", "iconv-lite"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "plugins", "wxgameIDEPlugin.ts"), path.join(egret.args.projectDir, "scripts", "plugins", "wxgameIDEPlugin.ts"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.tbcreativewidget"), path.join(egret.args.projectDir, "scripts", "config.tbcreativewidget"));
        file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "tbcreativewidget"), path.join(egret.args.projectDir, "scripts", "tbcreativewidget"));
        return 0;
    }
}
export = UpgradeCommand;
