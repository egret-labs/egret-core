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

module egret.web {

    /**
     * @private
     * @inheritDoc
     */
    export class QQSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {


        /**
         * @private
         */
        $url:string;
        /**
         * @private
         */
        $loops:number;

        $type:string;
        /**
         * @private
         */
        $startTime:number = 0;

        //声音是否已经播放完成
        private isStopped:boolean = false;

        /**
         * @private
         */
        constructor() {
            super();
        }

        $play():void {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

            var self = this;
            this._startTime = Date.now();

            var loop:number = 0;
            if (self.$loops > 0) {
                loop = self.$loops - 1;
            }
            else {
                loop = -1;
            }
            if (this.$type == egret.Sound.EFFECT) {
                QZAppExternal.playLocalSound(
                    function (data) {
                        //self.onPlayEnd();
                        //alert(JSON.stringify(data));
                    }, {
                        bid: -1,
                        url: self.$url,
                        loop: loop  //默认为0播放一次，背景音乐和音效同时最多各为一个
                    });
            }
            else {
                QZAppExternal.playLocalBackSound(
                    function (data) {
                        //self.onPlayEnd();
                        //alert(JSON.stringify(data));
                    }, {
                        bid: -1,
                        url: self.$url,
                        loop: loop  //默认为0  播放一次，-1为循环播放。背景音乐和音效同时最多各为一个
                    });
            }
        }

        /**
         * @private
         */
        private onPlayEnd = () => {
            if (this.$loops == 1) {
                this.stop();
                this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                return;
            }

            if (this.$loops > 0) {
                this.$loops--;
            }

            /////////////
            this.$play();
        };

        /**
         * @private
         * @inheritDoc
         */
        public stop() {
            if (this.$type == egret.Sound.EFFECT) {
                QZAppExternal.stopSound();
            }
            else {
                QZAppExternal.stopBackSound();
            }

        }

        /**
         * @private
         * @inheritDoc
         */
        public get volume():number {
            return 1;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

        }

        /**
         * @private
         */
        private _startTime:number = 0;

        /**
         * @private
         * @inheritDoc
         */
        public get position():number {
            return Math.floor((Date.now() - this._startTime));
        }
    }
}