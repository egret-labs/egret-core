require("launcher/native_require.js");

egret_native.egtMain = function () {
    egret_native.nativeType = "runtime";

    egret_native.egretInit();
    egret_native.egretStart();
};