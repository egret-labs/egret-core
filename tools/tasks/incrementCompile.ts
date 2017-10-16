import * as EgretProject from '../project/EgretProject';
import * as fs from 'fs';
import * as FileUtil from '../lib/FileUtil';
import * as Compiler from '../actions/Compiler';
import * as utils from '../lib/utils';
import * as  service from '../service/index';
import * as project from '../project/EgretProject';
import * as path from 'path';

export default {
    name: "incrementCompile",
    onFile: async (file) => {
        return file;
    },
    onFinish: async (pluginContext) => {

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

    if (!cmd.exitCode && egret.args.platform) {
        setTimeout(() => callback(0), 500);
    }
    else
        callback(cmd.exitCode || 0);
}