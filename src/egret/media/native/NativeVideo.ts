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
         */
        private cache:boolean;

        /**
         * @private
         * @inheritDoc
         */
        constructor(url?:string, cache:boolean = true) {
            super();
            this.$renderNode = new sys.BitmapNode();
            this.cache = cache;
            if (!__global.Video) {
                egret.$error(1044);
            }
            if (url) {
                this.load(url, cache);
            }
        }

        /**
         * @inheritDoc
         */
        public load(url?:string, cache:boolean = true):void {
            if (DEBUG && !url) {
                egret.$error(3002);
                return;
            }
            if (this.loading) {
                return;
            }
            if(url.indexOf('/')==0){
                url = url.slice(1,url.length);
            }
            this.src = url;
            this.loading = true;
            this.loaded = false;

            if (cache && !egret_native.isFileExists(url)) {
                let self = this;
                let promise = egret.PromiseObject.create();
                promise.onSuccessFunc = function () {
                    self.loadEnd();
                };
                promise.onErrorFunc = function () {
                    egret.$warn(1048);
                    self.dispatchEventWith(IOErrorEvent.IO_ERROR);
                };
                egret_native.download(url, url, promise);
            } else {
                this.loadEnd();
            }
        }

        /**
         * @private
         * */
        private loadEnd() {
            let video = new __global.Video(this.src);
            video['setVideoRect'](0, 0, 1, 1);
            video['setKeepRatio'](false);
            video.addEventListener("canplaythrough", onCanPlay);
            video.addEventListener("error", onVideoError);
            video.addEventListener("playing", onPlaying);
            video.load();
            let self = this;

            function onCanPlay():void {
                video['setVideoRect'](0, 0, 1, 1);
                video.play();
            }
            function onPlaying():void {
                video['setVideoRect'](0, 0, 1, 1);
                __global.setTimeout(() => {
                    video.pause();
                    if (self._fullscreen) {
                        video.fullScreen = true;
                    }
                    video.currentTime = 0;
                    self.originVideo = video;
                    self.loaded = true;
                    self.loading = false;
                    removeListeners();
                    self.dispatchEventWith(egret.Event.COMPLETE);
                    video.addEventListener('pause', function () {
                        self.paused = true;
                    });
                    video.addEventListener('playing', function () {
                        self.paused = false;
                    });
                    video.addEventListener('ended', function () {
                        self.dispatchEventWith(egret.Event.ENDED);
                        if (self.loop) {
                            self.play(0, true);
                        }
                    });
                }, 1);
            }

            function onVideoError():void {
                removeListeners();
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            }

            function removeListeners():void {
                video.removeEventListener("canplaythrough", onCanPlay);
                video.removeEventListener("error", onVideoError);
                video.removeEventListener("playing", onPlaying);
            }
        }

        /**
         * @private
         * */
        private loop:boolean = false;

        /**
         * @inheritDoc
         */
        public play(startTime?:number, loop:boolean = false) {
            this.loop = loop;
            if (!this.loaded) {
                this.load(this.src);
                this.once(egret.Event.COMPLETE, e=>this.play(startTime, loop), this)
                return;
            }
            let haveStartTime = false;
            if (startTime != undefined && startTime != this.originVideo.currentTime) {
                this.originVideo.currentTime = startTime || 0;
                haveStartTime = true;
            }
            this.startPlay(haveStartTime);
        }

        /**
         * @private
         * */
        private isPlayed:boolean = false;
        /**
         * @private
         * */
        private firstPlay:boolean = true;

        /**
         * @private
         * */
        private startPlay(haveStartTime:boolean = false) {
            if (!this.isAddToStage || !this.loaded) {
                return;
            }
            this.firstPlay = false;
            this.setVideoSize();
            this.isPlayed = true;
            if (!haveStartTime && this.paused && this.position != 0) {
                this.originVideo['resume']();
            } else {
                this.originVideo.play();
            }
            egret.startTick(this.markDirty, this);
        }

        /**
         * @private
         * */
        private stopPlay() {
            egret.stopTick(this.markDirty, this);
            if (this.isPlayed) {
                this.isPlayed = false;
                this.originVideo.pause();
            }
        }

        /**
         * @inheritDoc
         */
        public close() {
            if (this.originVideo) {
                this.originVideo['destroy']();
            }
            this.loaded = false;
            this.loading = false;
            this.originVideo = null;
            this.loop = false;
            this.src = null;
        }

        /**
         * @inheritDoc
         */
        public src:string = "";
        /**
         * @private
         * */
        private posterData:egret.BitmapData;
        /**
         * @private
         * */
        private posterUrl:string;

        /**
         * @inheritDoc
         */
        public get poster():string {
            return this.posterUrl;
        }

        /**
         * @inheritDoc
         */
        public set poster(value:string) {
            this.posterUrl = value;
            let loader = new NativeImageLoader();
            loader.load(value);
            loader.addEventListener(egret.Event.COMPLETE, ()=> {
                this.posterData = loader.data;
                this.markDirty();
                this.$invalidateContentBounds();
            }, this);
        }

        private _fullscreen:boolean = true;
        /**
         * @inheritDoc
         */
        public set fullscreen(value:boolean) {
            this._fullscreen = value;
            if (this.originVideo) {
                this.originVideo['fullScreen'] = value;
            }
        }

        /**
         * @inheritDoc
         */
        public get fullscreen():boolean {
            if (this.originVideo) {
                return this.originVideo['fullScreen'];
            }
            return this._fullscreen;
        }

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
        public get position():number {
            return this.originVideo.currentTime;
        }

        /**
         * @inheritDoc
         */
        public set position(value) {
            if (this.loaded) {
                this.originVideo.currentTime = value;
            }
        }

        /**
         * @inheritDoc
         */
        public pause() {
            this.originVideo.pause();
        }

        private _bitmapData:BitmapData = null;
        /**
         * @inheritDoc
         */
        public get bitmapData():BitmapData {
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
            if (this.originVideo) {
                this.originVideo["setVideoVisible"](true);
            }
            this.$invalidate();
            this.$invalidateContentBounds();
            super.$onAddToStage(stage, nestLevel);
        }

        /**
         * @inheritDoc
         */
        $onRemoveFromStage():void {
            this.isAddToStage = false;
            if (this.originVideo) {
                this.stopPlay();
                this.originVideo["setVideoVisible"](false);
            }
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
            this.$invalidate();
            this.$invalidateContentBounds();
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
            this.$invalidate();
            this.$invalidateContentBounds();
            return super.$setWidth(value);
        }

        /**
         * @inheritDoc
         */
        $setX(value:number):boolean {
            let result = super.$setX(value);
            this.setVideoSize();
            return result;
        }

        /**
         * @inheritDoc
         */
        $setY(value:number):boolean {
            let result = super.$setY(value);
            this.setVideoSize();
            return result;
        }

        /**
         * @private
         */
        private setVideoSize():void {
            let video = this.originVideo;
            if (video && !this.fullscreen) {
                if (!this.firstPlay) {
                    video['setVideoRect'](this.x, this.y, this.widthSet, this.heightSet);
                } else {
                    video['setVideoRect'](this.x, this.y, 0, 0);
                }
            }
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle) {
            let posterData = this.posterData;
            if (posterData) {
                bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
            }
            else {
                bounds.setEmpty();
            }
        }

        /**
         * @private
         */
        $render():void {
            let node = <sys.BitmapNode>this.$renderNode;
            let posterData = this.posterData;
            let width = this.getPlayWidth();
            let height = this.getPlayHeight();
            if (width <= 0 || height <= 0) {
                return;
            }
            if (!this.isPlayed && posterData) {
                node.image = posterData;
                node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
            } else if (this.isPlayed) {
                this.setVideoSize();
            }
        }

        private markDirty():boolean {
            this.$invalidate();
            return true;
        }
    }
    if (__global.Video) {
        egret.Video = NativeVideo;
    } else {
        egret.$warn(1044);
    }
}