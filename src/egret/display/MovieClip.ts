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


/// <reference path="../context/MainContext.ts"/>
/// <reference path="../context/Ticker.ts"/>
/// <reference path="Bitmap.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../utils/Logger.ts"/>

module egret {
    /**
     * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
     */
    export class MovieClip extends DisplayObjectContainer {

        private delegate:MovieClipDelegate;

        constructor(data, texture:Texture) {
            super();
            this.delegate = new DefaultMovieClipDelegate(data, texture);
            this.delegate.setMovieClip(this);
        }

        /**
         * 播放指定动画
         * @param frameName
         */
        public gotoAndPlay(frameName:string) {
            this.delegate.gotoAndPlay(frameName);
        }

        /**
         * 播放并暂停指定动画
         * @param frameName
         */
        public gotoAndStop(frameName:string) {
            this.delegate.gotoAndStop(frameName);
        }


        /**
         * 暂停动画
         */
        public stop() {
            this.delegate.stop();
        }

        public dispose():void {
            this.delegate.dispose();

        }

        /**
         * 方法名改为 release
         * @deprecated
         */
        public release() {
            Logger.warning("MovieClip#release方法即将废弃");
            this.dispose();
        }


        /**
         * @deprecated
         */
        public getCurrentFrameIndex():number {
            Logger.warning("MovieClip#getCurrentFrameIndex方法即将废弃");
            return this.delegate["_currentFrameIndex"];
        }

        /**
         * @deprecated
         */
        public getTotalFrame():number {
            Logger.warning("MovieClip#getTotalFrame方法即将废弃");
            return this.delegate["_totalFrame"];
        }

        /**
         * @deprecated
         */
        public setInterval(value:number) {
            Logger.warning("MovieClip#setInterval方法即将废弃");
            this.delegate["_interval"] = value;
        }

        /**
         * @deprecated
         */
        public getIsPlaying():boolean {
            Logger.warning("MovieClip#getIsPlaying方法即将废弃");
            return this.delegate["isPlaying"];
        }
    }

    interface MovieClipDelegate {

        gotoAndPlay(frameName:string):void;

        gotoAndStop(frameName:string):void;

        stop():void;

        dispose():void;

        setMovieClip(movieclip:MovieClip):void;
    }

    class DefaultMovieClipDelegate implements MovieClipDelegate {
        private _frameData;
        private _totalFrame:number = 0;
        private _spriteSheet:SpriteSheet;
        private _passTime:number = 0;
        private _oneFrameTime = 1000 / 60;
        private _interval = 0;
        private _resPool = {};
        private _currentFrameIndex:number = 0;
        private _currentFrameName:string;


        private _currentInterval = 0;
        private _isPlaying:boolean = false;
        private movieClip:MovieClip;

        private bitmap:Bitmap;


        constructor(public data, texture:Texture) {
            this._frameData = data;
            this._spriteSheet = new SpriteSheet(texture._bitmapData);
            this._oneFrameTime = 1000 / egret.MainContext.instance.deviceContext.frameRate;
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
            this._currentInterval = 0;
            this._currentFrameName = frameName;

            this.playNextFrame();
            this._passTime = 0;
            Ticker.getInstance().register(this.update, this);
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
        }

        public gotoAndStop(frameName:string):void {
            this.checkHasFrame(frameName);
            this.stop();
            this._currentFrameIndex = 0;
            this._currentInterval = 0;
            this._currentFrameName = frameName;
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
            this.playNextFrame();
        }

        public stop():void {
            this._isPlaying = false;
            Ticker.getInstance().unregister(this.update, this);
        }

        public dispose():void {
            for (var key in this._resPool) {
                delete this._resPool[key];
            }

        }

        private checkHasFrame(name:string) {
            if (this._frameData.frames[name] == undefined) {
                egret.Logger.fatal("MovieClip没有对应的frame：", name);
            }
        }

        private update(advancedTime:number):void {
            //设置间隔之后，间隔不到则不处理
            if (this._interval != this._currentInterval) {
                this._currentInterval++;
                return;
            }
            var last = this._passTime % this._oneFrameTime;
            var num = Math.floor((last + advancedTime) / this._oneFrameTime);
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
            this._currentInterval = 0;
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

        /**
         * 设置间隔
         * @param value
         */
        public setInterval(value:number) {
            this._interval = value;
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


