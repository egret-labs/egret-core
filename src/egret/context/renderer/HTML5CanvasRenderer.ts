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

/// <reference path="../MainContext.ts"/>
/// <reference path="RenderFilter.ts"/>
/// <reference path="RendererContext.ts"/>
/// <reference path="../../display/Texture.ts"/>
/// <reference path="../../geom/Matrix.ts"/>
/// <reference path="../../text/TextField.ts"/>
/// <reference path="../../utils/getTimer.ts"/>

module ns_egret {
	/**
	 * @class ns_egret.HTML5CanvasRenderer
	 * @classdesc
	 * @extends ns_egret.RendererContext
	 */
    export class HTML5CanvasRenderer extends RendererContext {

        private canvas;
		/**
		 * @member ns_egret.HTML5CanvasRenderer#canvasContext
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
//            if (DEBUG && DEBUG.DRAW_IMAGE) {
//                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
//            }
            var image = texture._bitmapData;
            destX += this._transformTx;
            destY += this._transformTy;
            var beforeDraw = ns_egret.getTimer();
            this.canvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            super.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            this.renderCost += ns_egret.getTimer() - beforeDraw;
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
                this.blendValue = blendMode.value;
                this.canvasContext.globalCompositeOperation = blendMode.value;
            }
            else if(this.blendValue != ns_egret.BlendMode.NORMAL.value){
                this.blendValue = ns_egret.BlendMode.NORMAL.value;
                this.canvasContext.globalCompositeOperation = ns_egret.BlendMode.NORMAL.value;
            }
        }

        setupFont(textField:TextField):void {
            var ctx = this.canvasContext;
            ctx.font = textField.size + "px " + textField.fontFamily;
            ctx.textAlign = textField.textAlign || "left";
            ctx.textBaseline = textField.textBaseline || "top";
        }


        measureText(text:string):number {
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
                renderContext.strokeText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
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