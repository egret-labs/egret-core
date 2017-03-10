import * as fs from '../../lib/FileUtil';
import * as path from 'path';
import {CliException} from '../../lib/utils';

declare var globalConfig;

export var egretProjectPath;
let projectConfig = {};
global['globalConfig'] = {};
let configValidator = {};

export async function getConfig(key: string | ConfigEntity) {
    let result;

    if (typeof key === "string") {
        if (projectConfig[key]) {
            result = projectConfig[key];
        }
        if (globalConfig[key]) {
            result = globalConfig[key]
        }
        if (!result) {
            throw new CliException(1000, key);
        }
        if (configValidator[key]) {
            var validator = configValidator[key];
            validator(result);
        }
        if (KEY.ANDROID_SUPPORT === key) {
            if (!testAndroidSupportFilePath(result)) {
                throw new CliException(1001, "cannot find android-support path or path illegal!");
            }
        }
    }
    else {
        var allConfig = await getAllConfig();
        result = key.getter(allConfig);
        if (key.validator) {
            key.validator(result);
        }
    }


    return result;
}

export const KEY = {

    ANDROID_SUPPORT: "android_support",

    ANDORID_PROJECT_PATH: "android.project.path",

    ANDROID_SDK: "android-sdk",

    ANT_DIR_PATH: "ant-dir-path"

}

function getAppDataPath(): string {
    var result: string;
    switch (process.platform) {
        case 'darwin':
            var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            if (!home)
                return null;
            result = `${home}/Library/Application Support/`;
            break;
        case 'win32':
            result = process.env.AppData || `${process.env.USERPROFILE}/AppData/Roaming/`;
            break;
        default:
            break;
    }
    return result;
}

export async function initConfig(projectPath?: string): Promise<void> {
    egretProjectPath = projectPath;
    initProjectConfig();
    await initGlobalConfig();
}

export async function getAllConfig(): Promise<Arguments> {
    return Object.assign({}, projectConfig, globalConfig) as Arguments
}

function initProjectConfig() {
    if (egretProjectPath) {
        let projectConfigFilename = path.join(egretProjectPath, "egret.config");
        if (!fs.existsSync(projectConfigFilename)) {
            projectConfig = {};
        }
        else {
            let content = fs.readFileSync(projectConfigFilename, "utf-8");
            projectConfig = JSON.parse(content);
        }
    }
}

async function initGlobalConfig() {
    initConfigValidator(KEY.ANDROID_SUPPORT, androidSupportValidator);
    var globalConfigFilename = path.join(getAppDataPath(), "egret.config");
    let isExist = await fs.existsAsync(globalConfigFilename);

    if (!isExist) {
        globalConfig = {};
    }
    else {
        let content = await fs.readFileAsync(globalConfigFilename, "utf-8");
        globalConfig = JSON.parse(content);
    }
}

function initConfigValidator(key: string, validator: (value) => boolean) {
    configValidator[key] = validator;
}

let androidSupportValidator = (value) => {
    var result = fs.existsSync(value);
    //todo
    // if (false){
    // throw new CliException(1001);
    // }
    return result;
}

export function validateConfigs<T>(config: T, keys: (string | ConfigEntity)[]): T {

    for (var key of keys) {
        var value = getConfig(key);
        //todo
    }
    return config;
}


export async function setProjectConfig(key: string | ConfigEntity, value: string) {
    console.log("=============", key);
    if (typeof key === 'string') {
        projectConfig[key] = value;
    }
    else {

        key.setter(projectConfig as Arguments, value);
    }
    var projectConfigFilename = path.join(egretProjectPath, "egret.config");
    var content = JSON.stringify(projectConfig, null, "\t");
    fs.writeFileAsync(projectConfigFilename, content, "utf-8");
}

function testAndroidSupportFilePath(value: string): boolean {
    if (fs.existsSync(value)) {
        let android_support_path = path.join(value, "proj.android");
        if (fs.existsSync(android_support_path)) {
            let propertyFilePath = path.join(android_support_path, "project.properties");
            let manifestFilePath = path.join(android_support_path, "AndroidManifest.xml");
            if (fs.existsSync(propertyFilePath) &&
                fs.existsSync(manifestFilePath)) {
                return true;
            }
        }
    }
    return false;
}

export async function setGlobaltConfig(key: string, value: string) {
    if (KEY.ANDROID_SUPPORT === key) {
        if (!testAndroidSupportFilePath(value)) {
            throw new CliException(1001, "cannot find android-support path or path illegal!");
        }
    }
    globalConfig[key] = value;
    var globalConfigFilename = path.join(getAppDataPath(), "egret.config");
    var content = JSON.stringify(globalConfig, null, "\t");
    fs.writeFileAsync(globalConfigFilename, content, "utf-8");
}


export interface Arguments {

    androidProjectPath: string;

    packageName: string;

    sdk?: string;

    androidSdkProjectPath?: string;
}



export interface ConfigEntity {

    validator?: Function;

    getter: (config: Arguments) => any

    setter: (config: Arguments, value: any) => any
}


export namespace Selector {

    export var android_support_path: ConfigEntity = {

        getter: c => c.androidProjectPath,

        setter: (c, value) => c.androidProjectPath = value

    }

    export var channel_sdk: ConfigEntity = {

        getter: c => c.sdk,

        setter: (c, value) => {
            c.sdk = value
        }

    }
}



