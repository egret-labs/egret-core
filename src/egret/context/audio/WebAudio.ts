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
    export class WebAudio implements IAudio {
        public static canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
        public static ctx = WebAudio.canUseWebAudio ? new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])() : undefined;

        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        private audioBuffer:AudioBuffer;
        private _arrayBuffer:ArrayBuffer;
        private context = WebAudio.ctx;
        private gain;
        private bufferSource:AudioBufferSourceNode = null;
        private paused = true;

        constructor() {
            if (WebAudio.ctx["createGain"]) {
                this.gain = WebAudio.ctx["createGain"]();
            }
            else {
                this.gain = WebAudio.ctx["createGainNode"]();
            }
        }

        private _loop:boolean = false;

        /**
         * 播放声音
         * @method egret.Sound#play
         * @param loop {boolean} 是否循环播放，默认为false
         */
        play(type?:string):void {
            if (this.bufferSource) {
                this.clear();
            }
            var context = this.context;
            var gain = this.gain;
            var bufferSource = context.createBufferSource();
            this.bufferSource = bufferSource;
            this.initStart();
            bufferSource.buffer = this.audioBuffer;
            bufferSource.connect(gain);
            gain.connect(context.destination);
            bufferSource.onended = ()=> {
                this.clear();
            };

            this.paused = false;

            this._startTime = Date.now();
            bufferSource.start(0, this._currentTime);
            this._currentTime = 0;
        }

        private clear():void {
            this.initEnd();
            this.bufferSource.stop(0);
            this.bufferSource.disconnect();
            this.bufferSource = null;
            if (this._loop && !this.paused)
                this.play();
        }

        private initStart():void {
            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                this.bufferSource.addEventListener(bin.type, bin.listener, bin.useCapture);
            }
        }

        private initEnd():void {
            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                this.bufferSource.removeEventListener(bin.type, bin.listener, bin.useCapture);
            }
        }

        /**
         * 暂停声音
         * @method egret.Sound#pause
         */
        public pause():void {
            this.paused = true;
            this.bufferSource.stop(0);
        }

        

        private _listeners:Array<any> = [];

        /**
         * 添加事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public addEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            this._listeners.push({type: type, listener: listener, useCapture: useCapture});
            if (this.bufferSource) {
                this.bufferSource.addEventListener(type, listener, useCapture);
            }
        }

        /**s
         * 移除事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {
            var self = this;
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                if (bin.listener == listener && bin.useCapture == useCapture && bin.type == type) {
                    self._listeners.splice(i, 1);
                    if (this.bufferSource) {
                        this.bufferSource.removeEventListener(type, listener, useCapture);
                    }
                    break;
                }
            }
        }

        public preload(type:string, callback:Function = null, thisObj:any = null):void {
            egret.callLater(callback, thisObj);
        }

        /**
         * 获取当前音量值
         * @returns number
         */
        public get volume():number {
            return this.gain.gain.value;
        }

        public set volume(value:number) {
            this.gain.gain.value = value;
        }

        public setLoop(value:boolean) :void{
            this._loop = value;
        }

        public get totalTime():number {
            if (this.bufferSource) {
                return this.bufferSource.buffer.duration;
            }
            return 0;
        }

        private _startTime:number = 0;
        private _currentTime:number = 0;
        public get currentTime():number {
            if (this.bufferSource) {
                return (Date.now() - this._startTime) / 1000;
            }
            return 0;
        }

        public set currentTime(value:number) {
            this._currentTime = value;
        }

        public destroy():void {

        }

    }
}

/**
 * @private
 */
interface AudioBuffer {
}
/**
 * @private
 */
interface AudioBufferSourceNode {
    buffer:any;
    context:any;
    stop(when?:number): void;
    addEventListener(type:string, listener:Function, useCapture?:boolean);
    removeEventListener(type:string, listener:Function, useCapture?:boolean);
    disconnect();
}