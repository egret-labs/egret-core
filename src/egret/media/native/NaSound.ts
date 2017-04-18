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

namespace egret.native {

    /**
     * @private
     * @inheritDoc
     */
    export class NaSound extends egret.EventDispatcher implements egret.Sound {
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
        private originAudio:HTMLAudioElement;
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

        public get length():number {

            throw new Error ("sound length not supported");

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

            if (!egret_native.isFileExists(url)) {
                download();
            }
            else {
                if(__global.setTimeout) {
                    __global.setTimeout(onLoadComplete, 0);
                }
                else {
                    $callAsync(onLoadComplete, self);
                }
            }

            function download() {
                let promise = PromiseObject.create();
                promise.onSuccessFunc = onLoadComplete;
                promise.onErrorFunc = function () {
                    egret.IOErrorEvent.dispatchIOErrorEvent(self);
                };
                egret_native.download(url, url, promise);
            }

            function onLoadComplete() {
                self.loaded = true;

                self.preload();
            }
        }

        private preload():void {
            let self = this;
            if (self.type == egret.Sound.EFFECT) {
                let promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (soundId) {
                    self.dispatchEventWith(egret.Event.COMPLETE);
                };
                egret_native.Audio.preloadEffectAsync(self.url, promise);
            }
            else {
                self.dispatchEventWith(egret.Event.COMPLETE);
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

            let channel = new NaSoundChannel();
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$type = this.type;
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


    if (!__global.Audio) {
        egret.Sound = NaSound;
    }
}

