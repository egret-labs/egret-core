
import * as fs from '../../lib/FileUtil';
import * as path from "path";
import * as config from './config';
import * as android from "./android";
import {CliException} from '../../lib/utils';

namespace PLATFORM {

    export const IOS = "ios";

    export const ANDROID = "android"
}

export async function run() {
    console.log("native create start!");
    let param = await config.getAllConfig();
    console.log("AllConfigShow",param);
    param = config.validateConfigs(param, [
        config.KEY.ANDROID_SUPPORT,
        config.Selector.android_support_path,
        config.Selector.channel_sdk
    ]);
    let androidProjectPathWithEgret = param.androidProjectPath;
    let absolutePath = path.resolve(config.egretProjectPath, androidProjectPathWithEgret);
    var egretPropertiesFilename = path.join(config.egretProjectPath, "egretProperties.json");
    var egretProperties:any = await fs.readJSONAsync(egretPropertiesFilename, { "encoding": "utf-8" });
    egretProperties.native["android_path"] = androidProjectPathWithEgret;
    await fs.writeJSONAsync(egretPropertiesFilename, egretProperties);
    let android_support_path = path.join(await config.getConfig(config.KEY.ANDROID_SUPPORT), "proj.android");
    await fs.copyAsync(android_support_path, absolutePath);
    await android.modifyAndroidProject(absolutePath, param.packageName)
    await handleSDKProject(param);
}

async function handleSDKProject(param: config.Arguments) {
    let projectName = path.resolve(config.egretProjectPath, param.androidProjectPath);
    //有sdk工程创建sdk工程
    if (param.sdk !== undefined) {
        //与android工程同级

        let projectSdkName = path.resolve(projectName, `../${path.basename(projectName)}.${param.sdk}`);
        param.androidSdkProjectPath = path.relative(process.cwd(), projectSdkName);
        // 去除自动写入 需要手动写入文件
        // config.setProjectConfig(`android-sdk-${param.sdk}-path`, param.androidSdkProjectPath);
        //拷贝sdk工程
        let android_support_sdk_path = path.join(await config.getConfig(config.KEY.ANDROID_SUPPORT), `proj.android.${param.sdk}`);
        if (!fs.existsSync(android_support_sdk_path)) {
            throw new CliException(1002, param.sdk);
        }
        console.log(`copying from ${android_support_sdk_path} to ${projectSdkName}`);
        await fs.copyAsync(android_support_sdk_path, projectSdkName);
        //引用proj.android工程

        await android.markAndroidProjectAsLib(projectName);
        var libIndex = 1;
        if ("apus" === param.sdk) {
            libIndex = 5;
        }
        await android.addAndroidProjectLib(projectSdkName, projectName, libIndex);

        //修改继承Activity
        let mainActivityPath = path.join(projectSdkName, "src/com/egret/androidsupport/", param.sdk, "MainActivity.java");
        console.log("MainActivityPath", mainActivityPath);
        await android.changeInheritActivity(mainActivityPath, param.packageName);

        //修改sdk工程包名
        let sdkPackageName = `${param.packageName}.${param.sdk}`;
        await android.modifyAndroidSDKProject(param.sdk, param.androidSdkProjectPath, sdkPackageName);

    }
}