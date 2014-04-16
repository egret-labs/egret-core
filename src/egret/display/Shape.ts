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

/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObject.ts"/>

module ns_egret {

    export class Shape extends ns_egret.DisplayObject {

        hitTest(x,y){
            return super.hitTest(x,y);
        }

    }


    export class ShapeRect extends ns_egret.Shape {

        private _color:number;
        private _colorRed:number;
        private _colorBlue:number;
        private _colorGreen:number;
        private _alpha:number;
        private _colorStr:string;
        private _colorDirty:boolean = true;

        constructor(){
            this._color = 0xFFFFFF;
            super();
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

        render(renderContext:RendererContext) {
            if (this._colorDirty) {
                var value = this._color;
                this._colorBlue = value & 0x0000FF;
                this._colorGreen = (value & 0x00ff00) >> 8;
                this._colorRed = value >> 16;
                this._colorStr = "rgba(" + this._colorRed + "," + this._colorGreen + "," + this._colorBlue + "," + this._alpha + ")";
                this._colorDirty = false;
            }
            var context = renderContext.canvasContext;
            context.fillStyle = this._colorStr;
            context.fillRect(renderContext._transformTx, renderContext._transformTy, this._contentWidth, this._contentHeight);

        }
    }

}