/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../core/Geometry.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="../interactive/TouchContext.ts"/>
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
    /**
     * @class DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。<br>
     * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。<br>
     * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵）。<br>
     * 所有显示对象都继承自 DisplayObject 类。<br>
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。<br>
     * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上）。<br>
     * 这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。<br>
     *
     * 任何继承自DisplayObject的类都必须实现以下方法<br>
     * _measureBounds()<br>
     * 不允许重写以下方法<br>
     * visit()<br>
     * updateTransform()<br>
     * draw()</br> (beta)
     */
    export class DisplayObject extends EventDispatcher {

        public name:string;

        private _parent:DisplayObjectContainer = null;
        /**
         * @description {Sting} 表示包含此显示对象的 DisplayObjectContainer 对象
         */
        public get parent():DisplayObjectContainer{
            return this._parent;
        }
        /**
         * 仅供框架内部调用。
         */
        public _parentChanged(parent:DisplayObjectContainer):void{
            this._parent = parent;
        }

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         */
        public x:number;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         */
        public y:number;

        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         */
        public scaleX:number = 1;

        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         */
        public scaleY:number = 1;

        public anchorPointX:number = 0;

        public anchorPointY:number = 0;

        public relativeAnchorPointX:number = 0;

        public relativeAnchorPointY:number = 0;

        /**
         * 显示对象是否可见。
         */
        public visible:Boolean;
        /**
         * @description 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位
         */
        public rotation:number = 0;
        /**
         * @description 表示指定对象的 Alpha 透明度值
         */
        public alpha:number = 1;

        /**
         * 表示DisplayObject的x方向斜切
         */
        public skewX:number = 0;

        /**
         * 表示DisplayObject的y方向斜切
         */
        public skewY:number = 0;

        /**
         * 指定此对象是否接收鼠标/触摸事件
         */
        public touchEnabled:Boolean;

        public blendMode:BlendMode;


        public _contentWidth:number;
        public _contentHeight:number;
        public _isRunning:boolean = false;

        /**
         * 调用显示对象被指定的 mask 对象遮罩
         */
        public mask:Rectangle;


        constructor() {
            super();
            this.x = this.y = 0;
            this.visible = true;
        }

        /**
         * @private
         * @param renderContext
         */
        visit(renderContext:RendererContext) {
            if (!this.visible) {
                return;
            }
            this.preDraw();
            this.draw(renderContext);
//        renderContext.globalAlpha *= .5;
        }

        /**
         * @private
         */
        preDraw() {

        }

        /**
         * @private
         * @param renderContext
         */
        draw(renderContext:RendererContext) {


            var hasDrawCache = unstable.cache_api.draw.call(this, renderContext);
            if (hasDrawCache) {
                return;
            }

            renderContext.save();
            this.updateTransform(renderContext);
            this.render(renderContext);
            renderContext.restore();
        }


        /**
         * @private
         * @param renderContext
         */
        updateTransform(renderContext:RendererContext) {
            var o = this;
            var mtx = Matrix2D.identity.appendTransformFromDisplay(this);
            renderContext.setAlpha(o.alpha, o.blendMode);
            renderContext.transform(mtx);
            if (o.mask) {
                renderContext.clip(o.mask.x, o.mask.y, o.mask.width, o.mask.height);
            }
        }

        /**
         * @private
         * @param renderContext
         */
        render(renderContext:RendererContext) {

        }

        /**
         * 获取显示对象的测量边界
         * @returns {Rectangle}
         */
        getBounds() {
            if (this._contentWidth !== undefined) { //这里严格意义上只用_contentWidth判断是不严谨的，但是为了性能考虑，暂时这样
                var anchorX, anchorY;
                if (this.relativeAnchorPointX != 0 || this.relativeAnchorPointY != 0) {
                    anchorX = this._contentWidth * this.relativeAnchorPointX;
                    anchorY = this._contentHeight * this.relativeAnchorPointY;
                }
                else {
                    anchorX = this.anchorPointX;
                    anchorY = this.anchorPointY;
                }
                return Rectangle.identity.initialize(-anchorX, -anchorY,
                    this._contentWidth, this._contentHeight);
            }
            else {
                return this._measureBounds();
            }
        }

        /**
         * 显式设置显示对象的size
         * @param contentWidth
         * @param contentHeight
         */
        setContentSize(contentWidth:number, contentHeight:number) {
            this._contentWidth = contentWidth;
            this._contentHeight = contentHeight;
        }


        /**
         * @private
         * @returns {Matrix2D}
         */
        getConcatenatedMatrix() {
            var matrix = Matrix2D.identity.identity();
            var o = this;
            while (o != null) {
//            matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
                if (o.relativeAnchorPointX != 0 || o.relativeAnchorPointY != 0) {
                    var bounds = o.getBounds();
                    matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY,
                            bounds.width * o.relativeAnchorPointX, bounds.height * o.relativeAnchorPointY);
                }
                else {
                    matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.anchorPointX, o.anchorPointY);
                }
                o = o.parent;
            }
            return matrix;
        }

        /**
         * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
         * @returns {ns_egret.Point}
         */
        localToGlobal(x = 0, y = 0):ns_egret.Point {
            var mtx = this.getConcatenatedMatrix();
            mtx.append(1, 0, 0, 1, x, y);
            var result = Point.identity;
            result.x = mtx.tx;
            result.y = mtx.ty;
            return result;
        }

        /**
         * 将 point 对象从舞台（全局坐标转换为显示对象（本地）坐标。
         * @returns {ns_egret.Point}
         */
        globalToLocal(x = 0, y = 0):ns_egret.Point {
//            todo,现在的实现是错误的
            var mtx = this.getConcatenatedMatrix();
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            var result = Point.identity;
            result.x = mtx.tx;
            result.y = mtx.ty;
            return result;
        }

        /**
         * 检测指定坐标是否在显示对象内
         * @param x
         * @param y
         * @param ignoreTouchEnabled 是否忽略TouchEnabled
         * @returns {*}
         */
        hitTest(x, y, ignoreTouchEnabled:Boolean = false) {
            if (!this.visible || (!ignoreTouchEnabled && !this.touchEnabled)) {
                return null;
            }
            var bound:Rectangle = this.getBounds();

            if (0 < x && x < bound.width
                && 0 < y && y < bound.height) {
                if (this.mask) {
                    if (this.mask.x < x && x < this.mask.x + this.mask.width && this.mask.y < y && y < this.mask.y + this.mask.height) {
                        return this;
                    }
                    return null;
                }
                return this;
            }
            else {
                return null;
            }
        }


        getMatrix() {
            return Matrix2D.identity.identity().appendTransformFromDisplay(this);
        }

        /**
         * 测量显示对象坐标，这个方法需要子类重写
         * @returns {ns_egret.Rectangle}
         * @private
         */
        _measureBounds():ns_egret.Rectangle {
            ns_egret.Logger.fatal("子类需要实现的方法");
            return ns_egret.Rectangle.identity;
        }

        public setAnchorPoint(x:number, y:number) {
            this.anchorPointX = x;
            this.anchorPointY = y;
        }

        public setRelativeAnchorPoint(x:number, y:number) {
            if (x < 0 || x > 1 || y < 0 || y > 1) {
                ns_egret.Logger.warning("相对锚点只接受0-1之间的值");
            }
            else {
                this.relativeAnchorPointX = x;
                this.relativeAnchorPointY = y;
            }
        }

        public getOffsetPoint() {
            var o = this;
            var regX = o.anchorPointX;
            var regY = o.anchorPointY;
            if (o.relativeAnchorPointX != 0 || o.relativeAnchorPointY != 0) {
                var bounds = o.getBounds();
                regX = o.relativeAnchorPointX * bounds.width;
                regY = o.relativeAnchorPointY * bounds.height;
            }
            var result = Point.identity;
            result.x = regX;
            result.y = regY;
            return result;
        }

        /**
         * 从显示列表中删除
         */
        public removeFromParent() {
            if (this && this.parent) {
                this.parent.removeChild(this);
            }
        }

        public _onAddToStage() {
            this._isRunning = true;
            this.dispatchEvent(Event.ADDED_TO_STAGE);
        }

        public _onRemoveFromStage() {
            this._isRunning = false;
            this.dispatchEvent(Event.REMOVED_FROM_STAGE);
        }

        public isRunning() {
            return this._isRunning;
        }


        static getTransformBounds(displayObject:DisplayObject) {
            var bounds = displayObject.getBounds();
            var mtx = displayObject.getMatrix();
            var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;

//            if (x || y) {
//                mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
//            }
//        if (matrix) { mtx.prependMatrix(matrix); }

            var x_a = width * mtx.a, x_b = width * mtx.b;
            var y_c = height * mtx.c, y_d = height * mtx.d;
            var tx = mtx.tx, ty = mtx.ty;

            var minX = tx, maxX = tx, minY = ty, maxY = ty;

            if ((x = x_a + tx) < minX) {
                minX = x;
            } else if (x > maxX) {
                maxX = x;
            }
            if ((x = x_a + y_c + tx) < minX) {
                minX = x;
            } else if (x > maxX) {
                maxX = x;
            }
            if ((x = y_c + tx) < minX) {
                minX = x;
            } else if (x > maxX) {
                maxX = x;
            }

            if ((y = x_b + ty) < minY) {
                minY = y;
            } else if (y > maxY) {
                maxY = y;
            }
            if ((y = x_b + y_d + ty) < minY) {
                minY = y;
            } else if (y > maxY) {
                maxY = y;
            }
            if ((y = y_d + ty) < minY) {
                minY = y;
            } else if (y > maxY) {
                maxY = y;
            }

            return bounds.initialize(minX, minY, maxX - minX, maxY - minY);

        }
    }

}

var unstable = unstable || {};
unstable.cache_api = {};
unstable.cache_api.cacheAsBitmap = function (bool) {
    var display:ns_egret.DisplayObject = this;
    if (bool) {


        var renderTexture = new ns_egret.RenderTexture();
        renderTexture.drawToTexture(display);
        display.renderTexture = renderTexture;
    }
}
unstable.cache_api.draw = function (renderContext) {
    var display = this;
    if (display.renderTexture) {
        renderContext.save();
        this.updateTransform(renderContext);
        var renderTexture = display.renderTexture;
        var width = renderTexture.getTextureWidth();
        var height = renderTexture.getTextureHeight();
        var offsetX = renderTexture.offsetX;
        var offsetY = renderTexture.offsetY;
        renderContext.drawImage(display.renderTexture, 0, 0, width, height, offsetX, offsetY, width, height);
        renderContext.restore();
        return true;
    }
    else {
        return false;
    }
}

ns_egret.DisplayObject.prototype.cacheAsBitmap = unstable.cache_api.cacheAsBitmap;