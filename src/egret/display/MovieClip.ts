/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

module egret {

    /**
     * @class egret.MovieClip
     * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。
     * @extends egret.DisplayObjectContainer
     */
    export class MovieClip extends DisplayObjectContainer {

        private delegate:MovieClipDelegate;
        /**
         * @member {number} egret.MovieClip#frameRate
         * 动画的播放帧频
         */
        public frameRate:number = 60;

        constructor(data, texture?:Texture) {
            super();
            if (data instanceof DefaultMovieClipDelegate){
                Logger.warning("MovieClip#constructor接口参数已经变更，请尽快调整用法为 new MovieClip(data,texture)")
                this.delegate = data;
            }
            else{
                this.delegate = new DefaultMovieClipDelegate(data, texture);
            }
            this.delegate.setMovieClip(this);
        }

        /**
         * 播放指定动画
         * @method egret.MovieClip#gotoAndPlay
         * @param frameName {string} 指定帧的帧名称

         */
        public gotoAndPlay(frameName:string) {
            this.delegate.gotoAndPlay(frameName);
        }

        /**
         * 播放并暂停指定动画
         * @method egret.MovieClip#gotoAndStop
         * @param frameName {string} 指定帧的帧名称

         */
        public gotoAndStop(frameName:string) {
            this.delegate.gotoAndStop(frameName);
        }


        /**
         * 暂停动画
         * @method egret.MovieClip#stop
         */
        public stop() {
            this.delegate.stop();
        }

        /**
         * @method egret.MovieClip#dispose
         */
        public dispose():void {
            this.delegate.dispose();

        }

        /**
         * 方法名改为 dispose
         * @method egret.MovieClip#release
         * @deprecated
         */
        public release() {
            Logger.warning("MovieClip#release方法即将废弃");
            this.dispose();
        }


        /**
         * @method egret.MovieClip#getCurrentFrameIndex
         * @deprecated
         * @returns {number}
         */
        public getCurrentFrameIndex():number {
            Logger.warning("MovieClip#getCurrentFrameIndex方法即将废弃");
            return this.delegate["_currentFrameIndex"];
        }

        /**
         * 获取当前影片剪辑的帧频数
         * @method egret.MovieClip#getTotalFrame
         * @deprecated
         * @returns {number}
         */
        public getTotalFrame():number {
            Logger.warning("MovieClip#getTotalFrame方法即将废弃");
            return this.delegate["_totalFrame"];
        }

        /**
         * @method egret.MovieClip#setInterval
         * @deprecated
         * @param value {number}
         */
        public setInterval(value:number) {
            Logger.warning("MovieClip#setInterval方法即将废弃,请使用MovieClip#frameRate代替");
            this.frameRate = 60 / value;
        }

        /**
         * @method egret.MovieClip#getIsPlaying
         * @deprecated
         * @returns {boolean}
         */
        public getIsPlaying():boolean {
            Logger.warning("MovieClip#getIsPlaying方法即将废弃");
            return this.delegate["isPlaying"];
        }
    }

    export interface MovieClipDelegate {


        gotoAndPlay(frameName:string):void;


        gotoAndStop(frameName:string):void;


        stop():void;


        dispose():void;


        setMovieClip(movieclip:MovieClip):void;
    }


    export class DefaultMovieClipDelegate implements MovieClipDelegate {
        private _frameData;
        private _totalFrame:number = 0;
        private _spriteSheet:SpriteSheet;
        private _passTime:number = 0;
        private _currentFrameIndex:number = 0;
        private _currentFrameName:string;

        private _isPlaying:boolean = false;
        private movieClip:MovieClip;

        private bitmap:Bitmap;



        constructor(public data, texture:Texture) {
            this._frameData = data;
            this._spriteSheet = new SpriteSheet(texture);
        }


        public setMovieClip(movieClip:MovieClip):void {
            this.movieClip = movieClip;
            this.bitmap = new egret.Bitmap();
            this.movieClip.addChild(this.bitmap);

        }

        public gotoAndPlay(frameName:string):void {
            this.checkHasFrame(frameName);
            this._isPlaying = true;
            this._currentFrameIndex = 0;
            this._currentFrameName = frameName;
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
            this.playNextFrame();
            this._passTime = 0;
            Ticker.getInstance().register(this.update, this);
        }


        public gotoAndStop(frameName:string):void {
            this.checkHasFrame(frameName);
            this.stop();
            this._passTime = 0;
            this._currentFrameIndex = 0;
            this._currentFrameName = frameName;
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
            this.playNextFrame();
        }


        public stop():void {
            this._isPlaying = false;
            Ticker.getInstance().unregister(this.update, this);
        }


        public dispose():void {

        }

        private checkHasFrame(name:string) {
            if (this._frameData.frames[name] == undefined) {
                egret.Logger.fatal("MovieClip没有对应的frame：", name);
            }
        }

        private update(advancedTime:number):void {

            var oneFrameTime = 1000 / this.movieClip.frameRate;
            var last = this._passTime % oneFrameTime;
            var num = Math.floor((last + advancedTime) / oneFrameTime);
            while (num >= 1) {
                if (num == 1) {
                    this.playNextFrame();
                }
                else {
                    this.playNextFrame(false);
                }
                num--;
            }
            this._passTime += advancedTime;
        }

        private playNextFrame(needShow:boolean = true) {
            var frameData = this._frameData.frames[this._currentFrameName].childrenFrame[this._currentFrameIndex];
            if (needShow) {
                var texture:Texture = this.getTexture(frameData.res);
                var bitmap = this.bitmap;
                bitmap.x = frameData.x;
                bitmap.y = frameData.y;
                bitmap.texture = texture;
            }

            if (frameData.action != null) {
                this.movieClip.dispatchEventWith(frameData.action);
            }

            this._currentFrameIndex++;
            if (this._currentFrameIndex == this._totalFrame) {
                this._currentFrameIndex = 0;
            }
        }

        private getTexture(name:string):Texture {
            var resData = this._frameData.res[name];
            var texture = this._spriteSheet.getTexture(name);
            if (!texture) {
                texture = this._spriteSheet.createTexture(name, resData.x, resData.y, resData.w, resData.h);
            }
            return texture;
        }


    }

}


