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

/// <reference path="../context/MainContext.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="Graphics.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

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