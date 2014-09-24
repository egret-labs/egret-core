/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {


    /**
     * @class egret.NativeDeviceContext
     * @classdesc
     * @extends egret.HashObject
     */
    export class NativeDeviceContext extends HashObject {

        private callback:Function;
        private thisObject:any;

        /**
         * @method egret.NativeDeviceContext#constructor
         */
        public constructor() {
            super();
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

    export function onRecivedPluginInfo(info:string):void {
        var data = JSON.parse(info);
        var functionName = data.functionName;
        var listener = egret_native_external_interface.callBackDic[functionName];
        if (listener) {
            var value = data.value;
            listener.call(null, value);
        }
        else {
            egret.Logger.warning("ExternalInterface调用了js没有注册的方法:" + functionName);
        }
    }

    export function init():void {
        for (var key in egret_native_external_interface) {
            egret.ExternalInterface[key] = egret_native_external_interface[key];
        }
        egret_native.recivedPluginInfo = egret_native_external_interface.onRecivedPluginInfo;
    }
}

egret_native_external_interface.init();

module egret_native_sound {
    export function play(loop:boolean):void {
        if (typeof loop == "undefined") {
            loop = false;
        }
        if (this.type == egret.Sound.MUSIC) {
            egret_native.Audio.playBackgroundMusic(this.path, loop);
        }
        else if (this.type == egret.Sound.EFFECT) {
            this.effect_id = egret_native.Audio.playEffect(this.path, loop);
        }
    }

    export function pause() {
        if (this.type == egret.Sound.MUSIC) {
            egret_native.Audio.stopBackgroundMusic(false);
        }
        else if (this.type == egret.Sound.EFFECT) {
            if (this.effect_id) {
                egret_native.Audio.stopEffect(this.effect_id);
                this.effect_id = null;
            }
        }
    }

    export function load() {

    }

    export function preload(type) {
        this.type = type;
        if (this.type == egret.Sound.MUSIC) {
            egret_native.Audio.preloadBackgroundMusic(this.path);
        }
        else if (this.type == egret.Sound.EFFECT) {
            egret_native.Audio.preloadEffect(this.path);
        }
    }

    export function setVolume(value) {
        this.volume = value;
    }

    export function getVolume() {
        return this.volume;
    }

    export function init():void {
        for (var key in egret_native_sound) {
            egret.Sound.prototype[key] = egret_native_sound[key];
        }
    }
}

egret_native_sound.init();

module egret_native_localStorage {
    export var filePath:string = "LocalStorage.local";

    export function getItem(key:string):string {
        return this.data[key];
    }

    export function setItem(key:string, value:string):void {
        this.data[key] = value;
        this.save();
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
//        console.log("egret_native_localStorage::" + "WriteFile");
        egret_native.saveRecord(egret_native_localStorage.filePath, JSON.stringify(this.data));
    }

    export function init():void {
        if (egret_native.isFileExists(egret_native_localStorage.filePath)) {
//            console.log("egret_native_localStorage::" + "文件存在");
            var str:string = egret_native.loadRecord(egret_native_localStorage.filePath);
//            console.log("egret_native_localStorage::" + str);
            this.data = JSON.parse(str);
//            console.log("egret_native_localStorage::" + "ReadFileSuccess");
        }
        else {
//            console.log("egret_native_localStorage::" + "文件不存在");
            this.data = {};
        }

        for (var key in egret_native_localStorage) {
            egret.localStorage[key] = egret_native_localStorage[key];
        }
    }
}

egret_native_localStorage.init();