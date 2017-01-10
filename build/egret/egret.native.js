var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    var native;
    (function (native) {
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                /**
                 * @private
                 */
                _this.audio = null;
                //声音是否已经播放完成
                _this.isStopped = false;
                /**
                 * @private
                 */
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    //this.audio.load();
                    _this.$play();
                };
                _this.$volume = 1;
                audio.addEventListener("ended", _this.onPlayEnd);
                _this.audio = audio;
                return _this;
            }
            NativeSoundChannel.prototype.$play = function () {
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
                    this.audio.volume = this.$volume;
                    this.audio.play();
                }
            };
            /**
             * @private
             * @inheritDoc
             */
            NativeSoundChannel.prototype.stop = function () {
                if (!this.audio)
                    return;
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                var audio = this.audio;
                audio.pause();
                audio.removeEventListener("ended", this.onPlayEnd);
                this.audio = null;
                native.NativeSound.$recycle(this.$url, audio);
            };
            Object.defineProperty(NativeSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this.$volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this.$volume = value;
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                },
                enumerable: true,
                configurable: true
            });
            return NativeSoundChannel;
        }(egret.EventDispatcher));
        native.NativeSoundChannel = NativeSoundChannel;
        __reflect(NativeSoundChannel.prototype, "egret.native.NativeSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * 测量文本在指定样式下的宽度。
         * @param text 要测量的文本内容。
         * @param fontFamily 字体名称
         * @param fontSize 字体大小
         * @param bold 是否粗体
         * @param italic 是否斜体
         */
        function measureText(text, fontFamily, fontSize, bold, italic) {
            var font;
            var arr;
            if (fontFamily.indexOf(", ") != -1) {
                arr = fontFamily.split(", ");
            }
            else if (fontFamily.indexOf(",") != -1) {
                arr = fontFamily.split(",");
                var length_1 = arr.length;
                for (var i = 0; i < length_1; i++) {
                    var fontFamily_1 = arr[i];
                    //暂时先不考虑带有引号的情况
                    if (egret.fontMapping[fontFamily_1]) {
                        font = egret.fontMapping[fontFamily_1];
                        break;
                    }
                }
            }
            else {
                font = egret.fontMapping[fontFamily];
            }
            if (!font) {
                font = "/system/fonts/DroidSansFallback.ttf";
            }
            egret_native.Label.createLabel(font, fontSize, "", 0);
            return egret_native.Label.getTextSize(text)[0];
        }
        egret.sys.measureText = measureText;
    })(native = egret.native || (egret.native = {}));
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
        var OldNativeCanvasRenderContext = (function (_super) {
            __extends(OldNativeCanvasRenderContext, _super);
            function OldNativeCanvasRenderContext() {
                var _this = _super.apply(this, arguments) || this;
                _this.$matrix = new egret.Matrix();
                _this.$nativeContext = null;
                _this.$globalCompositeOperation = "source-over";
                _this.$globalAlpha = 1;
                _this.$lineWidth = 0;
                _this.$strokeStyle = "#000000";
                _this.$fillStyle = "#000000";
                _this.$font = "normal normal 10px sans-serif";
                _this.$fontSize = 10;
                _this.$fontFamily = "";
                _this.clipRectArray = null;
                _this.$saveList = [];
                _this.$clipRectArray = [];
                _this.$clipRect = new egret.Rectangle();
                _this.$saveCount = 0;
                _this.$clipList = [];
                _this.savedMatrix = new egret.Matrix();
                _this.$hasStrokeText = false;
                return _this;
            }
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "globalCompositeOperation", {
                /**
                 * @private
                 * 设置新图像如何绘制到已有的图像上的规制
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$globalCompositeOperation;
                },
                set: function (value) {
                    this.$globalCompositeOperation = value;
                    var arr = blendModesForGL[value];
                    if (arr) {
                        this.$nativeContext.setBlendArg(arr[0], arr[1]);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "globalAlpha", {
                /**
                 * @private
                 * 设置接下来绘图填充的整体透明度
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$globalAlpha;
                },
                set: function (value) {
                    this.$globalAlpha = value;
                    this.$nativeContext.setGlobalAlpha(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "lineWidth", {
                /**
                 * @private
                 * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
                 * @default 1
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$lineWidth;
                },
                set: function (value) {
                    //console.log("set lineWidth" + value);
                    this.$lineWidth = value;
                    this.$nativeContext.lineWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "strokeStyle", {
                /**
                 * @private
                 * 设置要在图形边线填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$strokeStyle;
                },
                set: function (value) {
                    this.$strokeStyle = value;
                    if (value != null) {
                        if (value.indexOf("rgba") != -1) {
                            value = this.$parseRGBA(value);
                        }
                        else if (value.indexOf("rgb") != -1) {
                            value = this.$parseRGB(value);
                        }
                        egret_native.Label.setStrokeColor(parseInt(value.replace("#", "0x")));
                    }
                    this.$nativeContext.strokeStyle = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "fillStyle", {
                /**
                 * @private
                 * 设置要在图形内部填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$fillStyle;
                },
                set: function (value) {
                    this.$fillStyle = value;
                    if (value != null) {
                        if (value.indexOf("rgba") != -1) {
                            value = this.$parseRGBA(value);
                        }
                        else if (value.indexOf("rgb") != -1) {
                            value = this.$parseRGB(value);
                        }
                        egret_native.Label.setTextColor(parseInt(value.replace("#", "0x")));
                    }
                    this.$nativeContext.fillStyle = value;
                },
                enumerable: true,
                configurable: true
            });
            OldNativeCanvasRenderContext.prototype.$fillColorStr = function (s) {
                if (s.length < 2) {
                    s = "0" + s;
                }
                return s;
            };
            OldNativeCanvasRenderContext.prototype.$parseRGBA = function (str) {
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
            OldNativeCanvasRenderContext.prototype.$parseRGB = function (str) {
                var index = str.indexOf("(");
                str = str.slice(index + 1, str.length - 1);
                var arr = str.split(",");
                var r = parseInt(arr[0]).toString(16);
                var g = parseInt(arr[1]).toString(16);
                var b = parseInt(arr[2]).toString(16);
                str = "#" + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
                return str;
            };
            Object.defineProperty(OldNativeCanvasRenderContext.prototype, "font", {
                /**
                 * @private
                 * 当前的字体样式
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$font;
                },
                set: function (value) {
                    this.$font = value;
                    var arr = value.split(" ");
                    var sizeTxt = arr[2];
                    if (sizeTxt.indexOf("px") != -1) {
                        this.$fontSize = parseInt(sizeTxt.replace("px", ""));
                    }
                    if (egret.useFontMapping) {
                        var fontFamilyText = void 0;
                        if (arr.length == 4) {
                            fontFamilyText = arr[3];
                        }
                        else {
                            fontFamilyText = arr.slice(3).join(" ");
                        }
                        if (fontFamilyText.indexOf(", ") != -1) {
                            arr = fontFamilyText.split(", ");
                        }
                        else if (fontFamilyText.indexOf(",") != -1) {
                            arr = fontFamilyText.split(",");
                            var length_2 = arr.length;
                            for (var i = 0; i < length_2; i++) {
                                var fontFamily = arr[i];
                                //暂时先不考虑带有引号的情况
                                if (egret.fontMapping[fontFamily]) {
                                    this.$fontFamily = egret.fontMapping[fontFamily];
                                    return;
                                }
                            }
                        }
                        else {
                            this.$fontFamily = egret.fontMapping[fontFamilyText];
                        }
                        if (!this.$fontFamily) {
                            this.$fontFamily = "/system/fonts/DroidSansFallback.ttf";
                        }
                    }
                    else {
                        //兼容旧版本直接将 default_fontFamily 设置为字体路径的情况
                        this.$fontFamily = egret.TextField.default_fontFamily;
                    }
                },
                enumerable: true,
                configurable: true
            });
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
            OldNativeCanvasRenderContext.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.$nativeContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
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
            OldNativeCanvasRenderContext.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
                //console.log("quadraticCurveTo " + cpx + " " + cpy + " " + x + " " + y);
                this.$nativeContext.quadraticCurveTo(cpx, cpy, x, y);
            };
            /**
             * @private
             * 使用直线连接子路径的终点到x，y坐标。
             * @param x 直线终点的 x 轴坐标。
             * @param y 直线终点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.lineTo = function (x, y) {
                //console.log("lineTo " + x + " " + y);
                this.$nativeContext.lineTo(x, y);
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
            OldNativeCanvasRenderContext.prototype.fill = function (fillRule) {
                this.$nativeContext.fill(fillRule);
            };
            /**
             * @private
             * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.closePath = function () {
                this.$nativeContext.closePath();
                if (this.clipRectArray) {
                    this.$clipRectArray = this.clipRectArray;
                    this.clipRectArray = null;
                }
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
            OldNativeCanvasRenderContext.prototype.rect = function (x, y, w, h) {
                this.$nativeContext.rect(x, y, w, h);
                this.$clipRectArray.push({ x: x, y: y, w: w, h: h });
            };
            /**
             * @private
             * 将一个新的子路径的起始点移动到(x，y)坐标
             * @param x 点的 x 轴
             * @param y 点的 y 轴
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.moveTo = function (x, y) {
                this.$nativeContext.moveTo(x, y);
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
            OldNativeCanvasRenderContext.prototype.fillRect = function (x, y, w, h) {
                this.$nativeContext.fillRect(x, y, w, h);
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
            OldNativeCanvasRenderContext.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this.$nativeContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            };
            /**
             * @private
             * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.stroke = function () {
                this.$nativeContext.stroke();
            };
            /**
             * @private
             * 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法。
             * @param x 矩形起点的 x 轴坐标。
             * @param y 矩形起点的 y 轴坐标。
             * @param w 矩形的宽度。
             * @param h 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.strokeRect = function (x, y, w, h) {
                //console.log("strokeRect");
                this.$nativeContext.strokeRect(x, y, w, h);
            };
            /**
             * @private
             * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.beginPath = function () {
                this.$nativeContext.beginPath();
                this.clipRectArray = this.$clipRectArray.concat();
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
            OldNativeCanvasRenderContext.prototype.arcTo = function (x1, y1, x2, y2, radius) {
                this.$nativeContext.arcTo(x1, y1, x2, y2, radius);
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
            OldNativeCanvasRenderContext.prototype.transform = function (a, b, c, d, tx, ty) {
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
            OldNativeCanvasRenderContext.prototype.translate = function (x, y) {
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
            OldNativeCanvasRenderContext.prototype.scale = function (x, y) {
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
            OldNativeCanvasRenderContext.prototype.rotate = function (angle) {
                this.$matrix.rotate(angle);
                this.setTransformToNative();
            };
            /**
             * @private
             * 恢复到最近的绘制样式状态，此状态是通过 save() 保存到”状态栈“中最新的元素。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.restore = function () {
                //console.log("restore");
                if (this.$saveList.length) {
                    var data = this.$saveList.pop();
                    for (var key in data) {
                        this[key] = data[key];
                    }
                    this.setTransformToNative();
                    this.$nativeContext.restore();
                    this.clipRectArray = null;
                }
            };
            /**
             * @private
             * 使用栈保存当前的绘画样式状态，你可以使用 restore() 恢复任何改变。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.save = function () {
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
                    $matrix: transformMatrix,
                    $clipRectArray: this.$clipRectArray.concat()
                });
                this.$nativeContext.save();
            };
            /**
             * @private
             * 从当前路径创建一个剪切路径。在 clip() 调用之后，绘制的所有信息只会出现在剪切路径内部。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.clip = function (fillRule) {
                if (this.$clipRectArray.length > 0) {
                    var arr = [];
                    for (var i = 0; i < this.$clipRectArray.length; i++) {
                        var clipRect = this.$clipRectArray[i];
                        arr.push(clipRect.x);
                        arr.push(clipRect.y);
                        arr.push(clipRect.w);
                        arr.push(clipRect.h);
                    }
                    //console.log("pushRectStencils " + arr.toString());
                    this.$nativeContext.pushRectStencils(arr);
                    this.$clipRectArray.length = 0;
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
            OldNativeCanvasRenderContext.prototype.clearRect = function (x, y, width, height) {
                //console.log("clearRect x:" + x + " y:" +  y + " width:" + width + " height:" + height);
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
            OldNativeCanvasRenderContext.prototype.setTransform = function (a, b, c, d, tx, ty) {
                this.$matrix.setTo(a, b, c, d, tx, ty);
                this.setTransformToNative();
            };
            OldNativeCanvasRenderContext.prototype.setTransformToNative = function () {
                var m = this.$matrix;
                //console.log("setTransformToNative::a=" + m.a + " b=" + m.b + " c=" + m.c + " d=" + m.d + " tx=" + m.tx + " ty=" + m.ty);
                this.$nativeContext.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            };
            /**
             * @private
             * 保存矩阵，这里只能保存一次，嵌套无效
             */
            OldNativeCanvasRenderContext.prototype.saveTransform = function () {
                this.savedMatrix.copyFrom(this.$matrix);
            };
            /**
             * @private
             * 保存矩阵，这里只能保存一次，嵌套无效
             */
            OldNativeCanvasRenderContext.prototype.restoreTransform = function () {
                this.$matrix.copyFrom(this.savedMatrix);
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
            OldNativeCanvasRenderContext.prototype.createLinearGradient = function (x0, y0, x1, y1) {
                return this.$nativeContext.createLinearGradient(x0, y0, x1, y1);
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
            OldNativeCanvasRenderContext.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
                return this.$nativeContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
            };
            /**
             * @private
             * 在(x,y)位置绘制（填充）文本。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.fillText = function (text, x, y, maxWidth) {
                //console.log("drawText" + text);
                this.$nativeContext.createLabel(this.$fontFamily, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                this.$hasStrokeText = false;
                this.$nativeContext.drawText(text, x, y);
            };
            OldNativeCanvasRenderContext.prototype.strokeText = function (text, x, y, maxWidth) {
                this.$hasStrokeText = true;
            };
            /**
             * @private
             * 测量指定文本宽度，返回 TextMetrics 对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.measureText = function (text) {
                egret_native.Label.createLabel(this.$fontFamily, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                return { width: egret_native.Label.getTextSize(text)[0] };
            };
            /**
             * @private
             * 注意：如果要对绘制的图片进行缩放，出于性能优化考虑，系统不会主动去每次重置imageSmoothingEnabled属性，因此您在调用drawImage()方法前请务必
             * 确保 imageSmoothingEnabled 已被重置为正常的值，否则有可能沿用上个显示对象绘制过程留下的值。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.drawImage = function (image, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight) {
                var bitmapData;
                var isNative;
                if (image.$nativeCanvas) {
                    bitmapData = image.$nativeCanvas;
                    isNative = true;
                }
                else {
                    bitmapData = image;
                    isNative = false;
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
                else if (arguments.length == 5) {
                    surfaceOffsetX = offsetX;
                    surfaceOffsetY = offsetY;
                    surfaceImageWidth = width;
                    surfaceImageHeight = height;
                    offsetX = 0;
                    offsetY = 0;
                    width = image.width;
                    height = image.height;
                }
                else {
                    if (width == void 0) {
                        width = image.width;
                    }
                    if (height == void 0) {
                        height = image.height;
                    }
                    if (surfaceOffsetX == void 0) {
                        surfaceOffsetX = 0;
                    }
                    if (surfaceOffsetY == void 0) {
                        surfaceOffsetY = 0;
                    }
                    if (surfaceImageWidth == void 0) {
                        surfaceImageWidth = width;
                    }
                    if (surfaceImageHeight == void 0) {
                        surfaceImageHeight = height;
                    }
                }
                //console.log("drawImage::" + offsetX + " " + offsetY + " " + width + " " + height + " " + surfaceOffsetX + " " + surfaceOffsetY + " " + surfaceImageWidth + " " + surfaceImageHeight);
                //console.log("drawImage::" + bitmapData);
                this.$nativeContext.drawImage(bitmapData, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight);
            };
            /**
             * @private
             * draw mesh
             */
            OldNativeCanvasRenderContext.prototype.drawMesh = function (image, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
                var bitmapData;
                if (image.$nativeCanvas) {
                    bitmapData = image.$nativeCanvas;
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
                else if (arguments.length == 5) {
                    surfaceOffsetX = offsetX;
                    surfaceOffsetY = offsetY;
                    surfaceImageWidth = width;
                    surfaceImageHeight = height;
                    offsetX = 0;
                    offsetY = 0;
                    width = image.width;
                    height = image.height;
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
                this.vertices = new Float32Array(meshVertices.length / 2 * 5);
                this.indicesForMesh = new Uint32Array(meshIndices.length);
                this.cacheArrays(this.$matrix, 1, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices);
                this.$nativeContext.drawMesh(bitmapData, this.vertices, this.indicesForMesh, this.vertices.length, this.indicesForMesh.length);
            };
            OldNativeCanvasRenderContext.prototype.cacheArrays = function (transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = transform;
                var originalA = locWorldTransform.a;
                var originalB = locWorldTransform.b;
                var originalC = locWorldTransform.c;
                var originalD = locWorldTransform.d;
                var originalTx = locWorldTransform.tx;
                var originalTy = locWorldTransform.ty;
                if (destX != 0 || destY != 0) {
                    locWorldTransform.append(1, 0, 0, 1, destX, destY);
                }
                if (sourceWidth / destWidth != 1 || sourceHeight / destHeight != 1) {
                    locWorldTransform.append(destWidth / sourceWidth, 0, 0, destHeight / sourceHeight, 0, 0);
                }
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                locWorldTransform.a = originalA;
                locWorldTransform.b = originalB;
                locWorldTransform.c = originalC;
                locWorldTransform.d = originalD;
                locWorldTransform.tx = originalTx;
                locWorldTransform.ty = originalTy;
                if (meshVertices) {
                    // 计算索引位置与赋值
                    var vertices = this.vertices;
                    // 缓存顶点数组
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        // xy
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        // uv
                        vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        // alpha
                        vertices[iD + 4] = alpha;
                    }
                    for (i = 0; i < meshIndices.length; i++) {
                        this.indicesForMesh[i] = meshIndices[i];
                    }
                }
                else {
                    console.log("meshVertices not exist");
                }
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
            OldNativeCanvasRenderContext.prototype.createPattern = function (image, repetition) {
                return null;
            };
            /**
             * @private
             * 返回一个 ImageData 对象，用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh。
             * @version Egret 2.4
             * @platform Web,Native
             */
            OldNativeCanvasRenderContext.prototype.getImageData = function (sx, sy, sw, sh) {
                var res;
                if (sx != Math.floor(sx)) {
                    sx = Math.floor(sx);
                    sw++;
                }
                if (sy != Math.floor(sy)) {
                    sy = Math.floor(sy);
                    sh++;
                }
                res = this.$nativeContext.getPixels(sx, sy, sw, sh);
                if (res.pixelData) {
                    res.data = res.pixelData;
                }
                return res;
            };
            /**
             * @private
             * 设置全局shader
             * @param filter filter属性生成的json
             */
            OldNativeCanvasRenderContext.prototype.setGlobalShader = function (filter) {
                egret_native.Graphics.setGlobalShader(filter);
            };
            return OldNativeCanvasRenderContext;
        }(egret.HashObject));
        native.OldNativeCanvasRenderContext = OldNativeCanvasRenderContext;
        __reflect(OldNativeCanvasRenderContext.prototype, "egret.native.OldNativeCanvasRenderContext");
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * 呈现最终绘图结果的画布
         */
        var NativeCanvas = (function (_super) {
            __extends(NativeCanvas, _super);
            /**
             * @private
             */
            function NativeCanvas() {
                var _this = _super.call(this) || this;
                _this.$width = 0;
                _this.$height = 0;
                _this.renderContext = native.$supportCmdBatch ? new native.NativeCanvasRenderContext() : new native.OldNativeCanvasRenderContext();
                return _this;
            }
            NativeCanvas.prototype.toDataURL = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.$nativeCanvas) {
                    return this.$nativeCanvas.toDataURL.apply(this.$nativeCanvas, arguments);
                }
                return null;
            };
            NativeCanvas.prototype.saveToFile = function (type, filePath) {
                if (this.$nativeCanvas && this.$nativeCanvas.saveToFile) {
                    this.$nativeCanvas.saveToFile(type, filePath);
                }
            };
            Object.defineProperty(NativeCanvas.prototype, "width", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this.$width;
                },
                set: function (value) {
                    if (value > 0) {
                        this.$width = value;
                        if (!this.$nativeCanvas) {
                            this.$nativeCanvas = new egret_native.Canvas(value, 1);
                            if (this.$isRoot) {
                                egret_native.setScreenCanvas(this.$nativeCanvas);
                            }
                            var context = this.$nativeCanvas.getContext("2d");
                            if (native.$supportCmdBatch) {
                                native.$cmdManager.setContext(context);
                                native.$cmdManager.clearScreen(0, 0, 0, 0);
                            }
                            else {
                                context.clearScreen(0, 0, 0, 0);
                            }
                            this.renderContext.$nativeContext = context;
                        }
                        else {
                            this.$nativeCanvas.width = value;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvas.prototype, "height", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this.$height;
                },
                set: function (value) {
                    if (value > 0) {
                        this.$height = value;
                        if (!this.$nativeCanvas) {
                            this.$nativeCanvas = new egret_native.Canvas(1, value);
                            if (this.$isRoot) {
                                egret_native.setScreenCanvas(this.$nativeCanvas);
                            }
                            var context = this.$nativeCanvas.getContext("2d");
                            if (native.$supportCmdBatch) {
                                native.$cmdManager.setContext(context);
                                native.$cmdManager.clearScreen(0, 0, 0, 0);
                            }
                            else {
                                context.clearScreen(0, 0, 0, 0);
                            }
                            this.renderContext.$nativeContext = context;
                        }
                        else {
                            this.$nativeCanvas.height = value;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            NativeCanvas.prototype.getContext = function (type) {
                return this.renderContext;
            };
            return NativeCanvas;
        }(egret.HashObject));
        native.NativeCanvas = NativeCanvas;
        __reflect(NativeCanvas.prototype, "egret.native.NativeCanvas");
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * 创建一个canvas。
         */
        function createCanvas(width, height) {
            var result = new native.NativeCanvas();
            if (!isNaN(width) && !isNaN(height)) {
                result.width = width;
                result.height = height;
            }
            return result;
        }
        var sharedCanvas;
        /**
         * @private
         * NativeCanvas2D渲染器
         */
        var NativeCanvasRenderBuffer = (function () {
            function NativeCanvasRenderBuffer(width, height) {
                this.surface = createCanvas(width, height);
                this.context = this.surface.getContext("2d");
                //保证rootCanvas是第一个创建的canvas
            }
            Object.defineProperty(NativeCanvasRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvasRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            NativeCanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                //resize 之前要提交下绘制命令
                if (native.$supportCmdBatch) {
                    native.$cmdManager.flush();
                }
                var surface = this.surface;
                surface.width = width;
                surface.height = height;
                this.clear();
            };
            /**
             * 改变渲染缓冲为指定大小，但保留原始图像数据
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
             * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
             */
            NativeCanvasRenderBuffer.prototype.resizeTo = function (width, height, offsetX, offsetY) {
                //resize 之前要提交下绘制命令
                if (native.$supportCmdBatch) {
                    native.$cmdManager.flush();
                }
                if (!sharedCanvas) {
                    sharedCanvas = createCanvas();
                }
                var oldContext = this.context;
                var oldSurface = this.surface;
                var newSurface = sharedCanvas;
                var newContext = newSurface.getContext("2d");
                sharedCanvas = oldSurface;
                this.context = newContext;
                this.surface = newSurface;
                newSurface.width = Math.max(width, 1);
                newSurface.height = Math.max(height, 1);
                newContext.setTransform(1, 0, 0, 1, 0, 0);
                newContext.drawImage(oldSurface, offsetX, offsetY);
                oldSurface.height = 1;
                oldSurface.width = 1;
            };
            NativeCanvasRenderBuffer.prototype.setDirtyRegionPolicy = function (state) {
            };
            /**
             * 清空并设置裁切
             * @param regions 矩形列表
             * @param offsetX 矩形要加上的偏移量x
             * @param offsetY 矩形要加上的偏移量y
             */
            NativeCanvasRenderBuffer.prototype.beginClip = function (regions, offsetX, offsetY) {
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                var context = this.context;
                context.save();
                context.beginPath();
                context.setTransform(1, 0, 0, 1, offsetX, offsetY);
                var length = regions.length;
                for (var i = 0; i < length; i++) {
                    var region = regions[i];
                    context.clearRect(region.minX, region.minY, region.width, region.height);
                    context.rect(region.minX, region.minY, region.width, region.height);
                }
                context.clip();
            };
            /**
             * 取消上一次设置的clip。
             */
            NativeCanvasRenderBuffer.prototype.endClip = function () {
                this.context.restore();
            };
            /**
             * 获取指定区域的像素
             */
            NativeCanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return this.context.getImageData(x, y, width, height).data;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            NativeCanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            NativeCanvasRenderBuffer.prototype.clear = function () {
                var width = this.surface.width;
                var height = this.surface.height;
                if (width > 0 && height > 0) {
                    this.context.setTransform(1, 0, 0, 1, 0, 0);
                    this.context.clearRect(0, 0, width, height);
                }
            };
            /**
             * 销毁绘制对象
             */
            NativeCanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 1;
            };
            return NativeCanvasRenderBuffer;
        }());
        native.NativeCanvasRenderBuffer = NativeCanvasRenderBuffer;
        __reflect(NativeCanvasRenderBuffer.prototype, "egret.native.NativeCanvasRenderBuffer", ["egret.sys.RenderBuffer"]);
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         */
        function convertImageToRenderTexture(texture, rect) {
            var buffer = egret.sys.canvasHitTestBuffer;
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
            var surface = buffer.surface;
            buffer.resize(iWidth, iHeight);
            var bitmapData = texture;
            var offsetX = Math.round(bitmapData._offsetX);
            var offsetY = Math.round(bitmapData._offsetY);
            var bitmapWidth = bitmapData._bitmapWidth;
            var bitmapHeight = bitmapData._bitmapHeight;
            buffer.context.drawImage(bitmapData._bitmapData.source, bitmapData._bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData._bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            return buffer;
        }
        /**
         * @private
         */
        function toDataURL(type, rect) {
            try {
                var buffer = convertImageToRenderTexture(this, rect);
                var base64 = buffer.toDataURL(type);
                return base64;
            }
            catch (e) {
                egret.$error(1033);
                return null;
            }
        }
        function saveToFile(type, filePath, rect) {
            try {
                var buffer = convertImageToRenderTexture(this, rect);
                buffer.surface.saveToFile(type, filePath);
            }
            catch (e) {
                egret.$error(1033);
            }
        }
        function getPixel32(x, y) {
            egret.$warn(1041, "getPixel32", "getPixels");
            return this.getPixels(x, y);
        }
        function getPixels(x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            var self = this;
            if (self.$renderBuffer) {
                return self.$renderBuffer.getPixels(x, y, width, height);
            }
            else {
                try {
                    var buffer = convertImageToRenderTexture(this);
                    return buffer.getPixels(x, y, width, height);
                }
                catch (e) {
                    egret.$error(1033);
                }
            }
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = saveToFile;
        egret.Texture.prototype.getPixel32 = getPixel32;
        egret.Texture.prototype.getPixels = getPixels;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativePlayer = (function (_super) {
            __extends(NativePlayer, _super);
            function NativePlayer() {
                var _this = _super.call(this) || this;
                _this.init(NativePlayer.option);
                return _this;
            }
            NativePlayer.prototype.init = function (option) {
                //暂时无法显示重绘区域
                option.showPaintRect = false;
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$maxTouches = option.maxTouches;
                stage.textureScaleFactor = option.textureScaleFactor;
                //设置帧频到native
                stage.frameRate = option.frameRate;
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
                var canvas = buffer.surface;
                canvas.$isRoot = true;
                var touch = new native.NativeTouchHandler(stage);
                var player = new egret.sys.Player(buffer, stage, option.entryClassName);
                new native.NativeHideHandler(stage);
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
                this.playerOption = option;
                this.$stage = stage;
                this.player = player;
                this.nativeTouch = touch;
                //this.nativeInput = nativeInput;
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            NativePlayer.prototype.updateScreenSize = function () {
                var option = this.playerOption;
                var screenWidth = egret_native.EGTView.getFrameWidth();
                var screenHeight = egret_native.EGTView.getFrameHeight();
                egret.Capabilities.$boundingClientWidth = screenWidth;
                egret.Capabilities.$boundingClientHeight = screenHeight;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.$stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                var top = (screenHeight - displayHeight) / 2;
                var left = (screenWidth - displayWidth) / 2;
                egret_native.EGTView.setVisibleRect(left, top, displayWidth, displayHeight);
                egret_native.EGTView.setDesignSize(stageWidth, stageHeight);
                this.player.updateStageSize(stageWidth, stageHeight);
            };
            NativePlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            NativePlayer.prototype.updateMaxTouches = function () {
                this.nativeTouch.$updateMaxTouches();
            };
            return NativePlayer;
        }(egret.HashObject));
        native.NativePlayer = NativePlayer;
        __reflect(NativePlayer.prototype, "egret.native.NativePlayer", ["egret.sys.Screen"]);
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * 判断当前runtime版本是否支持cmdBatch
         */
        native.$supportCmdBatch = egret_native.sendToC ? true : false;
        /*
         * @private
         * 命令控制器
         * */
        var CmdManager = (function () {
            function CmdManager() {
                /*
                 * 存储绘制命令的 array buffer
                 **/
                this.maxArrayBufferLen = 80000;
                this.arrayBuffer = new ArrayBuffer(this.maxArrayBufferLen * 4);
                this.uint32View = new Uint32Array(this.arrayBuffer);
                this.float32View = new Float32Array(this.arrayBuffer);
                this.arrayBufferLen = 0;
                /*
                 * 存储字符串的数组
                 */
                this.strArray = [];
                //------绘制命令 end-------------
            }
            /*
             * 上传绘制命令到C
             */
            CmdManager.prototype.flush = function () {
                egret_native.sendToC(this.float32View, this.arrayBufferLen, this.strArray);
                this.clear();
            };
            /*
             * 切换native上下文
             * native绘制需要在自身的上下文进行绘制
             */
            CmdManager.prototype.setContext = function (ctx) {
                if (this.context != ctx) {
                    if (this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                        this.flush();
                    }
                    this.context = ctx;
                    var uint32View = this.uint32View;
                    var arrayBufferLen = this.arrayBufferLen;
                    uint32View[arrayBufferLen++] = 1000;
                    // uint32View[arrayBufferLen++] = ctx.___native_texture__p;
                    // 兼容64位
                    var addr = ctx.___native_texture__p;
                    uint32View[arrayBufferLen++] = (addr / 4294967296) >>> 0;
                    uint32View[arrayBufferLen++] = (addr & 4294967295) >>> 0;
                    // uint32View[arrayBufferLen++] = addr >> 32;
                    // uint32View[arrayBufferLen++] = addr & 4294967295;
                    this.arrayBufferLen = arrayBufferLen;
                }
            };
            /*
             * 清空绘制命令
             */
            CmdManager.prototype.clear = function () {
                this.arrayBufferLen = 0;
                this.strArray.length = 0;
            };
            /*
             * 压入一个字符串并返回索引
             */
            CmdManager.prototype.pushString = function (str) {
                var array = this.strArray;
                var len = array.length;
                array[len] = str;
                return len;
            };
            //------绘制命令 start-------------
            CmdManager.prototype.clearScreen = function (i1, i2, i3, i4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 100;
                uint32View[arrayBufferLen++] = i1;
                uint32View[arrayBufferLen++] = i2;
                uint32View[arrayBufferLen++] = i3;
                uint32View[arrayBufferLen++] = i4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.drawImage = function (i1, f1, f2, f3, f4, f5, f6, f7, f8) {
                if (this.arrayBufferLen + 11 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 101;
                // uint32View[arrayBufferLen++] = i1;
                // 兼容64位
                // uint32View[arrayBufferLen++] = i1 >> 32;
                // uint32View[arrayBufferLen++] = i1 & 4294967295;
                uint32View[arrayBufferLen++] = (i1 / 4294967296) >>> 0;
                uint32View[arrayBufferLen++] = (i1 & 4294967295) >>> 0;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                float32View[arrayBufferLen++] = f5;
                float32View[arrayBufferLen++] = f6;
                float32View[arrayBufferLen++] = f7;
                float32View[arrayBufferLen++] = f8;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setTransform = function (f1, f2, f3, f4, f5, f6) {
                if (this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 103;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                float32View[arrayBufferLen++] = f5;
                float32View[arrayBufferLen++] = f6;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setGlobalAlpha = function (f1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 106;
                float32View[arrayBufferLen++] = f1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.pushRectStencils = function (array) {
                var len = array.length;
                if (this.arrayBufferLen + len + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 113;
                uint32View[arrayBufferLen++] = len;
                for (var i = 0; i < len; i++) {
                    float32View[arrayBufferLen++] = array[i];
                }
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.restore = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 116;
            };
            CmdManager.prototype.save = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 117;
            };
            CmdManager.prototype.setBlendArg = function (f1, f2) {
                if (this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 120;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.beginPath = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 204;
            };
            CmdManager.prototype.closePath = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 205;
            };
            CmdManager.prototype.rect = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 210;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.clearRect = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 214;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.createLabel = function (i1, f1, i2, f2) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 300;
                uint32View[arrayBufferLen++] = i1;
                float32View[arrayBufferLen++] = f1;
                uint32View[arrayBufferLen++] = i2;
                float32View[arrayBufferLen++] = f2;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.drawText = function (i1, f1, f2) {
                if (this.arrayBufferLen + 4 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 301;
                uint32View[arrayBufferLen++] = i1;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setTextColor = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 302;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setStrokeColor = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 303;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setFillStyle = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 1200;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setStrokeStyle = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 1201;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setLineWidth = function (f1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 1202;
                float32View[arrayBufferLen++] = f1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.moveTo = function (f1, f2) {
                if (this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 207;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.lineTo = function (f1, f2) {
                if (this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 208;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.fill = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 203;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.pushClip = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 107;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.popClip = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 108;
            };
            CmdManager.prototype.stroke = function () {
                if (this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                    this.flush();
                }
                this.uint32View[this.arrayBufferLen++] = 206;
            };
            CmdManager.prototype.arc = function (f1, f2, f3, f4, f5, i6) {
                if (this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 209;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                float32View[arrayBufferLen++] = f5;
                uint32View[arrayBufferLen++] = i6;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.quadraticCurveTo = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 211;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.fillRect = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 212;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.strokeRect = function (f1, f2, f3, f4) {
                if (this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 213;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.bezierCurveTo = function (f1, f2, f3, f4, f5, f6) {
                if (this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var float32View = this.float32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 215;
                float32View[arrayBufferLen++] = f1;
                float32View[arrayBufferLen++] = f2;
                float32View[arrayBufferLen++] = f3;
                float32View[arrayBufferLen++] = f4;
                float32View[arrayBufferLen++] = f5;
                float32View[arrayBufferLen++] = f6;
                this.arrayBufferLen = arrayBufferLen;
            };
            CmdManager.prototype.setGlobalShader = function (i1) {
                if (this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                    this.flush();
                }
                var uint32View = this.uint32View;
                var arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 111;
                uint32View[arrayBufferLen++] = i1;
                this.arrayBufferLen = arrayBufferLen;
            };
            return CmdManager;
        }());
        __reflect(CmdManager.prototype, "CmdManager");
        /*
         * @private
         * 输出一个单例命令控制器，供所有需要调用的地方使用
         */
        native.$cmdManager = new CmdManager();
        var isRunning = false;
        var playerList = [];
        function runEgret(options) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            if (!options) {
                options = {};
            }
            setRenderMode(options.renderMode);
            if (true) {
                //todo 获得系统语言版本
                var language = "zh_CN";
                if (language in egret.$locale_strings)
                    egret.$language = language;
            }
            try {
                egret.Capabilities.$setNativeCapabilities(egret_native.getVersion());
            }
            catch (e) {
            }
            var ticker = egret.sys.$ticker;
            var mainLoop = native.$supportCmdBatch ? function () {
                ticker.update();
                native.$cmdManager.flush();
            } : function () {
                ticker.update();
            };
            egret_native.executeMainLoop(mainLoop, ticker);
            if (!egret.sys.screenAdapter) {
                if (options.screenAdapter) {
                    egret.sys.screenAdapter = options.screenAdapter;
                }
                else {
                    egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                }
            }
            //todo
            var player = new native.NativePlayer();
            playerList.push(player);
            egret.sys.customHitTestBuffer = new native.NativeCanvasRenderBuffer(3, 3);
            egret.sys.canvasHitTestBuffer = egret.sys.customHitTestBuffer;
        }
        /**
         * 设置渲染模式。"auto","webgl","canvas"
         * @param renderMode
         */
        function setRenderMode(renderMode) {
            egret.sys.RenderBuffer = native.NativeCanvasRenderBuffer;
            egret.sys.CanvasRenderBuffer = native.NativeCanvasRenderBuffer;
            egret.sys.systemRenderer = new egret.CanvasRenderer();
            egret.sys.canvasRenderer = egret.sys.systemRenderer;
            egret.Capabilities.$renderMode = "canvas";
        }
        function updateAllScreens() {
            var length = playerList.length;
            for (var i = 0; i < length; i++) {
                playerList[i].updateScreenSize();
            }
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
        if (true) {
            egret.log = function () {
                if (true) {
                    var length_3 = arguments.length;
                    var info = "";
                    for (var i = 0; i < length_3; i++) {
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
        egret.updateAllScreens = updateAllScreens;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeFps = (function (_super) {
            __extends(NativeFps, _super);
            function NativeFps(stage, showFPS, showLog, logFilter, styles) {
                var _this = _super.call(this) || this;
                _this.arrFps = [];
                _this.arrLog = [];
                if (showFPS || showLog) {
                    _this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                    _this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                    _this._stage = stage;
                    _this.showFps = showFPS;
                    _this.showLog = showLog;
                    _this.fontColor = styles["textColor"] === undefined ? 0xffffff : parseInt(styles['textColor']);
                    _this.fontSize = styles["size"] === undefined ? 24 : parseInt(styles['size']);
                    _this.bgAlpha = styles["bgAlpha"] || 0.9;
                    _this.shape = new egret.Shape();
                    _this.addChild(_this.shape);
                    if (showFPS)
                        _this.addFps();
                    if (showLog)
                        _this.addLog();
                }
                return _this;
            }
            NativeFps.prototype.addFps = function () {
                var fps = new egret.TextField();
                fps.x = fps.y = 4;
                this.textFps = fps;
                this.addChild(fps);
                fps.lineSpacing = 2;
                fps.size = this.fontSize;
                fps.textColor = this.fontColor;
                fps.textFlow = [
                    { text: "0 FPS " + egret.Capabilities.renderMode + "\n" },
                    { text: "Draw: 0\nDirty: 0%\n" },
                    { text: "Cost: " },
                    { text: "0 ", style: { "textColor": 0x18fefe } },
                    { text: "0 ", style: { "textColor": 0xffff00 } },
                    { text: "0 ", style: { "textColor": 0xff0000 } }
                ];
            };
            NativeFps.prototype.addLog = function () {
                var text = new egret.TextField();
                text.size = this.fontSize;
                text.textColor = this.fontColor;
                text.x = 4;
                this.addChild(text);
                this.textLog = text;
            };
            ;
            NativeFps.prototype.update = function (datas) {
                this.arrFps.push(datas.fps);
                var fpsTotal = 0;
                var lenFps = this.arrFps.length;
                if (lenFps > 101) {
                    lenFps = 101;
                    this.arrFps.shift();
                }
                var fpsMin = this.arrFps[0];
                var fpsMax = this.arrFps[0];
                for (var i = 0; i < lenFps; i++) {
                    var num = this.arrFps[i];
                    fpsTotal += num;
                    if (num < fpsMin)
                        fpsMin = num;
                    else if (num > fpsMax)
                        fpsMax = num;
                }
                this.textFps.textFlow = [
                    { text: datas.fps + " FPS " + egret.Capabilities.renderMode + "\n" },
                    { text: "min" + fpsMin + " max" + fpsMax + " avg" + Math.floor(fpsTotal / lenFps) + "\n" },
                    { text: "Draw: " + datas.draw + "\nDirty: " + datas.dirty + "%\n" },
                    { text: "Cost: " },
                    { text: datas.costTicker + " ", style: { "textColor": 0x18fefe } },
                    { text: datas.costDirty + " ", style: { "textColor": 0xffff00 } },
                    { text: datas.costRender + " ", style: { "textColor": 0xff0000 } }
                ];
                this.updateLayout();
            };
            ;
            NativeFps.prototype.updateInfo = function (info) {
                var fpsHeight = 0;
                if (this.showFps) {
                    fpsHeight = this.textFps.height;
                    this.textLog.y = fpsHeight + 4;
                }
                this.arrLog.push(info);
                this.textLog.text = this.arrLog.join('\n');
                if (this._stage.stageHeight > 0) {
                    if (this.textLog.textWidth > this._stage.stageWidth - 20 - this.panelX) {
                        this.textLog.width = this._stage.stageWidth - 20 - this.panelX;
                    }
                    while (this.textLog.textHeight > this._stage.stageHeight - fpsHeight - 20 - this.panelY) {
                        this.arrLog.shift();
                        this.textLog.text = this.arrLog.join("\n");
                    }
                }
                this.updateLayout();
            };
            NativeFps.prototype.updateLayout = function () {
                if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                    return;
                }
                var g = this.shape.$graphics;
                g.clear();
                g.beginFill(0x000000, this.bgAlpha);
                g.drawRect(0, 0, this.width + 8, this.height + 8);
                g.endFill();
            };
            return NativeFps;
        }(egret.Sprite));
        native.NativeFps = NativeFps;
        __reflect(NativeFps.prototype, "egret.native.NativeFps", ["egret.FPSDisplay", "egret.DisplayObject"]);
        egret.FPSDisplay = NativeFps;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        var callBackDic = {};
        /**
         * @private
         */
        var NativeExternalInterface = (function () {
            function NativeExternalInterface() {
            }
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
        }());
        native.NativeExternalInterface = NativeExternalInterface;
        __reflect(NativeExternalInterface.prototype, "egret.native.NativeExternalInterface", ["egret.ExternalInterface"]);
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
                egret.$warn(1050, functionName);
            }
        }
        egret.ExternalInterface = NativeExternalInterface;
        egret_native.receivedPluginInfo = onReceivedPluginInfo;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(NativeSound.prototype, "length", {
                get: function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            NativeSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                var audio = new Audio(url);
                audio.addEventListener("canplaythrough", onCanPlay);
                audio.addEventListener("error", onAudioError);
                this.originAudio = audio;
                if (!egret_native.isFileExists(url)) {
                    download();
                }
                else {
                    onAudioLoaded();
                }
                function download() {
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = onAudioLoaded;
                    promise.onErrorFunc = onAudioError;
                    egret_native.download(url, url, promise);
                }
                function onAudioLoaded() {
                    audio.load();
                    NativeSound.$recycle(url, audio);
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
                    audio.removeEventListener("canplaythrough", onCanPlay);
                    audio.removeEventListener("error", onAudioError);
                }
            };
            /**
             * @inheritDoc
             */
            NativeSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
                    egret.$error(1049);
                }
                var audio = NativeSound.$pop(this.url);
                if (audio == null) {
                    audio = new Audio(this.url);
                }
                else {
                }
                audio.autoplay = true;
                var channel = new native.NativeSoundChannel(audio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            NativeSound.prototype.close = function () {
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
            return NativeSound;
        }(egret.EventDispatcher));
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        NativeSound.MUSIC = "music";
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        NativeSound.EFFECT = "effect";
        /**
         * @private
         */
        NativeSound.audios = {};
        native.NativeSound = NativeSound;
        __reflect(NativeSound.prototype, "egret.native.NativeSound", ["egret.Sound"]);
        if (__global.Audio) {
            egret.Sound = NativeSound;
        }
    })(native = egret.native || (egret.native = {}));
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
        var NativeCanvasRenderContext = (function (_super) {
            __extends(NativeCanvasRenderContext, _super);
            function NativeCanvasRenderContext() {
                var _this = _super.apply(this, arguments) || this;
                _this.$matrix = new egret.Matrix();
                _this.$nativeContext = null;
                _this.$globalCompositeOperation = "source-over";
                _this.$globalAlpha = 1;
                _this.$lineWidth = 0;
                _this.$strokeStyle = "#000000";
                _this.$fillStyle = "#000000";
                _this.$font = "normal normal 10px sans-serif";
                _this.$fontSize = 10;
                _this.$fontFamily = "";
                _this.clipRectArray = null;
                _this.$saveList = [];
                _this.$clipRectArray = [];
                _this.$clipRect = new egret.Rectangle();
                _this.$saveCount = 0;
                _this.$clipList = [];
                _this.savedMatrix = new egret.Matrix();
                _this.$hasStrokeText = false;
                return _this;
            }
            Object.defineProperty(NativeCanvasRenderContext.prototype, "globalCompositeOperation", {
                /**
                 * @private
                 * 设置新图像如何绘制到已有的图像上的规制
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$globalCompositeOperation;
                },
                set: function (value) {
                    this.$globalCompositeOperation = value;
                    var arr = blendModesForGL[value];
                    if (arr) {
                        native.$cmdManager.setContext(this.$nativeContext);
                        native.$cmdManager.setBlendArg(arr[0], arr[1]);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvasRenderContext.prototype, "globalAlpha", {
                /**
                 * @private
                 * 设置接下来绘图填充的整体透明度
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$globalAlpha;
                },
                set: function (value) {
                    this.$globalAlpha = value;
                    native.$cmdManager.setContext(this.$nativeContext);
                    native.$cmdManager.setGlobalAlpha(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvasRenderContext.prototype, "lineWidth", {
                /**
                 * @private
                 * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
                 * @default 1
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$lineWidth;
                },
                set: function (value) {
                    //console.log("set lineWidth" + value);
                    this.$lineWidth = value;
                    native.$cmdManager.setContext(this.$nativeContext);
                    native.$cmdManager.setLineWidth(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvasRenderContext.prototype, "strokeStyle", {
                /**
                 * @private
                 * 设置要在图形边线填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$strokeStyle;
                },
                set: function (value) {
                    this.$strokeStyle = value;
                    if (value != null) {
                        if (value.indexOf("rgba") != -1) {
                            value = this.$parseRGBA(value);
                        }
                        else if (value.indexOf("rgb") != -1) {
                            value = this.$parseRGB(value);
                        }
                        native.$cmdManager.setContext(egret_native.Label);
                        native.$cmdManager.setStrokeColor(parseInt(value.replace("#", "0x")));
                    }
                    native.$cmdManager.setContext(this.$nativeContext);
                    var s1 = native.$cmdManager.pushString(value);
                    native.$cmdManager.setStrokeStyle(s1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeCanvasRenderContext.prototype, "fillStyle", {
                /**
                 * @private
                 * 设置要在图形内部填充的颜色或样式
                 * @default "#000000"
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$fillStyle;
                },
                set: function (value) {
                    this.$fillStyle = value;
                    if (value != null) {
                        if (value.indexOf("rgba") != -1) {
                            value = this.$parseRGBA(value);
                        }
                        else if (value.indexOf("rgb") != -1) {
                            value = this.$parseRGB(value);
                        }
                        native.$cmdManager.setContext(egret_native.Label);
                        native.$cmdManager.setTextColor(parseInt(value.replace("#", "0x")));
                    }
                    native.$cmdManager.setContext(this.$nativeContext);
                    var s1 = native.$cmdManager.pushString(value);
                    native.$cmdManager.setFillStyle(s1);
                },
                enumerable: true,
                configurable: true
            });
            NativeCanvasRenderContext.prototype.$fillColorStr = function (s) {
                if (s.length < 2) {
                    s = "0" + s;
                }
                return s;
            };
            NativeCanvasRenderContext.prototype.$parseRGBA = function (str) {
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
            NativeCanvasRenderContext.prototype.$parseRGB = function (str) {
                var index = str.indexOf("(");
                str = str.slice(index + 1, str.length - 1);
                var arr = str.split(",");
                var r = parseInt(arr[0]).toString(16);
                var g = parseInt(arr[1]).toString(16);
                var b = parseInt(arr[2]).toString(16);
                str = "#" + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
                return str;
            };
            Object.defineProperty(NativeCanvasRenderContext.prototype, "font", {
                /**
                 * @private
                 * 当前的字体样式
                 * @version Egret 2.4
                 * @platform Web,Native
                 */
                get: function () {
                    return this.$font;
                },
                set: function (value) {
                    this.$font = value;
                    var arr = value.split(" ");
                    var sizeTxt = arr[2];
                    if (sizeTxt.indexOf("px") != -1) {
                        this.$fontSize = parseInt(sizeTxt.replace("px", ""));
                    }
                    if (egret.useFontMapping) {
                        var fontFamilyText = void 0;
                        if (arr.length == 4) {
                            fontFamilyText = arr[3];
                        }
                        else {
                            fontFamilyText = arr.slice(3).join(" ");
                        }
                        if (fontFamilyText.indexOf(", ") != -1) {
                            arr = fontFamilyText.split(", ");
                        }
                        else if (fontFamilyText.indexOf(",") != -1) {
                            arr = fontFamilyText.split(",");
                            var length_4 = arr.length;
                            for (var i = 0; i < length_4; i++) {
                                var fontFamily = arr[i];
                                //暂时先不考虑带有引号的情况
                                if (egret.fontMapping[fontFamily]) {
                                    this.$fontFamily = egret.fontMapping[fontFamily];
                                    return;
                                }
                            }
                        }
                        else {
                            this.$fontFamily = egret.fontMapping[fontFamilyText];
                        }
                        if (!this.$fontFamily) {
                            this.$fontFamily = "/system/fonts/DroidSansFallback.ttf";
                        }
                    }
                    else {
                        //兼容旧版本直接将 default_fontFamily 设置为字体路径的情况
                        this.$fontFamily = egret.TextField.default_fontFamily;
                    }
                },
                enumerable: true,
                configurable: true
            });
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
            NativeCanvasRenderContext.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.arc(x, y, radius, startAngle, endAngle, anticlockwise ? 1 : 0);
                // this.$nativeContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
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
            NativeCanvasRenderContext.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
                //console.log("quadraticCurveTo " + cpx + " " + cpy + " " + x + " " + y);
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.quadraticCurveTo(cpx, cpy, x, y);
                // this.$nativeContext.quadraticCurveTo(cpx, cpy, x, y);
            };
            /**
             * @private
             * 使用直线连接子路径的终点到x，y坐标。
             * @param x 直线终点的 x 轴坐标。
             * @param y 直线终点的 y 轴坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.lineTo = function (x, y) {
                //console.log("lineTo " + x + " " + y);
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.lineTo(x, y);
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
            NativeCanvasRenderContext.prototype.fill = function (fillRule) {
                native.$cmdManager.setContext(this.$nativeContext);
                var s1 = native.$cmdManager.pushString(fillRule);
                native.$cmdManager.fill(s1);
            };
            /**
             * @private
             * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.closePath = function () {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.closePath();
                if (this.clipRectArray) {
                    this.$clipRectArray = this.clipRectArray;
                    this.clipRectArray = null;
                }
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
            NativeCanvasRenderContext.prototype.rect = function (x, y, w, h) {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.rect(x, y, w, h);
                this.$clipRectArray.push({ x: x, y: y, w: w, h: h });
            };
            /**
             * @private
             * 将一个新的子路径的起始点移动到(x，y)坐标
             * @param x 点的 x 轴
             * @param y 点的 y 轴
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.moveTo = function (x, y) {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.moveTo(x, y);
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
            NativeCanvasRenderContext.prototype.fillRect = function (x, y, w, h) {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.fillRect(x, y, w, h);
                // this.$nativeContext.fillRect(x, y, w, h);
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
            NativeCanvasRenderContext.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                // this.$nativeContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            };
            /**
             * @private
             * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.stroke = function () {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.stroke();
                // this.$nativeContext.stroke();
            };
            /**
             * @private
             * 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法。
             * @param x 矩形起点的 x 轴坐标。
             * @param y 矩形起点的 y 轴坐标。
             * @param w 矩形的宽度。
             * @param h 矩形的高度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.strokeRect = function (x, y, w, h) {
                //console.log("strokeRect");
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.strokeRect(x, y, w, h);
                // this.$nativeContext.strokeRect(x, y, w, h);
            };
            /**
             * @private
             * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.beginPath = function () {
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.beginPath();
                this.clipRectArray = this.$clipRectArray.concat();
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
            NativeCanvasRenderContext.prototype.arcTo = function (x1, y1, x2, y2, radius) {
                this.$nativeContext.arcTo(x1, y1, x2, y2, radius);
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
            NativeCanvasRenderContext.prototype.transform = function (a, b, c, d, tx, ty) {
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
            NativeCanvasRenderContext.prototype.translate = function (x, y) {
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
            NativeCanvasRenderContext.prototype.scale = function (x, y) {
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
            NativeCanvasRenderContext.prototype.rotate = function (angle) {
                this.$matrix.rotate(angle);
                this.setTransformToNative();
            };
            /**
             * @private
             * 恢复到最近的绘制样式状态，此状态是通过 save() 保存到”状态栈“中最新的元素。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.restore = function () {
                //console.log("restore");
                if (this.$saveList.length) {
                    var data = this.$saveList.pop();
                    for (var key in data) {
                        this[key] = data[key];
                    }
                    this.setTransformToNative();
                    native.$cmdManager.setContext(this.$nativeContext);
                    native.$cmdManager.restore();
                    this.clipRectArray = null;
                }
            };
            /**
             * @private
             * 使用栈保存当前的绘画样式状态，你可以使用 restore() 恢复任何改变。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.save = function () {
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
                    $matrix: transformMatrix,
                    $clipRectArray: this.$clipRectArray.concat()
                });
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.save();
            };
            /**
             * @private
             * 从当前路径创建一个剪切路径。在 clip() 调用之后，绘制的所有信息只会出现在剪切路径内部。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.clip = function (fillRule) {
                if (this.$clipRectArray.length > 0) {
                    var arr = [];
                    for (var i = 0; i < this.$clipRectArray.length; i++) {
                        var clipRect = this.$clipRectArray[i];
                        arr.push(clipRect.x);
                        arr.push(clipRect.y);
                        arr.push(clipRect.w);
                        arr.push(clipRect.h);
                    }
                    //console.log("pushRectStencils " + arr.toString());
                    native.$cmdManager.setContext(this.$nativeContext);
                    native.$cmdManager.pushRectStencils(arr);
                    this.$clipRectArray.length = 0;
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
            NativeCanvasRenderContext.prototype.clearRect = function (x, y, width, height) {
                //console.log("clearRect x:" + x + " y:" +  y + " width:" + width + " height:" + height);
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.clearRect(x, y, width, height);
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
            NativeCanvasRenderContext.prototype.setTransform = function (a, b, c, d, tx, ty) {
                this.$matrix.setTo(a, b, c, d, tx, ty);
                this.setTransformToNative();
            };
            NativeCanvasRenderContext.prototype.setTransformToNative = function () {
                var m = this.$matrix;
                //console.log("setTransformToNative::a=" + m.a + " b=" + m.b + " c=" + m.c + " d=" + m.d + " tx=" + m.tx + " ty=" + m.ty);
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            };
            /**
             * @private
             * 保存矩阵，这里只能保存一次，嵌套无效
             */
            NativeCanvasRenderContext.prototype.saveTransform = function () {
                this.savedMatrix.copyFrom(this.$matrix);
            };
            /**
             * @private
             * 保存矩阵，这里只能保存一次，嵌套无效
             */
            NativeCanvasRenderContext.prototype.restoreTransform = function () {
                this.$matrix.copyFrom(this.savedMatrix);
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
            NativeCanvasRenderContext.prototype.createLinearGradient = function (x0, y0, x1, y1) {
                return this.$nativeContext.createLinearGradient(x0, y0, x1, y1);
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
            NativeCanvasRenderContext.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
                return this.$nativeContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
            };
            /**
             * @private
             * 在(x,y)位置绘制（填充）文本。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.fillText = function (text, x, y, maxWidth) {
                //console.log("drawText" + text);
                native.$cmdManager.setContext(this.$nativeContext);
                var s1 = native.$cmdManager.pushString(this.$fontFamily);
                var s2 = native.$cmdManager.pushString("");
                native.$cmdManager.createLabel(s1, this.$fontSize, s2, this.$hasStrokeText ? this.$lineWidth : 0);
                this.$hasStrokeText = false;
                var s3 = native.$cmdManager.pushString(text);
                native.$cmdManager.drawText(s3, x, y);
            };
            NativeCanvasRenderContext.prototype.strokeText = function (text, x, y, maxWidth) {
                this.$hasStrokeText = true;
            };
            /**
             * @private
             * 测量指定文本宽度，返回 TextMetrics 对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.measureText = function (text) {
                native.$cmdManager.setContext(egret_native.Label);
                var s1 = native.$cmdManager.pushString(this.$fontFamily);
                var s2 = native.$cmdManager.pushString("");
                native.$cmdManager.createLabel(s1, this.$fontSize, s2, this.$hasStrokeText ? this.$lineWidth : 0);
                //同步更新
                native.$cmdManager.flush();
                return { width: egret_native.Label.getTextSize(text)[0] };
            };
            /**
             * @private
             * 注意：如果要对绘制的图片进行缩放，出于性能优化考虑，系统不会主动去每次重置imageSmoothingEnabled属性，因此您在调用drawImage()方法前请务必
             * 确保 imageSmoothingEnabled 已被重置为正常的值，否则有可能沿用上个显示对象绘制过程留下的值。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.drawImage = function (image, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight) {
                var bitmapData;
                var isNative;
                if (image.$nativeCanvas) {
                    bitmapData = image.$nativeCanvas;
                    isNative = true;
                }
                else {
                    bitmapData = image;
                    isNative = false;
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
                else if (arguments.length == 5) {
                    surfaceOffsetX = offsetX;
                    surfaceOffsetY = offsetY;
                    surfaceImageWidth = width;
                    surfaceImageHeight = height;
                    offsetX = 0;
                    offsetY = 0;
                    width = image.width;
                    height = image.height;
                }
                else {
                    if (width == void 0) {
                        width = image.width;
                    }
                    if (height == void 0) {
                        height = image.height;
                    }
                    if (surfaceOffsetX == void 0) {
                        surfaceOffsetX = 0;
                    }
                    if (surfaceOffsetY == void 0) {
                        surfaceOffsetY = 0;
                    }
                    if (surfaceImageWidth == void 0) {
                        surfaceImageWidth = width;
                    }
                    if (surfaceImageHeight == void 0) {
                        surfaceImageHeight = height;
                    }
                }
                //console.log("drawImage::" + offsetX + " " + offsetY + " " + width + " " + height + " " + surfaceOffsetX + " " + surfaceOffsetY + " " + surfaceImageWidth + " " + surfaceImageHeight);
                //console.log("drawImage::" + bitmapData);
                var imageAdress;
                if (!isNative) {
                    if (!bitmapData._native_tex_loc) {
                        bitmapData._native_tex_loc = bitmapData.___native_texture__p;
                    }
                    imageAdress = bitmapData._native_tex_loc;
                }
                else {
                    imageAdress = bitmapData.___native_texture__p;
                }
                native.$cmdManager.setContext(this.$nativeContext);
                native.$cmdManager.drawImage(imageAdress, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight);
            };
            /**
             * @private
             * draw mesh
             */
            NativeCanvasRenderContext.prototype.drawMesh = function (image, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
                var bitmapData;
                if (image.$nativeCanvas) {
                    bitmapData = image.$nativeCanvas;
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
                else if (arguments.length == 5) {
                    surfaceOffsetX = offsetX;
                    surfaceOffsetY = offsetY;
                    surfaceImageWidth = width;
                    surfaceImageHeight = height;
                    offsetX = 0;
                    offsetY = 0;
                    width = image.width;
                    height = image.height;
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
                this.vertices = new Float32Array(meshVertices.length / 2 * 5);
                this.indicesForMesh = new Uint32Array(meshIndices.length);
                this.cacheArrays(this.$matrix, 1, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices);
                // 打断批渲染
                native.$cmdManager.flush();
                this.$nativeContext.drawMesh(bitmapData, this.vertices, this.indicesForMesh, this.vertices.length, this.indicesForMesh.length);
            };
            NativeCanvasRenderContext.prototype.cacheArrays = function (transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = transform;
                var originalA = locWorldTransform.a;
                var originalB = locWorldTransform.b;
                var originalC = locWorldTransform.c;
                var originalD = locWorldTransform.d;
                var originalTx = locWorldTransform.tx;
                var originalTy = locWorldTransform.ty;
                if (destX != 0 || destY != 0) {
                    locWorldTransform.append(1, 0, 0, 1, destX, destY);
                }
                if (sourceWidth / destWidth != 1 || sourceHeight / destHeight != 1) {
                    locWorldTransform.append(destWidth / sourceWidth, 0, 0, destHeight / sourceHeight, 0, 0);
                }
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                locWorldTransform.a = originalA;
                locWorldTransform.b = originalB;
                locWorldTransform.c = originalC;
                locWorldTransform.d = originalD;
                locWorldTransform.tx = originalTx;
                locWorldTransform.ty = originalTy;
                if (meshVertices) {
                    // 计算索引位置与赋值
                    var vertices = this.vertices;
                    // 缓存顶点数组
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        // xy
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        // uv
                        vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        // alpha
                        vertices[iD + 4] = alpha;
                    }
                    for (i = 0; i < meshIndices.length; i++) {
                        this.indicesForMesh[i] = meshIndices[i];
                    }
                }
                else {
                    console.log("meshVertices not exist");
                }
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
            NativeCanvasRenderContext.prototype.createPattern = function (image, repetition) {
                return null;
            };
            /**
             * @private
             * 返回一个 ImageData 对象，用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh。
             * @version Egret 2.4
             * @platform Web,Native
             */
            NativeCanvasRenderContext.prototype.getImageData = function (sx, sy, sw, sh) {
                native.$cmdManager.flush();
                var res;
                if (sx != Math.floor(sx)) {
                    sx = Math.floor(sx);
                    sw++;
                }
                if (sy != Math.floor(sy)) {
                    sy = Math.floor(sy);
                    sh++;
                }
                res = this.$nativeContext.getPixels(sx, sy, sw, sh);
                if (res.pixelData) {
                    res.data = res.pixelData;
                }
                return res;
            };
            /**
             * @private
             * 设置全局shader
             * @param filter filter属性生成的json
             */
            NativeCanvasRenderContext.prototype.setGlobalShader = function (filter) {
                native.$cmdManager.setContext(this.$nativeContext);
                var s1;
                if (filter) {
                    s1 = native.$cmdManager.pushString(filter.$toJson());
                }
                else {
                    s1 = native.$cmdManager.pushString("");
                }
                native.$cmdManager.setGlobalShader(s1);
            };
            return NativeCanvasRenderContext;
        }(egret.HashObject));
        native.NativeCanvasRenderContext = NativeCanvasRenderContext;
        __reflect(NativeCanvasRenderContext.prototype, "egret.native.NativeCanvasRenderContext");
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * @inheritDoc
         */
        var NaSound = (function (_super) {
            __extends(NaSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function NaSound() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(NaSound.prototype, "length", {
                get: function () {
                    throw new Error("sound length not supported");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            NaSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                if (!egret_native.isFileExists(url)) {
                    download();
                }
                else {
                    if (__global.setTimeout) {
                        __global.setTimeout(onLoadComplete, 0);
                    }
                    else {
                        egret.$callAsync(onLoadComplete, self);
                    }
                }
                function download() {
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = onLoadComplete;
                    promise.onErrorFunc = function () {
                        egret.IOErrorEvent.dispatchIOErrorEvent(self);
                    };
                    egret_native.download(url, url, promise);
                }
                function onLoadComplete() {
                    self.loaded = true;
                    self.preload();
                }
            };
            NaSound.prototype.preload = function () {
                var self = this;
                if (self.type == egret.Sound.EFFECT) {
                    var promise = new egret.PromiseObject();
                    promise.onSuccessFunc = function (soundId) {
                        self.dispatchEventWith(egret.Event.COMPLETE);
                    };
                    egret_native.Audio.preloadEffectAsync(self.url, promise);
                }
                else {
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
            };
            /**
             * @inheritDoc
             */
            NaSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
                    egret.$error(1049);
                }
                var channel = new native.NaSoundChannel();
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$type = this.type;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            NaSound.prototype.close = function () {
            };
            return NaSound;
        }(egret.EventDispatcher));
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        NaSound.MUSIC = "music";
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        NaSound.EFFECT = "effect";
        native.NaSound = NaSound;
        __reflect(NaSound.prototype, "egret.native.NaSound", ["egret.Sound"]);
        if (!__global.Audio) {
            egret.Sound = NaSound;
        }
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * @inheritDoc
         */
        var NaSoundChannel = (function (_super) {
            __extends(NaSoundChannel, _super);
            /**
             * @private
             */
            function NaSoundChannel() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                //声音是否已经播放完成
                _this.isStopped = false;
                /**
                 * @private
                 */
                _this._startTime = 0;
                return _this;
            }
            NaSoundChannel.prototype.$play = function () {
                this.isStopped = false;
                if (this.$type == egret.Sound.EFFECT) {
                    this._effectId = egret_native.Audio.playEffect(this.$url, this.$loops != 1);
                }
                else {
                    NaSoundChannel.currentPath = this.$url;
                    egret_native.Audio.playBackgroundMusic(this.$url, this.$loops != 1);
                }
                this._startTime = Date.now();
            };
            /**
             * @private
             * @inheritDoc
             */
            NaSoundChannel.prototype.stop = function () {
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                if (this.$type == egret.Sound.EFFECT) {
                    if (this._effectId) {
                        egret_native.Audio.stopEffect(this._effectId);
                        this._effectId = null;
                    }
                }
                else {
                    if (this.$url == NaSoundChannel.currentPath) {
                        egret_native.Audio.stopBackgroundMusic(false);
                    }
                }
            };
            Object.defineProperty(NaSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (this.$type == egret.Sound.EFFECT) {
                        return egret_native.Audio.getEffectsVolume();
                    }
                    else {
                        return egret_native.Audio.getBackgroundMusicVolume();
                    }
                    return 1;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.$type == egret.Sound.EFFECT) {
                        egret_native.Audio.setEffectsVolume(value);
                    }
                    else {
                        egret_native.Audio.setBackgroundMusicVolume(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NaSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return (Date.now() - this._startTime) / 1000;
                },
                enumerable: true,
                configurable: true
            });
            return NaSoundChannel;
        }(egret.EventDispatcher));
        native.NaSoundChannel = NaSoundChannel;
        __reflect(NaSoundChannel.prototype, "egret.native.NaSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * @inheritDoc
         */
        var NativeVideo = (function (_super) {
            __extends(NativeVideo, _super);
            /**
             * @private
             * @inheritDoc
             */
            function NativeVideo(url, cache) {
                if (cache === void 0) { cache = true; }
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                /**
                 * @private
                 */
                _this.loading = false;
                /**
                 * @private
                 * */
                _this.loop = false;
                /**
                 * @private
                 * */
                _this.isPlayed = false;
                /**
                 * @private
                 * */
                _this.firstPlay = true;
                /**
                 * @inheritDoc
                 */
                _this.src = "";
                _this._fullscreen = true;
                _this._bitmapData = null;
                /**
                 * @inheritDoc
                 */
                _this.paused = false;
                /**
                 * @private
                 */
                _this.isAddToStage = false;
                /**
                 * @private
                 */
                _this.heightSet = 0;
                /**
                 * @private
                 */
                _this.widthSet = 0;
                _this.$renderNode = new egret.sys.BitmapNode();
                _this.cache = cache;
                if (!__global.Video) {
                    egret.$error(1044);
                }
                if (url) {
                    _this.load(url, cache);
                }
                return _this;
            }
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.load = function (url, cache) {
                if (cache === void 0) { cache = true; }
                if (true && !url) {
                    egret.$error(3002);
                    return;
                }
                if (this.loading) {
                    return;
                }
                if (url.indexOf('/') == 0) {
                    url = url.slice(1, url.length);
                }
                this.src = url;
                this.loading = true;
                this.loaded = false;
                if (cache && !egret_native.isFileExists(url)) {
                    var self_1 = this;
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = function () {
                        self_1.loadEnd();
                    };
                    promise.onErrorFunc = function () {
                        egret.$warn(1048);
                        self_1.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    };
                    egret_native.download(url, url, promise);
                }
                else {
                    this.loadEnd();
                }
            };
            /**
             * @private
             * */
            NativeVideo.prototype.loadEnd = function () {
                var video = new __global.Video(this.src);
                video['setVideoRect'](0, 0, 1, 1);
                video['setKeepRatio'](false);
                video.addEventListener("canplaythrough", onCanPlay);
                video.addEventListener("error", onVideoError);
                video.addEventListener("playing", onPlaying);
                video.load();
                var self = this;
                function onCanPlay() {
                    video['setVideoRect'](0, 0, 1, 1);
                    video.play();
                }
                function onPlaying() {
                    video['setVideoRect'](0, 0, 1, 1);
                    __global.setTimeout(function () {
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
                function onVideoError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    video.removeEventListener("canplaythrough", onCanPlay);
                    video.removeEventListener("error", onVideoError);
                    video.removeEventListener("playing", onPlaying);
                }
            };
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.play = function (startTime, loop) {
                var _this = this;
                if (loop === void 0) { loop = false; }
                this.loop = loop;
                if (!this.loaded) {
                    this.load(this.src);
                    this.once(egret.Event.COMPLETE, function (e) { return _this.play(startTime, loop); }, this);
                    return;
                }
                var haveStartTime = false;
                if (startTime != undefined && startTime != this.originVideo.currentTime) {
                    this.originVideo.currentTime = startTime || 0;
                    haveStartTime = true;
                }
                this.startPlay(haveStartTime);
            };
            /**
             * @private
             * */
            NativeVideo.prototype.startPlay = function (haveStartTime) {
                if (haveStartTime === void 0) { haveStartTime = false; }
                if (!this.isAddToStage || !this.loaded) {
                    return;
                }
                this.firstPlay = false;
                this.setVideoSize();
                this.isPlayed = true;
                if (!haveStartTime && this.paused && this.position != 0) {
                    this.originVideo['resume']();
                }
                else {
                    this.originVideo.play();
                }
                egret.startTick(this.markDirty, this);
            };
            /**
             * @private
             * */
            NativeVideo.prototype.stopPlay = function () {
                egret.stopTick(this.markDirty, this);
                if (this.isPlayed) {
                    this.isPlayed = false;
                    this.originVideo.pause();
                }
            };
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.close = function () {
                if (this.originVideo) {
                    this.originVideo['destroy']();
                }
                this.loaded = false;
                this.loading = false;
                this.originVideo = null;
                this.loop = false;
                this.src = null;
            };
            Object.defineProperty(NativeVideo.prototype, "poster", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this.posterUrl;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    var _this = this;
                    this.posterUrl = value;
                    var loader = new native.NativeImageLoader();
                    loader.load(value);
                    loader.addEventListener(egret.Event.COMPLETE, function () {
                        _this.posterData = loader.data;
                        _this.markDirty();
                        _this.$invalidateContentBounds();
                    }, this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeVideo.prototype, "fullscreen", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (this.originVideo) {
                        return this.originVideo['fullScreen'];
                    }
                    return this._fullscreen;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    this._fullscreen = value;
                    if (this.originVideo) {
                        this.originVideo['fullScreen'] = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeVideo.prototype, "volume", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.loaded)
                        return 0;
                    return this.originVideo.volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (!this.loaded)
                        return;
                    this.originVideo.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeVideo.prototype, "position", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this.originVideo.currentTime;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.loaded) {
                        this.originVideo.currentTime = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.pause = function () {
                this.originVideo.pause();
            };
            Object.defineProperty(NativeVideo.prototype, "bitmapData", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeVideo.prototype, "length", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (this.loaded) {
                        return this.originVideo.duration;
                    }
                    throw new Error("Video not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.$onAddToStage = function (stage, nestLevel) {
                this.isAddToStage = true;
                if (this.originVideo) {
                    this.originVideo["setVideoVisible"](true);
                }
                this.$invalidate();
                this.$invalidateContentBounds();
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            };
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.$onRemoveFromStage = function () {
                this.isAddToStage = false;
                if (this.originVideo) {
                    this.stopPlay();
                    this.originVideo["setVideoVisible"](false);
                }
                _super.prototype.$onRemoveFromStage.call(this);
            };
            /**
             * @private
             */
            NativeVideo.prototype.getPlayWidth = function () {
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
            };
            /**
             * @private
             */
            NativeVideo.prototype.getPlayHeight = function () {
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
            };
            /**
             * @private
             */
            NativeVideo.prototype.$setHeight = function (value) {
                this.heightSet = +value || 0;
                this.setVideoSize();
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setHeight.call(this, value);
            };
            /**
             * @private
             */
            NativeVideo.prototype.$setWidth = function (value) {
                this.widthSet = +value || 0;
                this.setVideoSize();
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setWidth.call(this, value);
            };
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.$setX = function (value) {
                var result = _super.prototype.$setX.call(this, value);
                this.setVideoSize();
                return result;
            };
            /**
             * @inheritDoc
             */
            NativeVideo.prototype.$setY = function (value) {
                var result = _super.prototype.$setY.call(this, value);
                this.setVideoSize();
                return result;
            };
            /**
             * @private
             */
            NativeVideo.prototype.setVideoSize = function () {
                var video = this.originVideo;
                if (video && !this.fullscreen) {
                    if (!this.firstPlay) {
                        video['setVideoRect'](this.x, this.y, this.widthSet, this.heightSet);
                    }
                    else {
                        video['setVideoRect'](this.x, this.y, 0, 0);
                    }
                }
            };
            /**
             * @private
             */
            NativeVideo.prototype.$measureContentBounds = function (bounds) {
                var posterData = this.posterData;
                if (posterData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else {
                    bounds.setEmpty();
                }
            };
            /**
             * @private
             */
            NativeVideo.prototype.$render = function () {
                var node = this.$renderNode;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if (width <= 0 || height <= 0) {
                    return;
                }
                if (!this.isPlayed && posterData) {
                    node.image = posterData;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed) {
                    this.setVideoSize();
                }
            };
            NativeVideo.prototype.markDirty = function () {
                this.$invalidate();
                return true;
            };
            return NativeVideo;
        }(egret.DisplayObject));
        native.NativeVideo = NativeVideo;
        __reflect(NativeVideo.prototype, "egret.native.NativeVideo", ["egret.Video", "egret.DisplayObject"]);
        if (__global.Video) {
            egret.Video = NativeVideo;
        }
        else {
            egret.$warn(1044);
        }
    })(native = egret.native || (egret.native = {}));
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
                if (value === undefined) {
                    value = "undefined";
                }
                else if (value === null) {
                    value = "null";
                }
                else {
                    value = value.toString();
                }
                localStorageData[key] = value;
                try {
                    save();
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
                try {
                    localStorageData = JSON.parse(str);
                }
                catch (e) {
                    localStorageData = {};
                }
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
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeHideHandler = (function (_super) {
            __extends(NativeHideHandler, _super);
            function NativeHideHandler(stage) {
                var _this = _super.call(this) || this;
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
                return _this;
            }
            return NativeHideHandler;
        }(egret.HashObject));
        native.NativeHideHandler = NativeHideHandler;
        __reflect(NativeHideHandler.prototype, "egret.native.NativeHideHandler");
    })(native = egret.native || (egret.native = {}));
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
    var NativeResourceLoader = (function (_super) {
        __extends(NativeResourceLoader, _super);
        function NativeResourceLoader() {
            var _this = _super.apply(this, arguments) || this;
            /**
             * @private
             */
            _this._downCount = 0;
            /**
             * @private
             */
            _this._path = null;
            /**
             * @private
             */
            _this._bytesTotal = 0;
            return _this;
        }
        /**
         *
         * @param path
         * @param bytesTotal
         * @version Egret 2.4
         * @platform Web,Native
         */
        NativeResourceLoader.prototype.load = function (path, bytesTotal) {
            this._downCount = 0;
            this._path = path;
            this._bytesTotal = bytesTotal;
            this.reload();
        };
        /**
         * @private
         *
         */
        NativeResourceLoader.prototype.reload = function () {
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
        NativeResourceLoader.prototype.downloadingProgress = function (bytesLoaded) {
            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, bytesLoaded, this._bytesTotal);
        };
        /**
         * @private
         *
         */
        NativeResourceLoader.prototype.downloadFileError = function () {
            this.dispatchEvent(new egret.Event(egret.IOErrorEvent.IO_ERROR));
        };
        /**
         * @private
         *
         */
        NativeResourceLoader.prototype.loadOver = function () {
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        };
        return NativeResourceLoader;
    }(egret.EventDispatcher));
    egret.NativeResourceLoader = NativeResourceLoader;
    __reflect(NativeResourceLoader.prototype, "egret.NativeResourceLoader");
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
                var _this = _super.call(this) || this;
                _this.$touch = new egret.sys.TouchHandler(stage);
                var self = _this;
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
                return _this;
            }
            NativeTouchHandler.prototype.$executeTouchCallback = function (num, ids, xs_array, ys_array, callback) {
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
            NativeTouchHandler.prototype.$updateMaxTouches = function () {
                this.$touch.$initMaxTouches();
            };
            return NativeTouchHandler;
        }(egret.HashObject));
        native.NativeTouchHandler = NativeTouchHandler;
        __reflect(NativeTouchHandler.prototype, "egret.native.NativeTouchHandler");
    })(native = egret.native || (egret.native = {}));
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this._url = "";
                _this._method = "";
                /**
                 * @private
                 */
                _this.urlData = {};
                _this.responseHeader = "";
                return _this;
            }
            Object.defineProperty(NativeHttpRequest.prototype, "response", {
                /**
                 * @private
                 * 本次请求返回的数据，数据类型根据responseType设置的值确定。
                 */
                get: function () {
                    return this._response;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeHttpRequest.prototype, "responseType", {
                /**
                 * @private
                 * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
                 */
                get: function () {
                    return this._responseType;
                },
                set: function (value) {
                    this._responseType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeHttpRequest.prototype, "withCredentials", {
                /**
                 * @private
                 * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
                 */
                get: function () {
                    return this._withCredentials;
                },
                set: function (value) {
                    this._withCredentials = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
             * @param url 该请求所要访问的URL该请求所要访问的URL
             * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
             */
            NativeHttpRequest.prototype.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
            };
            /**
             * @private
             * 发送请求.
             * @param data 需要发送的数据
             */
            NativeHttpRequest.prototype.send = function (data) {
                var self = this;
                if (self.isNetUrl(self._url)) {
                    self.urlData.type = self._method;
                    //写入POST数据
                    if (self._method == egret.HttpMethod.POST && data) {
                        if (data instanceof ArrayBuffer) {
                            self.urlData.data = data;
                        }
                        else {
                            self.urlData.data = data.toString();
                        }
                    }
                    else {
                        delete self.urlData["data"];
                    }
                    if (self._responseType == egret.HttpResponseType.ARRAY_BUFFER) {
                        self.urlData.binary = true;
                    }
                    else {
                        self.urlData.header = false;
                    }
                    //写入header信息
                    if (this.headerObj) {
                        self.urlData.header = JSON.stringify(this.headerObj);
                    }
                    else {
                        delete self.urlData.header;
                    }
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = function (getted_str) {
                        self._response = getted_str;
                        egret.$callAsync(egret.Event.dispatchEvent, egret.Event, self, egret.Event.COMPLETE);
                    };
                    promise.onErrorFunc = function (error_code) {
                        egret.$warn(1019, error_code);
                        egret.Event.dispatchEvent(self, egret.IOErrorEvent.IO_ERROR);
                    };
                    promise.onResponseHeaderFunc = this.onResponseHeader;
                    promise.onResponseHeaderThisObject = this;
                    egret_native.requireHttp(self._url, self.urlData, promise);
                }
                else if (!egret_native.isFileExists(self._url)) {
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
                    promise.onErrorFunc = function () {
                        egret.Event.dispatchEvent(self, egret.IOErrorEvent.IO_ERROR);
                    };
                    if (self._responseType == egret.HttpResponseType.ARRAY_BUFFER) {
                        egret_native.readFileAsync(self._url, promise, "ArrayBuffer");
                    }
                    else {
                        egret_native.readFileAsync(self._url, promise);
                    }
                }
                function download() {
                    var promise = egret.PromiseObject.create();
                    promise.onSuccessFunc = readFileAsync;
                    promise.onErrorFunc = function () {
                        egret.Event.dispatchEvent(self, egret.IOErrorEvent.IO_ERROR);
                    };
                    promise.onResponseHeaderFunc = this.onResponseHeader;
                    promise.onResponseHeaderThisObject = this;
                    egret_native.download(self._url, self._url, promise);
                }
            };
            /**
             * 是否是网络地址
             * @param url
             * @returns {boolean}
             */
            NativeHttpRequest.prototype.isNetUrl = function (url) {
                return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
            };
            /**
             * @private
             * 如果请求已经被发送,则立刻中止请求.
             */
            NativeHttpRequest.prototype.abort = function () {
            };
            NativeHttpRequest.prototype.onResponseHeader = function (headers) {
                this.responseHeader = "";
                var obj = JSON.parse(headers);
                for (var key in obj) {
                    this.responseHeader += key + ": " + obj[key] + "\r\n";
                }
            };
            /**
             * @private
             * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
             */
            NativeHttpRequest.prototype.getAllResponseHeaders = function () {
                return this.responseHeader;
            };
            /**
             * @private
             * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
             * @param header 将要被赋值的请求头名称.
             * @param value 给指定的请求头赋的值.
             */
            NativeHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (!this.headerObj) {
                    this.headerObj = {};
                }
                this.headerObj[header] = value;
            };
            /**
             * @private
             * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
             * @param header 要返回的响应头名称
             */
            NativeHttpRequest.prototype.getResponseHeader = function (header) {
                return "";
            };
            return NativeHttpRequest;
        }(egret.EventDispatcher));
        native.NativeHttpRequest = NativeHttpRequest;
        __reflect(NativeHttpRequest.prototype, "egret.native.NativeHttpRequest", ["egret.HttpRequest"]);
        egret.HttpRequest = NativeHttpRequest;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
        /**
         * @private
         * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
         */
        var NativeImageLoader = (function (_super) {
            __extends(NativeImageLoader, _super);
            function NativeImageLoader() {
                var _this = _super.apply(this, arguments) || this;
                /**
                 * @private
                 * 使用 load() 方法加载成功的 BitmapData 图像数据。
                 */
                _this.data = null;
                /**
                 * @private
                 * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
                 * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
                 */
                _this._crossOrigin = null;
                return _this;
            }
            Object.defineProperty(NativeImageLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             *
             * @param url
             * @param callback
             */
            NativeImageLoader.prototype.load = function (url) {
                this.check(url);
            };
            NativeImageLoader.prototype.check = function (url) {
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
            NativeImageLoader.prototype.download = function (url) {
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
            NativeImageLoader.prototype.loadTexture = function (url) {
                var self = this;
                var promise = new egret.PromiseObject();
                promise.onSuccessFunc = function (bitmapData) {
                    self.data = new egret.BitmapData(bitmapData);
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
            NativeImageLoader.prototype.isNetUrl = function (url) {
                return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
            };
            return NativeImageLoader;
        }(egret.EventDispatcher));
        /**
         * @private
         * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
         */
        NativeImageLoader.crossOrigin = null;
        native.NativeImageLoader = NativeImageLoader;
        __reflect(NativeImageLoader.prototype, "egret.native.NativeImageLoader", ["egret.ImageLoader"]);
        egret.ImageLoader = NativeImageLoader;
    })(native = egret.native || (egret.native = {}));
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
    var native;
    (function (native) {
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.textValue = "";
                /**
                 * @private
                 */
                _this.colorValue = 0xffffff;
                /**
                 * @private
                 */
                _this.isFinishDown = false;
                _this.textValue = "";
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            NativeStageText.prototype.$getText = function () {
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
            NativeStageText.prototype.$setText = function (value) {
                this.textValue = value;
                return true;
            };
            NativeStageText.prototype.$setColor = function (value) {
                this.colorValue = value;
                return true;
            };
            /**
             * @private
             *
             */
            NativeStageText.prototype.$onBlur = function () {
            };
            //全屏键盘
            NativeStageText.prototype.showScreenKeyboard = function () {
                var self = this;
                self.dispatchEvent(new egret.Event("focus"));
                egret.Event.dispatchEvent(self, "focus", false, { "showing": true });
                egret_native.EGT_TextInput = function (appendText) {
                    if (self.$textfield.multiline) {
                        self.textValue = appendText;
                        self.dispatchEvent(new egret.Event("updateText"));
                        if (self.isFinishDown) {
                            self.isFinishDown = false;
                            self.dispatchEvent(new egret.Event("blur"));
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
                };
            };
            /**
             * @private
             *
             */
            NativeStageText.prototype.$show = function () {
                var self = this;
                var textfield = this.$textfield;
                var values = textfield.$TextField;
                egret_native.TextInputOp.setKeybordOpen(false);
                egret_native.EGT_getTextEditerContentText = function () {
                    return self.$getText();
                };
                egret_native.EGT_keyboardDidShow = function () {
                    //if (egret_native.TextInputOp.isFullScreenKeyBoard()) {//横屏
                    //}
                    self.showScreenKeyboard();
                    egret_native.EGT_keyboardDidShow = function () {
                    };
                    if (egret_native.TextInputOp.updateConfig) {
                        egret_native.TextInputOp.updateConfig(JSON.stringify({
                            "font_color": values[2 /* textColor */]
                        }));
                    }
                };
                egret_native.EGT_keyboardDidHide = function () {
                };
                egret_native.EGT_deleteBackward = function () {
                };
                var inputType = values[37 /* inputType */];
                var inputMode = values[30 /* multiline */] ? 0 : 6;
                var inputFlag = -1; //textfield.displayAsPassword ? 0 : -1;
                if (inputType == egret.TextFieldInputType.PASSWORD) {
                    inputFlag = 0;
                }
                else if (inputType == egret.TextFieldInputType.TEL) {
                    inputMode = 3;
                }
                var returnType = 1;
                var maxLength = values[21 /* maxChars */] <= 0 ? -1 : values[21 /* maxChars */];
                var node = textfield.$getRenderNode();
                var point = this.$textfield.localToGlobal(0, 0);
                egret_native.TextInputOp.setKeybordOpen(true, JSON.stringify({
                    "inputMode": inputMode,
                    "inputFlag": inputFlag,
                    "returnType": returnType,
                    "maxLength": maxLength,
                    "x": point.x,
                    "y": point.y,
                    "width": textfield.width,
                    "height": textfield.height,
                    "font_size": values[0 /* fontSize */],
                    "font_color": values[2 /* textColor */],
                    "textAlign": values[9 /* textAlign */],
                    "verticalAlign": values[10 /* verticalAlign */]
                }));
            };
            /**
             * @private
             *
             */
            NativeStageText.prototype.$hide = function () {
                egret_native.TextInputOp.setKeybordOpen(false);
                this.dispatchEvent(new egret.Event("blur"));
            };
            NativeStageText.prototype.$resetStageText = function () {
            };
            NativeStageText.prototype.$addToStage = function () {
            };
            NativeStageText.prototype.$removeFromStage = function () {
            };
            NativeStageText.prototype.$setTextField = function (value) {
                this.$textfield = value;
                return true;
            };
            return NativeStageText;
        }(egret.EventDispatcher));
        native.NativeStageText = NativeStageText;
        __reflect(NativeStageText.prototype, "egret.native.NativeStageText", ["egret.StageText"]);
        egret.StageText = NativeStageText;
    })(native = egret.native || (egret.native = {}));
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
    var web;
    (function (web) {
        /**
         * @private
         * XML节点基类
         */
        var XMLNode = (function () {
            /**
             * @private
             */
            function XMLNode(nodeType, parent) {
                this.nodeType = nodeType;
                this.parent = parent;
            }
            return XMLNode;
        }());
        web.XMLNode = XMLNode;
        __reflect(XMLNode.prototype, "egret.web.XMLNode");
        /**
         * @private
         * XML节点对象
         */
        var XML = (function (_super) {
            __extends(XML, _super);
            /**
             * @private
             */
            function XML(localName, parent, prefix, namespace, name) {
                var _this = _super.call(this, 1, parent) || this;
                /**
                 * @private
                 * 当前节点上的属性列表
                 */
                _this.attributes = {};
                /**
                 * @private
                 * 当前节点的子节点列表
                 */
                _this.children = [];
                _this.localName = localName;
                _this.prefix = prefix;
                _this.namespace = namespace;
                _this.name = name;
                return _this;
            }
            return XML;
        }(XMLNode));
        web.XML = XML;
        __reflect(XML.prototype, "egret.web.XML");
        /**
         * @private
         * XML文本节点
         */
        var XMLText = (function (_super) {
            __extends(XMLText, _super);
            /**
             * @private
             */
            function XMLText(text, parent) {
                var _this = _super.call(this, 3, parent) || this;
                _this.text = text;
                return _this;
            }
            return XMLText;
        }(XMLNode));
        web.XMLText = XMLText;
        __reflect(XMLText.prototype, "egret.web.XMLText");
        /**
         * @private
         * 解析字符串为XML对象
         * @param text 要解析的字符串
         */
        function parse(text) {
            var xmlDocStr = egret_native.xmlStr2JsonStr(text);
            //替换换行符
            xmlDocStr = xmlDocStr.replace(/\n/g, "\\n");
            var xmlDoc = JSON.parse(xmlDocStr);
            return parseNode(xmlDoc, null);
        }
        /**
         * @private
         * 解析一个节点
         */
        function parseNode(node, parent) {
            if (node.localName == "parsererror") {
                throw new Error(node.textContent);
            }
            var xml = new XML(node.localName, parent, node.prefix, node.namespace, node.name);
            var nodeAttributes = node.attributes;
            var attributes = xml.attributes;
            for (var key in nodeAttributes) {
                attributes[key] = xml["$" + key] = nodeAttributes[key];
            }
            var childNodes = node.children;
            var length = childNodes.length;
            var children = xml.children;
            for (var i = 0; i < length; i++) {
                var childNode = childNodes[i];
                var nodeType = childNode.nodeType;
                var childXML = null;
                if (nodeType == 1) {
                    childXML = parseNode(childNode, xml);
                }
                else if (nodeType == 3) {
                    var text = childNode.text.trim();
                    if (text) {
                        childXML = new XMLText(text, xml);
                    }
                }
                if (childXML) {
                    children.push(childXML);
                }
            }
            return xml;
        }
        egret.XML = { parse: parse };
    })(web = egret.web || (egret.web = {}));
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
    var native;
    (function (native) {
        if (true) {
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
