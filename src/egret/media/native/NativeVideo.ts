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
    export class NativeVideo extends egret.DisplayObject implements egret.Video {
        /**
         * @private
         */
        private originVideo:HTMLVideoElement;
        /**
         * @private
         */
        private loaded:boolean = false;
        /**
         * @private
         * @inheritDoc
         */
        constructor(url?:string) {
            super();
            if (!__global.Video) {
                egret.$error(1043);
            }
            this.src = url;
            if(url){
                this.load();
            }
        }
        /**
         * @inheritDoc
         */
        public load(url?:string):void {
            url = url || this.src;
            this.src = url;
            if (DEBUG && !url) {
                egret.$error(3002);
            }
            var self = this;
            var video = new __global.Video(url);
            this.originVideo = video;
            this.setVideoSize();
            video['setKeepRatio'](true);
            video.addEventListener("canplaythrough", onCanPlay);
            video.addEventListener("error", onVideoError);
            function onCanPlay():void {
                egret.log('onCanPlay');
                removeListeners();
                self.loaded = true;
                self.dispatchEventWith(egret.Event.COMPLETE);
            }
            function onVideoError():void {
                egret.log('onVideoError');
                removeListeners();
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            }
            function removeListeners():void {
                egret.log('removeListeners');
                video.removeEventListener("canplaythrough", onCanPlay);
                video.removeEventListener("error", onVideoError);
            }
            
        }
        /**
         * @private
         * */
        private canPlay:boolean = false;
        /**
         * @inheritDoc
         */
        public play(startTime?:number, loop:boolean = false){
            if(!this.loaded){
                this.load();
                this.once(egret.Event.COMPLETE,e=>this.play(startTime,loop),this)
                return;
            }
            this.canPlay = true;
            if(!this.isAddToStage){
                return;
            }
            var video = this.originVideo;
            this.setVideoSize();
            video.currentTime = startTime || 0;
            video.play();
        }
        /**
         * @inheritDoc
         */
        public close(){
            this.canPlay = false;
            //this.originVideo.close();
        }  
        /**
         * @inheritDoc
         */
        public src: string = "";
        /**
         * @inheritDoc
         */
        public poster: string = "";
        /**
         * @inheritDoc
         */
        public fullscreen: boolean = true;
        /**
         * @inheritDoc
         */
        public get volume():number {
            if (!this.originVideo)
                return 1;
            return this.originVideo.volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (!this.originVideo)
                return;
            this.originVideo.volume = value;
        }
        /**
         * @inheritDoc
         */
        public get position(): number{
            return this.originVideo.currentTime;
        }
        public set position(value){
            if(this.originVideo){
                this.originVideo.currentTime = value;
            }
        }
        /**
         * @inheritDoc
         */
        public pause(){
            this.originVideo.pause();
        }  
        public bitmapData: BitmapData;
        /**
         * @inheritDoc
         */
        public paused:boolean = false;
        /**
         * @inheritDoc
         */
        public length:number;
        /**
         * @private
         */
        private isAddToStage:boolean = false;
        /**
         * @inheritDoc
         */
        $onAddToStage(stage:Stage, nestLevel:number):void {
            this.isAddToStage = true;
            if(this.canPlay){
                this.originVideo.play();
            }
            super.$onAddToStage(stage,nestLevel);
        }
        /**
         * @inheritDoc
         */
        $onRemoveFromStage():void {
            this.isAddToStage = false;
            this.originVideo.pause();
            super.$onRemoveFromStage();
        }
        /**
         * @private
         */
        private heightSet:number = 0;
        /**
         * @private
         */
        private widthSet:number = 0;
        $setHeight(value:number):boolean {
            this.heightSet = +value || 0;
            this.setVideoSize();
            return super.$setHeight(value);
        }

        /**
         * @private
         * 设置显示宽度
         */
        $setWidth(value:number):boolean {
            this.widthSet = +value || 0;
            this.setVideoSize();
            return super.$setWidth(value);
        }
        private setVideoSize():void{
            if(this.fullscreen){
                this.originVideo['setVideoRect'](this.x, this.y, this.stage.stageWidth, this.stage.stageHeight);
            }else{
                this.originVideo['setVideoRect'](this.x, this.y, this.widthSet, this.heightSet);
            }
        }
    }
    if (__global.Video) {
        egret.Video = NativeVideo;
    }else{
        egret.$error(1043);
    }
}