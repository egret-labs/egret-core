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
/// <reference path="../context/renderer/RenderFilter.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="RenderTexture.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../geom/Matrix.ts"/>
/// <reference path="../geom/Point.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../../jslib/NumberUtils.ts"/>

module egret {
    /**
     * @class egret.DisplayObject
     * @extends egret.EventDispatcher
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
     * _render();
     * _measureBounds()
     * 不允许重写以下方法
     * _draw();
     * getBounds();
     *
     */
    export class DisplayObject extends EventDispatcher implements RenderData {

        public constructor() {
            super();
            this.worldTransform = new egret.Matrix();
            this.worldBounds = new egret.Rectangle(0, 0, 0, 0);
            this._cacheBounds = new egret.Rectangle(0, 0, 0, 0);
        }

        public name:string;

        public _texture_to_render:Texture;

        public _parent:DisplayObjectContainer = null;

        /**
         * @event egret.Event.event:ADDED_TO_STAGE
         */
        private _cacheAsBitmap:boolean = false;

        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象
         * @member {egret.DisplayObjectContainer} egret.DisplayObject#parent
         */
        public get parent():DisplayObjectContainer {
            return this._parent;
        }

        public _parentChanged(parent:DisplayObjectContainer):void {
            this._parent = parent;
        }

        public _x:number = 0;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * @member {number} egret.DisplayObject#x
         */
        public get x():number {
            return this._x;
        }

        public set x(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._x = value;
            }
        }


        public _y:number = 0;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * @member {number} egret.DisplayObject#y
         */
        public get y():number {
            return this._y;
        }

        public set y(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._y = value;
            }
        }

        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * @member {number} egret.DisplayObject#scaleX
         * @default 1
         */
        public _scaleX:number = 1;

        public get scaleX():number {
            return this._scaleX;
        }

        public set scaleX(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._scaleX = value;
            }
        }

        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * @member {number} egret.DisplayObject#scaleY
         * @default 1
         */
        public _scaleY:number = 1;

        public get scaleY():number {
            return this._scaleY;
        }

        public set scaleY(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._scaleY = value;
            }
        }

        /**
         * 表示从对象绝对锚点X。
         * @member {number} egret.DisplayObject#anchorOffsetX
         * @default 0
         */
        public _anchorOffsetX:number = 0;

        public get anchorOffsetX():number {
            return this._anchorOffsetX;
        }

        public set anchorOffsetX(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._anchorOffsetX = value;
            }
        }

        /**
         * 表示从对象绝对锚点Y。
         * @member {number} egret.DisplayObject#anchorOffsetY
         * @default 0
         */
        public _anchorOffsetY:number = 0;

        public get anchorOffsetY():number {
            return this._anchorOffsetY;
        }

        public set anchorOffsetY(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._anchorOffsetY = value;
            }
        }

        /**
         * 表示从对象相对锚点X。
         * @member {number} egret.DisplayObject#anchorX
         * @default 0
         */
        public _anchorX:number = 0;

        public get anchorX():number {
            return this._anchorX;
        }

        public set anchorX(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._anchorX = value;
            }
        }

        /**
         * 表示从对象相对锚点Y。
         * @member {number} egret.DisplayObject#anchorY
         * @default 0
         */
        public _anchorY:number = 0;

        public get anchorY():number {
            return this._anchorY;
        }

        public set anchorY(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._anchorY = value;
            }
        }

        /**
         * 显示对象是否可见。
         * @member {boolean} egret.DisplayObject#visible
         */
        public visible:boolean = true;
        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位
         * @member {number} egret.DisplayObject#rotation
         * @default 0
         */
        public _rotation:number = 0;

        public get rotation():number {
            return this._rotation;
        }

        public set rotation(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._rotation = value;
            }
        }

        /**
         * 表示指定对象的 Alpha 透明度值
         * @member {number} egret.DisplayObject#alpha
         *  @default 1
         */
        public _alpha:number = 1;

        public get alpha():number {
            return this._alpha;
        }

        public set alpha(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._alpha = value;
            }
        }

        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         */
        private _skewX:number = 0;

        public get skewX():number {
            return this._skewX;
        }

        public set skewX(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._skewX = value;
            }
        }

        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         */
        private _skewY:number = 0;

        public get skewY():number {
            return this._skewY;
        }

        public set skewY(value:number) {
            if (NumberUtils.isNumber(value)) {
                this._skewY = value;
            }
        }

        public _touchEnabled:boolean;
        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} egret.DisplayObject#touchEnabled
         * @default true
         */
        public get touchEnabled():boolean {
            return this._touchEnabled;
        }

        public set touchEnabled(value:boolean) {
            this._touchEnabled = value;
        }

        public blendMode:BlendMode;

        public _scrollRect:Rectangle;
        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         *  @member {egret.Rectangle} egret.DisplayObject#scrollRect
         */
        public get scrollRect():Rectangle {
            return this._scrollRect;
        }

        public set scrollRect(value:Rectangle) {
            this._scrollRect = value;
        }


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
         * @member {number} egret.DisplayObject#width
         * @returns {number}
         */
        public get width():number {
            return this.getBounds(Rectangle.identity).width;
        }

        /**
         * 高度，优先顺序为 显式设置高度 > 测量高度
         * @member {number} egret.DisplayObject#height
         * @returns {number}
         */
        public get height():number {
            return this.getBounds(Rectangle.identity).height;
        }

        public _hasWidthSet:Boolean = false;

        /**
         * 显式设置宽度
         * @param value
         */
        public set width(value:number) {
            this._setWidth(value);
        }

        /**
         * @inheritDoc
         */
        public _setWidth(value:number):void {
            this._explicitWidth = value;
            this._hasWidthSet = NumberUtils.isNumber(value);
        }

        public _hasHeightSet:Boolean = false;

        /**
         * 显式设置高度
         * @param value
         */
        public set height(value:number) {
            this._setHeight(value);
        }

        /**
         * @inheritDoc
         */
        public _setHeight(value:number):void {
            this._explicitHeight = value;
            this._hasHeightSet = NumberUtils.isNumber(value);
        }

        /**
         * 调用显示对象被指定的 mask 对象遮罩
         */
        public mask:Rectangle;

        public worldTransform:egret.Matrix;
        public worldBounds:egret.Rectangle;
        public worldAlpha:number = 1;


        /**
         * @private
         * @param renderContext
         */
        public _draw(renderContext:RendererContext):void {
            if (!this.visible) {
                this.destroyCacheBounds();
                return;
            }
            var hasDrawCache = this.drawCacheTexture(renderContext);
            if (hasDrawCache) {
                this.destroyCacheBounds();
                return;
            }
            var o = this;
            renderContext.setAlpha(o.worldAlpha, o.blendMode);
            renderContext.setTransform(o.worldTransform);
            if (o.mask || o._scrollRect) {
                renderContext.save();
                if (o._scrollRect) {
                    renderContext.clip(o._scrollRect.x, o._scrollRect.y, o._scrollRect.width, o._scrollRect.height);
                }
                else {
                    renderContext.clip(o.mask.x, o.mask.y, o.mask.width, o.mask.height);
                }
            }
            this._render(renderContext);
            if (o.mask || o._scrollRect) {
                renderContext.restore();
            }
            this.destroyCacheBounds();
        }


        private drawCacheTexture(renderContext:RendererContext):boolean {
            var display:egret.DisplayObject = this;
            if (display._cacheAsBitmap) {
                var renderTexture = display._texture_to_render;
                var offsetX = renderTexture._offsetX;
                var offsetY = renderTexture._offsetY;
                var width = renderTexture._textureWidth;
                var height = renderTexture._textureHeight;
                display._updateTransform();
                renderContext.setAlpha(display.worldAlpha, display.blendMode);
                renderContext.setTransform(display.worldTransform);
                if (display.mask) {
                    renderContext.save();
                    renderContext.clip(display.mask.x, display.mask.y, display.mask.width, display.mask.height);
                }
                var scale_factor = egret.MainContext.instance.rendererContext.texture_scale_factor;
                var renderFilter = egret.RenderFilter.getInstance();
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


        /**
         * @private
         * @param renderContext
         */
        public _updateTransform():void {
            var o = this;
            o.worldTransform.identity().appendMatrix(o._parent.worldTransform);
            var anchorX, anchorY;
            var resultPoint = o._getOffsetPoint();
            anchorX = resultPoint.x;
            anchorY = resultPoint.y;
            o.worldTransform.appendTransform(o._x, o._y, o._scaleX, o._scaleY, o._rotation,
                o._skewX, o._skewY, anchorX, anchorY);
            if (o._scrollRect) {
                o.worldTransform.append(1, 0, 0, 1, -o._scrollRect.x, -o._scrollRect.y);
            }
            var bounds:egret.Rectangle = DisplayObject.getTransformBounds(o._getSize(Rectangle.identity), o.worldTransform);
            o.worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);
            o.worldAlpha = o._parent.worldAlpha * o._alpha;
        }

        /**
         * @private
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {

        }

        private _cacheBounds:egret.Rectangle;

        /**
         * 获取显示对象的测量边界
         * @method egret.DisplayObject#getBounds
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @returns {Rectangle}
         */
        public getBounds(resultRect?:Rectangle):egret.Rectangle {
            if (this._cacheBounds.x == 0 && this._cacheBounds.y == 0 && this._cacheBounds.width == 0 && this._cacheBounds.height == 0) {
                var rect:Rectangle = this._measureBounds();
                var w:number = this._hasWidthSet ? this._explicitWidth : rect.width;
                var h:number = this._hasHeightSet ? this._explicitHeight : rect.height;
                var x:number = rect.x;
                var y:number = rect.y;
                var anchorX, anchorY;
                if (this._anchorX != 0 || this._anchorY != 0) {
                    anchorX = w * this._anchorX;
                    anchorY = h * this._anchorY;
                }
                else {
                    anchorX = this._anchorOffsetX;
                    anchorY = this._anchorOffsetY;
                }
                this._cacheBounds.initialize(x - anchorX, y - anchorY, w, h);
            }
            var result:egret.Rectangle = this._cacheBounds;
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            return resultRect.initialize(result.x, result.y, result.width, result.height);
        }

        private destroyCacheBounds():void {
            this._cacheBounds.x = 0;
            this._cacheBounds.y = 0;
            this._cacheBounds.width = 0;
            this._cacheBounds.height = 0;
        }

        /**
         * @private
         * @returns {Matrix}
         */
        private static identityMatrixForGetConcatenated = new Matrix();

        public _getConcatenatedMatrix():egret.Matrix {
            var matrix:Matrix = DisplayObject.identityMatrixForGetConcatenated.identity();
            var o = this;
            while (o != null) {
                if (o._anchorX != 0 || o._anchorY != 0) {
                    var bounds = o._getSize(Rectangle.identity);
                    matrix.prependTransform(o._x, o._y, o._scaleX, o._scaleY, o._rotation, o._skewX, o._skewY,
                        bounds.width * o._anchorX, bounds.height * o._anchorY);
                }
                else {
                    matrix.prependTransform(o._x, o._y, o._scaleX, o._scaleY, o._rotation, o._skewX, o._skewY, o._anchorOffsetX, o._anchorOffsetY);
                }
                o = o._parent;
            }
            return matrix;
        }

        /**
         * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
         * @method egret.DisplayObject#localToGlobal
         * @param x {number} 本地x坐标
         * @param y {number} 本地y坐标
         * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
         * @returns {egret.Point}
         */
        public localToGlobal(x:number = 0, y:number = 0, resultPoint?:Point):Point {
            var mtx = this._getConcatenatedMatrix();
            mtx.append(1, 0, 0, 1, x, y);
            if (!resultPoint) {
                resultPoint = new Point();
            }
            resultPoint.x = mtx.tx;
            resultPoint.y = mtx.ty;
            return resultPoint;
        }

        /**
         * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
         * @method egret.DisplayObject#globalToLocal
         * @param x {number} 全局x坐标
         * @param y {number} 全局y坐标
         * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
         * @returns {egret.Point}
         */
        public globalToLocal(x:number = 0, y:number = 0, resultPoint?:Point):Point {
            var mtx = this._getConcatenatedMatrix();
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            if (!resultPoint) {
                resultPoint = new Point();
            }
            resultPoint.x = mtx.tx;
            resultPoint.y = mtx.ty;
            return resultPoint;
        }

        /**
         * 检测指定坐标是否在显示对象内
         * @method egret.DisplayObject#hitTest
         * @param x {number}
         * @param y {number}
         * @param ignoreTouchEnabled 是否忽略TouchEnabled
         * @returns {*}
         */
        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):DisplayObject {
            if (!this.visible || (!ignoreTouchEnabled && !this._touchEnabled)) {
                return null;
            }
            var bound:Rectangle = this.getBounds(Rectangle.identity);
            if (0 < x && x < bound.width && 0 < y && y < bound.height) {
                if (this.mask || this._scrollRect) {
                    if (this._scrollRect
                        && x < this._scrollRect.width
                        && y < this._scrollRect.height) {
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


        public _getMatrix():Matrix {

            var matrix = Matrix.identity.identity();
            var anchorX, anchorY;
            var resultPoint = this._getOffsetPoint();
            anchorX = resultPoint.x;
            anchorY = resultPoint.y;
            matrix.appendTransform(this._x, this._y, this._scaleX, this._scaleY, this._rotation,
                this._skewX, this._skewY, anchorX, anchorY);
            return matrix;
        }

        public _getSize(resultRect:Rectangle):Rectangle {
            if (this._hasHeightSet && this._hasWidthSet) {
                return resultRect.initialize(NaN, NaN, this._explicitWidth, this._explicitHeight);
            }
            return this._measureSize(Rectangle.identity);
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureSize(resultRect:Rectangle):egret.Rectangle {
            return this._measureBounds();
        }

        /**
         * 测量显示对象坐标，这个方法需要子类重写
         * @returns {egret.Rectangle}
         * @private
         */
        public _measureBounds():egret.Rectangle {
            return egret.Rectangle.identity.initialize(0, 0, 0, 0);
        }

        public _getOffsetPoint():egret.Point {
            var o = this;
            var regX = o._anchorOffsetX;
            var regY = o._anchorOffsetY;
            if (o._anchorX != 0 || o._anchorY != 0) {
                var bounds = o._getSize(Rectangle.identity);
                regX = o._anchorX * bounds.width;
                regY = o._anchorY * bounds.height;
            }
            var result = Point.identity;
            result.x = regX;
            result.y = regY;
            return result;
        }

        public _onAddToStage():void {
            this._stage = MainContext.instance.stage;
            DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST.push(this);
        }

        public _onRemoveFromStage():void {
            this._stage = null;
            DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST.push(this);
        }

        public _stage:Stage;

        /**
         * 获取舞台对象。当该显示对象不在舞台上时，此属性返回 undefined
         * @member {number} egret.DisplayObject#stage
         * @returns {egret.Stage}
         */
        public get stage():Stage {
            return this._stage;
        }

        public static _enterFrameCallBackList:Array<any> = [];
        public static _renderCallBackList:Array<any> = [];

        public addEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false, priority:number = 0):void {
            super.addEventListener(type, listener, thisObject, useCapture, priority);
            var isEnterFrame:boolean = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                var list:Array<any> = isEnterFrame ? DisplayObject._enterFrameCallBackList : DisplayObject._renderCallBackList;
                this._insertEventBin(list, listener, thisObject, priority);
            }
        }

        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false):void {
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

            var list:Array<DisplayObject> = [];
            var target:DisplayObject = this;
            while (target) {
                list.unshift(target);
                target = target.parent;
            }

            var length:number = list.length;
            var targetIndex:number = length - 1;
            for (var i:number = length - 2; i >= 0; i--) {
                list.push(list[i]);
            }
            event._reset();
            this._dispatchPropagationEvent(event, list, targetIndex);
            return !event.isDefaultPrevented();
        }

        public _dispatchPropagationEvent(event:Event, list:Array<DisplayObject>, targetIndex:number):void {
            var length:number = list.length;
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
            this._cacheAsBitmap = bool;
            if (bool) {
                var renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(this);
                this._texture_to_render = renderTexture;
            }
        }

        public static getTransformBounds(bounds:egret.Rectangle, mtx:egret.Matrix):egret.Rectangle {
//            var x = bounds.x, y = bounds.y;
              var x,y;
              var width = bounds.width, height = bounds.height;

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