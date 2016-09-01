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
var egret;
(function (egret) {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    var FrameLabel = (function (_super) {
        __extends(FrameLabel, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function FrameLabel(name, frame /*int*/, end /*int*/) {
            _super.call(this);
            this._name = name;
            this._frame = frame | 0;
            if (end)
                this._end = end | 0;
        }
        var d = __define,c=FrameLabel,p=c.prototype;
        d(p, "name"
            /**
             * @language en_US
             * Frame number
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 标签名
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._name;
            }
        );
        d(p, "frame"
            /**
             * @language en_US
             * Frame serial number of the label
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 标签所在帧序号
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._frame;
            }
        );
        d(p, "end"
            /**
             * @language en_US
             * Frame serial number, the end of the label
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 标签对应的结束帧序号
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._end;
            }
        );
        /**
         * @language en_US
         * Duplicate the current frame label object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 复制当前帧标签对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clone = function () {
            return new FrameLabel(this._name, this._frame, this._end);
        };
        return FrameLabel;
    }(egret.EventDispatcher));
    egret.FrameLabel = FrameLabel;
    egret.registerClass(FrameLabel,'egret.FrameLabel');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
    * @language en_US
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample extension/game/display/MovieClip.ts
    */
    /**
     * @language zh_CN
     * 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
     * @extends egret.DisplayObject
     * @event egret.Event.COMPLETE 动画播放完成。
     * @event egret.Event.LOOP_COMPLETE 动画循环播放完成。
     * @see http://edn.egret.com/cn/docs/page/596 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/MovieClip.ts
     */
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        //Construct Function
        /**
         * 创建新的 MovieClip 实例。创建 MovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @param movieClipData {movieClipData} 被引用的 movieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function MovieClip(movieClipData) {
            _super.call(this);
            //Render Property
            this.$bitmapData = null;
            //Render Property
            this.offsetPoint = egret.Point.create(0, 0);
            //Data Property
            this.$movieClipData = null;
            /**
             * @private
             */
            this.frames = null;
            /**
             * @private
             */
            this.$totalFrames = 0;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             * @private
             */
            this.frameLabels = null;
            /**
             * @private
             */
            this.$frameLabelStart = 0;
            /**
             * @private
             */
            this.$frameLabelEnd = 0;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             * @private
             */
            this.frameEvents = null;
            /**
             * @private
             */
            this.frameIntervalTime = 0;
            /**
             * @private
             */
            this.$eventPool = null;
            //Animation Property
            this.$isPlaying = false;
            /**
             * @private
             */
            this.isStopped = true;
            /**
             * @private
             */
            this.playTimes = 0;
            /**
             * @private
             */
            this.$currentFrameNum = 0;
            /**
             * @private
             */
            this.$nextFrameNum = 0;
            /**
             * @private
             */
            this.displayedKeyFrameNum = 0;
            /**
             * @private
             */
            this.passedTime = 0;
            /**
             * @private
             */
            this.lastTime = 0;
            this.$smoothing = egret.Bitmap.defaultSmoothing;
            this.$renderNode = new egret.sys.BitmapNode();
            this.setMovieClipData(movieClipData);
        }
        var d = __define,c=MovieClip,p=c.prototype;
        d(p, "smoothing"
            /**
             * @language en_US
             * Whether or not is smoothed when scaled.
             * @version Egret 3.0
             * @platform Web
             */
            /**
             * @language zh_CN
             * 控制在缩放时是否进行平滑处理。
             * @version Egret 3.0
             * @platform Web
             */
            ,function () {
                return this.$smoothing;
            }
            ,function (value) {
                value = !!value;
                if (value == this.$smoothing) {
                    return;
                }
                this.$smoothing = value;
                this.$invalidate();
            }
        );
        /**
         * @private
         *
         */
        p.$init = function () {
            this.$reset();
            var movieClipData = this.$movieClipData;
            if (movieClipData && movieClipData.$isDataValid()) {
                this.frames = movieClipData.frames;
                this.$totalFrames = movieClipData.numFrames;
                this.frameLabels = movieClipData.labels;
                this.frameEvents = movieClipData.events;
                this.frameIntervalTime = 1000 / movieClipData.frameRate;
                this._initFrame();
            }
        };
        /**
         * @private
         *
         */
        p.$reset = function () {
            this.frames = null;
            this.playTimes = 0;
            this.$isPlaying = false;
            this.setIsStopped(true);
            this.$currentFrameNum = 0;
            this.$nextFrameNum = 1;
            this.displayedKeyFrameNum = 0;
            this.passedTime = 0;
            this.$eventPool = [];
        };
        /**
         * @private
         *
         */
        p._initFrame = function () {
            if (this.$movieClipData.$isTextureValid()) {
                this.advanceFrame();
                this.constructFrame();
            }
        };
        /**
         * @private
         */
        p.$render = function () {
            var texture = this.$bitmapData;
            if (texture) {
                var offsetX = Math.round(this.offsetPoint.x);
                var offsetY = Math.round(this.offsetPoint.y);
                var bitmapWidth = texture._bitmapWidth;
                var bitmapHeight = texture._bitmapHeight;
                var textureWidth = texture.$getTextureWidth();
                var textureHeight = texture.$getTextureHeight();
                var destW = Math.round(texture.$getScaleBitmapWidth());
                var destH = Math.round(texture.$getScaleBitmapHeight());
                var sourceWidth = texture._sourceWidth;
                var sourceHeight = texture._sourceHeight;
                egret.sys.BitmapNode.$updateTextureData(this.$renderNode, texture._bitmapData, texture._bitmapX, texture._bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, null, egret.BitmapFillMode.SCALE, this.$smoothing);
            }
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            var texture = this.$bitmapData;
            if (texture) {
                var x = this.offsetPoint.x;
                var y = this.offsetPoint.y;
                var w = texture.$getTextureWidth();
                var h = texture.$getTextureHeight();
                bounds.setTo(x, y, w, h);
            }
            else {
                bounds.setEmpty();
            }
        };
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        p.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            if (this.$isPlaying && this.$totalFrames > 1) {
                this.setIsStopped(false);
            }
        };
        /**
         * @private
         *
         */
        p.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.setIsStopped(true);
        };
        //Data Function
        /**
         * @private
         * 返回帧标签为指定字符串的FrameLabel对象
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        p.getFrameLabelByName = function (labelName, ignoreCase) {
            if (ignoreCase === void 0) { ignoreCase = false; }
            if (ignoreCase) {
                labelName = labelName.toLowerCase();
            }
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (ignoreCase ? outputFramelabel.name.toLowerCase() == labelName : outputFramelabel.name == labelName) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        };
        /**
         * @private
         * 根据帧标签，设置开始和结束的帧数
         * @param labelName {string} 帧标签名
         */
        p.getFrameStartEnd = function (labelName) {
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (labelName == outputFramelabel.name) {
                        this.$frameLabelStart = outputFramelabel.frame;
                        this.$frameLabelEnd = outputFramelabel.end;
                        break;
                    }
                }
            }
        };
        /**
         * @private
         * 返回指定序号的帧的FrameLabel对象
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        p.getFrameLabelByFrame = function (frame) {
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (outputFramelabel.frame == frame) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        };
        /**
         * @private
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        p.getFrameLabelForFrame = function (frame) {
            var outputFrameLabel = null;
            var tempFrameLabel = null;
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                for (var i = 0; i < frameLabels.length; i++) {
                    tempFrameLabel = frameLabels[i];
                    if (tempFrameLabel.frame > frame) {
                        return outputFrameLabel;
                    }
                    outputFrameLabel = tempFrameLabel;
                }
            }
            return outputFrameLabel;
        };
        //Animation Function
        /**
         * 继续播放当前动画
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)，
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.play = function (playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            this.$isPlaying = true;
            this.setPlayTimes(playTimes);
            if (this.$totalFrames > 1 && this.$stage) {
                this.setIsStopped(false);
            }
        };
        /**
         * 暂停播放动画
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stop = function () {
            this.$isPlaying = false;
            this.setIsStopped(true);
        };
        /**
         * 将播放头移到前一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.prevFrame = function () {
            this.gotoAndStop(this.$currentFrameNum - 1);
        };
        /**
         * 跳到后一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.nextFrame = function () {
            this.gotoAndStop(this.$currentFrameNum + 1);
        };
        /**
         * 将播放头移到指定帧并播放
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.gotoAndPlay = function (frame, playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            if (arguments.length == 0 || arguments.length > 2) {
                egret.$error(1022, "MovieClip.gotoAndPlay()");
            }
            if (typeof frame === "string") {
                this.getFrameStartEnd(frame);
            }
            else {
                this.$frameLabelStart = 0;
                this.$frameLabelEnd = 0;
            }
            this.play(playTimes);
            this.gotoFrame(frame);
        };
        /**
         * 将播放头移到指定帧并停止
         * @param frame {any} 指定帧的帧号或帧标签
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.gotoAndStop = function (frame) {
            if (arguments.length != 1) {
                egret.$error(1022, "MovieClip.gotoAndStop()");
            }
            this.stop();
            this.gotoFrame(frame);
        };
        /**
         * @private
         *
         * @param frame
         */
        p.gotoFrame = function (frame) {
            var frameNum;
            if (typeof frame === "string") {
                frameNum = this.getFrameLabelByName(frame).frame;
            }
            else {
                frameNum = parseInt(frame + '', 10);
                if (frameNum != frame) {
                    egret.$error(1022, "Frame Label Not Found");
                }
            }
            if (frameNum < 1) {
                frameNum = 1;
            }
            else if (frameNum > this.$totalFrames) {
                frameNum = this.$totalFrames;
            }
            if (frameNum == this.$nextFrameNum) {
                return;
            }
            this.$nextFrameNum = frameNum;
            this.advanceFrame();
            this.constructFrame();
            this.handlePendingEvent();
        };
        /**
         * @private
         *
         * @param advancedTime
         * @returns
         */
        p.advanceTime = function (timeStamp) {
            var self = this;
            var advancedTime = timeStamp - self.lastTime;
            self.lastTime = timeStamp;
            var frameIntervalTime = self.frameIntervalTime;
            var currentTime = self.passedTime + advancedTime;
            self.passedTime = currentTime % frameIntervalTime;
            var num = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            var event;
            while (num >= 1) {
                num--;
                self.$nextFrameNum++;
                event = this.frameEvents[self.$nextFrameNum];
                if (event && event != "") {
                    egret.MovieClipEvent.dispatchMovieClipEvent(self, egret.MovieClipEvent.FRAME_LABEL, event);
                }
                if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart > 0 && self.$nextFrameNum > self.$frameLabelEnd)) {
                    if (self.playTimes == -1) {
                        self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                        self.$nextFrameNum = 1;
                    }
                    else {
                        self.playTimes--;
                        if (self.playTimes > 0) {
                            self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                            self.$nextFrameNum = 1;
                        }
                        else {
                            self.$nextFrameNum = self.$totalFrames;
                            self.$eventPool.push(egret.Event.COMPLETE);
                            self.stop();
                            break;
                        }
                    }
                }
                if (self.$currentFrameNum == self.$frameLabelEnd) {
                    self.$nextFrameNum = self.$frameLabelStart;
                }
                self.advanceFrame();
            }
            self.constructFrame();
            self.handlePendingEvent();
            return false;
        };
        /**
         * @private
         *
         */
        p.advanceFrame = function () {
            this.$currentFrameNum = this.$nextFrameNum;
        };
        /**
         * @private
         *
         */
        p.constructFrame = function () {
            var currentFrameNum = this.$currentFrameNum;
            if (this.displayedKeyFrameNum == currentFrameNum) {
                return;
            }
            this.$bitmapData = this.$movieClipData.getTextureByFrame(currentFrameNum);
            this.$movieClipData.$getOffsetByFrame(currentFrameNum, this.offsetPoint);
            this.$invalidateContentBounds();
            this.displayedKeyFrameNum = currentFrameNum;
        };
        /**
         * @private
         *
         */
        p.handlePendingEvent = function () {
            if (this.$eventPool.length != 0) {
                this.$eventPool.reverse();
                var eventPool = this.$eventPool;
                var length = eventPool.length;
                var isComplete = false;
                var isLoopComplete = false;
                for (var i = 0; i < length; i++) {
                    var event = eventPool.pop();
                    if (event == egret.Event.LOOP_COMPLETE) {
                        isLoopComplete = true;
                    }
                    else if (event == egret.Event.COMPLETE) {
                        isComplete = true;
                    }
                    else {
                        this.dispatchEventWith(event);
                    }
                }
                if (isLoopComplete) {
                    this.dispatchEventWith(egret.Event.LOOP_COMPLETE);
                }
                if (isComplete) {
                    this.dispatchEventWith(egret.Event.COMPLETE);
                }
            }
        };
        d(p, "totalFrames"
            //Properties
            /**
             * MovieClip 实例中帧的总数
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$totalFrames;
            }
        );
        d(p, "currentFrame"
            /**
             * MovieClip 实例当前播放的帧的序号
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$currentFrameNum;
            }
        );
        d(p, "currentFrameLabel"
            /**
             * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                var label = this.getFrameLabelByFrame(this.$currentFrameNum);
                return label && label.name;
            }
        );
        d(p, "currentLabel"
            /**
             * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                var label = this.getFrameLabelForFrame(this.$currentFrameNum);
                return label ? label.name : null;
            }
        );
        d(p, "frameRate"
            /**
             * MovieClip 实例的帧频
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$movieClipData.frameRate;
            }
            ,function (value) {
                if (value == this.$movieClipData.frameRate) {
                    return;
                }
                this.$movieClipData.frameRate = value;
                this.frameIntervalTime = 1000 / this.$movieClipData.frameRate;
            }
        );
        d(p, "isPlaying"
            /**
             * MovieClip 实例当前是否正在播放
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$isPlaying;
            }
        );
        d(p, "movieClipData"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$movieClipData;
            }
            /**
             * MovieClip数据源
             */
            ,function (value) {
                this.setMovieClipData(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.setMovieClipData = function (value) {
            if (this.$movieClipData == value) {
                return;
            }
            this.$movieClipData = value;
            this.$init();
        };
        /**
         * @private
         *
         * @param value
         */
        p.setPlayTimes = function (value) {
            if (value < 0 || value >= 1) {
                this.playTimes = value < 0 ? -1 : Math.floor(value);
            }
        };
        /**
         * @private
         *
         * @param value
         */
        p.setIsStopped = function (value) {
            if (this.isStopped == value) {
                return;
            }
            this.isStopped = value;
            if (value) {
                this.playTimes = 0;
                egret.sys.$ticker.$stopTick(this.advanceTime, this);
            }
            else {
                this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
                this.lastTime = egret.getTimer();
                egret.sys.$ticker.$startTick(this.advanceTime, this);
            }
        };
        return MovieClip;
    }(egret.DisplayObject));
    egret.MovieClip = MovieClip;
    egret.registerClass(MovieClip,'egret.MovieClip');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @classdesc 使用 MovieClipData 类，您可以创建 MovieClip 对象和处理 MovieClip 对象的数据。MovieClipData 一般由MovieClipDataFactory生成
     * @see http://edn.egret.com/cn/docs/page/596 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     */
    var MovieClipData = (function (_super) {
        __extends(MovieClipData, _super);
        /**
         * 创建一个 egret.MovieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function MovieClipData() {
            _super.call(this);
            /**
             * @private
             * MovieClip数据
             */
            this.$mcData = null;
            /**
             * 总帧数
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.numFrames = 1;
            /**
             * 帧数据列表
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.frames = [];
            /**
             * 帧标签列表
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.labels = null;
            /**
             * 帧事件列表
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.events = [];
            /**
             * 帧率
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.frameRate = 0;
            /**
             * 纹理数据
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.textureData = null;
            /**
             * 纹理集
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.spriteSheet = null;
        }
        var d = __define,c=MovieClipData,p=c.prototype;
        /**
         * @private
         *
         * @param mcData
         * @param textureData
         * @param spriteSheet
         */
        p.$init = function (mcData, textureData, spriteSheet) {
            this.textureData = textureData;
            this.spriteSheet = spriteSheet;
            this.setMCData(mcData);
        };
        /**
         * 根据指定帧序号获取该帧对应的关键帧数据
         * @param frame {number} 帧序号
         * @returns {any} 帧数据对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getKeyFrameData = function (frame) {
            var outputFrameData = this.frames[frame - 1];
            if (outputFrameData.frame) {
                outputFrameData = this.frames[outputFrameData.frame - 1];
            }
            return outputFrameData;
        };
        /**
         * 根据指定帧序号获取该帧对应的Texture对象
         * @param frame {number} 帧序号
         * @returns {egret.Texture} Texture对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getTextureByFrame = function (frame) {
            var frameData = this.getKeyFrameData(frame);
            if (frameData.res) {
                var outputTexture = this.getTextureByResName(frameData.res);
                return outputTexture;
            }
            return null;
        };
        p.$getOffsetByFrame = function (frame, point) {
            var frameData = this.getKeyFrameData(frame);
            if (frameData.res) {
                point.setTo(frameData.x | 0, frameData.y | 0);
            }
        };
        /**
         * @private
         *
         * @param resName
         * @returns
         */
        p.getTextureByResName = function (resName) {
            var texture = this.spriteSheet.getTexture(resName);
            if (!texture) {
                var textureData = this.textureData[resName];
                texture = this.spriteSheet.createTexture(resName, textureData.x, textureData.y, textureData.w, textureData.h);
            }
            return texture;
        };
        /**
         * @private
         *
         * @returns
         */
        p.$isDataValid = function () {
            return this.frames.length > 0;
        };
        /**
         * @private
         *
         * @returns
         */
        p.$isTextureValid = function () {
            return this.textureData != null && this.spriteSheet != null;
        };
        /**
         * @private
         *
         * @param mcData
         */
        p.$fillMCData = function (mcData) {
            this.frameRate = mcData["frameRate"] || 24;
            this.fillFramesData(mcData.frames);
            this.fillFrameLabelsData(mcData.labels);
            this.fillFrameEventsData(mcData.events);
        };
        /**
         * @private
         *
         * @param framesData
         */
        p.fillFramesData = function (framesData) {
            var frames = this.frames;
            var length = framesData ? framesData.length : 0;
            var keyFramePosition;
            for (var i = 0; i < length; i++) {
                var frameData = framesData[i];
                frames.push(frameData);
                if (frameData.duration) {
                    var duration = parseInt(frameData.duration);
                    if (duration > 1) {
                        keyFramePosition = frames.length;
                        for (var j = 1; j < duration; j++) {
                            frames.push({ "frame": keyFramePosition });
                        }
                    }
                }
            }
            this.numFrames = frames.length;
        };
        /**
         * @private
         *
         * @param frameLabelsData
         */
        p.fillFrameLabelsData = function (frameLabelsData) {
            if (frameLabelsData) {
                var length = frameLabelsData.length;
                if (length > 0) {
                    this.labels = [];
                    for (var i = 0; i < length; i++) {
                        var label = frameLabelsData[i];
                        this.labels.push(new egret.FrameLabel(label.name, label.frame, label.end));
                    }
                }
            }
        };
        /**
         * @private
         *
         * @param frameEventsData
         */
        p.fillFrameEventsData = function (frameEventsData) {
            if (frameEventsData) {
                var length = frameEventsData.length;
                if (length > 0) {
                    this.events = [];
                    for (var i = 0; i < length; i++) {
                        var events = frameEventsData[i];
                        this.events[events.frame] = events.name;
                    }
                }
            }
        };
        d(p, "mcData"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$mcData;
            }
            /**
             * MovieClip数据源
             */
            ,function (value) {
                this.setMCData(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.setMCData = function (value) {
            if (this.$mcData == value) {
                return;
            }
            this.$mcData = value;
            if (value) {
                this.$fillMCData(value);
            }
        };
        return MovieClipData;
    }(egret.HashObject));
    egret.MovieClipData = MovieClipData;
    egret.registerClass(MovieClipData,'egret.MovieClipData');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @classdesc 使用 MovieClipDataFactory 类，可以生成 MovieClipData 对象用于创建MovieClip
     * @see http://edn.egret.com/cn/docs/page/596 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     */
    var MovieClipDataFactory = (function (_super) {
        __extends(MovieClipDataFactory, _super);
        /**
         * 创建一个 egret.MovieClipDataFactory 对象
         * @param movieClipDataSet {any} MovieClip数据集，该数据集必须由Egret官方工具生成
         * @param texture {Texture} 纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        function MovieClipDataFactory(movieClipDataSet, texture) {
            _super.call(this);
            /**
             * 是否开启缓存
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.enableCache = true;
            /**
             * @private
             */
            this.$mcDataCache = {};
            this.$mcDataSet = movieClipDataSet;
            this.setTexture(texture);
        }
        var d = __define,c=MovieClipDataFactory,p=c.prototype;
        /**
         * 清空缓存
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clearCache = function () {
            this.$mcDataCache = {};
        };
        /**
         * 根据名字生成一个MovieClipData实例。可以用于创建MovieClip。
         * @param movieClipName {string} MovieClip名字. 可选参数，默认为"", 相当于取第一个MovieClip数据
         * @returns {MovieClipData} 生成的MovieClipData对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.generateMovieClipData = function (movieClipName) {
            if (movieClipName === void 0) { movieClipName = ""; }
            if (movieClipName == "") {
                if (this.$mcDataSet) {
                    for (movieClipName in this.$mcDataSet.mc) {
                        break;
                    }
                }
            }
            if (movieClipName == "") {
                return null;
            }
            var output = this.findFromCache(movieClipName, this.$mcDataCache);
            if (!output) {
                output = new egret.MovieClipData();
                this.fillData(movieClipName, output, this.$mcDataCache);
            }
            return output;
        };
        /**
         * @private
         *
         * @param movieClipName
         * @param cache
         * @returns
         */
        p.findFromCache = function (movieClipName, cache) {
            if (this.enableCache && cache[movieClipName]) {
                return cache[movieClipName];
            }
            return null;
        };
        /**
         * @private
         *
         * @param movieClipName
         * @param movieClip
         * @param cache
         */
        p.fillData = function (movieClipName, movieClip, cache) {
            if (this.$mcDataSet) {
                var mcData = this.$mcDataSet.mc[movieClipName];
                if (mcData) {
                    movieClip.$init(mcData, this.$mcDataSet.res, this.$spriteSheet);
                    if (this.enableCache) {
                        cache[movieClipName] = movieClip;
                    }
                }
            }
        };
        d(p, "mcDataSet"
            /**
             * MovieClip数据集
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$mcDataSet;
            }
            ,function (value) {
                this.$mcDataSet = value;
            }
        );
        d(p, "texture",undefined
            /**
             * MovieClip需要使用的纹理图
             */
            ,function (value) {
                this.setTexture(value);
            }
        );
        d(p, "spriteSheet"
            /**
             * 由纹理图生成的精灵表
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$spriteSheet;
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.setTexture = function (value) {
            this.$spriteSheet = value ? new egret.SpriteSheet(value) : null;
        };
        return MovieClipDataFactory;
    }(egret.EventDispatcher));
    egret.MovieClipDataFactory = MovieClipDataFactory;
    egret.registerClass(MovieClipDataFactory,'egret.MovieClipDataFactory');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * When the movieClip's current frame have a frameLabel, dispatches MovieClipEvent object. FrameLabel Event type: MovieClipEvent.FRAME_LABEL
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 当动画的当前帧有事件，将调度 MovieClipEvent 对象。帧事件类型 MovieClipEvent.FRAME_LABEL.
     * @version Egret 2.4
     * @platform Web,Native
     */
    var MovieClipEvent = (function (_super) {
        __extends(MovieClipEvent, _super);
        /**
         * @language en_US
         * TextEvent create an object that contains information about movieClip events.
         * @param type Type of event, you can access the MovieClipEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param frameLabel When the current frame have a frameLabel, the event listeners can access this information through the frameLabel property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 MovieClipEvent 对象，其中包含有关帧事件的信息。
         * @param type 事件的类型，可以作为 MovieClipEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param frameLabel 动画上的帧事件。事件侦听器可以通过 frameLabel 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function MovieClipEvent(type, bubbles, cancelable, frameLabel) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            if (frameLabel === void 0) { frameLabel = null; }
            _super.call(this, type, bubbles, cancelable);
            /**
             * @language en_US
             * In MovieClipEvent.FRAME_LABEL event, event corresponding string.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 在 MovieClipEvent.FRAME_LABEL 事件中，event对应的字符串。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.frameLabel = null;
            this.frameLabel = frameLabel;
        }
        var d = __define,c=MovieClipEvent,p=c.prototype;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown MovieClipEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param frameLabel  MovieClipEvent object frameLabel
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出 MovieClipEvent 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param frameLabel  MovieClipEvent 对象的 frameLabel 赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        MovieClipEvent.dispatchMovieClipEvent = function (target, type, frameLabel) {
            if (frameLabel === void 0) { frameLabel = null; }
            var event = egret.Event.create(MovieClipEvent, type);
            event.frameLabel = frameLabel;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * Dispatched whenever the current frame have a frameLabel.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画的当前帧上有事件时调度
         * @version Egret 2.4
         * @platform Web,Native
         */
        MovieClipEvent.FRAME_LABEL = "frame_label";
        return MovieClipEvent;
    }(egret.Event));
    egret.MovieClipEvent = MovieClipEvent;
    egret.registerClass(MovieClipEvent,'egret.MovieClipEvent');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @private
     */
    var ScrollEase = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ScrollEase() {
            egret.$error(1014);
        }
        var d = __define,c=ScrollEase,p=c.prototype;
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollEase.get = function (amount) {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            };
        };
        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollEase.getPowOut = function (pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollEase.quintOut = ScrollEase.getPowOut(5);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollEase.quartOut = ScrollEase.getPowOut(4);
        return ScrollEase;
    }());
    egret.ScrollEase = ScrollEase;
    egret.registerClass(ScrollEase,'egret.ScrollEase');
    /**
     * @private
     */
    var ScrollTween = (function (_super) {
        __extends(ScrollTween, _super);
        /**
         * 创建一个 egret.ScrollTween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ScrollTween(target, props, pluginData) {
            _super.call(this);
            /**
             * @private
             */
            this._target = null;
            /**
             * @private
             */
            this._useTicks = false;
            /**
             * @private
             */
            this.ignoreGlobalPause = false;
            /**
             * @private
             */
            this.loop = false;
            /**
             * @private
             */
            this.pluginData = null;
            /**
             * @private
             */
            this._steps = null;
            /**
             * @private
             */
            this._actions = null;
            /**
             * @private
             */
            this.paused = false;
            /**
             * @private
             */
            this.duration = 0;
            /**
             * @private
             */
            this._prevPos = -1;
            /**
             * @private
             */
            this.position = null;
            /**
             * @private
             */
            this._prevPosition = 0;
            /**
             * @private
             */
            this._stepPosition = 0;
            /**
             * @private
             */
            this.passive = false;
            this.initialize(target, props, pluginData);
        }
        var d = __define,c=ScrollTween,p=c.prototype;
        /**
         * @language en_US
         * Activate an object and add a ScrollTween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 ScrollTween 动画
         * @param target {any} 要激活 ScrollTween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollTween.get = function (target, props, pluginData, override) {
            if (props === void 0) { props = null; }
            if (pluginData === void 0) { pluginData = null; }
            if (override === void 0) { override = false; }
            if (override) {
                ScrollTween.removeTweens(target);
            }
            return new ScrollTween(target, props, pluginData);
        };
        /**
         * @language en_US
         * Delete all ScrollTween animations from an object
         * @param target The object whose ScrollTween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除一个对象上的全部 ScrollTween 动画
         * @param target  需要移除 ScrollTween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        ScrollTween.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = ScrollTween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        };
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        ScrollTween.tick = function (timeStamp, paused) {
            if (paused === void 0) { paused = false; }
            var delta = timeStamp - ScrollTween._lastTime;
            ScrollTween._lastTime = timeStamp;
            var tweens = ScrollTween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
            return false;
        };
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        ScrollTween._register = function (tween, value) {
            var target = tween._target;
            var tweens = ScrollTween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!ScrollTween._inited) {
                    ScrollTween._lastTime = egret.getTimer();
                    egret.sys.$ticker.$startTick(ScrollTween.tick, null);
                    ScrollTween._inited = true;
                }
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        };
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        p.initialize = function (target, props, pluginData) {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    ScrollTween.removeTweens(target);
                }
            }
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                ScrollTween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position);
            }
        };
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        p.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1; }
            if (value < 0) {
                value = 0;
            }
            //正常化位置
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            if (this._target) {
                if (end) {
                    //结束
                    this._updateTargetProps(null, 1);
                }
                else if (this._steps.length > 0) {
                    // 找到新的tween
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }
            if (end) {
                this.setPaused(true);
            }
            //执行actions
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    this._runActions(t, t);
                }
                else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                }
                else {
                    this._runActions(prevPos, t);
                }
            }
            this.dispatchEventWith("change");
            return end;
        };
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        p._runActions = function (startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            var i = -1;
            var j = this._actions.length;
            var k = 1;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        };
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        p._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = ScrollTween._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == ScrollTween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }
        };
        /**
         * @language en_US
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setPaused = function (value) {
            this.paused = value;
            ScrollTween._register(this, !value);
            return this;
        };
        /**
         * @private
         *
         * @param props
         * @returns
         */
        p._cloneProps = function (props) {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._addStep = function (o) {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //设置plugins
                    if (arr = ScrollTween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = ScrollTween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._addAction = function (o) {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        };
        /**
         * @language en_US
         * Modify the property of the specified display object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.ScrollEase} Easing algorithm
         * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.ScrollEase} 缓动算法
         * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.to = function (props, duration, ease) {
            if (ease === void 0) { ease = undefined; }
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        };
        /**
         * @language en_US
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {Array<any>} Parameter of the callback method
         * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.call = function (callback, thisObj, params) {
            if (thisObj === void 0) { thisObj = undefined; }
            if (params === void 0) { params = undefined; }
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        };
        /**
         * @method egret.ScrollTween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        /**
         * @private
         */
        ScrollTween._tweens = [];
        /**
         * @private
         */
        ScrollTween.IGNORE = {};
        /**
         * @private
         */
        ScrollTween._plugins = {};
        /**
         * @private
         */
        ScrollTween._inited = false;
        ScrollTween._lastTime = 0;
        return ScrollTween;
    }(egret.EventDispatcher));
    egret.ScrollTween = ScrollTween;
    egret.registerClass(ScrollTween,'egret.ScrollTween');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * ScrollView auxiliary classes for slides, you will pass a display object constructor. It can display more than the range display object within the specified size range. And can easily drag in this range.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     */
    /**
     * @language zh_CN
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可。可以在指定的尺寸范围内显示超过该范围的显示对象。并可以在此范围内随意拖动。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     */
    var ScrollView = (function (_super) {
        __extends(ScrollView, _super);
        /**
         * @language en_US
         * Create a egret.ScrollView objects
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.ScrollView 对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ScrollView(content) {
            if (content === void 0) { content = null; }
            _super.call(this);
            /**
             * @language en_US
             * Start rolling threshold when the touch point from the initial touch point at a distance exceeding this value will trigger roll
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.scrollBeginThreshold = 10;
            /**
             * @language en_US
             * Scrolling speed, the speed is required and the default speed ratio.
             * The range of scrollSpeed> 0 assigned to 2:00, the speed is 2 times the default speed
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 滚动速度，这个值为需要的速度与默认速度的比值。
             * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.scrollSpeed = 1;
            /**
             * @private
             */
            this._content = null;
            /**
             * @private
             */
            this.delayTouchBeginEvent = null;
            /**
             * @private
             */
            this.touchBeginTimer = null;
            this.touchEnabled = true;
            this._ScrV_Props_ = new egret.ScrollViewProperties();
            if (content) {
                this.setContent(content);
            }
        }
        var d = __define,c=ScrollView,p=c.prototype;
        d(p, "bounces"
            /**
             * @language en_US
             * Whether to enable rebound, rebound When enabled, ScrollView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
             * @default true
             * @version Egret 2.4
             */
            /**
             * @language zh_CN
             * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
             * @default true
             * @version Egret 2.4
             */
            ,function () {
                return this._ScrV_Props_._bounces;
            }
            ,function (value) {
                this._ScrV_Props_._bounces = !!value;
            }
        );
        /**
         * @language en_US
         * Set to scroll object
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置需要滚动的对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setContent = function (content) {
            if (this._content === content)
                return;
            this.removeContent();
            if (content) {
                this._content = content;
                _super.prototype.addChild.call(this, content);
                this._addEvents();
            }
        };
        /**
         * @language en_US
         * Remove rolling objects
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 移除滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeContent = function () {
            if (this._content) {
                this._removeEvents();
                _super.prototype.removeChildAt.call(this, 0);
            }
            this._content = null;
        };
        d(p, "verticalScrollPolicy"
            /**
             * @language en_US
             * Vertical scroll bar display policy, on / off / auto.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 垂直滚动条显示策略，on/off/auto。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._ScrV_Props_._verticalScrollPolicy;
            }
            ,function (value) {
                if (value == this._ScrV_Props_._verticalScrollPolicy)
                    return;
                this._ScrV_Props_._verticalScrollPolicy = value;
            }
        );
        d(p, "horizontalScrollPolicy"
            /**
             * @language en_US
             * The horizontal scroll bar display policy, on / off / auto.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 水平滚动条显示策略，on/off/auto。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._ScrV_Props_._horizontalScrollPolicy;
            }
            ,function (value) {
                if (value == this._ScrV_Props_._horizontalScrollPolicy)
                    return;
                this._ScrV_Props_._horizontalScrollPolicy = value;
            }
        );
        d(p, "scrollLeft"
            /**
             * @language en_US
             * Gets or sets the horizontal scroll position
             * @returns {number}
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取或设置水平滚动位置,
             * @returns {number}
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._ScrV_Props_._scrollLeft;
            }
            ,function (value) {
                if (value == this._ScrV_Props_._scrollLeft)
                    return;
                this._ScrV_Props_._scrollLeft = value;
                this._validatePosition(false, true);
                this._updateContentPosition();
            }
        );
        d(p, "scrollTop"
            /**
             * @language en_US
             * Gets or sets the vertical scroll position
             * @returns {number}
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取或设置垂直滚动位置,
             * @returns {number}
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._ScrV_Props_._scrollTop;
            }
            ,function (value) {
                if (value == this._ScrV_Props_._scrollTop)
                    return;
                this._ScrV_Props_._scrollTop = value;
                this._validatePosition(true, false);
                this._updateContentPosition();
            }
        );
        /**
         * @language en_US
         * Set scroll position
         * @param top {number} The vertical scroll position
         * @param left {number} The horizontal scroll position
         * @param isOffset {boolean} Optional parameter, the default is false, whether it is the amount of scrolling increase as top = 1 on behalf of one pixel scroll up
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动位置
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setScrollPosition = function (top, left, isOffset) {
            if (isOffset === void 0) { isOffset = false; }
            if (isOffset && top == 0 && left == 0)
                return;
            if (!isOffset && this._ScrV_Props_._scrollTop == top
                && this._ScrV_Props_._scrollLeft == left)
                return;
            var oldTop = this._ScrV_Props_._scrollTop, oldLeft = this._ScrV_Props_._scrollLeft;
            if (isOffset) {
                var maxLeft = this.getMaxScrollLeft();
                var maxTop = this.getMaxScrollTop();
                if (oldTop <= 0 || oldTop >= maxTop) {
                    top = top / 2;
                }
                if (oldLeft <= 0 || oldLeft >= maxLeft) {
                    left = left / 2;
                }
                var newTop = oldTop + top;
                var newLeft = oldLeft + left;
                //判断是否回弹
                var bounces = this._ScrV_Props_._bounces;
                if (!bounces) {
                    if (newTop <= 0 || newTop >= maxTop)
                        newTop = Math.max(0, Math.min(newTop, maxTop));
                    if (newLeft <= 0 || newLeft >= maxLeft)
                        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                }
                this._ScrV_Props_._scrollTop = newTop;
                this._ScrV_Props_._scrollLeft = newLeft;
            }
            else {
                this._ScrV_Props_._scrollTop = top;
                this._ScrV_Props_._scrollLeft = left;
            }
            this._validatePosition(true, true);
            this._updateContentPosition();
        };
        /**
         * @private
         *
         * @param top
         * @param left
         */
        p._validatePosition = function (top, left) {
            if (top === void 0) { top = false; }
            if (left === void 0) { left = false; }
            if (top) {
                var height = this.height;
                var contentHeight = this._getContentHeight();
                this._ScrV_Props_._scrollTop = Math.max(this._ScrV_Props_._scrollTop, (0 - height) / 2);
                this._ScrV_Props_._scrollTop = Math.min(this._ScrV_Props_._scrollTop, contentHeight > height ? (contentHeight - height / 2) : height / 2);
            }
            if (left) {
                var width = this.width;
                var contentWidth = this._getContentWidth();
                this._ScrV_Props_._scrollLeft = Math.max(this._ScrV_Props_._scrollLeft, (0 - width) / 2);
                this._ScrV_Props_._scrollLeft = Math.min(this._ScrV_Props_._scrollLeft, contentWidth > width ? (contentWidth - width / 2) : width / 2);
            }
        };
        /**
         * @private
         * @inheritDoc
         */
        p.$setWidth = function (value) {
            if (this.$getExplicitWidth() == value) {
                return false;
            }
            var result = _super.prototype.$setWidth.call(this, value);
            this._updateContentPosition();
            return result;
        };
        /**
         * @private
         * @inheritDoc
         */
        p.$setHeight = function (value) {
            if (this.$getExplicitHeight() == value)
                return false;
            var result = _super.prototype.$setHeight.call(this, value);
            this._updateContentPosition();
            return true;
        };
        /**
         * @private
         *
         */
        p._updateContentPosition = function () {
            var height = this.height;
            var width = this.width;
            //这里将坐标取整，避免有些浏览器精度低产生“黑线”问题
            this.scrollRect = new egret.Rectangle(Math.round(this._ScrV_Props_._scrollLeft), Math.round(this._ScrV_Props_._scrollTop), width, height);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        /**
         * @private
         *
         * @returns
         */
        p._checkScrollPolicy = function () {
            var hpolicy = this._ScrV_Props_._horizontalScrollPolicy;
            var hCanScroll = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
            this._ScrV_Props_._hCanScroll = hCanScroll;
            var vpolicy = this._ScrV_Props_._verticalScrollPolicy;
            var vCanScroll = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
            this._ScrV_Props_._vCanScroll = vCanScroll;
            return hCanScroll || vCanScroll;
        };
        /**
         * @private
         *
         * @param policy
         * @param contentLength
         * @param viewLength
         * @returns
         */
        p.__checkScrollPolicy = function (policy, contentLength, viewLength) {
            if (policy == "on")
                return true;
            if (policy == "off")
                return false;
            return contentLength > viewLength;
        };
        /**
         * @private
         *
         * @returns
         */
        p._addEvents = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        };
        /**
         * @private
         *
         * @returns
         */
        p._removeEvents = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        };
        /**
         * @private
         *
         * @param e
         */
        p._onTouchBegin = function (e) {
            if (e.$isDefaultPrevented) {
                return;
            }
            var canScroll = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this._ScrV_Props_._touchStartPosition.x = e.stageX;
            this._ScrV_Props_._touchStartPosition.y = e.stageY;
            if (this._ScrV_Props_._isHTweenPlaying || this._ScrV_Props_._isVTweenPlaying) {
                this._onScrollFinished();
            }
            this._tempStage = this.stage;
            this._tempStage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._tempStage.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._tempStage.addEventListener(egret.TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
            this._logTouchEvent(e);
            e.preventDefault();
        };
        /**
         * @private
         *
         * @param event
         */
        p._onTouchBeginCapture = function (event) {
            var canScroll = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            var target = event.target;
            while (target != this) {
                if ("_checkScrollPolicy" in target) {
                    canScroll = target._checkScrollPolicy();
                    if (canScroll) {
                        return;
                    }
                }
                target = target.parent;
            }
            event.stopPropagation();
            var evt = this.cloneTouchEvent(event);
            this.delayTouchBeginEvent = evt;
            if (!this.touchBeginTimer) {
                this.touchBeginTimer = new egret.Timer(100, 1);
                this.touchBeginTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this._onTouchBeginTimer, this);
            }
            this.touchBeginTimer.start();
            this._onTouchBegin(event);
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p._onTouchEndCapture = function (event) {
            var _this = this;
            if (!this.delayTouchBeginEvent) {
                return;
            }
            this._onTouchBeginTimer();
            event.stopPropagation();
            var evt = this.cloneTouchEvent(event);
            egret.callLater(function () {
                if (_this.stage) {
                    _this.dispatchPropagationEvent(evt);
                }
            }, this);
        };
        /**
         * @private
         *
         */
        p._onTouchBeginTimer = function () {
            this.touchBeginTimer.stop();
            var event = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null;
            //Dispatch event only if the scroll view is still on the stage
            if (this.stage)
                this.dispatchPropagationEvent(event);
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p.dispatchPropagationEvent = function (event) {
            var target = event.$target;
            var list = this.$getPropagationList(target);
            var length = list.length;
            var targetIndex = list.length * 0.5;
            var startIndex = -1;
            for (var i = 0; i < length; i++) {
                if (list[i] === this._content) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, startIndex + 1);
            targetIndex -= startIndex + 1;
            this.$dispatchPropagationEvent(event, list, targetIndex);
            egret.Event.release(event);
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p._onTouchMove = function (event) {
            if (this._ScrV_Props_._lastTouchPosition.x == event.stageX && this._ScrV_Props_._lastTouchPosition.y == event.stageY)
                return;
            if (!this._ScrV_Props_._scrollStarted) {
                var x = event.stageX - this._ScrV_Props_._touchStartPosition.x, y = event.stageY - this._ScrV_Props_._touchStartPosition.y;
                var distance = Math.sqrt(x * x + y * y);
                if (distance < this.scrollBeginThreshold) {
                    this._logTouchEvent(event);
                    return;
                }
            }
            this._ScrV_Props_._scrollStarted = true;
            if (this.delayTouchBeginEvent) {
                this.delayTouchBeginEvent = null;
                this.touchBeginTimer.stop();
            }
            this.touchChildren = false;
            var offset = this._getPointChange(event);
            this.setScrollPosition(offset.y, offset.x, true);
            this._calcVelocitys(event);
            this._logTouchEvent(event);
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p._onTouchEnd = function (event) {
            this.touchChildren = true;
            this._ScrV_Props_._scrollStarted = false;
            this._tempStage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._tempStage.removeEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._tempStage.removeEventListener(egret.TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
            this._moveAfterTouchEnd();
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p._onEnterFrame = function (event) {
            var time = egret.getTimer();
            if (time - this._ScrV_Props_._lastTouchTime > 100 && time - this._ScrV_Props_._lastTouchTime < 300) {
                this._calcVelocitys(this._ScrV_Props_._lastTouchEvent);
            }
        };
        /**
         * @private
         *
         * @param e
         * @returns
         */
        p._logTouchEvent = function (e) {
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
            this._ScrV_Props_._lastTouchEvent = this.cloneTouchEvent(e);
            this._ScrV_Props_._lastTouchTime = egret.getTimer();
        };
        /**
         * @private
         *
         * @param e
         * @returns
         */
        p._getPointChange = function (e) {
            return {
                x: this._ScrV_Props_._hCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.x - e.stageX),
                y: this._ScrV_Props_._vCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.y - e.stageY)
            };
        };
        /**
         * @private
         *
         * @param e
         * @returns
         */
        p._calcVelocitys = function (e) {
            var time = egret.getTimer();
            if (this._ScrV_Props_._lastTouchTime == 0) {
                this._ScrV_Props_._lastTouchTime = time;
                return;
            }
            var change = this._getPointChange(e);
            var timeoffset = time - this._ScrV_Props_._lastTouchTime;
            change.x /= timeoffset;
            change.y /= timeoffset;
            this._ScrV_Props_._velocitys.push(change);
            if (this._ScrV_Props_._velocitys.length > 5)
                this._ScrV_Props_._velocitys.shift();
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
        };
        /**
         * @private
         *
         * @returns
         */
        p._getContentWidth = function () {
            return this._content.$getExplicitWidth() || this._content.width;
        };
        /**
         * @private
         *
         * @returns
         */
        p._getContentHeight = function () {
            return this._content.$getExplicitHeight() || this._content.height;
        };
        /**
         * @language en_US
         * The left side of the maximum distance
         * @returns The left side of the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离左侧的最大值
         * @returns 距离左侧最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getMaxScrollLeft = function () {
            var max = this._getContentWidth() - this.width;
            return Math.max(0, max);
        };
        /**
         * @language en_US
         * Above the maximum distance
         * @returns Above the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离上方最大值
         * @returns 距离上方最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getMaxScrollTop = function () {
            var max = this._getContentHeight() - this.height;
            return Math.max(0, max);
        };
        /**
         * @private
         *
         */
        p._moveAfterTouchEnd = function () {
            if (this._ScrV_Props_._velocitys.length == 0)
                return;
            var sum = { x: 0, y: 0 }, totalW = 0;
            for (var i = 0; i < this._ScrV_Props_._velocitys.length; i++) {
                var v = this._ScrV_Props_._velocitys[i];
                var w = ScrollView.weight[i];
                sum.x += v.x * w;
                sum.y += v.y * w;
                totalW += w;
            }
            this._ScrV_Props_._velocitys.length = 0;
            if (this.scrollSpeed <= 0)
                this.scrollSpeed = 1;
            var x = sum.x / totalW * this.scrollSpeed, y = sum.y / totalW * this.scrollSpeed;
            var pixelsPerMSX = Math.abs(x), pixelsPerMSY = Math.abs(y);
            var maxLeft = this.getMaxScrollLeft();
            var maxTop = this.getMaxScrollTop();
            var datax = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._ScrV_Props_._scrollLeft, maxLeft) : {
                position: this._ScrV_Props_._scrollLeft,
                duration: 1
            };
            var datay = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._ScrV_Props_._scrollTop, maxTop) : {
                position: this._ScrV_Props_._scrollTop,
                duration: 1
            };
            this.setScrollLeft(datax.position, datax.duration);
            this.setScrollTop(datay.position, datay.duration);
        };
        /**
         * @private
         *
         * @param tw
         */
        p.onTweenFinished = function (tw) {
            if (tw == this._ScrV_Props_._vScrollTween)
                this._ScrV_Props_._isVTweenPlaying = false;
            if (tw == this._ScrV_Props_._hScrollTween)
                this._ScrV_Props_._isHTweenPlaying = false;
            if (this._ScrV_Props_._isHTweenPlaying == false && this._ScrV_Props_._isVTweenPlaying == false) {
                this._onScrollFinished();
            }
        };
        /**
         * @private
         *
         * @returns
         */
        p._onScrollStarted = function () {
        };
        /**
         * @private
         *
         * @returns
         */
        p._onScrollFinished = function () {
            egret.ScrollTween.removeTweens(this);
            this._ScrV_Props_._hScrollTween = null;
            this._ScrV_Props_._vScrollTween = null;
            this._ScrV_Props_._isHTweenPlaying = false;
            this._ScrV_Props_._isVTweenPlaying = false;
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        };
        /**
         * @language en_US
         * Set the scroll position above the distance
         * @param scrollTop Position above distance
         * @param duration Easing of time, in milliseconds
         * @returns Get tween vertical scrolling
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离上方的位置
         * @param scrollTop 距离上方的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取垂直滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setScrollTop = function (scrollTop, duration) {
            if (duration === void 0) { duration = 0; }
            var finalPosition = Math.min(this.getMaxScrollTop(), Math.max(scrollTop, 0));
            if (duration == 0) {
                this.scrollTop = finalPosition;
                return;
            }
            if (this._ScrV_Props_._bounces == false)
                scrollTop = finalPosition;
            var vtween = egret.ScrollTween.get(this).to({ scrollTop: scrollTop }, duration, egret.ScrollEase.quartOut);
            if (finalPosition != scrollTop) {
                vtween.to({ scrollTop: finalPosition }, 300, egret.ScrollEase.quintOut);
            }
            this._ScrV_Props_._isVTweenPlaying = true;
            this._ScrV_Props_._vScrollTween = vtween;
            vtween.call(this.onTweenFinished, this, [vtween]);
            if (!this._ScrV_Props_._isHTweenPlaying)
                this._onScrollStarted();
        };
        /**
         * @language en_US
         * Set the scroll position from the left side
         * @param scrollLeft From the position on the left side
         * @param duration Get tween vertical scrolling
         * @returns Gets the horizontal scroll tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离左侧的位置
         * @param scrollLeft 距离左侧的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取水平滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setScrollLeft = function (scrollLeft, duration) {
            if (duration === void 0) { duration = 0; }
            var finalPosition = Math.min(this.getMaxScrollLeft(), Math.max(scrollLeft, 0));
            if (duration == 0) {
                this.scrollLeft = finalPosition;
                return;
            }
            if (this._ScrV_Props_._bounces == false)
                scrollLeft = finalPosition;
            var htween = egret.ScrollTween.get(this).to({ scrollLeft: scrollLeft }, duration, egret.ScrollEase.quartOut);
            if (finalPosition != scrollLeft) {
                htween.to({ scrollLeft: finalPosition }, 300, egret.ScrollEase.quintOut);
            }
            this._ScrV_Props_._isHTweenPlaying = true;
            this._ScrV_Props_._hScrollTween = htween;
            htween.call(this.onTweenFinished, this, [htween]);
            if (!this._ScrV_Props_._isVTweenPlaying)
                this._onScrollStarted();
        };
        /**
         * @private
         *
         * @param pixelsPerMS
         * @param curPos
         * @param maxPos
         * @returns
         */
        p.getAnimationDatas = function (pixelsPerMS, curPos, maxPos) {
            var absPixelsPerMS = Math.abs(pixelsPerMS);
            var extraFricition = 0.95;
            var duration = 0;
            var friction = 0.998;
            var minVelocity = 0.02;
            var posTo = curPos + pixelsPerMS * 500;
            if (posTo < 0 || posTo > maxPos) {
                posTo = curPos;
                while (Math.abs(pixelsPerMS) != Infinity && Math.abs(pixelsPerMS) > minVelocity) {
                    posTo += pixelsPerMS;
                    if (posTo < 0 || posTo > maxPos) {
                        pixelsPerMS *= friction * extraFricition;
                    }
                    else {
                        pixelsPerMS *= friction;
                    }
                    duration++;
                }
            }
            else {
                duration = -Math.log(minVelocity / absPixelsPerMS) * 500;
            }
            var result = {
                position: Math.min(maxPos + 50, Math.max(posTo, -50)),
                duration: duration
            };
            return result;
        };
        /**
         * @private
         *
         * @param event
         * @returns
         */
        p.cloneTouchEvent = function (event) {
            var evt = new egret.TouchEvent(event.type, event.bubbles, event.cancelable);
            evt.touchPointID = event.touchPointID;
            evt.$stageX = event.stageX;
            evt.$stageY = event.stageY;
            //evt.ctrlKey = event.ctrlKey;
            //evt.altKey = event.altKey;
            //evt.shiftKey = event.shiftKey;
            evt.touchDown = event.touchDown;
            evt.$isDefaultPrevented = false;
            evt.$target = event.target;
            return evt;
        };
        /**
         * @private
         *
         * @returns
         */
        p.throwNotSupportedError = function () {
            egret.$error(1023);
        };
        /**
         * @deprecated
         * @inheritDoc
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addChild = function (child) {
            this.throwNotSupportedError();
            return null;
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addChildAt = function (child, index) {
            this.throwNotSupportedError();
            return null;
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeChild = function (child) {
            this.throwNotSupportedError();
            return null;
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeChildAt = function (index) {
            this.throwNotSupportedError();
            return null;
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setChildIndex = function (child, index) {
            this.throwNotSupportedError();
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.swapChildren = function (child1, child2) {
            this.throwNotSupportedError();
        };
        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.swapChildrenAt = function (index1, index2) {
            this.throwNotSupportedError();
        };
        /**
         * @private
         */
        ScrollView.weight = [1, 1.33, 1.66, 2, 2.33];
        return ScrollView;
    }(egret.DisplayObjectContainer));
    egret.ScrollView = ScrollView;
    egret.registerClass(ScrollView,'egret.ScrollView');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var ScrollViewProperties = (function () {
        function ScrollViewProperties() {
            /**
             * @private
             */
            this._verticalScrollPolicy = "auto";
            /**
             * @private
             */
            this._horizontalScrollPolicy = "auto";
            /**
             * @private
             */
            this._scrollLeft = 0;
            /**
             * @private
             */
            this._scrollTop = 0;
            /**
             * @private
             */
            this._hCanScroll = false;
            /**
             * @private
             */
            this._vCanScroll = false;
            /**
             * @private
             */
            this._lastTouchPosition = new egret.Point(0, 0);
            /**
             * @private
             */
            this._touchStartPosition = new egret.Point(0, 0);
            /**
             * @private
             */
            this._scrollStarted = false;
            /**
             * @private
             */
            this._lastTouchTime = 0;
            /**
             * @private
             */
            this._lastTouchEvent = null;
            /**
             * @private
             */
            this._velocitys = [];
            /**
             * @private
             */
            this._isHTweenPlaying = false;
            /**
             * @private
             */
            this._isVTweenPlaying = false;
            /**
             * @private
             */
            this._hScrollTween = null;
            /**
             * @private
             */
            this._vScrollTween = null;
            /**
             * @private
             */
            this._bounces = true;
        }
        var d = __define,c=ScrollViewProperties,p=c.prototype;
        return ScrollViewProperties;
    }());
    egret.ScrollViewProperties = ScrollViewProperties;
    egret.registerClass(ScrollViewProperties,'egret.ScrollViewProperties');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @private
     *
     * @param request
     * @returns
     */
    function $getUrl(request) {
        var url = request.url;
        //get请求没有设置参数，而是设置URLVariables的情况
        if (url.indexOf("?") == -1 && request.method == egret.URLRequestMethod.GET && request.data && request.data instanceof egret.URLVariables) {
            url = url + "?" + request.data.toString();
        }
        return url;
    }
    egret.$getUrl = $getUrl;
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * UThe URLLoader class downloads data from a URL as text, binary data, or URL-encoded variables.  It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
     * A URLLoader object downloads all of the data from a URL before making it available to code in the applications. It sends out notifications about the progress of the download,
     * which you can monitor through bytesLoaded and bytesTotal properties, as well as through dispatched events.
     * @see http://edn.egret.com/cn/docs/page/601 Build communication request
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.IOErrorEvent.IO_ERROR io error.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
     */
    /**
     * @language zh_CN
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @see http://edn.egret.com/cn/docs/page/601 构建通信请求
     * @event egret.Event.COMPLETE 加载完成后调度。
     * @event egret.IOErrorEvent.IO_ERROR 加载错误后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
     */
    var URLLoader = (function (_super) {
        __extends(URLLoader, _super);
        /**
         * @language en_US
         * Create an egret.URLLoader object
         * @param request {URLRequest} A URLRequest object specifies the URL to be downloaded.
         * If this parameter is omitted, no load operation begins. If a parameter is specified, the load operation begins immediately
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 egret.URLLoader 对象
         * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
         * @version Egret 2.4
         * @platform Web,Native
         */
        function URLLoader(request) {
            if (request === void 0) { request = null; }
            _super.call(this);
            /**
             * @language en_US
             * Control whether the downloaded data is received as text (URLLoaderDataFormat.TEXT), raw binary data (URLLoaderDataFormat.BINARY), or URL-encoded variables (URLLoaderDataFormat.VARIABLES).
             * If the value of the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
             * If the value of the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
             * If the value of the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
             * If the value of the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
             * The default value is URLLoaderDataFormat.TEXT.
             * @default egret.URLLoaderDataFormat.TEXT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
             * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
             * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
             * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
             * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
             * @default egret.URLLoaderDataFormat.TEXT
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.dataFormat = egret.URLLoaderDataFormat.TEXT;
            /**
             * @language en_US
             * The data received from the load operation. This property is populated only when the load operation is complete. The format of the data depends on the setting of the dataFormat property:
             * If the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
             * If the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
             * If the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
             * If the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
             * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
             * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
             * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
             * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.data = null;
            /**
             * @private
             */
            this._request = null;
            /**
             * @private
             */
            this._status = -1;
            if (request) {
                this.load(request);
            }
        }
        var d = __define,c=URLLoader,p=c.prototype;
        /**
         * @language en_US
         * Send and load data from the specified URL. The data can be received as text, raw binary data, or URL-encoded variables, depending on the value you set for the dataFormat property.
         * Note that the default value of the dataFormat property is text. If you want to send data to the specified URL, you can set the data property in the URLRequest object.
         * @param request {URLRequest}  A URLRequest object specifies the URL to be downloaded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
         * @param request {URLRequest}  一个 URLRequest 对象，指定要下载的 URL。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.load = function (request) {
            this._request = request;
            this.data = null;
            egret.NetContext.getNetContext().proceed(this);
        };
        /**
         * @private
         *
         */
        p.__recycle = function () {
            this._request = null;
            this.data = null;
        };
        return URLLoader;
    }(egret.EventDispatcher));
    egret.URLLoader = URLLoader;
    egret.registerClass(URLLoader,'egret.URLLoader');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * The URLLoaderDataFormat class provides values that specify how downloaded data is received.
     * @see http://edn.egret.com/cn/docs/page/600 Read different data format
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoaderDataFormat.ts
     */
    /**
     * @language zh_CN
     * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see http://edn.egret.com/cn/docs/page/600 读取不同数据格式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoaderDataFormat.ts
     */
    var URLLoaderDataFormat = (function () {
        function URLLoaderDataFormat() {
        }
        var d = __define,c=URLLoaderDataFormat,p=c.prototype;
        /**
         * @language en_US
         * Specify that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 指定以原始二进制数据形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web
         */
        URLLoaderDataFormat.BINARY = "binary";
        /**
         * @language en_US
         * Specify that downloaded data is received as text.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以文本形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLLoaderDataFormat.TEXT = "text";
        /**
         * @language en_US
         * Specify that downloaded data is received as URL-encoded variables.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以 URL 编码变量形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLLoaderDataFormat.VARIABLES = "variables";
        /**
         * @language en_US
         * Specify that downloaded data is received as bitmap texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以位图纹理形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLLoaderDataFormat.TEXTURE = "texture";
        /**
         * @language en_US
         * Specify that downloaded data is received as sound.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以声音形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLLoaderDataFormat.SOUND = "sound";
        return URLLoaderDataFormat;
    }());
    egret.URLLoaderDataFormat = URLLoaderDataFormat;
    egret.registerClass(URLLoaderDataFormat,'egret.URLLoaderDataFormat');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * The URLRequest class captures all of the information in a single HTTP request.
     * @see http://edn.egret.com/cn/index.php/article/index/id/601 Build communication request
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     */
    /**
     * @language zh_CN
     * URLRequest 类可捕获单个 HTTP 请求中的所有信息。
     * @see http://edn.egret.com/cn/index.php/article/index/id/601 构建通信请求
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     */
    var URLRequest = (function (_super) {
        __extends(URLRequest, _super);
        /**
         * @language en_US
         * Create an egret.URLRequest object
         * @param url {string} Addresses for URL requests
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLRequest 对象
         * @param url {string} 进行网络请求的地址
         * @version Egret 2.4
         * @platform Web,Native
         */
        function URLRequest(url) {
            if (url === void 0) { url = null; }
            _super.call(this);
            /**
             * @language en_US
             * An object contains data to be transmitted with the URL request.
             * This property is used in conjunction with the method property.  When the value of method is GET, the value of data is appended to the value of URLRequest.url, using HTTP query-string syntax.
             * When the method value is POST (or any value other than GET), the value of data is transmitted in the body of the HTTP request.
             * The URLRequest API offers binary POST support and support for URL-encoded variables, as well as support for strings. The data object can be a ArrayBuffer, URLVariables, or String object.
             * The way in which the data is used depends on the type of object used:
             * If the object is a ArrayBuffer object, the binary data of the ArrayBuffer object is used as POST data. For GET, data of ArrayBuffer type is not supported.
             * If the object is a URLVariables object and the method is POST, then the variables are encoded using x-www-form-urlencoded format and the resulting string is used as POST data.
             * If the object is a URLVariables object and the method is GET, the URLVariables object will define variables to be sent with the URLRequest object.
             * Otherwise, the object is converted into a string, and the string is used as the POST or GET data.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个对象，它包含将随 URL 请求一起传输的数据。
             * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
             * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
             * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ArrayBuffer、URLVariables 或 String 对象。
             * 该数据的使用方式取决于所用对象的类型：
             * 如果该对象为 ArrayBuffer 对象，则 ArrayBuffer 对象的二进制数据用作 POST 数据。对于 GET，不支持 ArrayBuffer 类型的数据。
             * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
             * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
             * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.data = null;
            /**
             * @language en_US
             * Request method, valid values are URLRequestMethod.GET or URLRequestMethod.POST.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 请求方式，有效值为URLRequestMethod.GET 或 URLRequestMethod.POST。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.method = egret.URLRequestMethod.GET;
            /**
             * @language en_US
             * The requested URL.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 所请求的 URL。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.url = "";
            /**
             * @language en_US
             * The array of HTTP request headers to be appended to the HTTP request. The array is composed of URLRequestHeader objects.
             * Each object in the array must be a URLRequestHeader object that contains a name string and a value string.
             * Because of browser compatibility, this property has not been achieved in html5
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要追加到 HTTP 请求的 HTTP 请求标头的数组。该数组由 URLRequestHeader 对象组成。
             * 数组中的每一对象必须是包含一个名称字符串和一个值字符串的 URLRequestHeader 对象。
             * 由于浏览器兼容性原因，该属性在 html5 中并未实现
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.requestHeaders = [];
            this.url = url;
        }
        var d = __define,c=URLRequest,p=c.prototype;
        return URLRequest;
    }(egret.HashObject));
    egret.URLRequest = URLRequest;
    egret.registerClass(URLRequest,'egret.URLRequest');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * A URLRequestHeader object encapsulates a single HTTP request header and consists of a name/value pair.  URLRequestHeader objects are used in the requestHeaders property of the URLRequest class.
     * Note: Because of browser compatibility, this property has not been achieved in html5
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestHeader.ts
     */
    /**
     * @language zh_CN
     * URLRequestHeader 对象封装了一个 HTTP 请求标头并由一个名称/值对组成。URLRequestHeader 对象在 URLRequest 类的 requestHeaders 属性中使用。
     * 注意：由于浏览器兼容性原因，在 html5 中并未实现
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestHeader.ts
     */
    var URLRequestHeader = (function () {
        /**
         * @language en_US
         * Create an egret.URLRequestHeader object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLRequestHeader 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function URLRequestHeader(name, value) {
            /**
             * @language en_US
             * HTTP request header name, such as Content-Type
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * HTTP 请求标头名称，如 Content-Type
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.name = "";
            /**
             * @language en_US
             * The values associated with the name property (such as text/plain).
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 与 name 属性相关联的值，如 text/plain
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.value = "";
            this.name = name;
            this.value = value;
        }
        var d = __define,c=URLRequestHeader,p=c.prototype;
        return URLRequestHeader;
    }());
    egret.URLRequestHeader = URLRequestHeader;
    egret.registerClass(URLRequestHeader,'egret.URLRequestHeader');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * The URLRequestMethod class provides values that specify whether the
     * URLRequest object should use the POST method or the GET method when sending data to a server.
     * @see http://edn.egret.com/cn/docs/page/599 POST与GET
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestMethod.ts
     */
    /**
     * @language zh_CN
     * URLRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * URLRequest 对象应使用 POST 方法还是 GET 方法。
     * @see http://edn.egret.com/cn/docs/page/599 POST与GET
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestMethod.ts
     */
    var URLRequestMethod = (function () {
        function URLRequestMethod() {
        }
        var d = __define,c=URLRequestMethod,p=c.prototype;
        /**
         * @language en_US
         * Specify that the URLRequest object is a GET.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 URLRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLRequestMethod.GET = "get";
        /**
         * @language en_US
         * Specify that the URLRequest object is a POST.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 URLRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web,Native
         */
        URLRequestMethod.POST = "post";
        return URLRequestMethod;
    }());
    egret.URLRequestMethod = URLRequestMethod;
    egret.registerClass(URLRequestMethod,'egret.URLRequestMethod');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * The URLVariables class allows you to transfer variables between an application and a server.
     * Use URLVariables objects with methods of the URLLoader class and the data property of the URLRequest class.
     * @see http://edn.egret.com/cn/docs/page/598 Send the request with parameters
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     */
    /**
     * @language zh_CN
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     * @see http://edn.egret.com/cn/docs/page/598 发送带参数的请求
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     */
    var URLVariables = (function (_super) {
        __extends(URLVariables, _super);
        /**
         * @language en_US
         * Create an egret.URLVariable object
         * @param source {String} A URL-encoded string containing name/value pairs.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLVariables 对象
         * @param source {String} 包含名称/值对的 URL 编码的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function URLVariables(source) {
            if (source === void 0) { source = null; }
            _super.call(this);
            /**
             * @language en_US
             * Key-value pair data object saved in this URLVariables object
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 此 URLVariables 储存的键值对数据对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.variables = null;
            if (source !== null) {
                this.decode(source);
            }
        }
        var d = __define,c=URLVariables,p=c.prototype;
        /**
         * @language en_US
         * Convert the variable string into the property of this URLVariables.variables object.
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将变量字符串转换为此 URLVariables.variables 对象的属性。
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.decode = function (source) {
            if (!this.variables) {
                this.variables = {};
            }
            source = source.split("+").join(" ");
            var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(source)) {
                var key = decodeURIComponent(tokens[1]), val = decodeURIComponent(tokens[2]);
                //没有重复键值，直接赋值
                if ((key in this.variables) == false) {
                    this.variables[key] = val;
                    continue;
                }
                //有重复键值，如果已经存在数组，直接push到数组，否则创建一个新数组
                var value = this.variables[key];
                if (value instanceof Array) {
                    value.push(val);
                }
                else {
                    this.variables[key] = [value, val];
                }
            }
        };
        /**
         * @language en_US
         * Return a string containing all enumerable variables using  the MIME content encoding format : application/x-www-form-urlencoded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            if (!this.variables) {
                return "";
            }
            var variables = this.variables;
            var stringArray = [];
            for (var key in variables) {
                stringArray.push(this.encodeValue(key, variables[key]));
            }
            return stringArray.join("&");
        };
        /**
         * @private
         *
         * @param key
         * @param value
         */
        p.encodeValue = function (key, value) {
            if (value instanceof Array) {
                return this.encodeArray(key, value);
            }
            else {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
        };
        /**
         * @private
         *
         * @param key
         * @param value
         */
        p.encodeArray = function (key, value) {
            if (!key)
                return "";
            if (value.length == 0) {
                return encodeURIComponent(key) + "=";
            }
            return value.map(function (v) { return encodeURIComponent(key) + "=" + encodeURIComponent(v); }).join("&");
        };
        return URLVariables;
    }(egret.HashObject));
    egret.URLVariables = URLVariables;
    egret.registerClass(URLVariables,'egret.URLVariables');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
    * @language en_US
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample extension/game/player/Ticker.ts
    */
    /**
     * @language zh_CN
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/player/Ticker.ts
     */
    var Ticker = (function (_super) {
        __extends(Ticker, _super);
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Ticker() {
            _super.call(this);
            this._timeScale = 1;
            this._paused = false;
            this._callIndex = -1;
            this._lastTime = 0;
            this.callBackList = [];
            if (Ticker.instance != null) {
                if (DEBUG) {
                    egret.$error(1033);
                }
            }
            egret.sys.$ticker.$startTick(this.update, this);
            this._lastTime = egret.getTimer();
        }
        var d = __define,c=Ticker,p=c.prototype;
        p.update = function (timeStamp) {
            var advancedTime = timeStamp - this._lastTime;
            this._lastTime = timeStamp;
            if (this._paused) {
                return false;
            }
            var frameTime = advancedTime * this._timeScale;
            this._callList = this.callBackList.concat();
            this._callIndex = 0;
            for (; this._callIndex < this._callList.length; this._callIndex++) {
                var eventBin = this._callList[this._callIndex];
                eventBin.listener.call(eventBin.thisObject, frameTime);
            }
            this._callIndex = -1;
            this._callList = null;
            return false;
        };
        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。推荐使用 egret.startTick 替代此方法。
         * @method egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {number} 事件优先级，开发者请勿传递 Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        p.register = function (listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            this.$insertEventBin(this.callBackList, "", listener, thisObject, false, priority, false);
        };
        /**
         * 取消侦听enterFrame事件。推荐使用 egret.stopTick 替代此方法。
         * @method egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {any} 侦听函数的this对象
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        p.unregister = function (listener, thisObject) {
            this.$removeEventBin(this.callBackList, listener, thisObject);
        };
        /**
         * @deprecated
         * @param timeScale {number}
         * @private
         */
        p.setTimeScale = function (timeScale) {
            this._timeScale = timeScale;
        };
        /**
         * @deprecated
         * @method egret.Ticker#getTimeScale
         * @private
         */
        p.getTimeScale = function () {
            return this._timeScale;
        };
        /**
         * 暂停
         * @deprecated
         * @method egret.Ticker#pause
         */
        p.pause = function () {
            this._paused = true;
        };
        /**
         * 继续
         * @deprecated
         * @method egret.Ticker#resume
         */
        p.resume = function () {
            this._paused = false;
        };
        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        Ticker.getInstance = function () {
            if (Ticker.instance == null) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        return Ticker;
    }(egret.EventDispatcher));
    egret.Ticker = Ticker;
    egret.registerClass(Ticker,'egret.Ticker');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @class egret.MainContext
     * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     * @extends egret.EventDispatcher
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var MainContext = (function (_super) {
        __extends(MainContext, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function MainContext() {
            _super.call(this);
        }
        var d = __define,c=MainContext,p=c.prototype;
        d(p, "stage"
            /**
             * 渲染Context
             * @member egret.MainContext#rendererContext
             * @version Egret 2.4
             * @platform Web,Native
             */
            //public rendererContext:RendererContext = null;
            /**
             * 触摸Context
             * @member egret.MainContext#touchContext
             * @version Egret 2.4
             * @platform Web,Native
             */
            //public touchContext:TouchContext = null;
            /**
             * 网络Context
             * @member egret.MainContext#netContext
             * @version Egret 2.4
             * @platform Web,Native
             */
            //public netContext:NetContext = null;
            /**
             * 设备divice
             * @member egret.MainContext#deviceContext
             * @version Egret 2.4
             * @platform Web,Native
             */
            //public deviceContext:DeviceContext = null;
            /**
             * 舞台
             * @member egret.MainContext#stage
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return egret.sys.$TempStage;
            }
        );
        d(MainContext, "runtimeType"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                egret.$warn(1041);
                return MainContext._runtimeType;
            }
        );
        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         * @method egret.MainContext#run
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.run = function () {
        };
        d(MainContext, "instance"
            /**
             * @method egret.Ticker.getInstance
             * @returns {Ticker}
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                if (MainContext._instance == null) {
                    MainContext._instance = new MainContext();
                }
                return MainContext._instance;
            }
        );
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        MainContext.deviceType = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        MainContext.DEVICE_PC = "web";
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        MainContext.DEVICE_MOBILE = "native";
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        MainContext.RUNTIME_HTML5 = "runtimeHtml5";
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        MainContext.RUNTIME_NATIVE = "runtimeNative";
        return MainContext;
    }(egret.EventDispatcher));
    egret.MainContext = MainContext;
    egret.registerClass(MainContext,'egret.MainContext');
})(egret || (egret = {}));
var testDeviceType1 = function () {
    if (!this["navigator"]) {
        return true;
    }
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
};
var testRuntimeType1 = function () {
    if (this["navigator"]) {
        return true;
    }
    return false;
};
egret.MainContext.deviceType = testDeviceType1() ? egret.MainContext.DEVICE_MOBILE : egret.MainContext.DEVICE_PC;
egret.MainContext._runtimeType = testRuntimeType1() ? egret.MainContext.RUNTIME_HTML5 : egret.MainContext.RUNTIME_NATIVE;
delete testDeviceType1;
delete testRuntimeType1;
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * Tool class for object cache repeat use, which can be used to construct an object pool. Objects are automatically recycled after a certain duration.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     * @private
     */
    /**
     * @language zh_CN
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     * @private
     */
    var Recycler = (function (_super) {
        __extends(Recycler, _super);
        /**
         * @language en_US
         * Create an egret.Recycler object
         * @param autoDisposeTime {number} Number of frames when objects are destroyed automatically. Default value: 300
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Recycler 对象
         * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Recycler(autoDisposeTime) {
            if (autoDisposeTime === void 0) { autoDisposeTime = 300; }
            _super.call(this);
            /**
             * @private
             */
            this.objectPool = [];
            /**
             * @private
             */
            this._length = 0;
            if (autoDisposeTime < 1)
                autoDisposeTime = 1;
            this.autoDisposeTime = autoDisposeTime;
            this.frameCount = 0;
        }
        var d = __define,c=Recycler,p=c.prototype;
        Recycler.$init = function () {
            egret.sys.$ticker.$startTick(Recycler.onUpdate, Recycler);
        };
        Recycler.onUpdate = function (timeStamp) {
            var list = Recycler._callBackList;
            for (var i = list.length - 1; i >= 0; i--) {
                list[i].$checkFrame();
            }
            return false;
        };
        /**
         * @private
         *
         */
        p.$checkFrame = function () {
            this.frameCount--;
            if (this.frameCount <= 0) {
                this.dispose();
            }
        };
        d(p, "length"
            /**
             * @language en_US
             * Number of cached objects"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 缓存的对象数量
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._length;
            }
        );
        /**
         * @language en_US
         * Cache an object for repeat use
         * @param object {any} The object to be cached
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缓存一个对象以复用
         * @param object {any} 需要缓存的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.push = function (object) {
            var pool = this.objectPool;
            if (pool.indexOf(object) == -1) {
                pool.push(object);
                if (object.__recycle) {
                    object.__recycle();
                }
                this._length++;
                if (this.frameCount == 0) {
                    this.frameCount = this.autoDisposeTime;
                    Recycler._callBackList.push(this);
                }
            }
        };
        /**
         * @language en_US
         * Obtain a cached object
         * @returns {any} The obtained cached object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取一个缓存的对象
         * @returns {any} 获得的缓存对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.pop = function () {
            if (this._length == 0)
                return null;
            this._length--;
            return this.objectPool.pop();
        };
        /**
         * @language en_US
         * Immediately clear all cached objects.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 立即清空所有缓存的对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispose = function () {
            if (this._length > 0) {
                this.objectPool = [];
                this._length = 0;
            }
            this.frameCount = 0;
            var list = Recycler._callBackList;
            var index = list.indexOf(this);
            if (index != -1) {
                list.splice(index, 1);
            }
        };
        /**
         * @private
         */
        Recycler._callBackList = [];
        return Recycler;
    }(egret.HashObject));
    egret.Recycler = Recycler;
    egret.registerClass(Recycler,'egret.Recycler');
    Recycler.$init();
})(egret || (egret = {}));
var egret;
(function (egret) {
    var setIntervalCache = {};
    var setIntervalIndex = 0;
    var setIntervalCount = 0;
    var lastTime = 0;
    /**
     * @language en_US
     * To specify a delay (in milliseconds) calls the function specified interval loop.
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     */
    /**
     * @language zh_CN
     * 以指定的延迟（以毫秒为单位）间隔循环调用指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     */
    function setInterval(listener, thisObject, delay) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var data = { listener: listener, thisObject: thisObject, delay: delay, originDelay: delay, params: args };
        setIntervalCount++;
        if (setIntervalCount == 1) {
            lastTime = egret.getTimer();
            egret.sys.$ticker.$startTick(intervalUpdate, null);
        }
        setIntervalIndex++;
        setIntervalCache[setIntervalIndex] = data;
        return setIntervalIndex;
    }
    egret.setInterval = setInterval;
    /**
     * @language en_US
     * Clear function to run after a specified delay.
     * @param key {number} Index that egret.setInterval returns
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     */
    /**
     * @language zh_CN
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setInterval所返回的索引
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     */
    function clearInterval(key) {
        if (setIntervalCache[key]) {
            setIntervalCount--;
            delete setIntervalCache[key];
            if (setIntervalCount == 0) {
                egret.sys.$ticker.$stopTick(intervalUpdate, null);
            }
        }
    }
    egret.clearInterval = clearInterval;
    /**
     * @private
     *
     * @param dt
     */
    function intervalUpdate(timeStamp) {
        var dt = timeStamp - lastTime;
        lastTime = timeStamp;
        for (var key in setIntervalCache) {
            var data = setIntervalCache[key];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.delay = data.originDelay;
                data.listener.apply(data.thisObject, data.params);
            }
        }
        return false;
    }
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var setTimeoutCache = {};
    var setTimeoutIndex = 0;
    var setTimeoutCount = 0;
    var lastTime = 0;
    /**
     * @language en_US
     * Run the designated function in specified delay (in milliseconds).
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearTimeout
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setTimeout.ts
     */
    /**
     * @language zh_CN
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setTimeout.ts
     */
    function setTimeout(listener, thisObject, delay) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var data = { listener: listener, thisObject: thisObject, delay: delay, params: args };
        setTimeoutCount++;
        if (setTimeoutCount == 1 && egret.sys.$ticker) {
            lastTime = egret.getTimer();
            egret.sys.$ticker.$startTick(timeoutUpdate, null);
        }
        setTimeoutIndex++;
        setTimeoutCache[setTimeoutIndex] = data;
        return setTimeoutIndex;
    }
    egret.setTimeout = setTimeout;
    /**
     * @language en_US
     * Function run after the specified delay is cleared.
     * @param key {number} Index that egret.setTimeout returns
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setTimeout所返回的索引
     * @version Egret 2.4
     * @platform Web,Native
     */
    function clearTimeout(key) {
        if (setTimeoutCache[key]) {
            setTimeoutCount--;
            delete setTimeoutCache[key];
            if (setTimeoutCount == 0 && egret.sys.$ticker) {
                egret.sys.$ticker.$stopTick(timeoutUpdate, null);
            }
        }
    }
    egret.clearTimeout = clearTimeout;
    /**
     * @private
     *
     * @param dt
     */
    function timeoutUpdate(timeStamp) {
        var dt = timeStamp - lastTime;
        lastTime = timeStamp;
        for (var key in setTimeoutCache) {
            var key2 = key;
            var data = setTimeoutCache[key2];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.listener.apply(data.thisObject, data.params);
                clearTimeout(key2);
            }
        }
        return false;
    }
})(egret || (egret = {}));
