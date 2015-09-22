//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret {


    /**
     * @class egret.NativeDeviceContext
     * @classdesc
     * @extends egret.HashObject
     * @private
     */
    export class NativeDeviceContext extends HashObject {

        private callback:Function = null;
        private thisObject:any = null;

        /**
         * @method egret.NativeDeviceContext#constructor
         */
        public constructor() {
            super();
            TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
        }

        /**
         * @method egret.NativeDeviceContext#executeMainLoop
         * @param callback {Function}
         * @param thisObject {any}
         */
        public executeMainLoop(callback:Function, thisObject:any):void {

            this.callback = callback;
            this.thisObject = thisObject;
            egret_native.executeMainLoop(this.onEnterFrame, this);
        }

        private onEnterFrame(advancedTime:number):void {
            this.callback.call(this.thisObject, advancedTime);
        }

        public setFrameRate(frameRate){
            egret_native.setFrameRate(frameRate);
        }
    }
}

module egret_native_external_interface {
    export var callBackDic = {};

    export function call(functionName:string, value:string):void {
        var data:any = {};
        data.functionName = functionName;
        data.value = value;
        egret_native.sendInfoToPlugin(JSON.stringify(data));
    }

    export function addCallback(functionName:string, listener:Function):void {
        egret_native_external_interface.callBackDic[functionName] = listener;
    }

    export function onReceivedPluginInfo(info:string):void {
        var data = JSON.parse(info);
        var functionName = data.functionName;
        var listener = egret_native_external_interface.callBackDic[functionName];
        if (listener) {
            var value = data.value;
            listener.call(null, value);
        }
        else {
            egret.$warn(1004, functionName);
        }
    }

    export function init():void {
        for (var key in egret_native_external_interface) {
            egret.ExternalInterface[key] = egret_native_external_interface[key];
        }
        egret_native.receivedPluginInfo = egret_native_external_interface.onReceivedPluginInfo;
    }
}

egret_native_external_interface.init();

module egret_native_localStorage {
    export var filePath:string = "LocalStorage.local";

    export function getItem(key:string):string {
        return this.data[key];
    }

    export function setItem(key:string, value:string):boolean {
        this.data[key] = value;
        try {
            this.save();
            return true;
        }
        catch (e) {
            egret.$warn(1018, key, value);
            return false;
        }
    }

    export function removeItem(key:string):void {
        delete this.data[key];
        this.save();
    }

    export function clear():void {
        for (var key in this.data) {
            delete this.data[key];
        }
        this.save();
    }

    export function save() {
        egret_native.saveRecord(egret_native_localStorage.filePath, JSON.stringify(this.data));
    }

    export function init():void {
        if (egret_native.isRecordExists(egret_native_localStorage.filePath)) {
            var str:string = egret_native.loadRecord(egret_native_localStorage.filePath);
            this.data = JSON.parse(str);
        }
        else {
            this.data = {};
        }

        for (var key in egret_native_localStorage) {
            egret.localStorage[key] = egret_native_localStorage[key];
        }
    }
}

egret_native_localStorage.init();

egret.ContainerStrategy.prototype._setupContainer = function () {

};

egret.ContentStrategy.prototype._getClientWidth = function () {
    var result = egret_native.EGTView.getFrameWidth();
    return result;
};

egret.ContentStrategy.prototype._getClientHeight = function () {
    var result = egret_native.EGTView.getFrameHeight();
    return result;
};

egret.ResolutionPolicy.prototype._getClientWidth = function () {
    var result = egret_native.EGTView.getFrameWidth();
    return result;
};

egret.ResolutionPolicy.prototype._getClientHeight = function () {
    var result = egret_native.EGTView.getFrameHeight();
    return result;
};

egret.ResolutionPolicy.prototype._apply = function (view, designedResolutionWidth, designedResolutionHeight) {
    var self:any = <egret.ResolutionPolicy>this;
    var clientWidth = this._getClientWidth();
    var clientHeight = this._getClientHeight();

    self._containerStrategy._apply(view, designedResolutionWidth, designedResolutionHeight);
    self._contentStrategy._apply(view, designedResolutionWidth, designedResolutionHeight, clientWidth, clientHeight);
    this.$setEgretSize(self._contentStrategy.$stageWidth, self._contentStrategy.$stageHeight, self._contentStrategy.$displayWidth, self._contentStrategy.$displayHeight, clientWidth, clientHeight, false, "auto");
};

egret.ResolutionPolicy.prototype.$setEgretSize = function (w:number, h:number, styleW:number, styleH:number, clientWidth:number, clientHeight:number, shouldRotate:boolean, orientation:string) {
    egret.StageDelegate.getInstance()._stageWidth = w;
    egret.StageDelegate.getInstance()._stageHeight = h;

    var top = Math.max((clientHeight - styleH) / 2, 0);
    var left = Math.max((clientWidth - styleW) / 2, 0);

//    console.log("setVisibleRect:" + left + "|" + top + "|" + styleW + "|" + styleH);
    egret_native.EGTView.setVisibleRect(left, top, styleW, styleH);
    egret_native.EGTView.setDesignSize(w, h);
};

egret.Logger.openLogByType = function (logType:string) {
    egret_native.loglevel(logType);
};

egret_native.pauseApp = function () {
    egret.MainContext.instance.stage.dispatchEvent(new egret.Event(egret.Event.DEACTIVATE));
};
egret_native.resumeApp = function () {
    egret.MainContext.instance.stage.dispatchEvent(new egret.Event(egret.Event.ACTIVATE));
};

egret.RenderTexture.prototype.init = function () {

};

egret.RenderTexture.prototype.setSize = function (width:number, height:number) {
    //todo 复用
    if(!this._bitmapData || this.renderTextureWidth != width || this.renderTextureHeight != height) {
        this.dispose();
        this._bitmapData = new egret_native.RenderTexture(width, height);
        this.renderTextureWidth = width;
        this.renderTextureHeight = height;
        this._bitmapData["avaliable"] = true;
        this.renderContext = new egret.NativeRendererContext();
    }
};

egret.RenderTexture.prototype.begin = function () {
    this._bitmapData.begin();
};

egret.RenderTexture.prototype.end = function () {
    this._bitmapData.end();
};

egret.RenderTexture.prototype.dispose = function () {
    if (this._bitmapData) {
        this._bitmapData.dispose();
        this.renderContext = null;
        this._bitmapData = null;
    }
};

egret.getOption = function (key:string) {
    console.log("egret_native.getOption");
    return egret_native.getOption(key);
};