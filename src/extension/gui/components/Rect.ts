//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret.gui {

    /**
     * @class egret.gui.Rect
     * @classdesc
     * 矩形绘图元素。此组件可响应鼠标事件。
     * @extends egret.gui.UIComponent
     */
    export class Rect extends UIComponent {
        /**
         * 构造函数
         * @method egret.gui.Rect#constructor
         */
        public constructor() {
            super();
            this.touchChildren = false;
            this.$renderRegion = new sys.Region();
        }

        /**
         * @private
         */
        $graphics:Graphics;

        public get graphics():Graphics {
            if (!this.$graphics) {
                this.$graphics = new Graphics();
                this.$graphics.$renderContext.$targetDisplay = this;
            }
            return this.$graphics;
        }

        $render(context:egret.sys.RenderContext):void {
            if (this.$graphics)
                this.$graphics.$render(context);
            super.$render(context);
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            var target = super.$hitTest(stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            if (this.$graphics) {
                this.$graphics.$measureContentBounds(bounds);
            }
        }

        private _fillColor:number = 0xFFFFFF;
        /**
         * 填充颜色
         * @member egret.gui.Rect#fillColor
         */
        public get fillColor():number {
            return this._fillColor;
        }

        public set fillColor(value:number) {
            if (this._fillColor == value)
                return;
            this._fillColor = value;
            this.invalidateDisplayList();
        }

        private _fillAlpha:number = 1;
        /**
         * 填充透明度,默认值为0。
         * @member egret.gui.Rect#fillAlpha
         */
        public get fillAlpha():number {
            return this._fillAlpha;
        }

        public set fillAlpha(value:number) {
            if (this._fillAlpha == value)
                return;
            this._fillAlpha = value;
            this.invalidateDisplayList();
        }

        private _strokeColor:number = 0x444444;
        /**
         * 边框颜色,注意：当strokeAlpha为0时，不显示边框。
         * @member egret.gui.Rect#strokeColor
         */
        public get strokeColor():number {
            return this._strokeColor;
        }

        public set strokeColor(value:number) {
            if (this._strokeColor == value)
                return;
            this._strokeColor = value;
            this.invalidateDisplayList();
        }

        private _strokeAlpha:number = 0;
        /**
         * 边框透明度，默认值为0。
         * @member egret.gui.Rect#strokeAlpha
         */
        public get strokeAlpha():number {
            return this._strokeAlpha;
        }

        public set strokeAlpha(value:number) {
            if (this._strokeAlpha == value)
                return;
            this._strokeAlpha = value;
            this.invalidateDisplayList();
        }

        private _strokeWeight:number = 1;
        /**
         * 边框粗细(像素),注意：当strokeAlpha为0时，不显示边框。
         * @member egret.gui.Rect#strokeWeight
         */
        public get strokeWeight():number {
            return this._strokeWeight;
        }

        public set strokeWeight(value:number) {
            if (this._strokeWeight == value)
                return;
            this._strokeWeight = value;
            this.invalidateDisplayList();
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {Rectangle}
         * @private
         */
        //public _measureBounds():egret.Rectangle {
        //    var bounds:Rectangle = super._measureBounds();
        //    var w:number = this.width;
        //    var h:number = this.height;
        //    var x:number = 0;
        //    var y:number = 0;
        //    if (x < bounds.x) {
        //        bounds.x = x;
        //    }
        //    if (y < bounds.y) {
        //        bounds.y = y;
        //    }
        //    if (x + w > bounds.right) {
        //        bounds.right = x + w;
        //    }
        //    if (y + h > bounds.bottom) {
        //        bounds.bottom = y + h;
        //    }
        //    return bounds;
        //}

        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.Rect#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledWidth);
            var g:Graphics = this.graphics;
            g.clear();
            g.beginFill(this._fillColor, this._fillAlpha);
            if (this._strokeAlpha > 0) {
                g.lineStyle(this._strokeWeight, this._strokeColor, this._strokeAlpha, true, "normal", "square", "miter");
            }
            g.drawRect(0, 0, unscaledWidth, unscaledHeight);
            g.endFill();
        }

    }
}