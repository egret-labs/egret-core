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

module egret_native_sound {
    export var currentPath = "";
}

module egret.native {

    /**
     * @private
     * @inheritDoc
     */
    export class NativeSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {


        /**
         * @private
         */
        $url:string;
        /**
         * @private
         */
        $loops:number;
        /**
         * @private
         */
        $startTime:number = 0;

        $type:string;

        private _effectId;

        /**
         * @private
         */
        constructor() {
            super();
        }

        $play():void {
            var self = this;
            this._startTime = Date.now();

            if (this.$type == egret.Sound.MUSIC) {
                egret_native_sound.currentPath = this.$url;
                egret_native.Audio.playBackgroundMusic(this.$url, this.$loops > 0);
            }
            else if (this.$type == egret.Sound.EFFECT) {
                this._effectId = egret_native.Audio.playEffect(this.$url, this.$loops > 0);
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
            if (this.$type == egret.Sound.MUSIC) {
                if (this.$url == egret_native_sound.currentPath) {
                    egret_native.Audio.stopBackgroundMusic(false);
                }
            }
            else if (this.$type == egret.Sound.EFFECT) {
                if (this._effectId) {
                    egret_native.Audio.stopEffect(this._effectId);
                    this._effectId = null;
                }
            }

            this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
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
            //this.audio.volume = value;
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

        public $destroy():void {
            if (this.$type == egret.Sound.EFFECT) {
                egret_native.Audio.unloadEffect(this.$url);
            }
            else if (egret_native_sound.currentPath == this.$url) {
                egret_native.Audio.stopBackgroundMusic(true);
            }
        }
    }
}