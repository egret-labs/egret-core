/**
 * Created by yanjiaqi on 15/9/7.
 */
/// <reference path="../lib/types.d.ts" />


//import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import service = require('../service/index');
//import config = require('../lib/ProjectConfig');
//import globals = require("../Globals");


type VersionInfo = {

    v: string,
    command?: { new (): egret.Command }
}

class UpgradeCommand implements egret.Command {

    constructor() {
    }

    execute(): number {
        this.run();
        return DontExitCode
    }

    private async run() {
        //var currDir = params.getProjectRoot();

        //var config = require("../core/projectConfig.js");
        //config.init(currDir);
        var version = egret.args.properties.getVersion();
        if (!version) {
            version = "1.0.0";
        }
        var modify = require("./upgrade/ModifyProperties");

        let upgradeConfigArr: VersionInfo[] = [
            { "v": "4.0.1", command: Upgrade_4_0_1 }
        ];

        try {
            await series(upgrade, upgradeConfigArr.concat())
            modify.save(upgradeConfigArr.pop().v);
            service.execCommand({
                path: egret.args.projectDir,
                command: "shutdown",
                option: egret.args
            }, (e) => {
                globals.log(1702);
                return globals.exit(0);
            }, true);
        }
        catch (e) {
            // console.log (111)
            console.log(e)
            globals.exit(1705);
        }
    }
}


let series = <T>(cb: (data: T, index?: number, result?: any) => Promise<number>, arr: T[]) => {

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
    var version = egret.args.properties.getVersion();
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
                return new Promise((reslove, reject) => {
                    let p = commandPromise as Promise<number>
                    p.then(() => {
                        reslove(0)
                    }).catch(() => {
                        reject('升级中断')
                    })
                })
            }

        }

    } else {
        return Promise.resolve(0)
    }
}


class Upgrade_4_0_1 {


    execute() {
        return Promise.resolve(0)
    }
}

export = UpgradeCommand;