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
     * @extends egret.DisplayObjectContainer
     * @class egret.Sprite
     * @classdesc Sprite 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。Sprite 对象与影片剪辑类似，但没有时间轴。Sprite 是不需要时间轴的对象的相应基类。例如，Sprite 将是通常不使用时间轴的用户界面 (UI) 组件的逻辑基类。
     * @link http://docs.egret-labs.org/post/manual/displayobj/aboutdisplayobj.html 显示对象的基本概念
     */
    export class Sprite extends DisplayObjectContainer {

        /**
         * 创建一个 egret.Sprite 对象
         */
        public constructor() {
            super();
        }

        private _graphics:Graphics = null;

        /**
         * 获取 Sprite 中的 Graphics 对象。
         * 指定属于此 sprite 的 Graphics 对象，在此 sprite 中可执行矢量绘图命令。
         * @member {egret.Graphics} egret.Sprite#graphics
         */
        public get graphics():Graphics {
            if (!this._graphics) {
                this._graphics = new Graphics();
                this.needDraw = true;
            }
            return this._graphics;
        }

        public _render(renderContext:RendererContext):void {
            if (this._graphics)
                this._graphics._draw(renderContext);
            super._render(renderContext);
        }

        public _measureBounds():egret.Rectangle {

            var minX = 0, maxX = 0, minY = 0, maxY = 0;
            var l = this._children.length;
            for (var i = 0; i < l; i++) {
                var child = this._children[i];
                if (!child._getFlag(DisplayObjectFlags.VISIBLE)) {
                    continue;
                }

                var childBounds:Rectangle = child.getBounds(Rectangle.identity, false);
                var childBoundsX:number = childBounds.x;
                var childBoundsY:number = childBounds.y;
                var childBoundsW:number = childBounds.width;
                var childBoundsH:number = childBounds.height;

                var childMatrix:Matrix = child._getMatrix();

                var bounds:Rectangle = DisplayObject.getTransformBounds(Rectangle.identity.initialize(childBoundsX, childBoundsY, childBoundsW, childBoundsH), childMatrix);
                var x1 = bounds.x , y1 = bounds.y,
                    x2 = bounds.width + bounds.x,
                    y2 = bounds.height + bounds.y;
                if (x1 < minX || i == 0) {
                    minX = x1;
                }
                if (x2 > maxX || i == 0) {
                    maxX = x2;
                }
                if (y1 < minY || i == 0) {
                    minY = y1;
                }
                if (y2 > maxY || i == 0) {
                    maxY = y2;
                }
            }
            if(this._graphics) {
                var graphicsBounds:Rectangle = this._graphics._measureBounds();
                var x1 = graphicsBounds.x , y1 = graphicsBounds.y,
                    x2 = graphicsBounds.width + graphicsBounds.x,
                    y2 = graphicsBounds.height + graphicsBounds.y;
                if (x1 < minX || i == 0) {
                    minX = x1;
                }
                if (x2 > maxX || i == 0) {
                    maxX = x2;
                }
                if (y1 < minY || i == 0) {
                    minY = y1;
                }
                if (y2 > maxY || i == 0) {
                    maxY = y2;
                }
            }
            return Rectangle.identity.initialize(minX, minY, maxX - minX, maxY - minY);
        }

        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):DisplayObject {
            var result:DisplayObject = super.hitTest(x, y, ignoreTouchEnabled);
            if (result) {
                return result;
            }
            else if (this._graphics) {
                return DisplayObject.prototype.hitTest.call(this, x, y, ignoreTouchEnabled);
            }
            return null;
        }
    }
}