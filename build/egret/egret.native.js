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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) { 
  Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var NativeSound = (function (_super) {
            __extends(NativeSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function NativeSound() {
                _super.call(this);
                /**
                 * @private
                 */
                this.loaded = false;
            }
            var d = __define,c=NativeSound;p=c.prototype;
            /**
             * @inheritDoc
             */
            p.load = function (url) {
                var self = this;
                this.url = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = onAudioLoaded;
                promise.onErrorFunc = onAudioError;
                egret_native.download(url, url, promise);
                var audio = new Audio(url);
                audio.addEventListener("canplaythrough", onCanPlay);
                audio.addEventListener("error", onAudioError);
                this.originAudio = audio;
                function onAudioLoaded() {
                    audio.load();
                    NativeSound.$recycle(this.url, audio);
                }
                function onCanPlay() {
                    removeListeners();
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    audio.removeEventListener("canplaythrough", onAudioLoaded);
                    audio.removeEventListener("error", onAudioError);
                }
            };
            /**
             * @inheritDoc
             */
            p.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (DEBUG && this.loaded == false) {
                    egret.$error(3001);
                }
                var audio = NativeSound.$pop(this.url);
                if (audio == null) {
                    audio = new Audio(this.url);
                }
                else {
                    audio.load();
                }
                audio.autoplay = true;
                var channel = new web.NativeSoundChannel(audio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                return channel;
            };
            /**
             * @inheritDoc
             */
            p.close = function () {
                if (this.loaded == false && this.originAudio)
                    this.originAudio.src = "";
                if (this.originAudio)
                    this.originAudio = null;
                NativeSound.$clear(this.url);
            };
            NativeSound.$clear = function (url) {
                var array = NativeSound.audios[url];
                if (array) {
                    array.length = 0;
                }
            };
            NativeSound.$pop = function (url) {
                var array = NativeSound.audios[url];
                if (array && array.length > 0) {
                    return array.pop();
                }
                return null;
            };
            NativeSound.$recycle = function (url, audio) {
                var array = NativeSound.audios[url];
                if (NativeSound.audios[url] == null) {
                    array = NativeSound.audios[url] = [];
                }
                array.push(audio);
            };
            /**
             * @language en_US
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeSound.MUSIC = "music";
            /**
             * @language en_US
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeSound.EFFECT = "effect";
            /**
             * @private
             */
            NativeSound.audios = {};
            return NativeSound;
        })(egret.EventDispatcher);
        web.NativeSound = NativeSound;
        egret.registerClass(NativeSound,"egret.web.NativeSound",["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        var blendModesForGL = {
            "source-over": [1, 771],
            "lighter": [770, 1],
            "destination-out": [0, 771],
            "destination-in": [0, 770]
        };
        /**
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        var NativeRenderContext = (function (_super) {
            __extends(NativeRenderContext, _super);
            function NativeRenderContext() {
                _super.apply(this, arguments);
                this.$matrix = new egret.Matrix();
                this.$nativeContext = egret_native.Graphics;
                this.$nativeGraphicsContext = egret_native.rastergl;
                this.$globalCompositeOperation = "source-over";
                this.$globalAlpha = 1;
                this.$lineWidth = 0;
                this.$strokeStyle = "#000000";
                this.$fillStyle = "#000000";
                this.$font = "10px sans-serif";
                this.$fontSize = 10;
                this.$saveList = [];
                this.$clipRect = new egret.Rectangle();
                this.$saveCount = 0;
                this.$clipList = [];
                this.$hasStrokeText = false;
            }
            var d = __define,c=NativeRenderContext;p=c.prototype;
            d(p, "globalCompositeOperation"
                /**
                 * @private
                 * 设置新图像如何绘制到已有的图像上的规制
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$globalCompositeOperation;
                }
                ,function (value) {
                    this.$globalCompositeOperation = value;
                    var arr = blendModesForGL[value];
                    if (arr) {
                        this.$nativeContext.setBlendArg(arr[0], arr[1]);
                    }
                }
            );
            d(p, "globalAlpha"
                /**
                 * @private
                 * 设置接下来绘图填充的整体透明度
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$globalAlpha;
                }
                ,function (value) {
                    this.$globalAlpha = value;
                    this.$nativeContext.setGlobalAlpha(value);
                }
            );
            d(p, "lineWidth"
                /**
                 * @private
                 * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
                 * @default 1
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$lineWidth;
                }
                ,function (value) {
                    //console.log("set lineWidth" + value);
                    this.$lineWidth = value;
                    this.$nativeGraphicsContext.lineWidth = value;
                }
            );
            d(p, "strokeStyle"
                /**
                 * @private
                 * 设置要在图形边线填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$strokeStyle;
                }
                ,function (value) {
                    if (value.indexOf("rgba") != -1) {
                        value = this.$parseRGBA(value);
                    }
                    else if (value.indexOf("rgb") != -1) {
                        value = this.$parseRGB(value);
                    }
                    //console.log("strokeStyle::" + value);
                    this.$strokeStyle = value;
                    egret_native.Label.setStrokeColor(parseInt(value.replace("#", "0x")));
                    this.$nativeGraphicsContext.strokeStyle = value;
                }
            );
            d(p, "fillStyle"
                /**
                 * @private
                 * 设置要在图形内部填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$fillStyle;
                }
                ,function (value) {
                    if (value.indexOf("rgba") != -1) {
                        value = this.$parseRGBA(value);
                    }
                    else if (value.indexOf("rgb") != -1) {
                        value = this.$parseRGB(value);
                    }
                    //console.log("fillStyle::" + value);
                    this.$fillStyle = value;
                    egret_native.Label.setTextColor(parseInt(value.replace("#", "0x")));
                    this.$nativeGraphicsContext.fillStyle = value;
                }
            );
            p.$fillColorStr = function (s) {
                if (s.length < 2) {
                    s = "0" + s;
                }
                return s;
            };
            p.$parseRGBA = function (str) {
                var index = str.indexOf("(");
                str = str.slice(index + 1, str.length - 1);
                var arr = str.split(",");
                var a = parseInt((parseFloat(arr[3]) * 255)).toString(16);
                var r = parseInt(arr[0]).toString(16);
                var g = parseInt(arr[1]).toString(16);
                var b = parseInt(arr[2]).toString(16);
                str = "#" + this.$fillColorStr(a) + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
                return str;
            };
            p.$parseRGB = function (str) {
                var index = str.indexOf("(");
                str = str.slice(index + 1, str.length - 1);
                var arr = str.split(",");
                var r = parseInt(arr[0]).toString(16);
                var g = parseInt(arr[1]).toString(16);
                var b = parseInt(arr[2]).toString(16);
                str = "#" + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
                return str;
            };
            d(p, "font"
                /**
                 * @private
                 * 当前的字体样式
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                ,function () {
                    return this.$font;
                }
                ,function (value) {
                    this.$font = value;
                    var arr = value.split(" ");
                    var length = arr.length;
                    for (var i = 0; i < length; i++) {
                        var txt = arr[i];
                        if (txt.indexOf("px") != -1) {
                            this.$fontSize = parseInt(txt.replace("px", ""));
                            //console.log("set font" + this.$lineWidth);
                            return;
                        }
                    }
                }
            );
            /**
             * @private
             * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
             * @param x 圆弧中心（圆心）的 x 轴坐标。
             * @param y 圆弧中心（圆心）的 y 轴坐标。
             * @param radius 圆弧的半径。
             * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
             * @param endAngle 圆弧的重点， 单位以弧度表示。
             * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.$nativeGraphicsContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            };
            /**
             * @private
             * 绘制一段二次贝塞尔曲线路径。它需要2个点。 第一个点是控制点，第二个点是终点。 起始点是当前路径最新的点，当创建二次贝赛尔曲线之前，可以使用 moveTo() 方法进行改变。
             * @param cpx 控制点的 x 轴坐标。
             * @param cpy 控制点的 y 轴坐标。
             * @param x 终点的 x 轴坐标。
             * @param y 终点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.quadraticCurveTo = function (cpx, cpy, x, y) {
                this.$nativeGraphicsContext.quadraticCurveTo(cpx, cpy, x, y);
            };
            /**
             * @private
             * 使用直线连接子路径的终点到x，y坐标。
             * @param x 直线终点的 x 轴坐标。
             * @param y 直线终点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.lineTo = function (x, y) {
                this.$nativeGraphicsContext.lineTo(x, y);
            };
            /**
             * @private
             * 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环绕规则。
             * @param fillRule 一种算法，决定点是在路径内还是在路径外。允许的值：
             * "nonzero": 非零环绕规则， 默认的规则。
             * "evenodd": 奇偶环绕规则。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.fill = function (fillRule) {
                this.$nativeGraphicsContext.fill(fillRule);
            };
            /**
             * @private
             * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.closePath = function () {
                this.$nativeGraphicsContext.closePath();
            };
            /**
             * @private
             * 创建一段矩形路径，矩形的起点位置是 (x, y) ，尺寸为 width 和 height。矩形的4个点通过直线连接，子路径做为闭合的标记，所以你可以填充或者描边矩形。
             * @param x 矩形起点的 x 轴坐标。
             * @param y 矩形起点的 y 轴坐标。
             * @param width 矩形的宽度。
             * @param height 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.rect = function (x, y, w, h) {
                this.$nativeGraphicsContext.rect(x, y, w, h);
                this.$clipRect.setTo(x, y, w, h);
            };
            /**
             * @private
             * 将一个新的子路径的起始点移动到(x，y)坐标
             * @param x 点的 x 轴
             * @param y 点的 y 轴
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.moveTo = function (x, y) {
                this.$nativeGraphicsContext.moveTo(x, y);
            };
            /**
             * @private
             * 绘制一个填充矩形。矩形的起点在 (x, y) 位置，矩形的尺寸是 width 和 height ，fillStyle 属性决定矩形的样式。
             * @param x 矩形起始点的 x 轴坐标。
             * @param y 矩形起始点的 y 轴坐标。
             * @param width 矩形的宽度。
             * @param height 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.fillRect = function (x, y, w, h) {
                this.$nativeGraphicsContext.fillRect(x, y, w, h);
            };
            /**
             * @private
             * 绘制一段三次贝赛尔曲线路径。该方法需要三个点。 第一、第二个点是控制点，第三个点是结束点。起始点是当前路径的最后一个点，
             * 绘制贝赛尔曲线前，可以通过调用 moveTo() 进行修改。
             * @param cp1x 第一个控制点的 x 轴坐标。
             * @param cp1y 第一个控制点的 y 轴坐标。
             * @param cp2x 第二个控制点的 x 轴坐标。
             * @param cp2y 第二个控制点的 y 轴坐标。
             * @param x 结束点的 x 轴坐标。
             * @param y 结束点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this.$nativeGraphicsContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            };
            /**
             * @private
             * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.stroke = function () {
                this.$nativeGraphicsContext.stroke();
            };
            /**
             * @private
             * 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法。
             * @param x 矩形起点的 x 轴坐标。
             * @param y 矩形起点的 y 轴坐标。
             * @param width 矩形的宽度。
             * @param height 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.strokeRect = function (x, y, w, h) {
                //console.log("strokeRect");
                this.$nativeGraphicsContext.strokeRect(x, y, w, h);
            };
            /**
             * @private
             * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.beginPath = function () {
                this.$nativeGraphicsContext.beginPath();
            };
            /**
             * @private
             * 根据控制点和半径绘制一段圆弧路径，使用直线连接前一个点。
             * @param x1 第一个控制点的 x 轴坐标。
             * @param y1 第一个控制点的 y 轴坐标。
             * @param x2 第二个控制点的 x 轴坐标。
             * @param y2 第二个控制点的 y 轴坐标。
             * @param radius 圆弧的半径。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.arcTo = function (x1, y1, x2, y2, radius) {
                this.$nativeGraphicsContext.arcTo(x1, y1, x2, y2, radius);
            };
            /**
             * @private
             * 使用方法参数描述的矩阵多次叠加当前的变换矩阵。
             * @param a 水平缩放。
             * @param b 水平倾斜。
             * @param c 垂直倾斜。
             * @param d 垂直缩放。
             * @param tx 水平移动。
             * @param ty 垂直移动。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.transform = function (a, b, c, d, tx, ty) {
                this.$matrix.append(a, b, c, d, tx, ty);
                this.setTransformToNative();
            };
            /**
             * @private
             * 通过在网格中移动 surface 和 surface 原点 x 水平方向、原点 y 垂直方向，添加平移变换
             * @param x 水平移动。
             * @param y 垂直移动。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.translate = function (x, y) {
                this.$matrix.translate(x, y);
                this.setTransformToNative();
            };
            /**
             * @private
             * 根据 x 水平方向和 y 垂直方向，为 surface 单位添加缩放变换。
             * @param x 水平方向的缩放因子。
             * @param y 垂直方向的缩放因子。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.scale = function (x, y) {
                this.$matrix.scale(x, y);
                this.setTransformToNative();
            };
            /**
             * @private
             * 在变换矩阵中增加旋转，角度变量表示一个顺时针旋转角度并且用弧度表示。
             * @param angle 顺时针旋转的弧度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.rotate = function (angle) {
                this.$matrix.rotate(angle);
                this.setTransformToNative();
            };
            /**
             * @private
             * 恢复到最近的绘制样式状态，此状态是通过 save() 保存到”状态栈“中最新的元素。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.restore = function () {
                //console.log("restore");
                if (this.$saveCount > 0) {
                    if (this.$saveList.length) {
                        var data = this.$saveList.pop();
                        for (var key in data) {
                            this[key] = data[key];
                        }
                        this.setTransformToNative();
                    }
                    //console.log("pop clip");
                    var index = this.$clipList.indexOf(this.$saveCount);
                    if (index != -1) {
                        var length = this.$clipList.length;
                        this.$clipList.splice(index, length - index);
                        for (; index < length; index++) {
                            this.$nativeContext.popClip();
                        }
                    }
                    this.$saveCount--;
                }
            };
            /**
             * @private
             * 使用栈保存当前的绘画样式状态，你可以使用 restore() 恢复任何改变。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.save = function () {
                //console.log("save");
                var transformMatrix = new egret.Matrix();
                transformMatrix.copyFrom(this.$matrix);
                this.$saveList.push({
                    lineWidth: this.$lineWidth,
                    globalCompositeOperation: this.$globalCompositeOperation,
                    globalAlpha: this.$globalAlpha,
                    strokeStyle: this.$strokeStyle,
                    fillStyle: this.$fillStyle,
                    font: this.$font,
                    $matrix: transformMatrix
                });
                this.$saveCount++;
            };
            /**
             * @private
             * 从当前路径创建一个剪切路径。在 clip() 调用之后，绘制的所有信息只会出现在剪切路径内部。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.clip = function (fillRule) {
                if (this.$clipRect.width > 0 && this.$clipRect.height > 0) {
                    //console.log("push clip" + this.$clipRect.x);
                    this.$nativeContext.pushClip(this.$clipRect.x, this.$clipRect.y, this.$clipRect.width, this.$clipRect.height);
                    this.$clipRect.setEmpty();
                    this.$clipList.push(this.$saveCount);
                }
            };
            /**
             * @private
             * 设置指定矩形区域内（以 点 (x, y) 为起点，范围是(width, height) ）所有像素变成透明，并擦除之前绘制的所有内容。
             * @param x 矩形起点的 x 轴坐标。
             * @param y 矩形起点的 y 轴坐标。
             * @param width 矩形的宽度。
             * @param height 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.clearRect = function (x, y, width, height) {
                //console.log("clearScreen");
                this.$nativeContext.clearRect(x, y, width, height);
            };
            /**
             * @private
             * 重新设置当前的变换为单位矩阵，并使用同样的变量调用 transform() 方法。
             * @param a 水平缩放。
             * @param b 水平倾斜。
             * @param c 垂直倾斜。
             * @param d 垂直缩放。
             * @param tx 水平移动。
             * @param ty 垂直移动。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.setTransform = function (a, b, c, d, tx, ty) {
                this.$matrix.setTo(a, b, c, d, tx, ty);
                this.setTransformToNative();
            };
            p.setTransformToNative = function () {
                var m = this.$matrix;
                //console.log("setTransformToNative::a=" + m.a + " b=" + m.b + " c=" + m.c + " d=" + m.d + " tx=" + m.tx + " ty=" + m.ty);
                this.$nativeContext.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            };
            /**
             * @private
             * 创建一个沿参数坐标指定的直线的渐变。该方法返回一个线性的 GraphicsGradient 对象。
             * @param x0 起点的 x 轴坐标。
             * @param y0 起点的 y 轴坐标。
             * @param x1 终点的 x 轴坐标。
             * @param y1 终点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.createLinearGradient = function (x0, y0, x1, y1) {
                return this.$nativeGraphicsContext.createLinearGradient(x0, y0, x1, y1);
            };
            /**
             * @private
             * 根据参数确定的两个圆的坐标，创建一个放射性渐变。该方法返回一个放射性的 GraphicsGradient。
             * @param x0 开始圆形的 x 轴坐标。
             * @param y0 开始圆形的 y 轴坐标。
             * @param r0 开始圆形的半径。
             * @param x1 结束圆形的 x 轴坐标。
             * @param y1 结束圆形的 y 轴坐标。
             * @param r1 结束圆形的半径。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
                return this.$nativeGraphicsContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
            };
            /**
             * @private
             * 在(x,y)位置绘制（填充）文本。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.fillText = function (text, x, y, maxWidth) {
                //console.log("drawText" + text);
                var font = egret.TextField.default_fontFamily;
                egret_native.Label.createLabel(font, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                this.$hasStrokeText = false;
                egret_native.Label.drawText(text, x, y);
            };
            p.strokeText = function (text, x, y, maxWidth) {
                this.$hasStrokeText = true;
            };
            /**
             * @private
             * 测量指定文本宽度，返回 TextMetrics 对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.measureText = function (text) {
                var font = egret.TextField.default_fontFamily;
                egret_native.Label.createLabel(font, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                return { width: egret_native.Label.getTextSize(text)[0] };
            };
            /**
             * @private
             * 注意：如果要对绘制的图片进行缩放，出于性能优化考虑，系统不会主动去每次重置imageSmoothingEnabled属性，因此您在调用drawImage()方法前请务必
             * 确保 imageSmoothingEnabled 已被重置为正常的值，否则有可能沿用上个显示对象绘制过程留下的值。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.drawImage = function (image, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight) {
                var bitmapData;
                if (image.$nativeRenderTexture) {
                    bitmapData = image.$nativeRenderTexture;
                }
                else {
                    bitmapData = image;
                }
                if (!bitmapData) {
                    return;
                }
                if (arguments.length == 3) {
                    surfaceOffsetX = offsetX;
                    surfaceOffsetY = offsetY;
                    offsetX = 0;
                    offsetY = 0;
                    width = surfaceImageWidth = image.width;
                    height = surfaceImageHeight = image.height;
                }
                else {
                    if (!width) {
                        width = image.width;
                    }
                    if (!height) {
                        height = image.height;
                    }
                    if (!surfaceOffsetX) {
                        surfaceOffsetX = 0;
                    }
                    if (!surfaceOffsetY) {
                        surfaceOffsetY = 0;
                    }
                    if (!surfaceImageWidth) {
                        surfaceImageWidth = width;
                    }
                    if (!surfaceImageHeight) {
                        surfaceImageHeight = height;
                    }
                }
                //console.log("drawImage::" + offsetX + " " + offsetY + " " + width + " " + height + " " + surfaceOffsetX + " " + surfaceOffsetY + " " + surfaceImageWidth + " " + surfaceImageHeight);
                this.$nativeContext.drawImage(bitmapData, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight);
            };
            /**
             * @private
             * 基于指定的源图象(BitmapData)创建一个模板，通过repetition参数指定源图像在什么方向上进行重复，返回一个GraphicsPattern对象。
             * @param bitmapData 做为重复图像源的 BitmapData 对象。
             * @param repetition 指定如何重复图像。
             * 可能的值有："repeat" (两个方向重复),"repeat-x" (仅水平方向重复),"repeat-y" (仅垂直方向重复),"no-repeat" (不重复).
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.createPattern = function (image, repetition) {
                return null;
            };
            /**
             * @private
             * 返回一个 ImageData 对象，用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh。
             * @version Egret 2.4
             * @platform Web,Native
             */
            p.getImageData = function (sx, sy, sw, sh) {
                return { width: sw, height: sh, data: null };
            };
            p.begin = function () {
                this.surface.begin();
            };
            p.end = function () {
                this.surface.end();
            };
            return NativeRenderContext;
        })(egret.HashObject);
        native.NativeRenderContext = NativeRenderContext;
        egret.registerClass(NativeRenderContext,"egret.native.NativeRenderContext",["egret.sys.RenderContext"]);
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var displayListPool = [];
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        /**
         * @private
         * 显示列表
         */
        var NativeDisplayList = (function (_super) {
            __extends(NativeDisplayList, _super);
            /**
             * @private
             * 创建一个DisplayList对象
             */
            function NativeDisplayList(root) {
                _super.call(this);
                /**
                 * @private
                 * 是否需要重绘
                 */
                this.$isDirty = false;
                /**
                 * @private
                 * 在舞台上的透明度
                 */
                this.$renderAlpha = 1;
                /**
                 * @private
                 * 相对于显示列表根节点或位图缓存根节点的矩阵对象
                 */
                this.$renderMatrix = new egret.Matrix();
                this.$ratioMatrix = new egret.Matrix();
                this.$ratioChanged = false;
                this.$pixelRatio = 1;
                /**
                 * @private
                 * 在显示列表根节点或位图缓存根节点上的显示区域
                 */
                this.$renderRegion = new sys.Region();
                /**
                 * @private
                 * 呈现绘制结果的目标画布
                 */
                this.surface = null;
                /**
                 * @private
                 */
                this.offsetX = 0;
                /**
                 * @private
                 */
                this.offsetY = 0;
                /**
                 * @private
                 */
                this.needRedraw = false;
                /**
                 * @private
                 */
                this.rootMatrix = new egret.Matrix();
                /**
                 * @private
                 * 显示对象的渲染节点发生改变时，把自身的IRenderable对象注册到此列表上。
                 */
                this.dirtyNodes = {};
                /**
                 * @private
                 */
                this.dirtyNodeList = [];
                /**
                 * @private
                 */
                this.dirtyList = null;
                /**
                 * @private
                 */
                this.dirtyRegion = new sys.DirtyRegion();
                /**
                 * @private
                 */
                this.sizeChanged = false;
                this.root = root;
            }
            var d = __define,c=NativeDisplayList;p=c.prototype;
            /**
             * @private
             * 释放一个DisplayList实例到对象池
             */
            NativeDisplayList.release = function (displayList) {
                sys.surfaceFactory.release(displayList.surface);
                egret.Matrix.release(displayList.$renderMatrix);
                egret.Matrix.release(displayList.$ratioMatrix);
                displayList.surface = null;
                displayList.renderContext = null;
                displayList.root = null;
                displayList.$renderMatrix = null;
                displayList.$ratioMatrix = null;
                displayList.needRedraw = false;
                displayList.$isDirty = false;
                displayListPool.push(displayList);
            };
            /**
             * @private
             * 从对象池中取出或创建一个新的DisplayList对象。
             */
            NativeDisplayList.create = function (target) {
                var displayList = displayListPool.pop();
                if (!displayList) {
                    displayList = new egret.sys.DisplayList(target);
                }
                var surface = sys.surfaceFactory.create();
                if (!surface) {
                    return null;
                }
                displayList.surface = surface;
                displayList.renderContext = surface.renderContext;
                displayList.root = target;
                displayList.$renderMatrix = egret.Matrix.create();
                displayList.$renderMatrix.setTo(1, 0, 0, 1, 0, 0);
                displayList.$pixelRatio = 1;
                displayList.$ratioMatrix = egret.Matrix.create();
                displayList.$ratioMatrix.setTo(1, 0, 0, 1, 0, 0);
                displayList.needRedraw = true;
                displayList.$isDirty = true;
                return displayList;
            };
            /**
             * @private
             * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
             */
            p.$update = function () {
                var target = this.root;
                //当cache对象的显示列表已经加入dirtyList，对象又取消cache的时候，root为空
                if (target == null) {
                    return false;
                }
                target.$removeFlagsUp(768 /* Dirty */);
                this.$renderAlpha = target.$getConcatenatedAlpha();
                //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
                var concatenatedMatrix = target.$getConcatenatedMatrix();
                var bounds = target.$getOriginalBounds();
                var displayList = target.$parentDisplayList;
                var pixelRatio = 1;
                if (displayList)
                    pixelRatio = displayList.$pixelRatio;
                else if (target.stage && target.stage.$displayList)
                    pixelRatio = target.stage.$displayList.$pixelRatio;
                this.setDevicePixelRatio(pixelRatio);
                var region = this.$renderRegion;
                if (this.needRedraw) {
                    this.updateDirtyRegions();
                }
                if (!displayList) {
                    region.setTo(0, 0, 0, 0);
                    region.moved = false;
                    return false;
                }
                if (!region.moved && !displayList.$ratioChanged) {
                    return false;
                }
                region.moved = false;
                var matrix = this.$renderMatrix;
                matrix.copyFrom(concatenatedMatrix);
                var root = displayList.root;
                if (root !== target.$stage) {
                    target.$getConcatenatedMatrixAt(root, matrix);
                }
                this.$ratioMatrix.$preMultiplyInto(matrix, matrix);
                region.updateRegion(bounds, matrix);
                return true;
            };
            /**
             * @private
             *
             * @param context
             */
            p.$render = function (context) {
                var data = this.surface;
                if (data) {
                    context.begin();
                    context.drawImage(data, this.offsetX, this.offsetY, data.width / this.$pixelRatio, data.height / this.$pixelRatio);
                    context.end();
                }
            };
            /**
             * @private
             * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
             */
            p.setClipRect = function (width, height) {
                width *= this.$pixelRatio;
                height *= this.$pixelRatio;
                this.dirtyRegion.setClipRect(width, height);
                this.rootMatrix = null; //只有舞台画布才能设置ClipRect
                var surface = this.renderContext.surface;
                surface.width = width;
                surface.height = height;
                this.surface = surface;
            };
            /**
             * @private
             * 标记一个节点需要重新渲染
             */
            p.markDirty = function (node) {
                var key = node.$hashCode;
                if (this.dirtyNodes[key]) {
                    return;
                }
                this.dirtyNodes[key] = true;
                this.dirtyNodeList.push(node);
                if (!this.needRedraw) {
                    this.needRedraw = true;
                    var parentCache = this.root.$parentDisplayList;
                    if (parentCache) {
                        parentCache.markDirty(this);
                    }
                }
            };
            /**
             * @private
             * 更新节点属性并返回脏矩形列表。
             */
            p.updateDirtyRegions = function () {
                var nodeList = this.dirtyNodeList;
                this.dirtyNodeList = [];
                this.dirtyNodes = {};
                var dirtyRegion = this.dirtyRegion;
                var length = nodeList.length;
                for (var i = 0; i < length; i++) {
                    var node = nodeList[i];
                    var region = node.$renderRegion;
                    if (node.$renderAlpha > 0) {
                        if (dirtyRegion.addRegion(region)) {
                            node.$isDirty = true;
                        }
                    }
                    var moved = node.$update();
                    if (node.$renderAlpha > 0 && (moved || !node.$isDirty)) {
                        if (dirtyRegion.addRegion(region)) {
                            node.$isDirty = true;
                        }
                    }
                }
                this.dirtyList = dirtyRegion.getDirtyRegions();
                return this.dirtyList;
            };
            /**
             * @private
             * 绘制根节点显示对象到目标画布，返回draw的次数。
             */
            p.drawToSurface = function () {
                var m = this.rootMatrix;
                if (m) {
                    this.changeSurfaceSize();
                }
                var context = this.renderContext;
                context.begin();
                //绘制脏矩形区域
                context.save();
                context.beginPath();
                if (m) {
                    context.setTransform(1, 0, 0, 1, -this.offsetX * this.$pixelRatio, -this.offsetY * this.$pixelRatio);
                }
                var dirtyList = this.dirtyList;
                this.dirtyList = null;
                var length = dirtyList.length;
                for (var i = 0; i < length; i++) {
                    var region = dirtyList[i];
                    context.clearRect(region.minX, region.minY, region.width, region.height);
                    context.rect(region.minX, region.minY, region.width, region.height);
                }
                context.clip();
                if (m) {
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                context.end();
                //绘制显示对象
                var drawCalls = this.drawDisplayObject(this.root, context, dirtyList, m, null, null);
                //清除脏矩形区域
                context.begin();
                context.restore();
                context.end();
                this.dirtyRegion.clear();
                this.needRedraw = false;
                this.$ratioChanged = false;
                return drawCalls;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            p.drawDisplayObject = function (displayObject, context, dirtyList, rootMatrix, displayList, clipRegion) {
                var drawCalls = 0;
                var node;
                var globalAlpha;
                if (displayList) {
                    if (displayList.needRedraw) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList;
                    globalAlpha = 1; //这里不用读取displayList.$renderAlpha,因为它已经绘制到了displayList.surface的内部。
                }
                else if (displayObject.$renderRegion) {
                    node = displayObject;
                    globalAlpha = displayObject.$renderAlpha;
                }
                if (node) {
                    var renderRegion = node.$renderRegion;
                    if (clipRegion && !clipRegion.intersects(renderRegion)) {
                        node.$isDirty = false;
                    }
                    else if (!node.$isDirty) {
                        var l = dirtyList.length;
                        for (var j = 0; j < l; j++) {
                            if (renderRegion.intersects(dirtyList[j])) {
                                node.$isDirty = true;
                                break;
                            }
                        }
                    }
                    if (node.$isDirty) {
                        drawCalls++;
                        context.begin();
                        context.globalAlpha = globalAlpha;
                        var m = node.$renderMatrix;
                        if (rootMatrix) {
                            context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            node.$render(context);
                            context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                        }
                        else {
                            context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            node.$render(context);
                        }
                        context.end();
                        node.$isDirty = false;
                    }
                }
                if (displayList) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                            continue;
                        }
                        if (child.$blendMode !== 0 || (child.$mask && child.$mask.$parentDisplayList)) {
                            drawCalls += this.drawWithClip(child, context, dirtyList, rootMatrix, clipRegion);
                        }
                        else if (child.$scrollRect || child.$maskRect) {
                            drawCalls += this.drawWithScrollRect(child, context, dirtyList, rootMatrix, clipRegion);
                        }
                        else {
                            if (DEBUG && child["isFPS"]) {
                                this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                            }
                            else {
                                drawCalls += this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                            }
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             */
            p.drawWithClip = function (displayObject, context, dirtyList, rootMatrix, clipRegion) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                if (hasBlendMode) {
                    var compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask && !mask.$parentDisplayList) {
                    mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
                }
                //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
                var maskRegion;
                var displayMatrix = egret.Matrix.create();
                displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
                var root = displayObject.$parentDisplayList.root;
                var invertedMatrix;
                if (root !== displayObject.$stage) {
                    invertedMatrix = root.$getInvertedConcatenatedMatrix();
                    invertedMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
                }
                this.$ratioMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
                if (mask) {
                    var bounds = mask.$getOriginalBounds();
                    maskRegion = sys.Region.create();
                    var m = egret.Matrix.create();
                    m.copyFrom(mask.$getConcatenatedMatrix());
                    if (invertedMatrix) {
                        invertedMatrix.$preMultiplyInto(m, m);
                    }
                    this.$ratioMatrix.$preMultiplyInto(m, m);
                    maskRegion.updateRegion(bounds, m);
                    egret.Matrix.release(m);
                }
                var region;
                if (scrollRect) {
                    region = sys.Region.create();
                    region.updateRegion(scrollRect, displayMatrix);
                }
                if (region && maskRegion) {
                    region.intersect(maskRegion);
                    sys.Region.release(maskRegion);
                }
                else if (!region && maskRegion) {
                    region = maskRegion;
                }
                if (region) {
                    if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                        sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                }
                else {
                    region = sys.Region.create();
                    bounds = displayObject.$getOriginalBounds();
                    region.updateRegion(bounds, displayMatrix);
                }
                var found = false;
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                //绘制显示对象自身，若有scrollRect，应用clip
                var displayContext = this.createRenderContext(region.width, region.height);
                if (!displayContext) {
                    drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                    sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                displayContext.begin();
                if (scrollRect) {
                    var m = displayMatrix;
                    displayContext.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                    displayContext.beginPath();
                    displayContext.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                    displayContext.clip();
                }
                displayContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                displayContext.end();
                var rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, rootM, displayObject.$displayList, region);
                egret.Matrix.release(rootM);
                //绘制遮罩
                if (mask) {
                    var maskContext = this.createRenderContext(region.width, region.height);
                    if (!maskContext) {
                        drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                        sys.surfaceFactory.release(displayContext.surface);
                        sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    maskContext.begin();
                    maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    maskContext.end();
                    rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    var calls = this.drawDisplayObject(mask, maskContext, dirtyList, rootM, mask.$displayList, region);
                    egret.Matrix.release(rootM);
                    if (calls > 0) {
                        drawCalls += calls;
                        displayContext.begin();
                        displayContext.globalCompositeOperation = "destination-in";
                        displayContext.setTransform(1, 0, 0, 1, 0, 0);
                        displayContext.globalAlpha = 1;
                        displayContext.drawImage(maskContext.surface, 0, 0);
                        displayContext.end();
                    }
                    sys.surfaceFactory.release(maskContext.surface);
                }
                //绘制结果到屏幕
                if (drawCalls > 0) {
                    drawCalls++;
                    context.begin();
                    if (hasBlendMode) {
                        context.globalCompositeOperation = compositeOp;
                    }
                    if (rootMatrix) {
                        context.translate(region.minX, region.minY);
                        context.drawImage(displayContext.surface, 0, 0);
                        context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                    }
                    else {
                        context.setTransform(1, 0, 0, 1, region.minX, region.minY);
                        context.drawImage(displayContext.surface, 0, 0);
                    }
                    if (hasBlendMode) {
                        context.globalCompositeOperation = defaultCompositeOp;
                    }
                    context.end();
                }
                sys.surfaceFactory.release(displayContext.surface);
                sys.Region.release(region);
                egret.Matrix.release(displayMatrix);
                return drawCalls;
            };
            /**
             * @private
             */
            p.drawWithScrollRect = function (displayObject, context, dirtyList, rootMatrix, clipRegion) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var m = egret.Matrix.create();
                m.copyFrom(displayObject.$getConcatenatedMatrix());
                var root = displayObject.$parentDisplayList.root;
                if (root !== displayObject.$stage) {
                    root.$getInvertedConcatenatedMatrix().$preMultiplyInto(m, m);
                }
                this.$ratioMatrix.$preMultiplyInto(m, m);
                var region = sys.Region.create();
                if (!scrollRect.isEmpty()) {
                    region.updateRegion(scrollRect, m);
                }
                if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                    sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                var found = false;
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                //绘制显示对象自身
                context.begin();
                context.save();
                if (rootMatrix) {
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                    context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                else {
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                context.beginPath();
                context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                context.clip();
                if (rootMatrix) {
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                }
                context.end();
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, region);
                context.begin();
                context.restore();
                context.end();
                sys.Region.release(region);
                egret.Matrix.release(m);
                return drawCalls;
            };
            /**
             * @private
             */
            p.createRenderContext = function (width, height) {
                var surface = sys.surfaceFactory.create(true);
                if (!surface) {
                    return null;
                }
                if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                    //在chrome里，小等于256*256的canvas会不启用GPU加速。
                    surface.width = Math.max(257, width);
                    surface.height = Math.max(257, height);
                }
                else {
                    surface.width = width;
                    surface.height = height;
                }
                return surface.renderContext;
            };
            /**
             * @private
             * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
             */
            p.changeSurfaceSize = function () {
                var root = this.root;
                var oldOffsetX = this.offsetX;
                var oldOffsetY = this.offsetY;
                var bounds = this.root.$getOriginalBounds();
                var scaleX = this.$pixelRatio;
                var scaleY = this.$pixelRatio;
                this.offsetX = bounds.x;
                this.offsetY = bounds.y;
                var oldContext = this.renderContext;
                var oldSurface = oldContext.surface;
                if (!this.sizeChanged) {
                    this.sizeChanged = true;
                    oldSurface.width = bounds.width * scaleX;
                    oldSurface.height = bounds.height * scaleY;
                }
                else {
                    var newContext = sys.sharedRenderContext;
                    var newSurface = newContext.surface;
                    sys.sharedRenderContext = oldContext;
                    this.renderContext = newContext;
                    this.surface = newSurface;
                    newSurface.width = bounds.width * scaleX;
                    newSurface.height = bounds.height * scaleY;
                    if (oldSurface.width !== 0 && oldSurface.height !== 0) {
                        newContext.begin();
                        newContext.setTransform(1, 0, 0, 1, 0, 0);
                        newContext.drawImage(oldSurface, (oldOffsetX - this.offsetX) * scaleX, (oldOffsetY - this.offsetY) * scaleY);
                        newContext.end();
                    }
                    oldSurface.height = 1;
                    oldSurface.width = 1;
                }
                this.rootMatrix.setTo(1, 0, 0, 1, -this.offsetX, -this.offsetY);
                this.renderContext.begin();
                this.renderContext.setTransform(1, 0, 0, 1, -bounds.x, -bounds.y);
                this.renderContext.end();
            };
            p.setDevicePixelRatio = function (ratio) {
                if (ratio === void 0) { ratio = 1; }
                if (this.$pixelRatio == ratio && this.$ratioMatrix)
                    return;
                if (!this.$ratioMatrix)
                    this.$ratioMatrix = egret.Matrix.create();
                this.$ratioChanged = true;
                this.$pixelRatio = ratio;
                this.$ratioMatrix.setTo(ratio, 0, 0, ratio, 0, 0);
                this.root.$invalidate(true);
            };
            return NativeDisplayList;
        })(egret.HashObject);
        sys.NativeDisplayList = NativeDisplayList;
        egret.registerClass(NativeDisplayList,"egret.sys.NativeDisplayList",["egret.sys.Renderable"]);
        egret.sys["DisplayList"] = egret.sys["NativeDisplayList"];
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         * 呈现最终绘图结果的画布
         */
        var NativeSurface = (function (_super) {
            __extends(NativeSurface, _super);
            /**
             * @private
             */
            function NativeSurface() {
                _super.call(this);
                /**
                 * @private
                 * @inheritDoc
                 */
                this.renderContext = new native.NativeRenderContext();
                this.$widthReadySet = false;
                this.$heightReadySet = false;
                this.$isRoot = false;
                this.$isDispose = false;
            }
            var d = __define,c=NativeSurface;p=c.prototype;
            p.toDataURL = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.$nativeRenderTexture) {
                    return this.$nativeRenderTexture.toDataURL.apply(this, arguments);
                }
                return null;
            };
            p.saveToFile = function (type, filePath) {
                if (this.$nativeRenderTexture) {
                    this.$nativeRenderTexture.saveToFile(type, filePath);
                }
            };
            d(p, "width"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    return this.$width;
                }
                ,function (value) {
                    this.$width = value;
                    if (!this.$isDispose) {
                        this.$widthReadySet = true;
                        this.createRenderTexture();
                    }
                }
            );
            d(p, "height"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    return this.$height;
                }
                ,function (value) {
                    this.$height = value;
                    if (!this.$isDispose) {
                        this.$heightReadySet = true;
                        this.createRenderTexture();
                    }
                }
            );
            p.createRenderTexture = function () {
                if (this.$isRoot) {
                    return;
                }
                if (this.$widthReadySet && this.$heightReadySet) {
                    if (this.$nativeRenderTexture) {
                        this.$nativeRenderTexture.dispose();
                    }
                    this.$nativeRenderTexture = new egret_native.RenderTexture(this.$width, this.$height);
                    this.$widthReadySet = false;
                    this.$heightReadySet = false;
                }
            };
            p.begin = function () {
                if (this.$nativeRenderTexture) {
                    //console.log("begin");
                    this.$nativeRenderTexture.begin();
                }
            };
            p.end = function () {
                if (this.$nativeRenderTexture) {
                    //console.log("end");
                    this.$nativeRenderTexture.end();
                }
            };
            p.$dispose = function () {
                if (this.$nativeRenderTexture) {
                    this.$nativeRenderTexture.dispose();
                    this.$nativeRenderTexture = null;
                }
                this.$isDispose = true;
            };
            p.$reload = function () {
                this.$isDispose = false;
            };
            return NativeSurface;
        })(egret.HashObject);
        native.NativeSurface = NativeSurface;
        egret.registerClass(NativeSurface,"egret.native.NativeSurface",["egret.sys.Surface","egret.BitmapData"]);
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        function convertImageToRenderTexture(texture, rect) {
            var surface = egret.sys.surfaceFactory.create(true);
            if (!surface) {
                return null;
            }
            var w = texture.$getTextureWidth();
            var h = texture.$getTextureHeight();
            if (rect == null) {
                rect = egret.$TempRectangle;
                rect.x = 0;
                rect.y = 0;
                rect.width = w;
                rect.height = h;
            }
            rect.x = Math.min(rect.x, w - 1);
            rect.y = Math.min(rect.y, h - 1);
            rect.width = Math.min(rect.width, w - rect.x);
            rect.height = Math.min(rect.height, h - rect.y);
            var iWidth = rect.width;
            var iHeight = rect.height;
            surface.width = iWidth;
            surface.height = iHeight;
            //surface["style"]["width"]= iWidth + "px";
            //surface["style"]["height"] = iHeight + "px";
            var bitmapData = texture;
            var renderContext = surface.renderContext;
            renderContext.begin();
            renderContext.imageSmoothingEnabled = false;
            var offsetX = Math.round(bitmapData._offsetX);
            var offsetY = Math.round(bitmapData._offsetY);
            var bitmapWidth = bitmapData._bitmapWidth;
            var bitmapHeight = bitmapData._bitmapHeight;
            renderContext.globalAlpha = 1;
            renderContext.globalCompositeOperation = "source-over";
            renderContext.setTransform(1, 0, 0, 1, 0, 0);
            renderContext.drawImage(bitmapData._bitmapData, bitmapData._bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData._bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            renderContext.end();
            return surface;
        }
        /**
         * @private
         */
        function toDataURL(type, rect) {
            try {
                var renderTexture = convertImageToRenderTexture(this, rect);
                var base64 = renderTexture.toDataURL(type);
                renderTexture.$dispose();
                return base64;
            }
            catch (e) {
                egret.$error(1033);
                return null;
            }
        }
        function saveToFile(type, filePath, rect) {
            try {
                var renderTexture = convertImageToRenderTexture(this, rect);
                renderTexture.saveToFile(type, filePath);
                renderTexture.$dispose();
            }
            catch (e) {
                egret.$error(1033);
            }
        }
        function getPixel32(x, y) {
            egret.$error(1035);
            return null;
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = saveToFile;
        egret.Texture.prototype.getPixel32 = getPixel32;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        var surfacePool = [];
        /**
         * @private
         */
        var OpenGLFactory = (function () {
            /**
             * @private
             */
            function OpenGLFactory() {
                egret.sys.sharedRenderContext = this.create().renderContext;
                for (var i = 0; i < 3; i++) {
                    surfacePool.push(this.create());
                }
            }
            var d = __define,c=OpenGLFactory;p=c.prototype;
            /**
             * @private
             * 从对象池取出或创建一个新的Surface实例
             * @param useOnce 表示对取出实例的使用是一次性的，用完后立即会释放。
             */
            p.create = function (useOnce) {
                var surface = (useOnce || surfacePool.length > 3) ? surfacePool.pop() : null;
                if (!surface) {
                    surface = this.createSurface(new native.NativeSurface());
                }
                surface.$reload();
                return surface;
            };
            /**
             * @private
             * 释放一个Surface实例
             * @param surface 要释放的Surface实例
             */
            p.release = function (surface) {
                if (!surface) {
                    return;
                }
                surface.$dispose();
                surface.width = surface.height = 1;
                surfacePool.push(surface);
            };
            /**
             * @private
             */
            p.createSurface = function (canvas) {
                var context = canvas.renderContext;
                context.surface = canvas;
                return canvas;
            };
            return OpenGLFactory;
        })();
        native.OpenGLFactory = OpenGLFactory;
        egret.registerClass(OpenGLFactory,"egret.native.OpenGLFactory",["egret.sys.SurfaceFactory"]);
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativePlayer = (function (_super) {
            __extends(NativePlayer, _super);
            function NativePlayer() {
                _super.call(this);
                this.init(NativePlayer.option);
            }
            var d = __define,c=NativePlayer;p=c.prototype;
            p.init = function (option) {
                //暂时无法显示重绘区域
                option.showPaintRect = false;
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                stage.textureScaleFactor = option.textureScaleFactor;
                var surface = egret.sys.surfaceFactory.create();
                surface.$isRoot = true;
                var touch = new native.NativeTouchHandler(stage);
                var player = new egret.sys.Player(surface.renderContext, stage, option.entryClassName);
                new native.NativeHideHandler(stage);
                //var nativeInput = new NativeInput();
                if (DEBUG) {
                    player.showPaintRect(option.showPaintRect);
                    if (option.showFPS || option.showLog) {
                        var styleStr = option.fpsStyles || "";
                        var stylesArr = styleStr.split(",");
                        var styles = {};
                        for (var i = 0; i < stylesArr.length; i++) {
                            var tempStyleArr = stylesArr[i].split(":");
                            styles[tempStyleArr[0]] = tempStyleArr[1];
                        }
                        option.fpsStyles = styles;
                        player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                    }
                }
                this.playerOption = option;
                this.stage = stage;
                this.player = player;
                this.nativeTouch = touch;
                //this.nativeInput = nativeInput;
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            p.updateScreenSize = function () {
                var option = this.playerOption;
                var screenWidth = egret_native.EGTView.getFrameWidth();
                var screenHeight = egret_native.EGTView.getFrameHeight();
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                var top = (screenHeight - displayHeight) / 2;
                var left = (screenWidth - displayWidth) / 2;
                egret_native.EGTView.setVisibleRect(left, top, displayWidth, displayHeight);
                egret_native.EGTView.setDesignSize(stageWidth, stageHeight);
                this.player.updateStageSize(stageWidth, stageHeight);
                //var scalex = displayWidth / stageWidth,
                //    scaley = displayHeight / stageHeight;
                //this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
                //this.webInput.$updateSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            p.updateMaxTouches = function () {
                this.nativeTouch.$updateMaxTouches();
            };
            return NativePlayer;
        })(egret.HashObject);
        native.NativePlayer = NativePlayer;
        egret.registerClass(NativePlayer,"egret.native.NativePlayer",["egret.sys.Screen"]);
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        function runEgret() {
            var ticker = egret.sys.$ticker;
            var mainLoop = function () {
                ticker.update();
            };
            egret_native.executeMainLoop(mainLoop, ticker);
            egret.sys.surfaceFactory = new native.OpenGLFactory();
            if (!egret.sys.screenAdapter) {
                egret.sys.screenAdapter = new egret.sys.ScreenAdapter();
            }
            new native.NativePlayer();
        }
        function toArray(argument) {
            var args = [];
            for (var i = 0; i < argument.length; i++) {
                args.push(argument[i]);
            }
            return args;
        }
        egret.warn = function () {
            console.warn.apply(console, toArray(arguments));
        };
        egret.error = function () {
            console.error.apply(console, toArray(arguments));
        };
        egret.assert = function () {
            console.assert.apply(console, toArray(arguments));
        };
        if (DEBUG) {
            egret.log = function () {
                if (DEBUG) {
                    var length = arguments.length;
                    var info = "";
                    for (var i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    egret.sys.$logToFPS(info);
                }
                console.log.apply(console, toArray(arguments));
            };
        }
        else {
            egret.log = function () {
                console.log.apply(console, toArray(arguments));
            };
        }
        egret.runEgret = runEgret;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        function getOption(key) {
            return egret_native.getOption(key);
        }
        native.getOption = getOption;
        egret.getOption = getOption;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        var callBackDic = {};
        /**
         * @private
         */
        var NativeExternalInterface = (function () {
            function NativeExternalInterface() {
            }
            var d = __define,c=NativeExternalInterface;p=c.prototype;
            NativeExternalInterface.call = function (functionName, value) {
                var data = {};
                data.functionName = functionName;
                data.value = value;
                egret_native.sendInfoToPlugin(JSON.stringify(data));
            };
            NativeExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            return NativeExternalInterface;
        })();
        native.NativeExternalInterface = NativeExternalInterface;
        egret.registerClass(NativeExternalInterface,"egret.native.NativeExternalInterface",["egret.ExternalInterface"]);
        /**
         * @private
         * @param info
         */
        function onReceivedPluginInfo(info) {
            var data = JSON.parse(info);
            var functionName = data.functionName;
            var listener = callBackDic[functionName];
            if (listener) {
                var value = data.value;
                listener.call(null, value);
            }
            else {
                egret.$warn(1004, functionName);
            }
        }
        egret.ExternalInterface = NativeExternalInterface;
        egret_native.receivedPluginInfo = onReceivedPluginInfo;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
        var native;
        (function (native) {
            var filePath = "LocalStorage.local";
            var localStorageData = {};
            /**
             * @private
             *
             * @param key
             * @returns
             */
            function getItem(key) {
                return localStorageData[key];
            }
            /**
             * @private
             *
             * @param key
             * @param value
             * @returns
             */
            function setItem(key, value) {
                localStorageData[key] = value;
                try {
                    this.save();
                    return true;
                }
                catch (e) {
                    egret.$warn(1018, key, value);
                    return false;
                }
            }
            /**
             * @private
             *
             * @param key
             */
            function removeItem(key) {
                delete localStorageData[key];
                save();
            }
            /**
             * @private
             *
             */
            function clear() {
                for (var key in localStorageData) {
                    delete localStorageData[key];
                }
                save();
            }
            /**
             * @private
             *
             */
            function save() {
                egret_native.saveRecord(filePath, JSON.stringify(localStorageData));
            }
            if (egret_native.isRecordExists(filePath)) {
                var str = egret_native.loadRecord(filePath);
                localStorageData = JSON.parse(str);
            }
            else {
                localStorageData = {};
            }
            localStorage.getItem = getItem;
            localStorage.setItem = setItem;
            localStorage.removeItem = removeItem;
            localStorage.clear = clear;
        })(native = localStorage.native || (localStorage.native = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var NativeSoundChannel = (function (_super) {
            __extends(NativeSoundChannel, _super);
            /**
             * @private
             */
            function NativeSoundChannel(audio) {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.$startTime = 0;
                /**
                 * @private
                 */
                this.audio = null;
                //声音是否已经播放完成
                this.isStopped = false;
                /**
                 * @private
                 */
                this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    _this.audio.load();
                    _this.$play();
                };
                audio.addEventListener("ended", this.onPlayEnd);
                this.audio = audio;
            }
            var d = __define,c=NativeSoundChannel;p=c.prototype;
            p.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                try {
                    this.audio.currentTime = this.$startTime;
                }
                catch (e) {
                }
                finally {
                    this.audio.play();
                }
            };
            /**
             * @private
             * @inheritDoc
             */
            p.stop = function () {
                if (!this.audio)
                    return;
                var audio = this.audio;
                audio.pause();
                audio.removeEventListener("ended", this.onPlayEnd);
                this.audio = null;
                web.NativeSound.$recycle(this.$url, audio);
            };
            d(p, "volume"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.audio)
                        return 1;
                    return this.audio.volume;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                }
            );
            d(p, "position"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                }
            );
            return NativeSoundChannel;
        })(egret.EventDispatcher);
        web.NativeSoundChannel = NativeSoundChannel;
        egret.registerClass(NativeSoundChannel,"egret.web.NativeSoundChannel",["egret.SoundChannel","egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeHideHandler = (function (_super) {
            __extends(NativeHideHandler, _super);
            function NativeHideHandler(stage) {
                _super.call(this);
                egret_native.pauseApp = function () {
                    //console.log("pauseApp");
                    stage.dispatchEvent(new egret.Event(egret.Event.DEACTIVATE));
                    egret_native.Audio.pauseBackgroundMusic();
                    egret_native.Audio.pauseAllEffects();
                };
                egret_native.resumeApp = function () {
                    //console.log("resumeApp");
                    stage.dispatchEvent(new egret.Event(egret.Event.ACTIVATE));
                    egret_native.Audio.resumeBackgroundMusic();
                    egret_native.Audio.resumeAllEffects();
                };
            }
            var d = __define,c=NativeHideHandler;p=c.prototype;
            return NativeHideHandler;
        })(egret.HashObject);
        native.NativeHideHandler = NativeHideHandler;
        egret.registerClass(NativeHideHandler,"egret.native.NativeHideHandler");
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var NativeResourceLoader = (function (_super) {
        __extends(NativeResourceLoader, _super);
        function NativeResourceLoader() {
            _super.apply(this, arguments);
            /**
             * @private
             */
            this._downCount = 0;
            /**
             * @private
             */
            this._path = null;
            /**
             * @private
             */
            this._bytesTotal = 0;
        }
        var d = __define,c=NativeResourceLoader;p=c.prototype;
        /**
         *
         * @param path
         * @param bytesTotal
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.load = function (path, bytesTotal) {
            this._downCount = 0;
            this._path = path;
            this._bytesTotal = bytesTotal;
            this.reload();
        };
        /**
         * @private
         *
         */
        p.reload = function () {
            if (this._downCount >= 3) {
                this.downloadFileError();
                return;
            }
            //if (egret_native.isRecordExists(this._path)) {//卡里
            //    this.loadOver();
            //    return;
            //}
            //else if (egret_native.isFileExists(this._path)){
            //    this.loadOver();
            //    return;
            //}
            //else {
            this._downCount++;
            var promise = egret.PromiseObject.create();
            var self = this;
            promise.onSuccessFunc = function () {
                self.loadOver();
            };
            promise.onErrorFunc = function () {
                self.reload();
            };
            promise.downloadingSizeFunc = function (bytesLoaded) {
                self.downloadingProgress(bytesLoaded);
            };
            egret_native.download(this._path, this._path, promise);
            //}
        };
        /**
         * @private
         *
         * @param bytesLoaded
         */
        p.downloadingProgress = function (bytesLoaded) {
            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, bytesLoaded, this._bytesTotal);
        };
        /**
         * @private
         *
         */
        p.downloadFileError = function () {
            this.dispatchEvent(new egret.Event(egret.IOErrorEvent.IO_ERROR));
        };
        /**
         * @private
         *
         */
        p.loadOver = function () {
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        };
        return NativeResourceLoader;
    })(egret.EventDispatcher);
    egret.NativeResourceLoader = NativeResourceLoader;
    egret.registerClass(NativeResourceLoader,"egret.NativeResourceLoader");
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided this the following conditions are met:
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
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeTouchHandler = (function (_super) {
            __extends(NativeTouchHandler, _super);
            function NativeTouchHandler(stage) {
                _super.call(this);
                this.$touch = new egret.sys.TouchHandler(stage);
                var self = this;
                egret_native.onTouchesBegin = function (num, ids, xs_array, ys_array) {
                    self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchBegin);
                };
                egret_native.onTouchesMove = function (num, ids, xs_array, ys_array) {
                    self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchMove);
                };
                egret_native.onTouchesEnd = function (num, ids, xs_array, ys_array) {
                    self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchEnd);
                };
                egret_native.onTouchesCancel = function (num, ids, xs_array, ys_array) {
                };
            }
            var d = __define,c=NativeTouchHandler;p=c.prototype;
            p.$executeTouchCallback = function (num, ids, xs_array, ys_array, callback) {
                for (var i = 0; i < num; i++) {
                    var id = ids[i];
                    var x = xs_array[i];
                    var y = ys_array[i];
                    callback.call(this.$touch, x, y, id);
                }
            };
            /**
             * @private
             * 更新同时触摸点的数量
             */
            p.$updateMaxTouches = function () {
                this.$touch.$initMaxTouches();
            };
            return NativeTouchHandler;
        })(egret.HashObject);
        native.NativeTouchHandler = NativeTouchHandler;
        egret.registerClass(NativeTouchHandler,"egret.native.NativeTouchHandler");
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeHttpRequest = (function (_super) {
            __extends(NativeHttpRequest, _super);
            /**
             * @private
             */
            function NativeHttpRequest() {
                _super.call(this);
                /**
                 * @private
                 */
                this._url = "";
                this._method = "";
            }
            var d = __define,c=NativeHttpRequest;p=c.prototype;
            d(p, "response"
                /**
                 * @private
                 * 本次请求返回的数据，数据类型根据responseType设置的值确定。
                 */
                ,function () {
                    return this._response;
                }
            );
            d(p, "responseType"
                /**
                 * @private
                 * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
                 */
                ,function () {
                    return this._responseType;
                }
                ,function (value) {
                    this._responseType = value;
                }
            );
            d(p, "withCredentials"
                /**
                 * @private
                 * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
                 */
                ,function () {
                    return this._withCredentials;
                }
                ,function (value) {
                    this._withCredentials = value;
                }
            );
            /**
             * @private
             * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
             * @param url 该请求所要访问的URL该请求所要访问的URL
             * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
             */
            p.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
            };
            /**
             * @private
             * 发送请求.
             * @param data 需要发送的数据
             */
            p.send = function (data) {
                var self = this;
                if (!egret_native.isFileExists(self._url)) {
                    download();
                }
                else {
                    readFileAsync();
                }
                function readFileAsync() {
                    var promise = new egret.PromiseObject();
                    promise.onSuccessFunc = function (content) {
                        self._response = content;
                        egret.Event.dispatchEvent(self, egret.Event.COMPLETE);
                    };
                    egret_native.readFileAsync(self._url, promise);
                }
                function download() {
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = onLoadComplete;
                    promise.onErrorFunc = function () {
                        egret.Event.dispatchEvent(self, egret.IOErrorEvent.IO_ERROR);
                    };
                    egret_native.download(self._url, self._url, promise);
                }
                function onLoadComplete() {
                    var content = egret_native.readFileSync(self._url);
                    self._response = content;
                    egret.Event.dispatchEvent(self, egret.Event.COMPLETE);
                }
            };
            /**
             * @private
             * 如果请求已经被发送,则立刻中止请求.
             */
            p.abort = function () {
            };
            /**
             * @private
             * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
             */
            p.getAllResponseHeaders = function () {
                return "";
            };
            /**
             * @private
             * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
             * @param header 将要被赋值的请求头名称.
             * @param value 给指定的请求头赋的值.
             */
            p.setRequestHeader = function (header, value) {
                this.header = header;
                this.headerValue = value;
            };
            /**
             * @private
             * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
             * @param header 要返回的响应头名称
             */
            p.getResponseHeader = function (header) {
                return "";
            };
            return NativeHttpRequest;
        })(egret.EventDispatcher);
        native.NativeHttpRequest = NativeHttpRequest;
        egret.registerClass(NativeHttpRequest,"egret.native.NativeHttpRequest",["egret.HttpRequest"]);
        egret.HttpRequest = NativeHttpRequest;
        if (DEBUG) {
            egret.$markReadOnly(NativeHttpRequest, "response");
        }
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
         */
        var NativeImageLoader = (function (_super) {
            __extends(NativeImageLoader, _super);
            function NativeImageLoader() {
                _super.apply(this, arguments);
                /**
                 * @private
                 * 使用 load() 方法加载成功的 BitmapData 图像数据。
                 */
                this.data = null;
                /**
                 * @private
                 * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
                 * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
                 */
                this.crossOrigin = null;
            }
            var d = __define,c=NativeImageLoader;p=c.prototype;
            /**
             * @private
             *
             * @param url
             * @param callback
             */
            p.load = function (url) {
                this.check(url);
            };
            p.check = function (url) {
                var self = this;
                if (self.isNetUrl(url)) {
                    self.download(url);
                }
                else if (!egret_native.isFileExists(url)) {
                    self.download(url);
                }
                else {
                    self.loadTexture(url);
                }
            };
            p.download = function (url) {
                var self = this;
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = function () {
                    self.loadTexture(url);
                };
                promise.onErrorFunc = function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                };
                egret_native.download(url, url, promise);
            };
            p.loadTexture = function (url) {
                var self = this;
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (bitmapData) {
                    self.data = native.toBitmapData(bitmapData);
                    self.dispatchEventWith(egret.Event.COMPLETE);
                };
                promise.onErrorFunc = function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                };
                egret_native.Texture.addTextureAsyn(url, promise);
            };
            /**
             * 是否是网络地址
             * @param url
             * @returns {boolean}
             */
            p.isNetUrl = function (url) {
                return url.indexOf("http://") != -1;
            };
            return NativeImageLoader;
        })(egret.EventDispatcher);
        native.NativeImageLoader = NativeImageLoader;
        egret.registerClass(NativeImageLoader,"egret.native.NativeImageLoader",["egret.ImageLoader"]);
        egret.ImageLoader = NativeImageLoader;
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @classdesc
     * @implements egret.StageText
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var NativeStageText = (function (_super) {
        __extends(NativeStageText, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function NativeStageText() {
            _super.call(this);
            /**
             * @private
             */
            this.textValue = "";
            /**
             * @private
             */
            this.isFinishDown = false;
            this.textValue = "";
        }
        var d = __define,c=NativeStageText;p=c.prototype;
        /**
         * @private
         *
         * @returns
         */
        p.$getText = function () {
            if (!this.textValue) {
                this.textValue = "";
            }
            return this.textValue;
        };
        /**
         * @private
         *
         * @param value
         */
        p.$setText = function (value) {
            this.textValue = value;
            return true;
        };
        /**
         * @private
         *
         */
        p.$onBlur = function () {
        };
        //全屏键盘
        p.showScreenKeyboard = function () {
            var self = this;
            self.dispatchEvent(new egret.Event("focus"));
            egret.Event.dispatchEvent(self, "focus", false, { "showing": true });
            egret_native.EGT_TextInput = function (appendText) {
                if (self.$textfield.multiline) {
                    if (self.isFinishDown) {
                        self.isFinishDown = false;
                        self.textValue = appendText;
                        self.dispatchEvent(new egret.Event("updateText"));
                    }
                }
                else {
                    self.textValue = appendText.replace(/[\n|\r]/, "");
                    //关闭软键盘
                    egret_native.TextInputOp.setKeybordOpen(false);
                    self.dispatchEvent(new egret.Event("updateText"));
                    self.dispatchEvent(new egret.Event("blur"));
                }
            };
            //点击完成
            egret_native.EGT_keyboardFinish = function () {
                if (self.$textfield.multiline) {
                    self.isFinishDown = true;
                }
                self.dispatchEvent(new egret.Event("blur"));
            };
        };
        /**
         * @private
         *
         */
        p.$show = function () {
            var self = this;
            egret_native.EGT_getTextEditerContentText = function () {
                return self.$getText();
            };
            egret_native.EGT_keyboardDidShow = function () {
                //if (egret_native.TextInputOp.isFullScreenKeyBoard()) {//横屏
                //}
                self.showScreenKeyboard();
                egret_native.EGT_keyboardDidShow = function () {
                };
            };
            var textfield = this.$textfield;
            var inputMode = textfield.multiline ? 0 : 6;
            var inputFlag = -1; //textfield.displayAsPassword ? 0 : -1;
            var returnType = 1;
            var maxLength = textfield.maxChars <= 0 ? -1 : textfield.maxChars;
            egret_native.TextInputOp.setKeybordOpen(true, JSON.stringify({ "inputMode": inputMode, "inputFlag": inputFlag, "returnType": returnType, "maxLength": maxLength }));
        };
        /**
         * @private
         *
         */
        p.$hide = function () {
            this.dispatchEvent(new egret.Event("blur"));
            egret_native.TextInputOp.setKeybordOpen(false);
        };
        p.$resetStageText = function () {
        };
        p.$addToStage = function () {
        };
        p.$removeFromStage = function () {
        };
        p.$setTextField = function (value) {
            this.$textfield = value;
            return true;
        };
        return NativeStageText;
    })(egret.EventDispatcher);
    egret.NativeStageText = NativeStageText;
    egret.registerClass(NativeStageText,"egret.NativeStageText",["egret.StageText"]);
    egret.StageText = NativeStageText;
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        if (DEBUG) {
            function setLogLevel(logType) {
                egret_native.loglevel(logType);
            }
            Object.defineProperty(egret.Logger, "logLevel", {
                set: setLogLevel,
                enumerable: true,
                configurable: true
            });
        }
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
