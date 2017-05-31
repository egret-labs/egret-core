
import InstallSDK = require("./installsdk");

class SDKConfig implements egret.Command {
    execute() {
        InstallSDK.printAndroidSDKConfig();
        return DontExitCode;
    }
}

export = SDKConfig;