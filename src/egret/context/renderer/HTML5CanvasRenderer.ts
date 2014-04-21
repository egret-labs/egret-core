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

/// <reference path="RendererContext.ts"/>
/// <reference path="../../core/MainContext.ts"/>
/// <reference path="../../core/RenderFilter.ts"/>
/// <reference path="../../core/Ticker.ts"/>
/// <reference path="../../debug/DEBUG.ts"/>
/// <reference path="../../geom/Matrix.ts"/>
/// <reference path="../../geom/Rectangle.ts"/>
/// <reference path="../../text/TextField.ts"/>
/// <reference path="../../texture/Texture.ts"/>

module ns_egret {
    export class HTML5CanvasRenderer extends RendererContext {

        private canvas;
        private canvasContext;

        private _matrixA:number;
        private _matrixB:number;
        private _matrixC:number;
        private _matrixD:number;
        private _matrixTx:number;
        private _matrixTy:number;

        private _transformTx:number;
        private _transformTy:number;

        constructor(canvas) {
            this.canvas = canvas;
            this.canvasContext = canvas.getContext("2d");
            var f = this.canvasContext.setTransform;
            var that = this;
            this.canvasContext.setTransform = function (a,b,c,d,tx,ty){
                that._matrixA = a;
                that._matrixB = b;
                that._matrixC = c;
                that._matrixD = d;
                that._matrixTx = tx;
                that._matrixTy = ty;
                f.call(that.canvasContext,a, b, c, d, tx, ty);
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
            this.setTransform(ns_egret.Matrix.identity.identity());
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
            sourceX = sourceX / ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceY = sourceY / ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceWidth = sourceWidth / ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceHeight = sourceHeight / ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
            if (DEBUG && DEBUG.DRAW_IMAGE) {
                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
            var image = texture._bitmapData;
            var beforeDraw = ns_egret.Ticker.now();
            destX += this._transformTx;
            destY += this._transformTy;
            this.canvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            super.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            this.renderCost += ns_egret.Ticker.now() - beforeDraw;
        }

        setTransform(matrix:ns_egret.Matrix) {
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
            this.canvasContext.setTransform(1,0,0,1,0,0);
        }

        setAlpha(alpha:number, blendMode:ns_egret.BlendMode) {
            if (alpha != this.canvasContext.globalAlpha) {
                this.canvasContext.globalAlpha = alpha;
            }
            if (blendMode) {
                this.canvasContext.globalCompositeOperation = blendMode.value;
            }
            else {
                this.canvasContext.globalCompositeOperation = ns_egret.BlendMode.NORMAL.value;
            }
        }

        setupFont(font:string, textAlign:string, textBaseline:string) {
            var ctx = this.canvasContext;
            ctx.font = font;
            ctx.textAlign = textAlign || "left";
            ctx.textBaseline = textBaseline || "top";
        }


        measureText(text):number {
            var result = this.canvasContext.measureText(text);
            return result.width;
        }


        drawText(textField:ns_egret.TextField, text:string, x:number, y:number, maxWidth:number) {
            var textColor:string = textField._textColorString;
            var strokeColor:string = textField._strokeColorString;
            var outline = textField.stroke;
            var renderContext = this.canvasContext;
            renderContext.fillStyle = textColor;
            renderContext.strokeStyle = strokeColor;
            if (outline) {
                renderContext.lineWidth = outline * 2;
                renderContext.strokeText(text, x, y, maxWidth || 0xFFFF);
            }
            renderContext.fillText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
            super.drawText(textField,text, x, y, maxWidth);
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