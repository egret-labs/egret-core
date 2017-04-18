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
    export class NaSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
        static currentPath:string;

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
        /**
         * @private
         */
        $type:string;
        private _effectId;

        //声音是否已经播放完成
        private isStopped:boolean = false;

        /**
         * @private
         */
        constructor() {
            super();
        }

        $play():void {
            this.isStopped = false;
            if (this.$type == egret.Sound.EFFECT) {
                this._effectId = egret_native.Audio.playEffect(this.$url, this.$loops != 1);
            }
            else {
                NaSoundChannel.currentPath = this.$url;
                egret_native.Audio.playBackgroundMusic(this.$url, this.$loops != 1);
            }
            this._startTime = Date.now();
        }

        /**
         * @private
         * @inheritDoc
         */
        public stop() {
            if (!this.isStopped) {
                sys.$popSoundChannel(this);
            }
            this.isStopped = true;
            if (this.$type == egret.Sound.EFFECT) {
                if (this._effectId) {
                    egret_native.Audio.stopEffect(this._effectId);
                    this._effectId = null;
                }
            }
            else {
                if (this.$url == NaSoundChannel.currentPath) {
                    egret_native.Audio.stopBackgroundMusic(false);
                }
            }

        }

        /**
         * @private
         * @inheritDoc
         */
        public get volume():number {
            if (this.$type == egret.Sound.EFFECT) {
                return egret_native.Audio.getEffectsVolume();
            }
            else {
                return egret_native.Audio.getBackgroundMusicVolume();
            }
            return 1;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (this.$type == egret.Sound.EFFECT) {
                egret_native.Audio.setEffectsVolume(value)
            }
            else {
                egret_native.Audio.setBackgroundMusicVolume(value);
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
            return (Date.now() - this._startTime) / 1000;
        }
    }
}