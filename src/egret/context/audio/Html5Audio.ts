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
     * @private
     */
    export class Html5Audio implements IAudio {
        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        constructor() {
        }

        private _audio;
        private _loop:boolean = false;

        /**
         * 播放声音
         * @method egret.Sound#play
         * @param loop {boolean} 是否循环播放，默认为false
         */
        public _play(type?:string):void {
            this.removeListeners();

            if (Html5Capatibility._System_OS != SystemOSType.WPHONE) {
                this._audio = this._audio.cloneNode();
            }
            this.paused = false;
            this._audio.autoplay = true;
            this._audio.volume = this._volume;
            //this._audio.load();

            var self = this;
            var func = function (e) {
                self._audio.removeEventListener("ended", func);

                if (self._onEndedCall) {
                    self._onEndedCall.call(null, e);
                }

                self.clear();
            };
            this._audio.addEventListener("ended", func);

            this.initStart();

            try {
                this._audio.currentTime = this._startTime;
            }
            catch(e) {

            }
            finally {
                this._audio.play();
            }
        }

        private clear():void {
            try {
                this._audio.pause();
            }
            catch(e) {

            }
            finally {
                this.removeListeners();

                if (this._loop && !this.paused)
                    this._play();
            }

        }

        private paused:boolean = true;

        /**
         * 暂停声音
         * @method egret.Sound#pause
         */
        public _pause():void {
            this.paused = true;
            this._audio.pause();
        }

        /**
         * 重新加载声音
         * @method egret.Sound#load
         */
        public _load():void {
            this._audio.load();
        }

        public _setAudio(audio):void {
            this._audio = audio;
        }

        private initStart():void {
            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                this._audio.addEventListener(bin.type, bin.listener, bin.useCapture);
            }
        }

        private _listeners:Array<any> = [];

        private _onEndedCall:Function = null;

        /**
         * 添加事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public _addEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            if (type == "ended") {
                this._onEndedCall = listener;
                return;
            }

            this._listeners.push({type: type, listener: listener, useCapture: useCapture});
            if (this._audio) {
                this._audio.addEventListener(type, listener, useCapture);
            }
        }

        private removeListeners():void {
            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];

                if (this._audio) {
                    this._audio.removeEventListener(bin.type, bin.listener, bin.useCapture);
                }
            }
        }

        /**
         * 移除事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public _removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            if (type == "ended") {
                this._onEndedCall = null;
                return;
            }

            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                if (bin.listener == listener && bin.useCapture == useCapture && bin.type == type) {
                    self._listeners.splice(i, 1);
                    if (this._audio) {
                        this._audio.removeEventListener(type, listener, useCapture);
                    }
                    break;
                }
            }
        }

        public _preload(type:string, callback:Function = null, thisObj:any = null):void {
            egret.callLater(callback, thisObj);
        }

        public _destroy():void {

        }

        private _volume:number = 1;
        /**
         * 获取当前音量值
         * @returns number
         */
        public _getVolume():number {
            return this._volume;
        }

        public _setVolume(value:number):void {
            this._volume = Math.max(0, Math.min(value, 1));
            this._audio.volume = this._volume;
        }

        public _setLoop(value:boolean):void {
            this._loop = value;
        }

        private _startTime:number = 0;

        public _getCurrentTime():number {
            return this._audio.currentTime;
        }

        public _setCurrentTime(value:number):void {
            this._startTime = value;
        }
    }
}