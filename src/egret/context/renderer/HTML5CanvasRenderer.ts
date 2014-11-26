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
        public canvasContext:CanvasRenderingContext2D;

        private _matrixA:number;
        private _matrixB:number;
        private _matrixC:number;
        private _matrixD:number;
        private _matrixTx:number;
        private _matrixTy:number;

        public _transformTx:number;
        public _transformTy:number;

        private blendValue:string;
        private globalAlpha:number = 1;

        private _cacheCanvas;
        public _cacheCanvasContext;

        public constructor(canvas?:HTMLCanvasElement) {
            super();

            this.canvas = canvas || this.createCanvas();
            this.canvasContext = this.canvas.getContext("2d");

            this._cacheCanvas = document.createElement("canvas");
            this._cacheCanvas.width = this.canvas.width;
            this._cacheCanvas.height = this.canvas.height;
            this._cacheCanvasContext = this._cacheCanvas.getContext("2d");

            this._cacheCanvasContext["imageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
            this._cacheCanvasContext["webkitImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
            this._cacheCanvasContext["mozImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
            this._cacheCanvasContext["msImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;

            var f = this.canvasContext.setTransform;
            var that = this;
            this._cacheCanvasContext.setTransform = function (a, b, c, d, tx, ty) {
                that._matrixA = a;
                that._matrixB = b;
                that._matrixC = c;
                that._matrixD = d;
                that._matrixTx = tx;
                that._matrixTy = ty;
                f.call(that._cacheCanvasContext, a, b, c, d, tx, ty);
            };
            this._matrixA = 1;
            this._matrixB = 0;
            this._matrixC = 0;
            this._matrixD = 1;
            this._matrixTx = 0;
            this._matrixTy = 0;

            this._transformTx = 0;
            this._transformTy = 0;
            this.initBlendMode();
        }

        private createCanvas():HTMLCanvasElement {
            var canvas:HTMLCanvasElement = egret.Browser.getInstance().$("#egretCanvas");
            if (!canvas) {
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                canvas = egret.Browser.getInstance().$new("canvas");
                canvas.id = "egretCanvas";
                canvas.width = egret.MainContext.instance.stage.stageWidth; //stageW
                canvas.height = egret.MainContext.instance.stage.stageHeight; //stageH
                canvas.style.width = container.style.width;
                canvas.style.height = container.style.height;
//                canvas.style.position = "absolute";
                container.appendChild(canvas);
            }
            return canvas;
        }

        public clearScreen() {
            var list = RenderFilter.getInstance().getDrawAreaList();
            for (var i:number = 0 , l:number = list.length; i < l; i++) {
                var area = list[i];
                this.clearRect(area.x, area.y, area.width, area.height);
            }
            var stage:Stage = egret.MainContext.instance.stage;
            this._cacheCanvasContext.clearRect(0, 0, stage.stageWidth, stage.stageHeight);
            this.renderCost = 0;
        }

        public clearRect(x:number, y:number, w:number, h:number) {
//            this.canvasContext.fillRect(x, y, w, h);
            this.canvasContext.clearRect(x, y, w, h);
        }

        public drawImage(texture: Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat=undefined) {

            var scale = egret.MainContext.instance.rendererContext.texture_scale_factor;
            sourceX = sourceX / scale;
            sourceY = sourceY / scale;
            sourceWidth = sourceWidth / scale;
            sourceHeight = sourceHeight / scale;
//            if (DEBUG && DEBUG.DRAW_IMAGE) {
//                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
//            }
            var image = texture._bitmapData;
            destX += this._transformTx;
            destY += this._transformTy;
            var beforeDraw = egret.getTimer();
            if (repeat ===undefined) {
                this._cacheCanvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
            else {
                this.drawRepeatImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
            }
            super.drawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight,repeat);
            this.renderCost += egret.getTimer() - beforeDraw;
        }

        public drawRepeatImage(texture: Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            if(texture['pattern']===undefined){
                var image = texture._bitmapData;
                var tempImage:HTMLElement = image;
                if (image.width != sourceWidth || image.height != sourceHeight) {
                    var tempCanvas = document.createElement("canvas");
                    tempCanvas.width = sourceWidth;
                    tempCanvas.height = sourceHeight;
                    tempCanvas.getContext("2d").drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
                    tempImage = tempCanvas;
                }
                var pat = this._cacheCanvasContext.createPattern(tempImage, repeat);
                texture['pattern'] = pat;
            }
            var pattern = texture['pattern'];
            this._cacheCanvasContext.fillStyle = pattern;
            this._cacheCanvasContext.translate(destX, destY);
            this._cacheCanvasContext.fillRect(0, 0, destWidth, destHeight);
            this._cacheCanvasContext.translate(-destX, -destY);
        }

        public setTransform(matrix:egret.Matrix) {
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
                this._cacheCanvasContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        public setAlpha(alpha:number, blendMode:string) {
            if (alpha != this.globalAlpha) {
                this._cacheCanvasContext.globalAlpha = this.globalAlpha = alpha;
            }
            if (blendMode) {
                this.blendValue = this.blendModes[blendMode];
                this._cacheCanvasContext.globalCompositeOperation = this.blendValue;
            }
            else if (this.blendValue != egret.BlendMode.NORMAL) {
                this.blendValue = this.blendModes[egret.BlendMode.NORMAL];
                this._cacheCanvasContext.globalCompositeOperation = this.blendValue;
            }
        }

        private blendModes:any;

        private initBlendMode():void {
            this.blendModes = {};
            this.blendModes[BlendMode.NORMAL] = "source-over";
            this.blendModes[BlendMode.ADD] = "lighter";
        }

        public setupFont(textField:TextField):void {
            var ctx = this._cacheCanvasContext;
            var font:string = textField._italic ? "italic " : "normal ";
            font += textField._bold ? "bold " : "normal ";
            font += textField._size + "px " + textField._fontFamily;
            ctx.font = font;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
        }


        public measureText(text:string):number {
            var result = this._cacheCanvasContext.measureText(text);
            return result.width;
        }

        public drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number, style:Object) {
            var textColor:string;
            if (style["textColor"]) {

                textColor = toColorString(parseInt(style["textColor"]));
            }
            else {
                textColor = textField._textColorString;
            }

            var strokeColor:string;
            if (style["strokeColor"]) {
                strokeColor = toColorString(style["strokeColor"]);
            }
            else {
                strokeColor = textField._strokeColorString;
            }

            var outline;
            if (style["outline"]) {
                outline = style["outline"];
            }
            else {
                outline = textField._stroke;
            }

            var renderContext = this._cacheCanvasContext;
            renderContext.fillStyle = textColor;
            renderContext.strokeStyle = strokeColor;
            if (outline) {
                renderContext.lineWidth = outline * 2;
                renderContext.strokeText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
            }
            renderContext.fillText(text, x + this._transformTx, y + this._transformTy, maxWidth || 0xFFFF);
            super.drawText(textField, text, x, y, maxWidth, style);
        }

        public strokeRect(x, y, w, h, color) {
            this._cacheCanvasContext.strokeStyle = color;
            this._cacheCanvasContext.strokeRect(x, y, w, h);
        }


        public pushMask(mask:Rectangle):void {
            this._cacheCanvasContext.save();
            this._cacheCanvasContext.beginPath();
            this._cacheCanvasContext.rect(mask.x + this._transformTx, mask.y + this._transformTy, mask.width, mask.height);
            this._cacheCanvasContext.clip();
            this._cacheCanvasContext.closePath();
        }

        public popMask():void {
            this._cacheCanvasContext.restore();
            this._cacheCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
        }


        public onRenderStart():void {
            this._cacheCanvasContext.save();
        }

        public onRenderFinish():void {
            this._cacheCanvasContext.restore();
            this._cacheCanvasContext.setTransform(1, 0, 0, 1, 0, 0);

            var list = RenderFilter.getInstance().getDrawAreaList();
            for (var i:number = 0 , l:number = list.length; i < l; i++) {
                var area:Rectangle = list[i];
                this.canvasContext.drawImage(this._cacheCanvas, area.x, area.y, area.width, area.height, area.x, area.y, area.width, area.height);
            }
        }
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
        this._fill();
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
        this._fill();
    }

    export function drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {
        //非等值椭圆角实现
        this.commandQueue.push(new Command(
                function (x, y, width, height, ellipseWidth, ellipseHeight?) {
                    var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                    var _x:number = rendererContext._transformTx + x;//控制X偏移
                    var _y:number = rendererContext._transformTy + y;//控制Y偏移
                    var _w:number = width;
                    var _h:number = height;
                    var _ew:number = ellipseWidth / 2;
                    var _eh:number = ellipseHeight ? ellipseHeight / 2 : _ew;
                    var right:number = _x + _w;
                    var bottom:number = _y + _h;
                    var ax:number = right;
                    var ay:number = bottom - _eh;

                    this.canvasContext.beginPath();
                    this.canvasContext.moveTo(ax, ay);
                    this.canvasContext.quadraticCurveTo(right, bottom, right - _ew, bottom);
                    this.canvasContext.lineTo(_x + _ew, bottom);
                    this.canvasContext.quadraticCurveTo(_x, bottom, _x, bottom - _eh);
                    this.canvasContext.lineTo(_x, _y + _eh);
                    this.canvasContext.quadraticCurveTo(_x, _y, _x + _ew, _y);
                    this.canvasContext.lineTo(right - _ew, _y);
                    this.canvasContext.quadraticCurveTo(right, _y, right, _y + _eh);
                    this.canvasContext.lineTo(ax, ay);
                    this.canvasContext.closePath();
                },
                this,
                [ x, y, width, height, ellipseWidth, ellipseHeight]
            )
        );
        this._fill();
    }

    export function drawEllipse(x:number, y:number, width:number, height:number):void {
        //基于均匀压缩算法
        this.commandQueue.push(new Command(
            function (x, y, width, height) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                this.canvasContext.save();
                var _x:number = rendererContext._transformTx + x;//控制X偏移
                var _y:number = rendererContext._transformTy + y;//控制Y偏移
                var r:number = (width > height) ? width : height;//选宽高较大者做为arc半径参数
                var ratioX:number = width / r;//横轴缩放比率
                var ratioY:number = height / r;//纵轴缩放比率
                this.canvasContext.scale(ratioX, ratioY);//进行缩放(均匀压缩)
                this.canvasContext.beginPath();
                this.canvasContext.moveTo((_x + width) / ratioX, _y / ratioY);
                this.canvasContext.arc(_x / ratioX, _y / ratioY, r, 0, 2 * Math.PI);
                this.canvasContext.closePath();
                this.canvasContext.restore();
                this.canvasContext.stroke();
            },
            this,
            [ x, y, width, height]
        ));
        this._fill();
    }

    export function lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {
        if (this.strokeStyleColor) {
            this.createEndLineCommand();
            this.commandQueue.push(this.endLineCommand);
        }

        var _colorBlue = color & 0x0000FF;
        var _colorGreen = (color & 0x00ff00) >> 8;
        var _colorRed = color >> 16;
        var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        this.strokeStyleColor = _colorStr;

        this.commandQueue.push(new Command(
            function (lineWidth, strokeStyle) {
                this.canvasContext.lineWidth = lineWidth;
                this.canvasContext.strokeStyle = strokeStyle;
                this.canvasContext.beginPath();
            },
            this,
            [thickness, _colorStr]
        ));

        if (typeof(this.lineX) === "undefined") {
            this.lineX = 0;
            this.lineY = 0;
        }
        this.moveTo(this.lineX, this.lineY);
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
        ));
        this.lineX = x;
        this.lineY = y;
    }

    export function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void {

        this.commandQueue.push(new Command(
            function (x, y, ax, ay) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.quadraticCurveTo(rendererContext._transformTx + x, rendererContext._transformTy + y,
                        rendererContext._transformTx + ax, rendererContext._transformTy + ay);
            },
            this,
            [controlX, controlY, anchorX, anchorY]
        ));
        this.lineX = anchorX;
        this.lineY = anchorY;
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
        this.lineX = 0;
        this.lineY = 0;
        this.strokeStyleColor = null;
        this.fillStyleColor = null;
    }

    export function createEndFillCommand():void {
        if (!this.endFillCommand) {
            this.endFillCommand = new Command(
                function () {
                    this.canvasContext.fill();
                    this.canvasContext.closePath();
                },
                this,
                null);
        }
    }

    export function endFill():void {
        if (this.fillStyleColor != null) {
            this._fill();
        }
        this.fillStyleColor = null;
    }

    export function _fill():void {
        if (this.fillStyleColor) {
            this.createEndFillCommand();
            this.commandQueue.push(this.endFillCommand);
        }
    }

    export function createEndLineCommand():void {
        if (!this.endLineCommand) {
            this.endLineCommand = new Command(
                function () {
                    this.canvasContext.stroke();
                    this.canvasContext.closePath();
                },
                this,
                null);
        }
    }

    export function _draw(renderContext:egret.RendererContext):void {
        var length = this.commandQueue.length;
        if(length == 0) {
            return;
        }
        this.renderContext = renderContext;
        this.canvasContext = (<egret.HTML5CanvasRenderer>this.renderContext)._cacheCanvasContext || (<egret.HTML5CanvasRenderer>this.renderContext).canvasContext;
        var canvasContext:CanvasRenderingContext2D = this.canvasContext;

        canvasContext.save();
        if (this.strokeStyleColor && length > 0 && this.commandQueue[length - 1] != this.endLineCommand) {
            this.createEndLineCommand();
            this.commandQueue.push(this.endLineCommand);
            length = this.commandQueue.length;
        }
        for (var i = 0; i < length; i++) {
            var command:Command = this.commandQueue[i];
            command.method.apply(command.thisObject, command.args);
        }
        canvasContext.restore();
    }

    class Command {

        constructor(public method:Function, public thisObject:any, public args:Array<any>) {

        }


    }

    export function _setStyle(colorStr:string):void {
        this.canvasContext.fillStyle = colorStr;
        this.canvasContext.beginPath();
    }


    export function init():void {
        for (var key in egret_h5_graphics) {
            egret.Graphics.prototype[key] = egret_h5_graphics[key];
        }
        egret.RendererContext.createRendererContext = function (canvas:any) {
            return new egret.HTML5CanvasRenderer(canvas);
        }
    }

}


egret_h5_graphics.init();