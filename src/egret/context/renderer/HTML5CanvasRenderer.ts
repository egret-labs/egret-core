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
     * @private
     */
    export class HTML5CanvasRenderer extends RendererContext {

        private canvas:HTMLCanvasElement;
        /**
         * @member egret.HTML5CanvasRenderer#canvasContext
         */
        private canvasContext:CanvasRenderingContext2D;

        private _matrixA:number;
        private _matrixB:number;
        private _matrixC:number;
        private _matrixD:number;
        private _matrixTx:number;
        private _matrixTy:number;

        public _transformTx:number;
        public _transformTy:number;

        private blendValue:string;

        private _cacheCanvas:HTMLCanvasElement;
        private _cacheCanvasContext:CanvasRenderingContext2D;

        private useCacheCanvas:boolean;
        public drawCanvasContext:CanvasRenderingContext2D;

        public constructor(canvas?:HTMLCanvasElement, useCacheCanvas:boolean = true) {
            super();
            this.useCacheCanvas = useCacheCanvas;

            this.canvas = canvas || this.createCanvas();
            this.canvasContext = this.canvas.getContext("2d");

            if(useCacheCanvas) {
                this._cacheCanvas = document.createElement("canvas");
                this._cacheCanvas.width = this.canvas.width;
                this._cacheCanvas.height = this.canvas.height;
                this._cacheCanvasContext = this._cacheCanvas.getContext("2d");
                this.drawCanvasContext = this._cacheCanvasContext;
            }
            else {
                this.drawCanvasContext = this.canvasContext;
            }

            this.onResize();

            var f = this.drawCanvasContext.setTransform;
            var that = this;
            this.drawCanvasContext.setTransform = function (a, b, c, d, tx, ty) {
                that._matrixA = a;
                that._matrixB = b;
                that._matrixC = c;
                that._matrixD = d;
                that._matrixTx = tx;
                that._matrixTy = ty;
                f.call(that.drawCanvasContext, a, b, c, d, tx, ty);
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
                container.appendChild(canvas);
            }
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            return canvas;
        }

        private onResize():void {
            //设置canvas宽高
            if (this.canvas) {
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                this.canvas.width = egret.MainContext.instance.stage.stageWidth; //stageW
                this.canvas.height = egret.MainContext.instance.stage.stageHeight; //stageH
                this.canvas.style.width = container.style.width;
                this.canvas.style.height = container.style.height;
//              this.canvas.style.position = "absolute";

                if(this.useCacheCanvas) {
                    this._cacheCanvas.width = this.canvas.width;
                    this._cacheCanvas.height = this.canvas.height;
                }

                this.drawCanvasContext["imageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
                this.drawCanvasContext["webkitImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
                this.drawCanvasContext["mozImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
                this.drawCanvasContext["msImageSmoothingEnabled"] = RendererContext.imageSmoothingEnabled;
            }
        }

        public clearScreen() {
            var list = RenderFilter.getInstance().getDrawAreaList();
            for (var i:number = 0 , l:number = list.length; i < l; i++) {
                var area = list[i];
                this.clearRect(area.x, area.y, area.width, area.height);
            }
            var stage:Stage = egret.MainContext.instance.stage;
            if(this.useCacheCanvas) {
                this._cacheCanvasContext.clearRect(0, 0, stage.stageWidth, stage.stageHeight);
            }
            this.renderCost = 0;
        }

        public clearRect(x:number, y:number, w:number, h:number) {
//            this.canvasContext.fillRect(x, y, w, h);
            this.canvasContext.clearRect(x, y, w, h);
        }

        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat = undefined) {

//            if (DEBUG && DEBUG.DRAW_IMAGE) {
//                DEBUG.checkDrawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
//            }
            var image = texture._bitmapData;
            destX += this._transformTx;
            destY += this._transformTy;
            var beforeDraw = egret.getTimer();
            if (repeat === undefined) {
                this.drawCanvasContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
            else {
                this.drawRepeatImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
            }
            super.drawImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
            this.renderCost += egret.getTimer() - beforeDraw;
        }

        public drawRepeatImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            if (texture['pattern'] === undefined) {
                var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
                var image = texture._bitmapData;
                var tempImage:HTMLElement = image;
                if (image.width != sourceWidth || image.height != sourceHeight || texture_scale_factor != 1) {
                    var tempCanvas = document.createElement("canvas");
                    tempCanvas.width = sourceWidth * texture_scale_factor;
                    tempCanvas.height = sourceHeight * texture_scale_factor;
                    tempCanvas.getContext("2d").drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth * texture_scale_factor, sourceHeight * texture_scale_factor);
                    tempImage = tempCanvas;
                }
                var pat = this.drawCanvasContext.createPattern(tempImage, repeat);
                texture['pattern'] = pat;
            }
            var pattern = texture['pattern'];
            this.drawCanvasContext.fillStyle = pattern;
            this.drawCanvasContext.translate(destX, destY);
            this.drawCanvasContext.fillRect(0, 0, destWidth, destHeight);
            this.drawCanvasContext.translate(-destX, -destY);
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
                this.drawCanvasContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        public setAlpha(alpha:number, blendMode:string) {
            this.drawCanvasContext.globalAlpha = alpha;
            if (blendMode) {
                this.blendValue = this.blendModes[blendMode];
                this.drawCanvasContext.globalCompositeOperation = this.blendValue;
            }
            else if (this.blendValue != egret.BlendMode.NORMAL) {
                this.blendValue = this.blendModes[egret.BlendMode.NORMAL];
                this.drawCanvasContext.globalCompositeOperation = this.blendValue;
            }
        }

        private blendModes:any;

        private initBlendMode():void {
            this.blendModes = {};
            this.blendModes[BlendMode.NORMAL] = "source-over";
            this.blendModes[BlendMode.ADD] = "lighter";
            this.blendModes[BlendMode.ERASE] = "destination-out";
            this.blendModes[BlendMode.ERASE_REVERSE] = "destination-in";
        }

        public setupFont(textField:TextField, style:egret.ITextStyle = null):void {
            style = style || <egret.ITextStyle>{};
            var italic:boolean = style["italic"] == null ? textField._italic : style["italic"];
            var bold:boolean = style["bold"] == null ? textField._bold : style["bold"];
            var size:number = style["size"] == null ? textField._size : style["size"];
            var fontFamily:string = style["fontFamily"] == null ? textField._fontFamily : style["fontFamily"];
            var ctx = this.drawCanvasContext;
            var font:string = italic ? "italic " : "normal ";
            font += bold ? "bold " : "normal ";
            font += size + "px " + fontFamily;
            ctx.font = font;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
        }


        public measureText(text:string):number {
            var result = this.drawCanvasContext.measureText(text);
            return result.width;
        }

        public drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number, style:egret.ITextStyle = null) {
            this.setupFont(textField, style);
            style = style || <egret.ITextStyle>{};

            var textColor:string;
            if (style.textColor != null) {
                textColor = toColorString(style.textColor);
            }
            else {
                textColor = textField._textColorString;
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

            var renderContext = this.drawCanvasContext;
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
            this.drawCanvasContext.strokeStyle = color;
            this.drawCanvasContext.strokeRect(x, y, w, h);
        }


        public pushMask(mask:Rectangle):void {
            this.drawCanvasContext.save();
            this.drawCanvasContext.beginPath();
            this.drawCanvasContext.rect(mask.x + this._transformTx, mask.y + this._transformTy, mask.width, mask.height);
            this.drawCanvasContext.clip();
            this.drawCanvasContext.closePath();
        }

        public popMask():void {
            this.drawCanvasContext.restore();
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
        }


        public onRenderStart():void {
            this.drawCanvasContext.save();
        }

        public onRenderFinish():void {
            this.drawCanvasContext.restore();
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0);

            if(this.useCacheCanvas) {
                var canvasWidth = this._cacheCanvas.width;
                var canvasHeight = this._cacheCanvas.height;
                var list = RenderFilter.getInstance().getDrawAreaList();
                for (var i:number = 0 , l:number = list.length; i < l; i++) {
                    var area:Rectangle = list[i];
                    var areaX = area.x;
                    var areaY = area.y;
                    var areaWidth = area.width;
                    var areaHeight = area.height;
                    if (areaX + areaWidth > canvasWidth) {
                        areaWidth = canvasWidth - areaX;
                    }
                    if (areaY + areaHeight > canvasHeight) {
                        areaHeight = canvasHeight - areaY;
                    }
                    if (areaWidth > 0 && areaHeight > 0) {
                        this.canvasContext.drawImage(this._cacheCanvas, areaX, areaY, areaWidth, areaHeight, areaX, areaY, areaWidth, areaHeight);
                    }
                }
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

        this._pushCommand(new Command(this._setStyle, this, [_colorStr]))

    }

    export function drawRect(x:number, y:number, width:number, height:number):void {
        this._pushCommand(new Command(
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
        this.checkRect(x, y, width, height);
    }

    export function drawCircle(x:number, y:number, r:number):void {

        this._pushCommand(new Command(
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
        this.checkRect(x - r, y - r, 2 * r, 2 * r);
    }

    export function drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {
        //非等值椭圆角实现
        this._pushCommand(new Command(
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
        this.checkRect(x, y, width, height);
    }

    export function drawEllipse(x:number, y:number, width:number, height:number):void {
        //基于均匀压缩算法
        this._pushCommand(new Command(
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
        this.checkRect(x - width, y - height, 2 * width, 2 * height);
    }

    export function lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {
        if (this.strokeStyleColor) {
            this.createEndLineCommand();
            this._pushCommand(this.endLineCommand);
        }

        var _colorBlue = color & 0x0000FF;
        var _colorGreen = (color & 0x00ff00) >> 8;
        var _colorRed = color >> 16;
        var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        this.strokeStyleColor = _colorStr;

        this._pushCommand(new Command(
            function (lineWidth, strokeStyle) {
                this.canvasContext.lineWidth = lineWidth;
                this.canvasContext.strokeStyle = strokeStyle;
                this.canvasContext.beginPath();
            },
            this,
            [thickness, _colorStr]
        ));

        this.moveTo(this.lineX, this.lineY);
    }

    export function lineTo(x:number, y:number):void {
        this._pushCommand(new Command(
            function (x, y) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.lineTo(rendererContext._transformTx + x, rendererContext._transformTy + y);
            },
            this,
            [x, y]
        ));
        this.checkPoint(this.lineX, this.lineY);
        this.lineX = x;
        this.lineY = y;
        this.checkPoint(x, y);
    }

    export function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void {

        this._pushCommand(new Command(
            function (x, y, ax, ay) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.quadraticCurveTo(rendererContext._transformTx + x, rendererContext._transformTy + y,
                        rendererContext._transformTx + ax, rendererContext._transformTy + ay);
            },
            this,
            [controlX, controlY, anchorX, anchorY]
        ));
        this.checkPoint(this.lineX, this.lineY);
        this.lineX = anchorX;
        this.lineY = anchorY;
        this.checkPoint(controlX, controlY);
        this.checkPoint(anchorX, anchorY);
    }

    export function moveTo(x:number, y:number):void {
        this._pushCommand(new Command(
            function (x, y) {
                var rendererContext = <egret.HTML5CanvasRenderer>this.renderContext;
                var canvasContext:CanvasRenderingContext2D = this.canvasContext;
                canvasContext.moveTo(rendererContext._transformTx + x, rendererContext._transformTy + y);
            },
            this,
            [x, y]
        ));
    }

    export function clear():void {
        this.commandQueue.length = 0;
        this.lineX = 0;
        this.lineY = 0;
        this.strokeStyleColor = null;
        this.fillStyleColor = null;
        this._dirty = false;
        this._minX = 0;
        this._minY = 0;
        this._maxX = 0;
        this._maxY = 0;
        this._firstCheck = true;
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
    }

    export function _fill():void {
        if (this.fillStyleColor) {
            this.createEndFillCommand();
            this._pushCommand(this.endFillCommand);
            this.fillStyleColor = null;
        }
        if (this.strokeStyleColor) {
            this.createEndLineCommand();
            this._pushCommand(this.endLineCommand);
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

    export function _pushCommand(cmd:any):void {
        this.commandQueue.push(cmd);
        this._dirty = true;
    }

    export function _draw(renderContext:egret.RendererContext):void {
        var length = this.commandQueue.length;
        if (length == 0) {
            return;
        }
        this.renderContext = renderContext;
        this.canvasContext = (<egret.HTML5CanvasRenderer>this.renderContext).drawCanvasContext;
        var canvasContext:CanvasRenderingContext2D = this.canvasContext;

        canvasContext.save();
        if (this.strokeStyleColor && length > 0 && this.commandQueue[length - 1] != this.endLineCommand) {
            this.createEndLineCommand();
            this._pushCommand(this.endLineCommand);
            length = this.commandQueue.length;
        }
        for (var i = 0; i < length; i++) {
            var command:Command = this.commandQueue[i];
            command.method.apply(command.thisObject, command.args);
        }
        canvasContext.restore();
        this._dirty = false;
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
            return new egret.HTML5CanvasRenderer(canvas, false);
        }
    }

}


egret_h5_graphics.init();