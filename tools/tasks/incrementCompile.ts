import * as EgretProject from '../project';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as  service from '../service/index';
import * as path from 'path';

export class IncrementCompilePlugin {

    async onFile(file) {
        return file;
    }

    async onFinish(pluginContext) {
        await executeBuildCommand();
    }
}


function executeBuildCommand() {

    return new Promise((resolve, reject) => {

        service.client.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, cmd => onGotBuildCommandResult(cmd, () => {
            resolve();
        }), true);
    });
}


function onGotBuildCommandResult(cmd: egret.ServiceCommandResult, callback: (exitCode: number) => void) {
    if (cmd.messages) {
        cmd.messages.forEach(m => console.log(m));
    }

    if (!cmd.exitCode) {
        setTimeout(() => callback(0), 500);
    }
    else
        callback(cmd.exitCode || 0);
}