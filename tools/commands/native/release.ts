import * as fs from '../../lib/FileUtil';
import * as config from './config';
import * as path from "path";
import {shell} from "../../lib/utils";

export async function run(releaseConfig: config.Arguments) {

    if(!releaseConfig.androidProjectPath || !releaseConfig.sdk){
        globals.exit(13000);
    }

    let android_path = releaseConfig.androidProjectPath;
    android_path = path.resolve(config.egretProjectPath, android_path);

    let sdk = releaseConfig.sdk;
    await upgradeAntBuildXML("EgretGame", android_path);
    await upgradeAntBuildXML(`EgretGame.${sdk}`, `${android_path}.${sdk}`);

    let ant_dir = await config.getConfig(config.KEY.ANT_DIR_PATH);
    let ant = path.join(ant_dir, "ant");

    await shell(ant, ["debug"], { cwd: `${android_path}.${sdk}` });

}


async function upgradeAntBuildXML(name, android_path) {
    let android_sdk = await config.getConfig(config.KEY.ANDROID_SDK);
    let android_command = path.join(android_sdk, "tools/android");
    let args = ["update", "project", "--name", name, "--target", "android-19", "--path", android_path]
    await shell(android_command, args, {});

}