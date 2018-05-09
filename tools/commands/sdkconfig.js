var InstallSDK = require("./installsdk");
var SDKConfig = /** @class */ (function () {
    function SDKConfig() {
    }
    SDKConfig.prototype.execute = function () {
        InstallSDK.printAndroidSDKConfig();
        return DontExitCode;
    };
    return SDKConfig;
}());
module.exports = SDKConfig;
