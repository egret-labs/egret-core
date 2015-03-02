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
     * @class egret.NativeRendererContext
     * @classdesc
     * NativeRendererContext 是引擎在Native上的渲染上下文。
     * @extends egret.HashObject
     * @private
     */
    export class NativeRendererContext extends RendererContext {

        /**
         * @method egret.NativeRendererContext#constructor
         */
        public constructor() {
            super();
        }


        public _setTextureScaleFactor(value:number):void {
            super._setTextureScaleFactor(value);

            if (egret_native.Graphics.setTextureScaleFactor != null) {
                egret_native.Graphics.setTextureScaleFactor(value);
            }
        }

        /**
         * @method egret.NativeRendererContext#clearScreen
         * @private
         */
        public clearScreen() {
            egret_native.Graphics.clearScreen(0, 0, 0);
        }


        /**
         * 清除Context的渲染区域
         * @method egret.NativeRendererContext#clearRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {numbe}
         */
        public clearRect(x:number, y:number, w:number, h:number) {
        }

        /**
         * 绘制图片
         * @method egret.NativeRendererContext#drawImage
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         * @param repeat {string}
         */
        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat = undefined) {

            if (repeat !== undefined) {
                this.drawRepeatImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
                return;
            }
            else {
                egret_native.Graphics.drawImage(texture._bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }

            super.drawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight,repeat);
        }

        /**
         * 绘制9宫图片
         * @method egret.RendererContext#drawImageScale9
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        public drawImageScale9(texture: Texture, sourceX, sourceY, sourceWidth, sourceHeight, offX, offY, destWidth, destHeight, rect):boolean {
            if (egret_native.Graphics.drawImageScale9 != null) {
                egret_native.Graphics.drawImageScale9(texture._bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, offX, offY, destWidth, destHeight, rect.x, rect.y, rect.width, rect.height);
                this._addOneDraw();
                return true;
            }

            return false;
        }

        public drawRepeatImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            sourceWidth = sourceWidth * texture_scale_factor;
            sourceHeight = sourceHeight * texture_scale_factor;
            for (var x:number = destX; x < destWidth; x += sourceWidth) {
                for (var y:number = destY; y < destHeight; y += sourceHeight) {
                    var destW:number = Math.min(sourceWidth, destWidth - x);
                    var destH:number = Math.min(sourceHeight, destHeight - y);
                    this.drawImage(texture, sourceX, sourceY, destW / texture_scale_factor, destH / texture_scale_factor, x, y, destW, destH);
                }
            }
        }

        /**
         * 变换Context的当前渲染矩阵
         * @method egret.NativeRendererContext#setTransform
         * @param matrix {egret.Matrix}
         * @stable A
         */
        public setTransform(matrix:egret.Matrix) {
            egret_native.Graphics.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }

        private currentAlpha:number = NaN;

        /**
         * 设置渲染alpha
         * @method egret.NativeRendererContext#setAlpha
         * @param value {number}
         * @stable A
         * @param blendMode {egret.BlendMode}
         */
        public setAlpha(value:number, blendMode:string) {
            //if (this.currentAlpha != value) {
                egret_native.Graphics.setGlobalAlpha(value);
                //this.currentAlpha = value;
            //}
            this.setBlendMode(blendMode);
        }

        private currentBlendMode:string = null;

        private setBlendMode(blendMode:string) {
            if (!blendMode) {
                blendMode = egret.BlendMode.NORMAL;
            }
            //if (this.currentBlendMode != blendMode) {
                var blendModeArg = RendererContext.blendModesForGL[blendMode];
                if (blendModeArg) {
                    egret_native.Graphics.setBlendArg(blendModeArg[0], blendModeArg[1]);
                    this.currentBlendMode = blendMode;
                }
            //}
        }

        /**
         * 设置渲染文本参数
         * @method egret.NativeRendererContext#setupFont
         * @param textField {TextField}
         */
        public setupFont(textField:TextField, style:egret.ITextStyle = null):void {
            style = style || <egret.ITextStyle>{};
            var size:number = style["size"] == null ? textField._size : style["size"];

            egret_native.Label.createLabel(TextField.default_fontFamily, size, "");
        }

        /**
         * 测量文本
         * @method egret.NativeRendererContext#measureText
         * @param text {string}
         * @returns {number}
         */
        public measureText(text:string):number {
            return egret_native.Label.getTextSize(text)[0];
        }

        /**
         * 绘制文本
         * @method egret.NativeRendererContext#drawText
         * @param textField {egret.TextField}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         * @param maxWidth {numbe}
         */
        public drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number, style:egret.ITextStyle = null) {
            this.setupFont(textField, style);
            style = style || <egret.ITextStyle>{};

            var textColor:number;
            if (style.textColor != null) {
                textColor = style.textColor;
            }
            else {
                textColor = textField._textColor;
            }

            var strokeColor:string;
            if (style.strokeColor != null) {
                strokeColor = toColorString(style.strokeColor);
            }
            else {
                strokeColor = textField._strokeColorString;
            }

            var outline;
            if (style.stroke != null) {
                outline = style.stroke;
            }
            else {
                outline = textField._stroke;
            }

            egret_native.Label.setTextColor(textColor);
            egret_native.Label.drawText(text, x, y - 2);

            super.drawText(textField, text, x, y, maxWidth, style);
        }

        public pushMask(mask:Rectangle):void {
            egret_native.Graphics.pushClip(mask.x, mask.y, mask.width, mask.height);
        }

        public popMask():void {
            egret_native.Graphics.popClip();
        }


        public setGlobalColorTransform(colorTransformMatrix:Array<any>):void {
            if (colorTransformMatrix) {
                egret_native.Graphics.setGlobalColorTransformEnabled(true);
                egret_native.Graphics.setGlobalColorTransform(colorTransformMatrix);
            }
            else {
                egret_native.Graphics.setGlobalColorTransformEnabled(false);
            }
        }

        public setGlobalFilter(filterData:Filter):void {
            egret_native.Graphics.setGlobalShader(filterData);
        }
    }
}


//egret.Graphics.prototype._draw = function () {
//    return;
//}


var egret_native_graphics;
(function (egret_native_graphics) {
    function beginFill(color, alpha) {
        this.commandQueue.push(new Command(function (color, alpha) {
            if (!alpha && alpha != 0) {
                alpha = 1;
            }
            egret_native.Graphics.beginFill(color, alpha)
        }, this, arguments));
    }

    egret_native_graphics.beginFill = beginFill;

    function drawRect(x, y, width, height) {
        this.commandQueue.push(new Command(function (x, y) {
            egret_native.Graphics.moveTo(x, y)
            egret_native.Graphics.lineTo(x + width, y);
            egret_native.Graphics.lineTo(x + width, y + height);
            egret_native.Graphics.lineTo(x, y + height);
            egret_native.Graphics.lineTo(x, y);
        }, this, arguments));
        this.checkRect(x, y, width, height);
    }

    egret_native_graphics.drawRect = drawRect;

    function drawCircle(x, y, r) {

    }

    egret_native_graphics.drawCircle = drawCircle;

    function lineStyle(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {


        this.commandQueue.push(new Command(function (thickness, color) {
            egret_native.Graphics.lineStyle(thickness, color)
        }, this, arguments));
    }

    egret_native_graphics.lineStyle = lineStyle;

    function lineTo(x, y) {
        this.commandQueue.push(new Command(function (x, y) {
            egret_native.Graphics.lineTo(x, y)

        }, this, arguments));
        this.checkPoint(this.lineX, this.lineY);
        this.lineX = x;
        this.lineY = y;
        this.checkPoint(x, y);
    }

    egret_native_graphics.lineTo = lineTo;

    function curveTo(controlX, controlY, anchorX, anchorY) {

    }

    egret_native_graphics.curveTo = curveTo;

    function moveTo(x, y) {
        this.commandQueue.push(new Command(function (x, y) {
            egret_native.Graphics.moveTo(x, y)
        }, this, arguments));
    }

    egret_native_graphics.moveTo = moveTo;

    function clear() {
        this.commandQueue.splice(0, this.commandQueue.length);
        this.lineX = 0;
        this.lineY = 0;
        egret_native.Graphics.lineStyle(0, 0);
        this._minX = 0;
        this._minY = 0;
        this._maxX = 0;
        this._maxY = 0;
        this._firstCheck = true;
    }

    egret_native_graphics.clear = clear;


    function endFill() {
        this.commandQueue.push(new Command(function () {
            egret_native.Graphics.endFill();

        }, this, arguments));
    }

    egret_native_graphics.endFill = endFill;

    function _draw(renderContext) {
        var length = this.commandQueue.length;
        for (var i = 0; i < length; i++) {
            var command = this.commandQueue[i];
            command.method.apply(command.thisObject, command.args);
        }
        egret_native.Graphics.lineStyle(0, 0);
    }

    egret_native_graphics._draw = _draw;

    var Command = (function () {
        function Command(method, thisObject, args) {
            this.method = method;
            this.thisObject = thisObject;
            this.args = args;
        }

        return Command;
    })();

    function init() {
        for (var key in egret_native_graphics) {
            egret.Graphics.prototype[key] = egret_native_graphics[key];
        }
    }

    egret_native_graphics.init = init;
})(egret_native_graphics || (egret_native_graphics = {}));


egret_native_graphics.init();
