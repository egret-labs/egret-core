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
        /**
         * @private
         */
        private audio:any = null;

        //声音是否已经播放完成
        private isStopped:boolean = false;

        /**
         * @private
         */
        constructor(audio:any) {
            super();
            audio.addEventListener("ended", this.onPlayEnd);
            this.audio = audio;
        }

        $play():void {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

            try {
                this.audio.currentTime = this.$startTime;
            }
            catch (e) {

            }
            finally {
                this.audio.play();
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
            this.audio.load();
            this.$play();
        };

        /**
         * @private
         * @inheritDoc
         */
        public stop() {
            if (!this.audio)
                return;
            var audio = this.audio;
            audio.pause();
            audio.removeEventListener("ended", this.onPlayEnd);
            this.audio = null;

            NativeSound.$recycle(this.$url, audio);
        }

        /**
         * @private
         * @inheritDoc
         */
        public get volume():number {
            if (!this.audio)
                return 1;
            return this.audio.volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

            if (!this.audio)
                return;
            this.audio.volume = value;
        }

        /**
         * @private
         * @inheritDoc
         */
        public get position():number {
            if (!this.audio)
                return 0;
            return this.audio.currentTime;
        }
    }
}