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
    export class NativeRenderContext extends HashObject implements egret.sys.RenderContext {

        private $matrix:Matrix = new Matrix();

        public $nativeContext:any = !egret_native.Canvas?egret_native.Graphics:null;
        public $nativeGraphicsContext:any = !egret_native.Canvas?egret_native.rastergl:null;

        /**
         * @private
         * 与绘图上线文关联的画布实例
         * @version Egret 2.4
         * @platform Web,Native
         */
        surface:NativeSurface;
        private $globalCompositeOperation:string = "source-over";

        /**
         * @private
         * 设置新图像如何绘制到已有的图像上的规制
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get globalCompositeOperation():string {
            return this.$globalCompositeOperation;
        }

        public set globalCompositeOperation(value:string) {
            this.$globalCompositeOperation = value;
            var arr = blendModesForGL[value];
            if (arr) {
                if(!egret_native.Canvas) {
                    this.checkSurface();
                }
                this.$nativeContext.setBlendArg(arr[0], arr[1]);
            }
        }

        private $globalAlpha:number = 1;

        /**
         * @private
         * 设置接下来绘图填充的整体透明度
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get globalAlpha():number {
            return this.$globalAlpha;
        }

        public set globalAlpha(value:number) {
            this.$globalAlpha = value;
            if(!egret_native.Canvas) {
                this.checkSurface();
            }
            this.$nativeContext.setGlobalAlpha(value);
        }

        /**
         * @private
         * 用于表示剪切斜接的极限值的数字。
         * @default 10
         * @version Egret 2.4
         * @platform Web,Native
         */
        public miterLimit:number;
        /**
         * @private
         * 指定如何绘制每一条线段末端的属性。有3个可能的值，分别是：<br/>
         * <ul>
         * <li>"butt": 线段末端以方形结束。</li>
         * <li>"round": 线段末端以圆形结束。</li>
         * <li>"square": 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。</li>
         * </ul>
         * @default "butt"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineCap:string;
        /**
         * @private
         * 指定用于拐角的连接外观的类型,有3个可能的值，分别是：<br/>
         * <ul>
         * <li>"round": 圆角连接</li>
         * <li>"bevel": 斜角连接。</li>
         * <li>"miter": 尖角连接。当使用尖角模式时，还可以同时使用 miterLimit 参数限制尖角的长度。</li>
         * </ul>
         * @default "miter"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineJoin:string;

        private $lineWidth:number = 0;

        /**
         * @private
         * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get lineWidth():number {
            return this.$lineWidth;
        }

        public set lineWidth(value:number) {
            //console.log("set lineWidth" + value);
            this.$lineWidth = value;
            this.$nativeContext.lineWidth = value;

            if(egret_native.Canvas) {
                this.$nativeContext.lineWidth = value;
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.lineWidth = value;
            }

        }

        private $strokeStyle:any = "#000000";

        /**
         * @private
         * 设置要在图形边线填充的颜色或样式
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get strokeStyle():any {
            return this.$strokeStyle;
        }

        public set strokeStyle(value:any) {
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
            if(egret_native.Canvas) {
                this.$nativeContext.strokeStyle = value;
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.strokeStyle = value;
            }
        }

        private $fillStyle:any = "#000000";

        /**
         * @private
         * 设置要在图形内部填充的颜色或样式
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get fillStyle():any {
            return this.$fillStyle;
        }

        public set fillStyle(value:any) {
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
            if(egret_native.Canvas) {
                this.$nativeContext.fillStyle = value;
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.fillStyle = value;
            }

        }

        private $fillColorStr(s:string):string {
            if (s.length < 2) {
                s = "0" + s;
            }
            return s;
        }

        private $parseRGBA(str:string):string {
            var index:number = str.indexOf("(");
            str = str.slice(index + 1, str.length - 1);
            var arr:Array<string> = str.split(",");
            var a:string = parseInt(<any>(parseFloat(arr[3]) * 255)).toString(16);
            var r:string = parseInt(arr[0]).toString(16);
            var g:string = parseInt(arr[1]).toString(16);
            var b:string = parseInt(arr[2]).toString(16);
            str = "#" + this.$fillColorStr(a) + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
            return str;
        }

        private $parseRGB(str:string):string {
            var index:number = str.indexOf("(");
            str = str.slice(index + 1, str.length - 1);
            var arr:Array<string> = str.split(",");
            var r:string = parseInt(arr[0]).toString(16);
            var g:string = parseInt(arr[1]).toString(16);
            var b:string = parseInt(arr[2]).toString(16);
            str = "#" + this.$fillColorStr(r) + this.$fillColorStr(g) + this.$fillColorStr(b);
            return str;
        }

        /**
         * @private
         * 控制在缩放时是否对位图进行平滑处理。
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        public imageSmoothingEnabled:boolean;
        /**
         * @private
         * 文本的对齐方式的属性,有5个可能的值，分别是：<br/>
         * <ul>
         * <li>"left" 文本左对齐。</li>
         * <li>"right" 文本右对齐。</li>
         * <li>"center" 文本居中对齐。</li>
         * <li>"start" 文本对齐界线开始的地方 （对于从左向右阅读的语言使用左对齐，对从右向左的阅读的语言使用右对齐）。</li>
         * <li>"end" 文本对齐界线结束的地方 （对于从左向右阅读的语言使用右对齐，对从右向左的阅读的语言使用左对齐）。</li>
         * </ul>
         * @default "start"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public textAlign:string;
        /**
         * @private
         * 决定文字垂直方向的对齐方式。有6个可能的值，分别是：<br/>
         * <ul>
         * <li>"top" 文本基线在文本块的顶部。</li>
         * <li>"hanging" 文本基线是悬挂基线。</li>
         * <li>"middle" 文本基线在文本块的中间。</li>
         * <li>"alphabetic" 文本基线是标准的字母基线。</li>
         * <li>"ideographic" 文字基线是表意字基线；如果字符本身超出了alphabetic 基线，那么ideograhpic基线位置在字符本身的底部。</li>
         * <li>"bottom" 文本基线在文本块的底部。 与 ideographic 基线的区别在于 ideographic 基线不需要考虑下行字母。</li>
         * </ul>
         * @default "alphabetic"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public textBaseline:string;

        private $font:string = "10px sans-serif";
        private $fontSize:number = 10;

        /**
         * @private
         * 当前的字体样式
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get font():string {
            return this.$font;
        }

        public set font(value:string) {
            this.$font = value;
            var arr:Array<string> = value.split(" ");
            var length:number = arr.length;
            for (var i:number = 0; i < length; i++) {
                var txt:string = arr[i];
                if (txt.indexOf("px") != -1) {
                    this.$fontSize = parseInt(txt.replace("px", ""));
                    //console.log("set font" + this.$lineWidth);
                    return;
                }
            }
        }

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
        public arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean):void {
            if(egret_native.Canvas) {
                this.$nativeContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            }

        }

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
        public quadraticCurveTo(cpx:number, cpy:number, x:number, y:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.quadraticCurveTo(cpx, cpy, x, y);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.quadraticCurveTo(cpx, cpy, x, y);
            }

        }

        /**
         * @private
         * 使用直线连接子路径的终点到x，y坐标。
         * @param x 直线终点的 x 轴坐标。
         * @param y 直线终点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineTo(x:number, y:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.lineTo(x, y);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.lineTo(x, y);
            }

        }

        /**
         * @private
         * 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环绕规则。
         * @param fillRule 一种算法，决定点是在路径内还是在路径外。允许的值：
         * "nonzero": 非零环绕规则， 默认的规则。
         * "evenodd": 奇偶环绕规则。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public fill(fillRule?:string):void {
            if(egret_native.Canvas) {
                this.$nativeContext.fill(fillRule);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.fill(fillRule);
            }

        }

        /**
         * @private
         * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public closePath():void {
            if(egret_native.Canvas) {
                this.$nativeContext.closePath();
                if(this.clipRectArray) {
                    this.$clipRectArray = this.clipRectArray;
                    this.clipRectArray = null;
                }
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.closePath();
            }


        }

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
        public rect(x:number, y:number, w:number, h:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.rect(x, y, w, h);
                this.$clipRectArray.push({x: x, y: y, w: w, h: h});
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.rect(x, y, w, h);
                this.$clipRect.setTo(x, y, w, h);
            }

        }

        /**
         * @private
         * 将一个新的子路径的起始点移动到(x，y)坐标
         * @param x 点的 x 轴
         * @param y 点的 y 轴
         * @version Egret 2.4
         * @platform Web,Native
         */
        public moveTo(x:number, y:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.moveTo(x, y);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.moveTo(x, y);
            }
        }

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
        public fillRect(x:number, y:number, w:number, h:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.fillRect(x, y, w, h);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.fillRect(x, y, w, h);
            }
        }

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
        public bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            }
        }

        /**
         * @private
         * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stroke():void {
            if(egret_native.Canvas) {
                this.$nativeContext.stroke();
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.stroke();
            }

        }

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
        public strokeRect(x:number, y:number, w:number, h:number):void {
            //console.log("strokeRect");
            if(egret_native.Canvas) {
                this.$nativeContext.strokeRect(x, y, w, h);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.strokeRect(x, y, w, h);
            }
        }

        private clipRectArray = null;
        /**
         * @private
         * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public beginPath():void {
            if(egret_native.Canvas) {
                this.$nativeContext.beginPath();
                this.clipRectArray = this.$clipRectArray.concat();
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.beginPath();
            }
        }

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
        public arcTo(x1:number, y1:number, x2:number, y2:number, radius:number):void {
            if(egret_native.Canvas) {
                this.$nativeContext.arcTo(x1, y1, x2, y2, radius);
            } else {
                this.checkSurface();
                this.$nativeGraphicsContext.arcTo(x1, y1, x2, y2, radius);
            }
        }

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
        public transform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.$matrix.append(a, b, c, d, tx, ty);
            this.setTransformToNative();
        }

        /**
         * @private
         * 通过在网格中移动 surface 和 surface 原点 x 水平方向、原点 y 垂直方向，添加平移变换
         * @param x 水平移动。
         * @param y 垂直移动。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public translate(x:number, y:number):void {
            this.$matrix.translate(x, y);
            this.setTransformToNative();
        }

        /**
         * @private
         * 根据 x 水平方向和 y 垂直方向，为 surface 单位添加缩放变换。
         * @param x 水平方向的缩放因子。
         * @param y 垂直方向的缩放因子。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public scale(x:number, y:number):void {
            this.$matrix.scale(x, y);
            this.setTransformToNative();
        }

        /**
         * @private
         * 在变换矩阵中增加旋转，角度变量表示一个顺时针旋转角度并且用弧度表示。
         * @param angle 顺时针旋转的弧度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public rotate(angle:number):void {
            this.$matrix.rotate(angle);
            this.setTransformToNative();
        }

        /**
         * @private
         * 恢复到最近的绘制样式状态，此状态是通过 save() 保存到”状态栈“中最新的元素。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public restore():void {
            //console.log("restore");
            if(egret_native.Canvas) {
                if (this.$saveList.length) {
                    var data = this.$saveList.pop();
                    for (var key in data) {
                        this[key] = data[key];
                    }
                    this.setTransformToNative();
                    this.$nativeContext.restore();
                    this.clipRectArray = null;
                }
            } else {
                if (this.$saveCount > 0) {
                    if (this.$saveList.length) {
                        var data = this.$saveList.pop();
                        for (var key in data) {
                            this[key] = data[key];
                        }
                        this.setTransformToNative();
                    }
                    var index:number = this.$clipList.indexOf(this.$saveCount);
                    if (index != -1) {
                        var length:number = this.$clipList.length;
                        this.$clipList.splice(index, length - index);
                        for (; index < length; index++) {
                            this.checkSurface();
                            this.$nativeContext.popClip();
                        }
                    }
                    this.$saveCount--;
                }
            }

        }

        private $saveList:Array<any> = [];

        /**
         * @private
         * 使用栈保存当前的绘画样式状态，你可以使用 restore() 恢复任何改变。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public save():void {
            //console.log("save");
            var transformMatrix = new Matrix();
            transformMatrix.copyFrom(this.$matrix);
            if(egret_native.Canvas) {
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
            } else {
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
            }

        }



        private $clipRectArray:Array<any> = [];

        private $clipRect:Rectangle = new Rectangle();
        private $saveCount:number = 0;
        private $clipList:Array<number> = [];


        /**
         * @private
         * 从当前路径创建一个剪切路径。在 clip() 调用之后，绘制的所有信息只会出现在剪切路径内部。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clip(fillRule?:string):void {
            if(egret_native.Canvas) {
                if (this.$clipRectArray.length > 0) {
                    var arr = [];
                    for (var i:number = 0; i < this.$clipRectArray.length; i++) {
                        var clipRect = this.$clipRectArray[i];
                        arr.push(clipRect.x);
                        arr.push(clipRect.y);
                        arr.push(clipRect.w);
                        arr.push(clipRect.h);
                    }
                    this.$nativeContext.pushRectStencils(arr);
                    this.$clipRectArray.length = 0;
                }
            } else {
                if (this.$clipRect.width > 0 && this.$clipRect.height > 0) {
                    //console.log("push clip" + this.$clipRect.x);
                    this.checkSurface();
                    this.$nativeContext.pushClip(this.$clipRect.x, this.$clipRect.y, this.$clipRect.width, this.$clipRect.height);
                    this.$clipRect.setEmpty();
                    this.$clipList.push(this.$saveCount);
                }
            }
        }

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
        public clearRect(x:number, y:number, width:number, height:number):void {
            if(egret_native.Canvas) {
                //console.log("clearRect");
                this.$nativeContext.clearRect(x, y, width, height);
            } else {
                //console.log("clearScreen");
                this.checkSurface();
                this.$nativeContext.clearScreen(0, 0, 0);
            }
        }

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
        public setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.$matrix.setTo(a, b, c, d, tx, ty);
            this.setTransformToNative();
        }

        private setTransformToNative():void {
            var m = this.$matrix;
            //console.log("setTransformToNative::a=" + m.a + " b=" + m.b + " c=" + m.c + " d=" + m.d + " tx=" + m.tx + " ty=" + m.ty);
            if(egret_native.Canvas) {
            } else {
                this.checkSurface();
            }
            this.$nativeContext.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }

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
        public createLinearGradient(x0:number, y0:number, x1:number, y1:number):GraphicsGradient {
            if(egret_native.Canvas) {
                return this.$nativeContext.createLinearGradient(x0, y0, x1, y1);
            }
            this.checkSurface();
            return this.$nativeGraphicsContext.createLinearGradient(x0, y0, x1, y1);
        }

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
        public createRadialGradient(x0:number, y0:number, r0:number, x1:number, y1:number, r1:number):GraphicsGradient {
            if(egret_native.Canvas) {
                return this.$nativeContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
            }
            this.checkSurface();
            return this.$nativeGraphicsContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        }

        /**
         * @private
         * 在(x,y)位置绘制（填充）文本。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public fillText(text:string, x:number, y:number, maxWidth?:number):void {
            //console.log("drawText" + text);
            var font:string = TextField.default_fontFamily;
            if(egret_native.Canvas) {
                this.$nativeContext.createLabel(font, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                this.$hasStrokeText = false;
                this.$nativeContext.drawText(text, x, y);
            } else {
                egret_native.Label.createLabel(font, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
                this.$hasStrokeText = false;
                egret_native.Label.drawText(text, x, y);
            }
        }

        private $hasStrokeText:boolean = false;

        public strokeText(text:string, x:number, y:number, maxWidth:number):void {
            this.$hasStrokeText = true;
        }

        /**
         * @private
         * 测量指定文本宽度，返回 TextMetrics 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public measureText(text:string):TextMetrics {
            var font:string = TextField.default_fontFamily;
            egret_native.Label.createLabel(font, this.$fontSize, "", this.$hasStrokeText ? this.$lineWidth : 0);
            return {width: egret_native.Label.getTextSize(text)[0]};
        }

        /**
         * @private
         * 注意：如果要对绘制的图片进行缩放，出于性能优化考虑，系统不会主动去每次重置imageSmoothingEnabled属性，因此您在调用drawImage()方法前请务必
         * 确保 imageSmoothingEnabled 已被重置为正常的值，否则有可能沿用上个显示对象绘制过程留下的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawImage(image:BitmapData, offsetX:number, offsetY:number, width?:number, height?:number,
                         surfaceOffsetX?:number, surfaceOffsetY?:number, surfaceImageWidth?:number, surfaceImageHeight?:number):void {
            var bitmapData;
            if(egret_native.Canvas) {
                if ((<NativeSurface>image).$nativeCanvas) {
                    bitmapData = (<NativeSurface>image).$nativeCanvas;
                }
                else {
                    bitmapData = image;
                }
            }
            else {
                if ((<NativeSurface>image).$nativeRenderTexture) {
                    bitmapData = (<NativeSurface>image).$nativeRenderTexture;
                }
                else {
                    bitmapData = image;
                }
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
            else if(arguments.length == 5) {
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
                if(egret_native.Canvas) {
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
                } else {
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
            }
            //console.log("drawImage::" + offsetX + " " + offsetY + " " + width + " " + height + " " + surfaceOffsetX + " " + surfaceOffsetY + " " + surfaceImageWidth + " " + surfaceImageHeight);
            if(egret_native.Canvas) {

            } else {
                this.checkSurface();
            }
            this.$nativeContext.drawImage(bitmapData, offsetX, offsetY, width, height, surfaceOffsetX, surfaceOffsetY, surfaceImageWidth, surfaceImageHeight);
        }

        /**
         * @private
         * 基于指定的源图象(BitmapData)创建一个模板，通过repetition参数指定源图像在什么方向上进行重复，返回一个GraphicsPattern对象。
         * @param bitmapData 做为重复图像源的 BitmapData 对象。
         * @param repetition 指定如何重复图像。
         * 可能的值有："repeat" (两个方向重复),"repeat-x" (仅水平方向重复),"repeat-y" (仅垂直方向重复),"no-repeat" (不重复).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public createPattern(image:BitmapData, repetition:string):GraphicsPattern {
            return null;
        }

        /**
         * @private
         * 返回一个 ImageData 对象，用来描述canvas区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为sw、高为sh。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getImageData(sx:number, sy:number, sw:number, sh:number):sys.ImageData {
            var res;
            if(egret_native.Canvas) {
                if (sx != Math.floor(sx)) {
                    sx = Math.floor(sx);
                    sw++;
                }
                if (sy != Math.floor(sy)) {
                    sy = Math.floor(sy);
                    sh++;
                }
                res = this.$nativeContext.getPixels(sx, sy, sw, sh);
            }
            else {
                if($currentSurface == this.surface) {
                    if($currentSurface != null) {
                        $currentSurface.end();
                    }
                }
                res = this.surface.getImageData(sx,sy,sw,sh);
            }
            if(res.pixelData) {
                res.data = res.pixelData;
            }
            return res;
        }

        private checkSurface():void {
            //todo 暂时先写这里
            if($currentSurface != this.surface) {
                if($currentSurface != null) {
                    $currentSurface.end();
                }
                if(this.surface) {
                    this.surface.begin();
                }
            }
        }
    }
}