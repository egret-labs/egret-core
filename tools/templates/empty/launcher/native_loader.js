require("launcher/native_require.js");

egret_native.egtMain = function () {
    egret_native.egretInit();

    egret_native.loadVersion(egret_native.loadAllChange);
};

egret_native.loadAllChange = function () {
    egret_native.initLoadingUI();

    var list = egret.MainContext.instance.netContext.getChangeList();
    var errorList = [];
    var errorCount = 0;

    var loader = new egret.NativeResourceLoader();
    loader.addEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
    loader.addEventListener(egret.Event.COMPLETE, loadComplete, this);
    loader.addEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

    var loadBytes = 0;
    var totalBytes = 0;
    for (var key in list) {
        totalBytes += list[key]["size"];
    }

    loadNext();
    function loadNext() {
        if (list.length > 0) {
            loader.load(list[0]["url"], list[0]["size"]);
        }
        else if (errorCount > 3) {//结束，加载出错
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
            loader.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
            loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

            egret_native.loadError();
        }
        else if (errorList.length > 0) {
            list = errorList;
            errorList = [];
            errorCount++;

            loadComplete();
        }
        else {//结束，加载成功
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
            loader.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
            loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

            egret_native.removeUI();

            egret_native.egretStart();
        }
    }

    function loadComplete(e) {
        loadBytes += parseInt(list[0]["size"]);
        list.shift();
        loadNext();
    }

    function loadProgress(e) {
        egret_native.setProgress(parseInt(loadBytes) + parseInt(e.bytesLoaded), totalBytes);
    }

    function loadError() {
        errorList.push(list[0]);
        list.shift();
        loadComplete();
    }
};

var textField;
egret_native.initLoadingUI = function () {
    textField = new egret.TextField();
    egret.MainContext.instance.stage.addChild(textField);
    textField.y = egret.MainContext.instance.stage.stageHeight / 2;
    textField.x = egret.MainContext.instance.stage.stageWidth / 2;
    textField.textAlign = "center";
    textField.anchorX = textField.anchorY = 0.5;
};

egret_native.setProgress = function(current, total) {
    console.log("egret_native  " + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB");
    textField.text = "资源加载中..." + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB";
};

egret_native.loadError = function () {
    textField.text = "资源下载失败，请检查网络连接并退出重新进入游戏！";
};

egret_native.removeUI = function () {
    egret.MainContext.instance.stage.removeChild(textField);
};