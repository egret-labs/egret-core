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

/// <reference path="../context/renderer/HTML5CanvasRenderer.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="DisplayObject.ts"/>

module ns_egret {

    export class Shape extends ns_egret.DisplayObject {

        public graphic:Graphic;

        constructor() {
            super();
            var rendererContext = ns_egret.MainContext.instance.rendererContext;
            this.graphic = new Graphic(rendererContext);
        }

        hitTest(x, y) {
            return super.hitTest(x, y);
        }

        render(renderContext:RendererContext) {
            this.graphic._draw();
        }

    }


    export class ShapeRect extends ns_egret.Shape {

        private _color:number;
        private _colorDirty:boolean = true;
        private _sizeDirty:boolean = false;

        constructor() {
            super();
            this._color = 0xFFFFFF;

        }

        public get color():number {
            return this._color;
        }

        public set color(value:number) {
            this._colorDirty = true;
            this._color = value;
        }

        public get alpha():number {
            return this._alpha;
        }

        public set alpha(value:number) {
            this._colorDirty = true;
            this._alpha = value;
        }

        /**
         * 宽度，优先顺序为 显式设置宽度 > 测量宽度
         * @returns {number}
         */
        public get width():number {
            return this.getBounds().width;
        }

        /**
         * 高度，优先顺序为 显式设置高度 > 测量高度
         * @returns {number}
         */
        public get height():number {
            return this.getBounds().height;
        }

        /**
         * 显式设置宽度
         * @param value
         */
        public set width(value:number) {
            this._explicitWidth = value
            this._sizeDirty = true;
        }


        /**
         * 显式设置高度
         * @param value
         */
        public set height(value:number) {
            this._explicitHeight = value;
            this._sizeDirty = true;
        }

        render(renderContext:RendererContext) {
            if (this._colorDirty || this._sizeDirty) {
                this._colorDirty = false;
                this._sizeDirty = false;

                this.graphic.clear();
                this.graphic.beginFill(this._color, this._alpha);
                this.graphic.drawRect(0, 0, this._explicitWidth, this._explicitHeight);

            }
            this.graphic._draw();
        }
    }


    export class Graphic {


        private canvasContext:CanvasRenderingContext2D;
        private commandQueue:Array<Command>;

        constructor(private renderContext:RendererContext) {
            this.canvasContext = (<HTML5CanvasRenderer>renderContext).canvasContext;
            this.commandQueue = [];

        }

        public beginFill(color:number, alpha:number):void {
            var _colorBlue = color & 0x0000FF;
            var _colorGreen = (color & 0x00ff00) >> 8;
            var _colorRed = color >> 16;
            var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";

            this.commandQueue.push(new Command(this._setStyle, this, [_colorStr]))

        }

        private _setStyle(colorStr:string):void {
            this.canvasContext.fillStyle = colorStr;
        }

        public drawRect(x:number, y:number, width:number, height:number):void {

            var rendererContext = <HTML5CanvasRenderer>this.renderContext;
            this.commandQueue.push(new Command(this.canvasContext.fillRect, this.canvasContext,
                [rendererContext._transformTx + x,
                    rendererContext._transformTy + y,
                    width,
                    height])
            );
        }

        public clear():void {
            this.commandQueue.length = 0;
        }

        public endFill():void {
        }

        public _draw():void {
            for (var i = 0 , length = this.commandQueue.length; i < length; i++) {
                var command:Command = this.commandQueue[i];
                command.method.apply(command.thisObject, command.args);
            }
        }
    }

    class Command {

        constructor(public method:Function, public thisObject:any, public args:Array<any>) {

        }


    }

}