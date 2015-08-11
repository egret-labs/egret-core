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
module egret.native {
    /**
     * @private
     */
    export class NativeAudio implements Audio {
        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        constructor() {
        }

        //private _audio;
        private _loop:boolean = false;

        private _type:string = "";

        private _effectId;
        private _path:string = "";

        /**
         * 播放声音
         * @method egret.Sound#play
         * @param loop {boolean} 是否循环播放，默认为false
         */

        public $play(type?:string):void {
            this._type = type;

            if (this._type == egret.Sound.MUSIC) {
                egret_native_sound.currentPath = this._path;
                egret_native.Audio.playBackgroundMusic(this._path, this._loop);
            }
            else if (this._type == egret.Sound.EFFECT) {
                this._effectId = egret_native.Audio.playEffect(this._path, this._loop);
            }
        }

        private paused:boolean = true;

        /**
         * 暂停声音
         * @method egret.Sound#pause
         */
        public $pause():void {
            this.paused = true;

            if (this._type == egret.Sound.MUSIC) {
                if (this._path == egret_native_sound.currentPath) {
                    egret_native.Audio.stopBackgroundMusic(false);
                }
            }
            else if (this._type == egret.Sound.EFFECT) {
                if (this._effectId) {
                    egret_native.Audio.stopEffect(this._effectId);
                    this._effectId = null;
                }
            }
        }

        /**
         * 重新加载声音
         * @method egret.Sound#load
         */
        public $load():void {
        }

        public $preload(type:string, callback:Function = null, thisObj:any = null):void {
            this._type = type;
            if (this._type == egret.Sound.MUSIC) {
                egret_native.Audio.preloadBackgroundMusic(this._path);
                if (callback) {
                    egret.callLater(callback, thisObj);
                }
            }
            else if (this._type == egret.Sound.EFFECT) {
                if (NativeNetContext.__use_asyn) {
                    var promise = new egret.PromiseObject();
                    promise.onSuccessFunc = function (soundId) {
                        if (callback) {
                            callback.call(thisObj);
                        }
                    };
                    egret_native.Audio.preloadEffectAsync(this._path, promise);
                }
                else {
                    egret_native.Audio.preloadEffect(this._path);
                    if (callback) {
                        egret.callLater(callback, thisObj);
                    }
                }
            }
        }

        public $setAudio(path:string) {
            this._path = path;
        }

        private initStart():void {
            //var self = this;
            //for (var i = 0; i < self._listeners.length; i++) {
            //    var bin = self._listeners[i];
            //    this._audio.addEventListener(bin.type, bin.listener, bin.useCapture);
            //}
        }

        private _listeners:Array<any> = [];

        /**
         * 添加事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public $addEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            //this._listeners.push({ type: type, listener: listener, useCapture: useCapture });
            //if (this._audio) {
            //    this._audio.addEventListener(type, listener, useCapture);
            //}
        }

        /**s
         * 移除事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public $removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            //var self = this;
            //for (var i = 0; i < self._listeners.length; i++) {
            //    var bin = self._listeners[i];
            //    if (bin.listener == listener && bin.useCapture == useCapture && bin.type == type) {
            //        self._listeners.splice(i, 1);
            //        if (this._audio) {
            //            this._audio.removeEventListener(type, listener, useCapture);
            //        }
            //        break;
            //    }
            //}
        }

        /**
         * 获取当前音量值
         * @returns number
         */
        public $getVolume():number {
            //return this._audio.volume;
            return 1;
        }

        public $setVolume(value:number):void {
            //this._audio.volume = Math.max(0, Math.min(value, 1));
        }

        public $setLoop(value:boolean):void {
            this._loop = value;
        }

        private _startTime:number = 0;

        public $getCurrentTime():number {
            //return this._audio.currentTime;
            return 0;
        }

        public $setCurrentTime(value:number):void {
            this._startTime = value;
        }

        public $destroy():void {
            if (this._type == egret.Sound.EFFECT) {
                egret_native.Audio.unloadEffect(this._path);
            }
            else if (egret_native_sound.currentPath == this._path) {
                egret_native.Audio.stopBackgroundMusic(true);
            }
        }

        public $loadByUrl(virtualUrl:string, callback:(code:number)=>void):void {

        }
    }
}

module egret_native_sound {
    export var currentPath = "";
}