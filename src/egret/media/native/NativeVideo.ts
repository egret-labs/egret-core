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
         */
        private loading:boolean = false;
        /**
         * @private
         * @inheritDoc
         */
        constructor(url?:string) {
            super();
            this.$renderNode = new sys.BitmapNode();
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
            this.originVideo.currentTime = startTime || 0;
            this.startPlay();
        }
        private isPlayed:boolean = false;
        /**
         * @private
         * */
        private startPlay(){
            this.setVideoSize();
            if(!this.isAddToStage || !this.loaded){
                return;
            }
            this.isPlayed = true;
            this.originVideo.play();
            egret.startTick(this.markDirty, this);
        }
        /**
         * @private
         * */
        private stopPlay(){
            egret.stopTick(this.markDirty, this);
            if(this.isPlayed){
                this.isPlayed = false;
                this.originVideo.pause();
            }
        }
        /**
         * @inheritDoc
         */
        public close(){
            if(this.loaded){
                this.originVideo['destroy']();
            }
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
        private posterData:egret.Bitmap;
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
                this.posterData = new egret.Bitmap(loader.data);
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
        private _bitmapData:BitmapData;
        //todo
        /**
         * @inheritDoc
         */
        public get bitmapData():BitmapData {
            //if (!this.originVideo || !this.loaded)
            //    return null;
            //if (!this._bitmapData) {
            //    this._bitmapData = $toBitmapData(this.originVideo);
            //}
            return this._bitmapData;
        }
        /**
         * @inheritDoc
         */
        public paused:boolean = false;
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
            this.startPlay();
            super.$onAddToStage(stage,nestLevel);
        }
        /**
         * @inheritDoc
         */
        $onRemoveFromStage():void {
            this.isAddToStage = false;
            this.stopPlay();
            super.$onRemoveFromStage();
        }
        /**
         * @private
         */
        private getPlayWidth():number {
            if (!isNaN(this.widthSet)) {
                return this.widthSet;
            }
            if (this.bitmapData) {
                return this.bitmapData.width;
            }
            if (this.posterData) {
                return this.posterData.width;
            }
            return NaN;
        }
        /**
         * @private
         */
        private getPlayHeight():number {
            if (!isNaN(this.heightSet)) {
                return this.heightSet;
            }
            if (this.bitmapData) {
                return this.bitmapData.height;
            }
            if (this.posterData) {
                return this.posterData.height;
            }
            return NaN;
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
        /**
         * @private
         */
        $render():void {
            var node = <sys.BitmapNode>this.$renderNode;
            //var bitmapData = this.bitmapData;
            var posterData = this.posterData;
            var width = this.getPlayWidth();
            var height = this.getPlayHeight();
            if (width <= 0 || height <= 0) {
                return;
            }
            if (!this.isPlayed && posterData) {
                node.image = posterData;
                node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
            }else if(this.isPlayed){
                this.setVideoSize();
            }

            //else if (this.isPlayed) {
            //    node.image = posterData;
            //    node.drawImage(0, 0, this.widthSet, this.heightSet, 0, 0, width, height);
            //}
        }
        private markDirty():boolean {
            this.$invalidate();
            return true;
        }
    }
    if (__global.Video) {
        egret.Video = NativeVideo;
    }else{
        egret.$error(1043);
    }
}