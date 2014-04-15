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
/// <reference path="../geom/Rectangle.ts"/>
///<reference path="DisplayObjectContainer.ts" />
///<reference path="../core/StageDelegate.ts" />
module ns_egret{
    export class Stage extends DisplayObjectContainer {

        public static _invalidateRenderFlag:boolean = false;
        /**
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 render 事件的显示对象发送一个 render 事件。
         * 每次您希望 Egret 发送 render 事件时，都必须调用 invalidate() 方法。
         */
        public invalidate():void{
            Stage._invalidateRenderFlag = true;
        }
        /**
         * 舞台宽度（坐标系宽度，非设备宽度）
         */
        public stageWidth:number;
        /**
         * 舞台高度（坐标系高度，非设备高度）
         */
        public stageHeight:number;

        public constructor() {
            super();
            this.touchEnabled = true;
            this._stage = this;
            var canvas:HTMLCanvasElement = document.getElementById(StageDelegate.canvas_name);
            this.stageWidth = canvas.width;
            this.stageHeight = canvas.height;
        }

        /**
         * @see egret.DisplayObject.hitTest
         * @param x
         * @param y
         * @returns {DisplayObject}
         */
        public hitTest(x, y) {
//            var result = super.hitTest(x, y);
//            if (result == null) {
//                result = this;
//            }
//            return result;
            if (!this.touchEnabled) {
                return null;
            }
            var result:DisplayObject;
            if (!this.visible) {
                return this;
            }
            var children = this._children;
            var l = children.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                var o = child;
                var offsetPoint = o.getOffsetPoint();
                var mtx = Matrix.identity.identity().prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation,
                    0, 0, offsetPoint.x, offsetPoint.y);
                mtx.invert();
                var point = Matrix.transformCoords(mtx, x, y);
                result = child.hitTest(point.x, point.y, true);
                if (result) {
                    if (result.touchEnabled) {
                        return result;
                    }
                }
            }
            return this;
        }

        /**
         * @see egret.DisplayObject.getBounds
         * @returns {Rectangle}
         */
        public getBounds() {
            //todo
            return Rectangle.identity.initialize(0, 0, 100000, 100000);
//            return Rectangle.identity.initialize(0, 0, this.stageWidth, this.stageHeight);
        }

        public updateTransform() {
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child.updateTransform();
            }
        }

    }
}
