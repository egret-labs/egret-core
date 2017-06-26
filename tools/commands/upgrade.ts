import file = require('../lib/FileUtil');
import service = require('../service/index');
import Project = require('../project/EgretProject');
import path = require('path');
import utils = require('../lib/utils')
import modify = require("./upgrade/ModifyProperties");
import doT = require('../lib/doT');
import projectAction = require('../actions/Project');

type VersionInfo = {

    v: string,
    command?: { new (): egret.Command }
}

class UpgradeCommand implements egret.Command {

    constructor() {
    }

    execute(): number {

        utils.checkEgret();
        this.run();
        return DontExitCode
    }

    private async run() {
        var version = Project.data.getVersion();
        if (!version) {
            version = "1.0.0";
        }


        let upgradeConfigArr: VersionInfo[] = [
            { "v": "4.0.1", command: Upgrade_4_0_1 },
            { "v": "4.0.3" },
            { "v": "4.1.0", command: Upgrade_4_1_0 },
            { "v": "5.0.0" },
            { "v": "5.1.0", command: Upgrade_5_1_0 }
        ];

        try {
            modify.initProperties();
            await series(upgrade, upgradeConfigArr.concat())
            modify.save(upgradeConfigArr.pop().v);
            globals.log(1702);
            await service.client.closeServer(Project.data.getProjectRoot())
            globals.exit(0);
        }
        catch (e) {
            console.log("升级中断，具体原因如下")
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
    var version = Project.data.getVersion();
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


class Upgrade_4_0_1 {


    async execute() {

        let tsconfigPath = Project.data.getFilePath('tsconfig.json');
        if (!file.exists(tsconfigPath)) {
            let source = file.joinPath(egret.root, "tools/templates/empty/tsconfig.json");
            let target = Project.data.getFilePath("tsconfig.json")
            file.copy(source, target);
        }
        let tsconfigContent = file.read(tsconfigPath);
        let tsconfig = JSON.parse(tsconfigContent);
        let needLibs = [
            "es5", "dom", "es2015.promise"
        ];
        if (!tsconfig.compilerOptions.lib) {
            tsconfig.compilerOptions.lib = [];
        }
        needLibs.forEach(lib => {
            if (tsconfig.compilerOptions.lib.indexOf(lib) == -1) {
                tsconfig.compilerOptions.lib.push(lib);
            }
        })
        tsconfigContent = JSON.stringify(tsconfig, null, "\t");
        file.save(tsconfigPath, tsconfigContent);
        file.copy(path.join(egret.root, 'tools/templates/empty/polyfill'), Project.data.getFilePath('polyfill'));

        globals.log(1703, "https://github.com/egret-labs/egret-core/tree/master/docs/cn/release-note/4.0.1")

        return 0;
    }
}

class Upgrade_4_1_0 {
    /**
     * 将用户的系统内置模块添加 path 字段，并指向老版本的模块，而非新版本模块
     */
    async execute() {
        modify.upgradeModulePath();
        globals.log(1703, "https://github.com/egret-labs/egret-core/tree/master/docs/cn/release-note/4.1.0")
        return 0;
    }
}

class Upgrade_5_1_0 {
    async execute() {
        let options = egret.args;
        if (file.exists(file.joinPath(options.projectDir, "polyfill"))) {
            file.rename(file.joinPath(options.projectDir, "polyfill"), file.joinPath(options.projectDir, "promise"));
        }
        let jsonPath = file.joinPath(options.projectDir, "egretProperties.json");
        let json = JSON.parse(file.read(jsonPath));
        let modules = json.modules;
        modules.push({ name: "promise", path: "./promise" });
        file.save(jsonPath, JSON.stringify(json, undefined, "\t"));
        modify.initProperties();
        return 0;
    }
}

export = UpgradeCommand;