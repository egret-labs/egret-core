/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/Ticker.ts"/>
/// <reference path="Bitmap.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="../texture/Texture.ts"/>

module ns_egret {
    /**
     * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
     */
    export class MovieClip extends DisplayObjectContainer {
        private _frameData;
        private _resPool = {};
        private _currentFrameIndex:number = 0;
        private _currentFrameName:string;
        private _totalFrame:number = 0;
        private _interval = 0;
        private _currentInterval = 0;
        private _isPlaying:boolean = false;
        private _passTime:number = 0;
        private _oneFrameTime = 1000 / Ticker.getInstance().getFrameRate();

        constructor(public data, public texture:Texture) {
            super();
            this._frameData = data;
        }

        /**
         * 播放指定动画
         * @param frameName
         */
        public gotoAndPlay(frameName:string) {
            this.checkHasFrame(frameName);
            this._isPlaying = true;
            this._currentFrameIndex = 0;
            this._currentInterval = 0;
            this._currentFrameName = frameName;
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
            this.playNextFrame();
            this._passTime = 0;
            Ticker.getInstance().register(this.update, this);
        }

        /**
         * 播放并暂停指定动画
         * @param frameName
         */
        public gotoAndStop(frameName:string) {
            this.checkHasFrame(frameName);
            this.stop();
            this._currentFrameIndex = 0;
            this._currentInterval = 0;
            this._currentFrameName = frameName;
            this._totalFrame = this._frameData.frames[frameName].totalFrame;
            this.playNextFrame();
        }

        private checkHasFrame(name:string) {
            if (this._frameData.frames[name] == undefined) {
                ns_egret.Logger.fatal("MovieClip没有对应的frame：", name);
            }
        }

        /**
         * 暂停动画
         */
        public stop() {
            this._isPlaying = false;
            Ticker.getInstance().unregister(this.update, this);
        }

        private update(frameTime:number) {
            //设置间隔之后，间隔不到则不处理
            if (this._interval != this._currentInterval) {
                this._currentInterval++;
                return;
            }
            var last = this._passTime % this._oneFrameTime;
            var num = Math.floor((last + frameTime) / this._oneFrameTime);
            while (num >= 1) {
                if(num == 1)
                {
                    this.playNextFrame();
                }
                else
                {
                    this.playNextFrame(false);
                }
                num--;
            }
            this._passTime += frameTime;
        }

        private playNextFrame(needShow:boolean = true) {
            //todo 如果动画只有一帧的性能优化
            this._currentInterval = 0;
            var frameData = this._frameData.frames[this._currentFrameName].childrenFrame[this._currentFrameIndex];
            if (needShow) {
                var bitmap = this.getBitmap(frameData.res);
                bitmap.x = frameData.x;
                bitmap.y = frameData.y;
                this.removeChildren();
                this.addChild(bitmap);
            }

            if (frameData.action != null) {
                this.dispatchEventWith(frameData.action);
            }

            this._currentFrameIndex++;
            if (this._currentFrameIndex == this._totalFrame) {
                this._currentFrameIndex = 0;
            }
        }

        private getBitmap(name:string):Bitmap {
            var result:Bitmap;
            if (this._resPool[name] != null) {
                result = this._resPool[name];
            }
            else {
                var resData = this._frameData.res[name];
                result = Bitmap.initWithTexture(this.texture);
                result.spriteFrame = resData;
                this._resPool[name] = result;
            }
            return result;
        }

        public release() {
            //todo,这里没必要创建对象
            this._resPool = {};
        }

        public getCurrentFrameIndex():number {
            return this._currentFrameIndex;
        }

        public getTotalFrame():number {
            return this._totalFrame;
        }

        /**
         * 设置间隔
         * @param value
         */
        public setInterval(value:number) {
            this._interval = value;
        }

        /**
         * 判断当前动画是否正在播放
         * @stable D 这个API需要改为 isPlaying()
         * @returns {Boolean}
         */
        public getIsPlaying():boolean {
            return this._isPlaying;
        }
    }
}