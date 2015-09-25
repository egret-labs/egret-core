
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import childProcess = require("child_process");

export function buildRunEmulate(callback: (code: number) => void) {
    exec(egret.args.command, [egret.args.platform], callback);
}



function exec(command: string, params: string[], callback: Function) {
    var cdvProcess = childProcess.exec(`cordova ${command} ${params.join(' ')}`, {}, (e, stdout, stdin) => { console.log(e) });
    cdvProcess.stdout.on("data", data=> console.log("/"+data));
    cdvProcess.stderr.on("data", data=> console.log("/"+data));
    cdvProcess.on("close", code=> callback(code));
    cdvProcess.on("error", (ee) => console.log("error when build", ee));
}