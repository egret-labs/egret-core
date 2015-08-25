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
     * @inheritDoc
     */
    export class NativeSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * @language en_US
         * Background music
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 背景音乐
         * @version Egret 2.0
         * @platform Web,Native
         */
        public static MUSIC:string = "music";

        /**
         * @language en_US
         * EFFECT
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音效
         * @version Egret 2.0
         * @platform Web,Native
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

        /**
         * @inheritDoc
         */
        public load(url:string):void {
            var self = this;

            if (DEBUG && !url) {
                egret.$error(3002);
            }

            var promise = PromiseObject.create();
            promise.onSuccessFunc = onAudioLoaded;
            promise.onErrorFunc = onAudioError;
            egret_native.download(url, url, promise);

            function onAudioLoaded():void {
                self.loaded = true;
                self.dispatchEventWith(egret.Event.COMPLETE);
            }

            function onAudioError():void {

                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            }
        }

        public preload(type:string, callback:Function = null, thisObj:any = null):void {
            this.type = type;
            if (this.type == egret.Sound.MUSIC) {
                egret_native.Audio.preloadBackgroundMusic(this.url);
                if (callback) {
                    egret.callLater(callback, thisObj);
                }
            }
            else if (this.type == egret.Sound.EFFECT) {
                if (egret.native.NativeNetContext.__use_asyn) {
                    var promise = new egret.PromiseObject();
                    promise.onSuccessFunc = function (soundId) {
                        if (callback) {
                            callback.call(thisObj);
                        }
                    };
                    egret_native.Audio.preloadEffectAsync(this.url, promise);
                }
                else {
                    egret_native.Audio.preloadEffect(this.url);
                    if (callback) {
                        egret.callLater(callback, thisObj);
                    }
                }
            }
        }

        /**
         * @inheritDoc
         */
        public play(startTime?:number, loops?:number):SoundChannel {
            startTime = +startTime || 0;
            loops = +loops || 0;

            if (DEBUG && this.loaded == false) {
                egret.$error(3001);
            }

            var channel = new NativeSoundChannel();
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$startTime = startTime;
            channel.$type = this.type;
            channel.$play();
            return channel;
        }

        /**
         * @inheritDoc
         */
        public close() {
        }

        public destroy():void {
            this.loaded = false;

            if (this.type == egret.Sound.EFFECT) {
                egret_native.Audio.unloadEffect(this.url);
            }
            else if (egret_native_sound.currentPath == this.url) {
                egret_native.Audio.stopBackgroundMusic(true);
            }
        }

    }

    Sound = NativeSound;
}