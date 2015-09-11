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


declare module QZAppExternal {
    function playLocalSound(call, data);

    function playLocalBackSound(call, data);

    function preloadSound(call, data);

    function stopSound();

    function stopBackSound();
}


module egret.web {

    /**
     * @private
     * @inheritDoc
     */
    export class QQSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * @language en_US
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static MUSIC:string = "music";

        /**
         * @language en_US
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音效
         * @version Egret 2.4
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

            this.url = url;

            if (DEBUG && !url) {
                egret.$error(3002);
            }

            QZAppExternal.preloadSound(
                function (data) {
                    if (data.code == 0) {
                        self.loaded = true;

                        self.dispatchEventWith(egret.Event.COMPLETE);
                    }
                    else {
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                }, {
                    bid: -1,
                    url: Html5Capatibility._QQRootPath + url,
                    refresh: 1
                });

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

            var channel = new QQSoundChannel();
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$type = this.type;
            channel.$startTime = startTime;
            channel.$play();
            return channel;
        }

        /**
         * @inheritDoc
         */
        public close() {
        }

    }
}