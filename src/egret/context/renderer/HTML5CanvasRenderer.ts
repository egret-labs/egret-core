/// <reference path="RendererContext.ts"/>
/// <reference path="../../geom/Matrix2D.ts"/>
/// <reference path="../../core/StageDelegate.ts"/>
/// <reference path="../../debug/DEBUG.ts"/>
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
module ns_egret {
    export class HTML5CanvasRenderer extends RendererContext {

        private canvas;
        private canvasContext;

        constructor(canvas) {
            this.canvas = canvas;
            this.canvasContext = canvas.getContext("2d");
            super();
        }

        clearScreen() {
            var canvas = this.canvas;
            //todo:temp
            this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);


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
            var beforeDraw = Ticker.now();
            if (DEBUG && DEBUG.DRAW_IMAGE) {
                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
            var image = texture._bitmapData;
//            var scale = this.texture_scale_factor;
//            destWidth = destWidth * scale + .5;
//            destHeight = destHeight * scale + .5;
            this.canvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            super.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

            this.renderCost += Ticker.now() - beforeDraw;
        }


        transform(matrix:ns_egret.Matrix2D) {
//            return;
//            if (matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1 && matrix.tx == 0 && matrix.ty == 0){
//                return;
//            }
//            if (matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1){
//                this.translate(matrix.tx,matrix.ty);
//                return;
//            }
//            var stageDelegate:StageDelegate = StageDelegate.getInstance();
//            this.canvasContext.translate(matrix.tx,matrix.ty);
            this.canvasContext.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }

        translate(x:number, y:number){
//            return;
//            if (x == 0 && y == 0) return;
            this.canvasContext.translate(x, y);
        }

        save() {
//            return;
            this.canvasContext.save();
        }

        restore() {
//            return;
            this.canvasContext.restore();
        }

        setAlpha(alpha:number, blendMode:ns_egret.BlendMode) {
            if (alpha != 1) {
                this.canvasContext.globalAlpha *= alpha;
            }
            if (blendMode) {
                this.canvasContext.globalCompositeOperation = blendMode.value;
            }

        }

        setupFont(font:string, textAlign:string, textBaseline:string) {
            var ctx = this.canvasContext;
            ctx.font = font;
            ctx.textAlign = textAlign || "left";
            ctx.textBaseline = textBaseline || "top";
        }


        measureText(text) {
            var result = this.canvasContext.measureText(text);
            var rect = Rectangle.identity;
            rect.width = result.width;
            rect.height = result.height;
            return rect;
        }


        drawText(textField:ns_egret.TextField,text:string, x:number, y:number, maxWidth:number) {
//            return;
            var textColor = textField.textColor;
            var strokeColor = textField.strokeColor;
            var outline = textField.stroke;
            var renderContext = this.canvasContext;
            renderContext.fillStyle = textColor;
            renderContext.strokeStyle = strokeColor;
            if (outline) {
                renderContext.lineWidth = outline * 2;
                renderContext.strokeText(text, x, y, maxWidth || 0xFFFF);
            }
            renderContext.fillText(text, x, y, maxWidth || 0xFFFF);
            super.drawText(text, x, y, maxWidth, outline, textColor, strokeColor);
        }

        clip(x, y, w, h) {
            var stageDelegate:StageDelegate = StageDelegate.getInstance();
            this.canvasContext.beginPath();
            this.canvasContext.rect(x, y, w, h);
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