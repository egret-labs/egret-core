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
    export class WebAudio {
        public static canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
        public static ctx = WebAudio.canUseWebAudio ? new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])() : undefined;

        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        private audioBuffer: AudioBuffer;
        private _arrayBuffer: ArrayBuffer;
        private context = WebAudio.ctx;
        private gain;
        private bufferSource: AudioBufferSourceNode = null;
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
        play(): void {
            var context = this.context;
            var gain = this.gain;
            var bufferSource = context.createBufferSource();
            bufferSource.buffer = this.audioBuffer;
            bufferSource.connect(gain);
            gain.connect(context.destination);
            bufferSource.start(0, 0);
            bufferSource.onended = ()=> {
                bufferSource.stop(0);
                bufferSource.disconnect();
                if (this._loop && !this.paused)
                    this.play();
            };
            this.bufferSource = bufferSource;
            this.paused = false;
        }
        /**
         * 暂停声音
         * @method egret.Sound#pause
         */
        pause(): void {
            this.paused = true;
            this.bufferSource.stop();
        }
        /**
         * 重新加载声音
         * @method egret.Sound#load
         */
        load(): void {
            this.arrayBuffer = this._arrayBuffer;
        }

        public set arrayBuffer(buffer:ArrayBuffer) {
            this._arrayBuffer = buffer;
            this.context.decodeAudioData(buffer, audioBuffer=> this.audioBuffer = audioBuffer);
        }

        /**
         * 添加事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public addEventListener(type:string, listener:Function):void {

        }

        /**
         * 移除事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public removeEventListener(type:string, listener:Function):void {

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

        public set loop(value:boolean) {
            this._loop = value;
        }
    }
}

/**
 * @private
 */
interface AudioBuffer {}
/**
 * @private
 */
interface AudioBufferSourceNode {
    stop(when?: number): void;
}