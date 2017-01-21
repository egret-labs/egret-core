
import InstallSDK = require("./installsdk");

class SDKConfig {
    execute() {
        InstallSDK.printAndroidSDKConfig();
    }
}

export = SDKConfig;