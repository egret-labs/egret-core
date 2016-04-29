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
        constructor() {
            super();
            egret.log('native video init');
            if (!__global.Video) {
                egret.log('not have global.video');
                egret.$error(1043);
            }
        }
        /**
         * @inheritDoc
         */
        public load(url:string):void {
            var self = this;
            if (DEBUG && !url) {
                egret.$error(3002);
            }
            this.src = url;
            
            var video = new __global.Video(url);
            video.addEventListener("canplaythrough", onCanPlay);
            video.addEventListener("error", onVideoError);
            this.originVideo = video;
            egret.log('ok1')
            if (!egret_native.isFileExists(url)) {
                download();
            }
            else {
                onVideoLoaded();
            }
            function download() {
                egret.log('download');
                var promise = PromiseObject.create();
                promise.onSuccessFunc = onVideoLoaded;
                promise.onErrorFunc = onVideoError;
                egret_native.download(url, url, promise);
            }
            function onVideoLoaded():void {
                egret.log('onVideoLoaded');
                video.load();
                NativeSound.$recycle(url, video);
            }
            function onCanPlay():void {
                egret.log('onCanPlay');
                removeListeners();
                video['setVideoRect'](0, 300, 300, 400);
                video['setKeepRatio'](true);
                video.play();
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
         * @inheritDoc
         */
        public play(){
            
        }  
        /**
         * @inheritDoc
         */
        public close(){
            
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
        public position: number = 0;
        /**
         * @inheritDoc
         */
        public pause(){
            
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
    }
    if (__global.Video) {
        egret.Video = NativeVideo;
    }else{
        egret.$error(1043);
    }
}