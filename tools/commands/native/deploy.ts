import * as fs from '../../lib/FileUtil';
import * as config from './config';
import {shell} from '../../lib/utils';
import * as path from "path";

export async function run(deployConfig: config.Arguments) {
    console.log("native deploy start!");
    if(!deployConfig.androidProjectPath){
        globals.exit(13000);
    }
    var args = [
        "build",
        config.egretProjectPath,
        "-e",
        "--runtime",
        "native"
    ];
    // let android_path = await config.getConfig(config.KEY.ANDROID_PROJECT_PATH);
    let android_path = deployConfig.androidProjectPath;

    let egret_game_android_path = path.resolve(config.egretProjectPath, android_path, "assets/egret-game");
    let egret_game_android_path_polyfill = path.resolve(config.egretProjectPath, android_path, "proj.android/assets/egret-game");

    let shellCommand = process.platform == "win32" ? "egret.cmd" : "egret";

    await shell(shellCommand, args, {});
    await fs.removeAsync(egret_game_android_path);
    await fs.moveAsync(egret_game_android_path_polyfill, egret_game_android_path);
    await fs.removeAsync(egret_game_android_path_polyfill);
    if (deployConfig.sdk) {
        let android_sdk_path = path.resolve(config.egretProjectPath, android_path, `../${path.basename(android_path)}.${deployConfig.sdk}`);
        // let android_sdk_path = config.getConfig(`android-sdk-${deployConfig.sdk}-path`);
        let egret_game_android_sdk_path = path.resolve(android_sdk_path, "assets/egret-game");
        await fs.copyAsync(egret_game_android_path, egret_game_android_sdk_path);
    }
}
