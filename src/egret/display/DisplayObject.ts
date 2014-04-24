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
/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/RenderFilter.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../geom/Matrix.ts"/>
/// <reference path="../geom/Point.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../texture/Texture.ts"/>

module ns_egret {
    /**
     * @class ns_egret.DisplayObject
     * @classdesc 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。
     *
     * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。
     *
     * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵），所有显示对象都继承自 DisplayObject 类。
     *
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
     *
     * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上），这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
     *
     * 任何继承自DisplayObject的类都必须实现以下方法
     * render();
     * _measureBounds()
     * 不允许重写以下方法
     * draw();
     * getBounds();
     */
    export class DisplayObject extends EventDispatcher implements RenderData {

        public name:string;

        public _texture_to_render:Texture;

        private _parent:DisplayObjectContainer = null;
        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象
         * @member {ns_egret.DisplayObjectContainer} ns_egret.DisplayObject#parent
         */
        public get parent():DisplayObjectContainer {
            return this._parent;
        }

        /**
         * 仅供框架内部调用。
         */
        public _parentChanged(parent:DisplayObjectContainer):void {
            this._parent = parent;
        }

        public _x:number;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * @member {number} ns_egret.DisplayObject#x
         */
        public get x():number {
            return this._x;
        }

        public set x(value:number) {
            this._x = value;
        }


        public _y:number;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * @member {number} ns_egret.DisplayObject#y
         */
        public get y():number {
            return this._y;
        }

        public set y(value:number) {
            this._y = value;
        }

        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * @member {number} ns_egret.DisplayObject#scaleX
         * @default 1
         */
        public _scaleX:number = 1;

        public get scaleX():number{
            return this._scaleX;
        }
        public set scaleX(value:number){
            this._scaleX = value;
        }

        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * @member {number} ns_egret.DisplayObject#scaleY
         * @default 1
         */
        public _scaleY:number = 1;

        public get scaleY():number{
            return this._scaleY;
        }
        public set scaleY(value:number){
            this._scaleY = value;
        }

        public anchorPointX:number = 0;

        public anchorPointY:number = 0;

        public relativeAnchorPointX:number = 0;

        public relativeAnchorPointY:number = 0;

        /**
         * 显示对象是否可见。
         * @member {boolean} ns_egret.DisplayObject#x
         */
        public visible:boolean;
        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位
         * @member {number} ns_egret.DisplayObject#rotation
         * @default 0
         */
        public rotation:number = 0;
        /**
         * 表示指定对象的 Alpha 透明度值
         * @member {number} ns_egret.DisplayObject#alpha
         *  @default 1
         */
        public alpha:number = 1;

        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} ns_egret.DisplayObject#skewX
         * @default 0
         */
        public skewX:number = 0;

        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} ns_egret.DisplayObject#skewY
         * @default 0
         */
        public skewY:number = 0;

        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} ns_egret.DisplayObject#touchEnabled
         * @default true
         */
        public touchEnabled:boolean;

        public blendMode:BlendMode;

        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         */
        public scrollRect:Rectangle;


        /**
         * 测量宽度
         * @returns {number}
         */
        public get measuredWidth():number {
            return this._measureBounds().width;
        }

        /**
         * 测量高度
         * @returns {number}
         */
        public get measuredHeight():number {
            return this._measureBounds().height;
        }

        public _explicitWidth:number;
        /**
         * 显式设置宽度
         * @returns {number}
         */
        public get explicitWidth():number {
            return this._explicitWidth;
        }

        public _explicitHeight:number;
        /**
         * 显式设置高度
         * @returns {number}
         */
        public get explicitHeight():number {
            return this._explicitHeight;
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
            this._explicitWidth = value;
        }


        /**
         * 显式设置高度
         * @param value
         */
        public set height(value:number) {
            this._explicitHeight = value;
        }

        /**
         * 调用显示对象被指定的 mask 对象遮罩
         */
        public mask:Rectangle;

        public worldTransform:ns_egret.Matrix;
        public worldBounds:ns_egret.Rectangle;
        public worldAlpha:number;


        constructor() {
            super();
            this.x = this.y = 0;
            this.visible = true;
            this.worldTransform = new ns_egret.Matrix();
            this.worldBounds = new ns_egret.Rectangle(0, 0, 0, 0);
            this.worldAlpha = 1;
        }

        /**
         * @private
         * @param renderContext
         */
        public draw(renderContext:RendererContext) {
            if (!this.visible) {
                return;
            }
            var hasDrawCache = unstable.cache_api.draw.call(this, renderContext);
            if (hasDrawCache) {
                return;
            }
            var o = this;
            renderContext.setAlpha(o.worldAlpha, o.blendMode);
            renderContext.setTransform(o.worldTransform);
            if (o.mask || o.scrollRect) {
                renderContext.save();
                if (o.scrollRect) {
                    renderContext.clip(o.scrollRect.x, o.scrollRect.y, o.scrollRect.width, o.scrollRect.height);
                }
                else {
                    renderContext.clip(o.mask.x, o.mask.y, o.mask.width, o.mask.height);
                }
            }
            this.render(renderContext);
            if (o.mask || o.scrollRect) {
                renderContext.restore();
            }
        }


        /**
         * @private
         * @param renderContext
         */
        public updateTransform() {
            var o = this;
            o.worldTransform.identity();
            o.worldTransform = o.worldTransform.appendMatrix(o.parent.worldTransform);
            var anchorX, anchorY;
            if (o.relativeAnchorPointX != 0 || o.relativeAnchorPointY != 0) {
                var bounds = o.getBounds();
                anchorX = bounds.width * o.relativeAnchorPointX;
                anchorY = bounds.height * o.relativeAnchorPointY;
            }
            else {
                anchorX = o.anchorPointX;
                anchorY = o.anchorPointY;
            }
            o.worldTransform.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation,
                o.skewX, o.skewY, anchorX, anchorY);
            if (o.scrollRect) {
                o.worldTransform.append(1, 0, 0, 1, -o.scrollRect.x, -o.scrollRect.y);
            }
            var bounds:ns_egret.Rectangle = DisplayObject.getTransformBounds(o.getBounds(), o.worldTransform);
            o.worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);
            o.worldAlpha = o.parent.worldAlpha * o.alpha;
        }

        /**
         * @private
         * @param renderContext
         */
        public render(renderContext:RendererContext) {

        }

        /**
         * 获取显示对象的测量边界
         * @returns {Rectangle}
         */
        public getBounds() {
            var rect:Rectangle = this._measureBounds();
            var heightSet:boolean = !isNaN(this._explicitHeight);
            var w:number = isNaN(this._explicitWidth) ? rect.width : this._explicitWidth;
            var h:number = isNaN(this._explicitHeight) ? rect.height : this._explicitHeight;
            var x:number = rect.x;
            var y:number = rect.y;
            var anchorX, anchorY;
            if (this.relativeAnchorPointX != 0 || this.relativeAnchorPointY != 0) {
                anchorX = w * this.relativeAnchorPointX;
                anchorY = h * this.relativeAnchorPointY;
            }
            else {
                anchorX = this.anchorPointX;
                anchorY = this.anchorPointY;
            }
            return Rectangle.identity.initialize(x - anchorX, y - anchorY, w, h);
        }

        /**
         * @private
         * @returns {Matrix}
         */
        public getConcatenatedMatrix() {
            var matrix = Matrix.identity.identity();
            var o = this;
            while (o != null) {
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
        public localToGlobal(x = 0, y = 0):ns_egret.Point {
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
        public globalToLocal(x:number = 0, y:number = 0):Point {
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
        public hitTest(x, y, ignoreTouchEnabled:Boolean = false) {
            if (!this.visible || (!ignoreTouchEnabled && !this.touchEnabled)) {
                return null;
            }
            var bound:Rectangle = this.getBounds();
            if (0 < x && x < bound.width && 0 < y && y < bound.height) {
                if (this.mask || this.scrollRect) {
                    if (this.scrollRect
                        && x < this.scrollRect.width
                        && y < this.scrollRect.height) {
                        return this;
                    }
                    else if (this.mask
                        && this.mask.x < x
                        && x < this.mask.x + this.mask.width
                        && this.mask.y < y
                        && y < this.mask.y + this.mask.height) {
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


        public getMatrix() {
            return Matrix.identity.identity().appendTransformFromDisplay(this);
        }

        /**
         * 测量显示对象坐标，这个方法需要子类重写
         * @returns {ns_egret.Rectangle}
         * @private
         */
        public _measureBounds():ns_egret.Rectangle {
            return ns_egret.Rectangle.identity.initialize(0, 0, 0, 0);
        }

        public setAnchorPoint(x:number, y:number) {
            this.anchorPointX = x;
            this.anchorPointY = y;
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

        public _onAddToStage():void {
            this._stage = MainContext.instance.stage;
            this.dispatchEventWith(Event.ADDED_TO_STAGE);
        }

        public _onRemoveFromStage():void {
            this._stage = null;
            this.dispatchEventWith(Event.REMOVED_FROM_STAGE);
        }

        public _stage:Stage;

        public get stage():Stage {
            return this._stage;
        }

        public static _enterFrameCallBackList:Array<any> = [];
        public static _renderCallBackList:Array<any> = [];

        public addEventListener(type:string, listener:Function, thisObject:any, useCapture:Boolean = false, priority:number = 0):void {
            super.addEventListener(type, listener, thisObject, useCapture, priority);
            var isEnterFrame:boolean = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                var list:Array<any> = isEnterFrame ? DisplayObject._enterFrameCallBackList : DisplayObject._renderCallBackList;
                this._insertEventBin(list, listener, thisObject, priority);
            }
        }

        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture:Boolean = false):void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            var isEnterFrame:boolean = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                var list:Array<any> = isEnterFrame ? DisplayObject._enterFrameCallBackList : DisplayObject._renderCallBackList;
                this._removeEventBin(list, listener, thisObject);
            }
        }

        public dispatchEvent(event:Event):boolean {
            if (!event._bubbles) {
                return super.dispatchEvent(event);
            }

            event._reset();
            var list:Array<DisplayObject> = [];//todo 这个list可以服用
            var target:DisplayObject = this;
            while (target) {
                list.unshift(target);
                target = target.parent;
            }

            var length:number = list.length;
            for (var i:number = length - 2; i >= 0; i--) {
                list.push(list[i]);
            }
            length = list.length;
            var targetIndex:number = (length - 1) * 0.5;
            for (var i:number = 0; i < length; i++) {
                var currentTarget:DisplayObject = list[i];
                event._setCurrentTarget(currentTarget);
                event._target = this;
                if (i < targetIndex)
                    event._eventPhase = 1;
                else if (i == targetIndex)
                    event._eventPhase = 2;
                else
                    event._eventPhase = 3;
                currentTarget._notifyListener(event);
                if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
                    break;
                }
            }
            return !event.isDefaultPrevented();
        }

        public willTrigger(type:string):boolean {
            var parent:DisplayObject = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent._parent;
            }
            return false;
        }

        public cacheAsBitmap(bool:boolean):void {
            if (bool) {
                var renderTexture = new ns_egret.RenderTexture();
                renderTexture.drawToTexture(this);
                this._texture_to_render = renderTexture;
            }
        }

        static getTransformBounds(bounds:ns_egret.Rectangle, mtx:ns_egret.Matrix) {
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

var unstable = unstable || {cache_api:{}};
unstable.cache_api.draw = function (renderContext) {
    var display:ns_egret.DisplayObject = this;
    if (display._texture_to_render) {
        var renderTexture = display._texture_to_render;
        var offsetX = renderTexture.offsetX;
        var offsetY = renderTexture.offsetY;
        var width = renderTexture._textureWidth;
        var height = renderTexture._textureHeight;
        display.updateTransform();
        renderContext.setAlpha(display.worldAlpha, display.blendMode);
        renderContext.setTransform(display.worldTransform);
        if (display.mask) {
            renderContext.save();
            renderContext.clip(display.mask.x, display.mask.y, display.mask.width, display.mask.height);
        }
        var scale_factor = ns_egret.MainContext.instance.rendererContext.texture_scale_factor;
        var renderFilter = ns_egret.RenderFilter.getInstance();
        renderFilter.drawImage(renderContext, display, 0, 0, width * scale_factor, height * scale_factor, offsetX, offsetY, width, height);
        if (display.mask) {
            renderContext.restore();
        }
        return true;
    }
    else {
        return false;
    }
}