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
/// <reference path="../core/MainContext.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="Graphics.ts"/>

module ns_egret {

    export class Shape extends ns_egret.DisplayObject {

        public constructor() {
            super();
        }

        private _graphics:Graphics;

        public get graphics():Graphics{
            if(!this._graphics){
                var rendererContext = ns_egret.MainContext.instance.rendererContext;
                this._graphics = new Graphics(rendererContext);
            }
            return this._graphics;
        }

        public _render(renderContext:RendererContext):void {
            if(this._graphics)
                this._graphics._draw();
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
            return this.getBounds(Rectangle.identity).width;
        }

        /**
         * 高度，优先顺序为 显式设置高度 > 测量高度
         * @returns {number}
         */
        public get height():number {
            return this.getBounds(Rectangle.identity).height;
        }

        /**
         * 显式设置宽度
         * @param value
         */
        public set width(value:number) {
            super._setWidth(value);
            this._sizeDirty = true;
        }


        /**
         * 显式设置高度
         * @param value
         */
        public set height(value:number) {
            super._setHeight(value);
            this._sizeDirty = true;
        }

        public _render(renderContext:RendererContext):void {
            if (this._colorDirty || this._sizeDirty) {
                this._colorDirty = false;
                this._sizeDirty = false;

                this.graphics.clear();
                this.graphics.beginFill(this._color, this._alpha);
                this.graphics.drawRect(0, 0, this._explicitWidth, this._explicitHeight);

            }
            this.graphics._draw();
        }
    }
}