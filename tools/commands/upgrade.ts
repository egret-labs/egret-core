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
            { "v": "5.2.20" }
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
export = UpgradeCommand;
