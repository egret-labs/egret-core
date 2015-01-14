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
    export class WebAudio {
        public static canUseWebAudio = false;//window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
        public static ctx = WebAudio.canUseWebAudio ? new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])() : undefined;
        private _sourceNode:any = null;
        private _volumeNode:any = null;
        public _buffer:any = null;
        private _volume:number = 1;
        private _stopped:boolean = false;
        private _loop:boolean = false;

        constructor() {
            if (WebAudio.ctx["createGain"]) {
                this._volumeNode = WebAudio.ctx["createGain"]();
            }
            else {
                this._volumeNode = WebAudio.ctx["createGainNode"]();
            }
        }

        public play():void {
            var self = this;
            var sourceNode = self._sourceNode = WebAudio.ctx["createBufferSource"]();
            var volumeNode = self._volumeNode;
            var offset:number = 0;//todo

            sourceNode.buffer = self._buffer;
            volumeNode["gain"].value = self._volume;
            sourceNode["connect"](volumeNode);
            volumeNode["connect"](WebAudio.ctx["destination"]);
            sourceNode.loop = this._loop;

            sourceNode["onended"] = function () {
                self._stopped = true;
            };

            self._stopped = false;

            if (sourceNode.start) {
                sourceNode.start(0, offset);
            }
            else if (sourceNode["noteGrainOn"]) {
                var duration = sourceNode.buffer.duration;
                if (this._loop) {
                    sourceNode["noteGrainOn"](0, offset, duration);
                }
                else {
                    sourceNode["noteGrainOn"](0, offset, duration - offset);
                }
            }
            else {
                sourceNode["noteOn"](0);
            }
        }

        public pause():void {
            var self = this;
            if (self._stopped) {
                return;
            }
            var sourceNode = self._sourceNode;
            if (sourceNode.stop) {
                sourceNode.stop(0);
            }
            else {
                sourceNode.noteOff(0);
            }
            self._stopped = true;
        }

        public load():void {

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

        public get volume():number {
            return this._volume;
        }

        public set volume(value:number) {
            this._volume = value;
            this._volumeNode["gain"].value = value;
        }

        public set loop(value:boolean) {
            this._loop = value;
        }
    }
}