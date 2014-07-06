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
     * @class egret.HTML5CanvasRenderer
     * @classdesc
     * @extends egret.RendererContext
     */
    export class HTML5CanvasRenderer extends RendererContext {

        private canvas;
        /**
         * @member egret.HTML5CanvasRenderer#canvasContext
         */
        public canvasContext;

        private _matrixA:number;
        private _matrixB:number;
        private _matrixC:number;
        private _matrixD:number;
        private _matrixTx:number;
        private _matrixTy:number;

        public _transformTx:number;
        public _transformTy:number;

        private blendValue:string;

        constructor(canvas) {
            this.canvas = canvas;
            this.canvasContext = canvas.getContext("2d");
            var f = this.canvasContext.setTransform;
            var that = this;
            this.canvasContext.setTransform = function (a, b, c, d, tx, ty) {
                that._matrixA = a;
                that._matrixB = b;
                that._matrixC = c;
                that._matrixD = d;
                that._matrixTx = tx;
                that._matrixTy = ty;
                f.call(that.canvasContext, a, b, c, d, tx, ty);
            };
            this._matrixA = 1;
            this._matrixB = 0;
            this._matrixC = 0;
            this._matrixD = 1;
            this._matrixTx = 0;
            this._matrixTy = 0;

            this._transformTx = 0;
            this._transformTy = 0;
            super();
        }

        clearScreen() {
            this.setTransform(egret.Matrix.identity.identity());
            var list = RenderFilter.getInstance().getDrawAreaList();
            for (var i:number = 0 , l:number = list.length; i < l; i++) {
                var area = list[i];
                this.clearRect(area.x + this._transformTx, area.y + this._transformTy, area.width, area.height);
            }
            this.renderCost = 0;
        }

        clearRect(x:number, y:number, w:number, h:number) {
            this.canvasContext.clearRect(x, y, w, h);
        }

        drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            sourceX = sourceX / egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceY = sourceY / egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceWidth = sourceWidth / egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceHeight = sourceHeight / egret.MainContext.instance.rendererContext.texture_scale_factor;
//            if (DEBUG && DEBUG.DRAW_IMAGE) {
//                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
//            }
            var image = texture._bitmapData;
            destX += this._transformTx;
            destY += this._transformTy;
            var beforeDraw = egret.getTimer();
            this.canvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            super.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            this.renderCost += egret.getTimer() - beforeDraw;
        }

        setTransform(matrix:egret.Matrix) {
            //在没有旋转缩放斜切的情况下，先不进行矩阵偏移，等下次绘制的时候偏移
            if (matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1
                && this._matrixA == 1 && this._matrixB == 0 && this._matrixC == 0 && this._matrixD == 1) {
                this._transformTx = matrix.tx - this._matrixTx;
                this._transformTy = matrix.ty - this._matrixTy;
                return;
            }
            this._transformTx = this._transformTy = 0;
            if (this._matrixA != matrix.a || this._matrixB != matrix.b || this._matrixC != matrix.c
                || this._matrixD != matrix.d || this._matrixTx != matrix.tx || this._matrixTy != matrix.ty) {
                this.canvasContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        save() {
//            return;
            this.canvasContext.save();
        }

        restore() {
//            return;
            this.canvasContext.restore();
            this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        }


        setAlpha(alpha:number, blendMode:egret.BlendMode) {
            if (alpha != this.canvasContext.globalAlpha) {
                this.canvasContext.globalAlpha = alpha;
            }
            if (blendMode) {
                this.blendValue = blendMode.value;
                this.canvasContext.globalCompositeOperation = blendMode.value;
            }
            else if (this.blendValue != egret.BlendMode.NORMAL.value) {
                this.blendValue = egret.BlendMode.NORMAL.value;
                this.canvasContext.globalCompositeOperation = egret.BlendMode.NORMAL.value;
            }
        }

        setupFont(textField:TextField):void {
            var ctx = this.canvasContext;
            var font:string = textField.italic ? "italic " : "normal ";
            font += textField.bold ? "bold " : "normal ";
            font += textField.size + "px " + textField.fontFamily;
            ctx.font = font;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
        }


        measureText(text:string):number {
            var result = this.canvasContext.measureText(text);
            return result.width;
        }


        drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number) {
            var textColor:string = textField._textColorString;
            var strokeColor:string = textField._strokeColorString;
            var outline = textField.stroke;
            var renderContext = this.canvasContext;
            renderContext.fillStyle = textColor;
            renderContext.strokeStyle = strokeColor;
            if (outline) {
                renderContext.lineWidth = outline * 2;
                renderContext.strokeText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
            }
            renderContext.fillText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
            super.drawText(textField, text, x, y, maxWidth);
        }

        clip(x, y, w, h) {
            this.canvasContext.beginPath();
            this.canvasContext.rect(x + this._transformTx, y + this._transformTy, w, h);
            this.canvasContext.clip();
            this.canvasContext.closePath();
        }

        strokeRect(x, y, w, h, color) {
            this.canvasContext.strokeStyle = color;
            this.canvasContext.strokeRect(x, y, w, h);
        }




        //WebGL API
    }
}


module egret_h5_graphics {

    export function beginFill(color:number, alpha:number = 1):void {
        var _colorBlue = color & 0x0000FF;
        var _colorGreen = (color & 0x00ff00) >> 8;
        var _colorRed = color >> 16;
        var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        this.fillStyleColor = _colorStr;

        this.commandQueue.push(new Command(this._setStyle, this, [_colorStr]))

    }

    export function drawRect(x:number, y:number, width:number, height:number):void {
        this.commandQueue.push(new Command(

            function (x, y, width, height) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                this.canvasContext.beginPath();
                this.canvasContext.rect(rendererContext._transformTx + x,
                    rendererContext._transformTy + y,
                    width,
                    height);
                this.canvasContext.closePath();
            },
            this,
            [ x, y, width, height]

        )
        );

    }

    export function drawCircle(x:number, y:number, r:number):void {

        this.commandQueue.push(new Command(
            function (x, y, r) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                this.canvasContext.beginPath();
                this.canvasContext.arc(rendererContext._transformTx + x,
                    rendererContext._transformTy + y, r, 0, Math.PI * 2);
                this.canvasContext.closePath();

            },
            this,
            [ x, y, r]

        ));
    }

    export function lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {

        var _colorBlue = color & 0x0000FF;
        var _colorGreen = (color & 0x00ff00) >> 8;
        var _colorRed = color >> 16;
        var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        this.strokeStyleColor = _colorStr;

        this.commandQueue.push(new Command(

            function (lineWidth, strokeStyle) {
                this.canvasContext.lineWidth = lineWidth;
                this.canvasContext.strokeStyle = strokeStyle;
            },
            this,
            [thickness, _colorStr]

        ))
    }

    export function lineTo(x:number, y:number):void {

        this.commandQueue.push(new Command(
            function (x, y) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.lineTo(rendererContext._transformTx + x, rendererContext._transformTy + y);
            },
            this,
            [x, y]

        ))
    }

    export function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void {

        this.commandQueue.push(new Command(
            function (x, y, ax, ay) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.quadraticCurveTo(rendererContext._transformTx + x, rendererContext._transformTy + y, ax, ay);
            },
            this,
            [controlX, controlY, anchorX, anchorY]

        ))
    }

    export function moveTo(x:number, y:number):void {
        this.commandQueue.push(new Command(
            function (x, y) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.moveTo(rendererContext._transformTx + x, rendererContext._transformTy + y);
            },
            this,
            [x, y]

        ))

    }

    export function clear():void {
        this.commandQueue.length = 0;
        this.strokeStyleColor = null;
        this.fillStyleColor = null;
    }


    export function endFill():void {
        if (this.strokeStyleColor) {
            this.commandQueue.push(
                new Command(
                    function () {
                        this.canvasContext.stroke();
                    },
                    this,
                    null)
            )
        }

        if (this.fillStyleColor) {
            this.commandQueue.push(
                new Command(
                    function () {
                        this.canvasContext.fill();
                    },
                    this,
                    null)
            )
        }

    }

    export function _draw(renderContext:egret.RendererContext):void {
        this.renderContext = renderContext;
        this.canvasContext = (<egret.HTML5CanvasRenderer>this.renderContext).canvasContext;
        var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
        var canvasContext:CanvasRenderingContext2D = this.canvasContext;
        canvasContext.moveTo(rendererContext._transformTx, rendererContext._transformTy);
        canvasContext.save();
        canvasContext.beginPath();
        for (var i = 0 , length = this.commandQueue.length; i < length; i++) {
            var command:Command = this.commandQueue[i];
            command.method.apply(command.thisObject, command.args);
        }
        canvasContext.closePath();
        canvasContext.restore();
    }

    class Command {

        constructor(public method:Function, public thisObject:any, public args:Array<any>) {

        }


    }

    export function _setStyle(colorStr:string):void {
        this.canvasContext.fillStyle = colorStr;
    }


    export function init():void {
        for (var key in egret_h5_graphics) {
            egret.Graphics.prototype[key] = egret_h5_graphics[key];
        }
        egret.RendererContext.createRendererContext = function(canvas:any){
            return new egret.HTML5CanvasRenderer(canvas);
        }
    }

}


egret_h5_graphics.init();