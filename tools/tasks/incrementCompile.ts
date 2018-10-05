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
        // console.log("1   executeBuildCommand", {
        //     path: egret.args.projectDir,
        //     command: "build",
        //     option: egret.args
        // });
        service.client.execCommand({
            path: egret.args.projectDir,
            command: "build",
            option: egret.args
        }, cmd => onGotBuildCommandResult(cmd, (errorcode) => {
            global.exitCode = errorcode;
            resolve();
        }), true);
    });
}


function onGotBuildCommandResult(cmd: egret.ServiceCommandResult, callback: (exitCode: number) => void) {
    if (!cmd.exitCode) {
        if (cmd.messages) {
            cmd.messages.forEach(m => console.log(m));
        }
        setTimeout(() => callback(0), 500);
    }
    else {
        if (cmd.exitCode == 0) {
            if (cmd.messages) {
                cmd.messages.forEach(m => console.log(m));
            }
        }
        else {
            if (cmd.messages) {
                cmd.messages.forEach(m => console.error(m));
            }
        }
        callback(cmd.exitCode || 0);
    }


}