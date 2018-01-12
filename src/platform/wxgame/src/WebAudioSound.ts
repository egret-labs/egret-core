//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

/**
 * @private
 */
interface AudioBufferSourceNodeEgret {
    buffer:any;
    context:any;
    onended:Function;
    stop(when?:number): void;
    noteOff(when?:number): void;
    addEventListener(type:string, listener:Function, useCapture?:boolean);
    removeEventListener(type:string, listener:Function, useCapture?:boolean);
    disconnect();
}

namespace egret.wxapp {

    /**
     * @private
     */
    export class WebAudioDecode {
        /**
         * @private
         */
        public static ctx;

        /**
         * @private
         */
        public static decodeArr:any[] = [];
        /**
         * @private
         */
        private static isDecoding:boolean = false;

        /**
         * @private
         *
         */
        static decodeAudios() {
            if (WebAudioDecode.decodeArr.length <= 0) {
                return;
            }
            if (WebAudioDecode.isDecoding) {
                return;
            }
            WebAudioDecode.isDecoding = true;
            let decodeInfo = WebAudioDecode.decodeArr.shift();

            WebAudioDecode.ctx.decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
                decodeInfo["self"].audioBuffer = audioBuffer;

                if (decodeInfo["success"]) {
                    decodeInfo["success"]();
                }
                WebAudioDecode.isDecoding = false;
                WebAudioDecode.decodeAudios();
            }, function () {
                alert("sound decode error: " + decodeInfo["url"] + "！\nsee http://edn.egret.com/cn/docs/page/156");

                if (decodeInfo["fail"]) {
                    decodeInfo["fail"]();
                }
                WebAudioDecode.isDecoding = false;
                WebAudioDecode.decodeAudios();
            });
        }

    }

    /**
     * @private
     * @inheritDoc
     */
    export class WebAudioSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static MUSIC:string = "music";

        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static EFFECT:string = "effect";

        /**
         * @private
         */
        public type:string;

        /**
         * @private
         */
        private url:string;
        /**
         * @private
         */
        private loaded:boolean = false;

        /**
         * @private
         * @inheritDoc
         */
        constructor() {
            super();
        }


        /**
         * @private
         */
        private audioBuffer:AudioBuffer;


        public get length():number {
            if (this.audioBuffer) {
                return this.audioBuffer.duration;
            }

            throw new Error ("sound not loaded!");

            //return 0;
        }


        /**
         * @inheritDoc
         */
        public load(url:string):void {
            let self = this;

            this.url = url;

            if (DEBUG && !url) {
                egret.$error(3002);
            }

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onreadystatechange = function () {
                if (request.readyState == 4) {// 4 = "loaded"
                    let ioError = (request.status >= 400 || request.status == 0);
                    if (ioError) {//请求错误
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    } else {
                        WebAudioDecode.decodeArr.push({
                            "buffer": request.response,
                            "success": onAudioLoaded,
                            "fail": onAudioError,
                            "self": self,
                            "url": self.url
                        });
                        WebAudioDecode.decodeAudios();
                    }
                }
            }
            request.send();

            function onAudioLoaded():void {
                self.loaded = true;
                self.dispatchEventWith(egret.Event.COMPLETE);
            }

            function onAudioError():void {
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            }
        }

        /**
         * @inheritDoc
         */
        public play(startTime?:number, loops?:number):SoundChannel {
            startTime = +startTime || 0;
            loops = +loops || 0;

            if (DEBUG && this.loaded == false) {
                egret.$error(1049);
            }

            let channel = new WebAudioSoundChannel();
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$audioBuffer = this.audioBuffer;
            channel.$startTime = startTime;
            channel.$play();

            sys.$pushSoundChannel(channel);

            return channel;
        }

        /**
         * @inheritDoc
         */
        public close() {
        }
    }
}