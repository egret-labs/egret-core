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
    export class NativeVideo extends egret.DisplayObjectContainer implements egret.Video {
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
         */
        private loading:boolean = false;
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
                return;
            }
            if(this.loading){
                return;
            }
            this.loading = true;
            this.loaded = false;
            var video = new __global.Video(url);
            this.originVideo = video;
            video['setVideoRect'](0, 0, 1, 1);
            video['setKeepRatio'](false);
            video.addEventListener("canplaythrough", onCanPlay);
            video.addEventListener("error", onVideoError);
            video.addEventListener("playing",onPlaying);
            video.load();
            var self = this;
            function onCanPlay():void {
                //video.current=0;
                video['setVideoRect'](0, 0, 1, 1);
                video.play();
                egret.log('onCanPlay');
            }
            function onPlaying():void{
                egret.log('onPlaying');
                video['setVideoRect'](0, 0, 1, 1);
                video.pause();
                self.loaded = true;
                self.loading = false;
                removeListeners();
                self.dispatchEventWith(egret.Event.COMPLETE);
                video.addEventListener('pause',function(){
                    self.paused = true;
                });
                video.addEventListener('playing',function(){
                    self.paused = false;
                });
                video.addEventListener('ended',function(){
                    egret.log('ended')
                    self.dispatchEventWith(egret.Event.ENDED);
                    if(self.loop){
                        self.play(0,true);
                    }
                });
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
                video.removeEventListener("playing",onPlaying);
            }
        }
        /**
         * @private
         * */
        private canPlay:boolean = false;
        /**
         * @private
         * */
        private loop:boolean = false;
        /**
         * @inheritDoc
         */
        public play(startTime?:number, loop:boolean = false){
            this.loop = loop;
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
            if(this.loaded){
                this.originVideo['destroy']();
            }
            this.canPlay = false;
            this.loaded = false;
            this.loading = false;
            this.originVideo = null;
            this.loop = false;
        }
        /**
         * @inheritDoc
         */
        public src: string = "";
        /**
         * @private
         * */
        private posterBitmap:egret.Bitmap;
        /**
         * @private
         * */
        private posterUrl:string;
        /**
         * @inheritDoc
         */
        public get poster():string{
            return this.posterUrl;
        }
        /**
         * @inheritDoc
         */
        public set poster(value:string){
            this.posterUrl = value;
            var loader = new NativeImageLoader();
            loader.load(value);
            loader.addEventListener(egret.Event.COMPLETE,()=>{
                this.posterBitmap = new egret.Bitmap(loader.data);
                if(this.isAddToStage){
                    this.setVideoSize();
                    this.addChild(this.posterBitmap);
                }
            },this);
        }
        /**
         * @inheritDoc
         */
        public fullscreen: boolean = true;
        /**
         * @inheritDoc
         */
        public get volume():number {
            if (!this.loaded)
                return 0;
            return this.originVideo.volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (!this.loaded)
                return;
            this.originVideo.volume = value;
        }
        /**
         * @inheritDoc
         */
        public get position(): number{
            return this.originVideo.currentTime;
        }
        /**
         * @inheritDoc
         */
        public set position(value){
            if(this.loaded){
                this.originVideo.currentTime = value;
            }
        }
        /**
         * @inheritDoc
         */
        public pause(){
            egret.log('pause');
            this.originVideo.pause();
        }
        //todo
        public bitmapData: BitmapData;
        //todo
        /**
         * @inheritDoc
         */
        public paused:boolean = false;
        //todo
        /**
         * @inheritDoc
         */
        public get length():number {
            if (this.loaded) {
                return this.originVideo.duration;
            }
            throw new Error("Video not loaded!");
            //return 0;
        }
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
            if(this.posterBitmap){
                this.addChild(this.posterBitmap);
            }
            this.setVideoSize();
            super.$onAddToStage(stage,nestLevel);
        }
        /**
         * @inheritDoc
         */
        $onRemoveFromStage():void {
            this.isAddToStage = false;
            if(this.loaded){
                this.originVideo.pause();
            }
            this.removeChildren();
            super.$onRemoveFromStage();
        }
        /**
         * @private
         */
        private heightSet:number = 0;
        /**
         * @private
         */
        $setHeight(value:number):boolean {
            this.heightSet = +value || 0;
            this.setVideoSize();
            return super.$setHeight(value);
        }
        /**
         * @private
         */
        private widthSet:number = 0;
        /**
         * @private
         */
        $setWidth(value:number):boolean {
            this.widthSet = +value || 0;
            this.setVideoSize();
            return super.$setWidth(value);
        }
        /**
         * @inheritDoc
         */
        $setX(value:number):boolean {
            var result = super.$setX(value);
            this.setVideoSize();
            return result;
        }
        /**
         * @inheritDoc
         */
        $setY(value:number):boolean {
            var result = super.$setY(value);
            this.setVideoSize();
            return result;
        }
        /**
         * @private
         */
        private setVideoSize():void{
            var video = this.originVideo;
            var poster = this.posterBitmap;
            if(poster){
                if(this.fullscreen && this.isAddToStage){
                    poster.width = this.stage.stageWidth;
                    poster.height = this.stage.stageHeight;
                }else{
                    poster.width = this.widthSet;
                    poster.height = this.heightSet;
                }
                //poster.width = 100;
                //poster.height = 100;
                egret.log('poster:',poster.width,poster.height);
            }
            if(video){
                //egret.log('fullscreen:',this.fullscreen);
                //egret.log(this.x, this.y, this.widthSet, this.heightSet);
                if(this.fullscreen){
                    video['setFullScreen'](true);
                    //this.originVideo['setVideoRect'](this.x, this.y, this.stage.stageWidth, this.stage.stageHeight);
                }else{
                    video['setFullScreen'](false);
                    video['setVideoRect'](this.x, this.y, this.widthSet, this.heightSet);
                }
            }
        }
    }
    if (__global.Video) {
        egret.Video = NativeVideo;
    }else{
        egret.$error(1043);
    }
}