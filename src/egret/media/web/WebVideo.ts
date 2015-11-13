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
    export class WebVideo extends egret.DisplayObject implements egret.Video {

        /**
         * @inheritDoc
         */
        public src: string;
        /**
         * @inheritDoc
         */
        public poster: string;

        /**
         * @private
         */
        private posterData: BitmapData;
        /**
         * @private
         */
        private video: HTMLVideoElement;
        /**
         * @private
         */
        private loaded: boolean = false;
        /**
         * @private
         */
        private closed: boolean = false;
        /**
         * @private
         */
        private heightSet: number = NaN;
        /**
         * @private
         */
        private widthSet: number = NaN;

        /**
         * @inheritDoc
         */
        constructor(url?: string) {
            super();
            this.$renderRegion = new sys.Region();
            this.src = url;
            this.once(egret.Event.ADDED_TO_STAGE, this.loadPoster, this);
            if (url) {
                this.load();
            }
        }

        /**
         * @inheritDoc
         */
        public load(url?: string) {
            url = url || this.src;
            this.src = url;
            if (DEBUG && !url) {
                egret.$error(3002);
            }
            if (this.video && this.video.src == url)
                return;
            var video = document.createElement("video");
            video.controls = null;
            video.src = url;//
            video.setAttribute("autoplay","autoplay");
            video.setAttribute("webkit-playsinline", "true");
            video.addEventListener("canplay", this.onVideoLoaded);
            video.addEventListener("error", () => this.onVideoError());
            video.addEventListener("ended", () => this.onVideoEnded());
            video.load();
            video.play();
            video.style.position = "absolute";
            video.style.top = "0px";
            video.style.zIndex = "-88888";
            video.style.left = "0px";
            video.height = 1;
            video.width = 1;
            window.setTimeout(() => video.pause(), 16);
            this.video = video;
        }

        private isPlayed:boolean = false;

        /**
         * @inheritDoc
         */
        public play(startTime?: number, loop: boolean = false) {
            if (this.loaded == false) {
                this.load(this.src);
                this.once(egret.Event.COMPLETE, e=> this.play(startTime, loop), this);
                return;
            }

            this.isPlayed = true;

            var video = this.video;
            if (startTime != undefined)
                video.currentTime = +startTime||0;
            video.loop = !!loop;

            if (egret.Capabilities.isMobile) {
                video.style.zIndex = "-88888"; //移动端，就算设置成最小，只要全屏，都会在最上层，而且在自动退出去后，不担心挡住canvas
            }
            else {
                video.style.zIndex = "9999";
            }
            video.style.position = "absolute";
            video.style.top = "0px";
            video.style.left = "0px";
            video.height = this.heightSet;
            video.width = this.widthSet;
            setTimeout(function() {//为了解决视频返回挤压页面内容
                video.width = 0;
            }, 1000);

            this.checkFullScreen(this._fullscreen);
        }

        private checkFullScreen(playFullScreen:boolean):void {
            var video = this.video;

            if (playFullScreen) {
                if (video.parentElement == null) {
                    video.removeAttribute("webkit-playsinline");
                    document.body.appendChild(video);
                }
                egret.stopTick(this.markDirty, this);
                this.goFullscreen();                
            }
            else {
                if (video.parentElement != null) {
                    video.parentElement.removeChild(video);
                }
                video.setAttribute("webkit-playsinline", "true");

                this.setFullScreenMonitor(false);

                egret.startTick(this.markDirty, this);
            }

            video.play();
        }

        private goFullscreen():boolean {
            var video = this.video;

            var fullscreenType:string;
            fullscreenType = egret.web.getPrefixStyleName('requestFullscreen', video);
            if (!video[fullscreenType]) {
                fullscreenType = egret.web.getPrefixStyleName('requestFullScreen', video);
                if (!video[fullscreenType]) {
                    return true;
                }
            }

            video.removeAttribute("webkit-playsinline");

            video[fullscreenType]();

            this.setFullScreenMonitor(true);

            return true;
        }

        private setFullScreenMonitor(use:boolean):void {
            var video = this.video;

            if (use) {
                video.addEventListener("mozfullscreenchange", this.screenChanged);
                video.addEventListener("webkitfullscreenchange", this.screenChanged);

                video.addEventListener("webkitfullscreenerror", this.screenError);
                video.addEventListener("webkitfullscreenerror", this.screenError);
            }
            else {
                video.removeEventListener("mozfullscreenchange", this.screenChanged);
                video.removeEventListener("webkitfullscreenchange", this.screenChanged);

                video.removeEventListener("webkitfullscreenerror", this.screenError);
                video.removeEventListener("webkitfullscreenerror", this.screenError);
            }
        }

        private screenError():void {
            egret.$error(3003);
        }

        private screenChanged = (e):void => {
            var isfullscreen = !!this.video['webkitDisplayingFullscreen'];
            if (!isfullscreen) {
                this.checkFullScreen(false);
            }
        };

        private exitFullscreen():void {
            //退出全屏
            if (document['exitFullscreen']) {
                document['exitFullscreen']();
            } else if (document['msExitFullscreen']) {
                document['msExitFullscreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if(document['oCancelFullScreen']){
                document['oCancelFullScreen']();
            }else if (document['webkitExitFullscreen']){
                document['webkitExitFullscreen']();
            }else{
            }
        }

        /**
         * @private
         *
         */
        private onVideoEnded() {
            this.pause();
            this.isPlayed = false;
            this.$invalidateContentBounds();

            this.dispatchEventWith(egret.Event.ENDED);
        }

        /**
         * @private
         *
         */
        private onVideoError() {
            this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
        }

        /**
         * @inheritDoc
         */
        public close() {
            this.closed = true;
            this.video.removeEventListener("canplay", this.onVideoLoaded);
            this.video.removeEventListener("error", () => this.onVideoError());
            this.video.removeEventListener("ended", () => this.onVideoEnded());
            this.pause();
            if (this.loaded == false && this.video)
                this.video.src = "";
            if (this.video && this.video.parentElement) {
                this.video.parentElement.removeChild(this.video);
                this.video = null;
            }

            this.loaded = false;
        }


        /**
         * @inheritDoc
         */
        public pause() {
            if (this.video) {
                this.video.pause();
            }

            egret.stopTick(this.markDirty, this);
            this.$invalidate();
        }


        /**
         * @inheritDoc
         */
        public get volume(): number {
            if (!this.video)
                return 1;
            return this.video.volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value: number) {
            if (!this.video)
                return;
            this.video.volume = value;
        }

        /**
         * @inheritDoc
         */
        public get position(): number {
            if (!this.video)
                return 0;
            return this.video.currentTime;
        }

        /**
         * @inheritDoc
         */
        public set position(value: number) {
            if (!this.video)
                return ;
            this.video.currentTime = value;
        }

        private _fullscreen = true;
        /**
         * @inheritDoc
         */
        public get fullscreen(): boolean {
            return this._fullscreen;
        }

        /**
         * @inheritDoc
         */
        public set fullscreen(value: boolean) {
            if (egret.Capabilities.isMobile) {
                return;
            }
            this._fullscreen = !!value;
            if (this.video && this.video.paused == false) {
                this.checkFullScreen(this._fullscreen);
            }
        }

        private _bitmapData: BitmapData;

        /**
         * @inheritDoc
         */
        public get bitmapData(): BitmapData {
            if (!this.video || !this.loaded)
                return null;
            if (!this._bitmapData) {
                this.video.width = this.video.videoWidth;
                this.video.height = this.video.videoHeight;
                this._bitmapData = $toBitmapData(this.video);
            }
            return this._bitmapData;
        }

        private loadPoster() {
            var poster = this.poster;
            if (!poster)
                return;
            var imageLoader = new egret.ImageLoader();
            imageLoader.once(egret.Event.COMPLETE, e=> {
                var posterData = <HTMLImageElement><any>imageLoader.data;
                this.posterData = imageLoader.data;

                this.posterData.width = this.getPlayWidth();
                this.posterData.height = this.getPlayHeight();

                this.$invalidateContentBounds();
            }, this);
            imageLoader.load(poster);
        }

        /**
         * @private
         *
         */
        private onVideoLoaded = () => {
            this.video.removeEventListener("canplay", this.onVideoLoaded);
            var video = this.video;
            this.loaded = true;
            video.pause();
            if (this.posterData) {
                this.posterData.width = this.getPlayWidth();
                this.posterData.height = this.getPlayHeight();
            }
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            this.$invalidateContentBounds();
            this.dispatchEventWith(egret.Event.COMPLETE);
        };

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            var bitmapData = this.bitmapData;
            var posterData = this.posterData;
            if (bitmapData) {
                bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
            }
            else if (posterData) {
                bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
            }
            else {
                bounds.setEmpty();
            }
        }

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
        $render(context: sys.RenderContext): void {
            var bitmapData = this.bitmapData;
            var posterData = this.posterData;

            if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                context.drawImage(posterData, 0, 0, this.getPlayWidth(), this.getPlayHeight());
            }
            else if (this.isPlayed && bitmapData) {
                context.imageSmoothingEnabled = true;
                context.drawImage(bitmapData, 0, 0, this.getPlayWidth(), this.getPlayHeight());
            }
        }

        private markDirty():boolean {
            this.$invalidate();
            return true;
        }

        /**
         * @private
         * 设置显示高度
         */
        $setHeight(value: number):boolean {
            this.heightSet = +value || 0;

            return super.$setHeight(value);
        }

        /**
         * @private
         * 设置显示宽度
         */
        $setWidth(value: number):boolean {
            this.widthSet = +value || 0;

            return super.$setWidth(value);
        }

        public get paused():boolean {
            if (this.video) {
                return this.video.paused;
            }

            return true;
        }
    }

    egret.Video = WebVideo;
}