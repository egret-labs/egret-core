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
 *       derived from this software without specific prior written pemission.
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
     * @class egret.DisplayObject
     * @extends egret.EventDispatcher
     * @classdesc DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。
     * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。
     * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵），所有显示对象都继承自 DisplayObject 类。
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
     * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上），这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
     * 任何继承自DisplayObject的类都必须实现以下方法
     * _render();
     * _measureBounds()
     * 不允许重写以下方法
     * _draw();
     * getBounds();
     * @link http://docs.egret-labs.org/post/manual/displayobj/aboutdisplayobj.html 显示对象的基本概念
     */
    export class DisplayObject extends EventDispatcher implements RenderData {


        public _displayObjectFlags:number = 0;

        public _getORFlag(flag1:DisplayObjectFlags, flag2:DisplayObjectFlags):boolean {
            return (this._displayObjectFlags & (flag1 | flag2)) != 0;
        }

        public _getFlag(flag:DisplayObjectFlags):boolean {
            return (this._displayObjectFlags & flag) === flag;
        }

        public _setFlag(flag:DisplayObjectFlags, value:boolean):void {
            this._displayObjectFlags = value ? (this._displayObjectFlags | flag) : (this._displayObjectFlags & ~flag);
        }

        public __hack_local_matrix:any = null;

        /**
         * 创建一个 egret.DisplayObject 对象
         */
        public constructor() {
            super();
            this._worldTransform = new egret.Matrix();
            this._worldBounds = new egret.Rectangle(0, 0, 0, 0);
            this._cacheBounds = new egret.Rectangle(0, 0, 0, 0);
        }

        public _normalDirty:boolean = true;

        public _setDirty():void {
            this._normalDirty = true;
        }

        public getDirty():boolean {
            return this._normalDirty || this._sizeDirty;
        }

        //对宽高有影响
        private _sizeDirty:boolean = true;

        public _setParentSizeDirty():void {
            var parent = this._parent;
            if (parent && (!(parent._hasWidthSet || parent._hasHeightSet))) {
                parent._setSizeDirty();
            }
        }
        /**
         * 尺寸发生改变的回调函数。若此对象被添加到UIAsset里，此函数将被赋值，在尺寸发生改变时通知UIAsset重新测量。
         */
        public _sizeChangeCallBack:Function = null;
        public _sizeChangeCallTarget:any = null;

        public _setSizeDirty():void {
            if (this._sizeDirty) {
                return;
            }
            this._sizeDirty = true;

            this._setDirty();
            this._setCacheDirty();
            this._setParentSizeDirty();
            if(this._sizeChangeCallBack!=null){
                if(this._sizeChangeCallTarget==this._parent){
                    this._sizeChangeCallBack.call(this._sizeChangeCallTarget);
                }
                else{
                    this._sizeChangeCallBack = null;
                    this._sizeChangeCallTarget = null;
                }
            }
        }

        public _clearDirty():void {
            //todo 这个除了文本的，其他都没有clear过
            this._normalDirty = false;
        }

        public _clearSizeDirty():void {
            //todo 最好在enterFrame都重新算一遍
            this._sizeDirty = false;
        }

        /**
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @member {string} egret.DisplayObject#name
         */
        public name:string = null;

        public _texture_to_render:Texture = null;

        public _parent:DisplayObjectContainer = null;

        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
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
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#x
         */
        public get x():number {
            return this._x;
        }

        public set x(value:number) {
            this._setX(value);
        }

        public _setX(value:number):void {
            if (NumberUtils.isNumber(value) && this._x != value) {
                this._x = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _y:number = 0;

        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#y
         */
        public get y():number {
            return this._y;
        }

        public set y(value:number) {
            this._setY(value);
        }

        public _setY(value:number):void {
            if (NumberUtils.isNumber(value) && this._y != value) {
                this._y = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _scaleX:number = 1;

        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleX
         * @default 1
         */
        public get scaleX():number {
            return this._scaleX;
        }

        public set scaleX(value:number) {
            if (NumberUtils.isNumber(value) && this._scaleX != value) {
                this._scaleX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _scaleY:number = 1;

        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleY
         * @default 1
         */
        public get scaleY():number {
            return this._scaleY;
        }

        public set scaleY(value:number) {
            if (NumberUtils.isNumber(value) && this._scaleY != value) {
                this._scaleY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _anchorOffsetX:number = 0;

        /**
         * 表示从对象绝对锚点X。
         * @member {number} egret.DisplayObject#anchorOffsetX
         * @default 0
         */
        public get anchorOffsetX():number {
            return this._anchorOffsetX;
        }

        public set anchorOffsetX(value:number) {
            if (NumberUtils.isNumber(value) && this._anchorOffsetX != value) {
                this._anchorOffsetX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _anchorOffsetY:number = 0;

        /**
         * 表示从对象绝对锚点Y。
         * @member {number} egret.DisplayObject#anchorOffsetY
         * @default 0
         */
        public get anchorOffsetY():number {
            return this._anchorOffsetY;
        }

        public set anchorOffsetY(value:number) {
            if (NumberUtils.isNumber(value) && this._anchorOffsetY != value) {
                this._anchorOffsetY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _anchorX:number = 0;

        /**
         * 表示从对象相对锚点X。
         * @member {number} egret.DisplayObject#anchorX
         * @default 0
         */
        public get anchorX():number {
            return this._anchorX;
        }

        public set anchorX(value:number) {
            this._setAnchorX(value);
        }

        public _setAnchorX(value:number):void {
            if (NumberUtils.isNumber(value) && this._anchorX != value) {
                this._anchorX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _anchorY:number = 0;

        /**
         * 表示从对象相对锚点Y。
         * @member {number} egret.DisplayObject#anchorY
         * @default 0
         */
        public get anchorY():number {
            return this._anchorY;
        }

        public set anchorY(value:number) {
            this._setAnchorY(value);
        }

        public _setAnchorY(value:number):void {
            if (NumberUtils.isNumber(value) && this._anchorY != value) {
                this._anchorY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _visible:boolean = true;

        /**
         * 显示对象是否可见。
         * 不可见的显示对象已被禁用。例如，如果实例的 visible=false，则无法单击该对象。
         * 默认值为 true 可见
         * @member {boolean} egret.DisplayObject#visible
         */
        public get visible():boolean {
            return this._visible;
        }

        public set visible(value:boolean) {
            this._setVisible(value);
        }

        public _setVisible(value:boolean):void {
            if (this._visible != value) {
                this._visible = value;
                this._setSizeDirty();
            }
        }

        public _rotation:number = 0;

        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。例如，my_video.rotation = 450语句与 my_video.rotation = 90 是相同的。
         * @member {number} egret.DisplayObject#rotation
         * @default 0 默认值为 0 不旋转。
         */
        public get rotation():number {
            return this._rotation;
        }

        public set rotation(value:number) {
            if (NumberUtils.isNumber(value) && this._rotation != value) {
                this._rotation = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _alpha:number = 1;

        /**
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
         * @member {number} egret.DisplayObject#alpha
         *  @default 1 默认值为 1。
         */
        public get alpha():number {
            return this._alpha;
        }

        public set alpha(value:number) {
            this._setAlpha(value);
        }

        public _setAlpha(value:number):void {
            if (NumberUtils.isNumber(value) && this._alpha != value) {
                this._alpha = value;

                this._setDirty();
                this._setCacheDirty();
            }
        }

        public _skewX:number = 0;

        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         */
        public get skewX():number {
            return this._skewX;
        }

        public set skewX(value:number) {
            if (NumberUtils.isNumber(value) && this._skewX != value) {
                this._skewX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _skewY:number = 0;

        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         */
        public get skewY():number {
            return this._skewY;
        }

        public set skewY(value:number) {
            if (NumberUtils.isNumber(value) && this._skewY != value) {
                this._skewY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }

        public _touchEnabled:boolean = false;

        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} egret.DisplayObject#touchEnabled
         * @default false 默认为 false 即不可以接收。
         */
        public get touchEnabled():boolean {
            return this._touchEnabled;
        }

        public set touchEnabled(value:boolean) {
            this._setTouchEnabled(value);
        }

        public _setTouchEnabled(value:boolean):void {
            this._touchEnabled = value;
        }

        /**
         * BlendMode 类中的一个值，用于指定要使用的混合模式。
         * 内部绘制位图的方法有两种。 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @member {string} egret.DisplayObject#blendMode
         */
        public blendMode:string = null;

        public _scrollRect:Rectangle = null;

        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         *  @member {egret.Rectangle} egret.DisplayObject#scrollRect
         */
        public get scrollRect():Rectangle {
            return this._scrollRect;
        }

        public set scrollRect(value:Rectangle) {
            this._setScrollRect(value);
        }

        public _setScrollRect(value:Rectangle):void {
            this._scrollRect = value;

            this._setSizeDirty();
        }


        /**
         * 测量宽度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        public get measuredWidth():number {
            return this._measureBounds().width;
        }

        /**
         * 测量高度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        public get measuredHeight():number {
            return this._measureBounds().height;
        }

        public _explicitWidth:number = NaN;

        /**
         * 显式设置宽度
         * @returns {number}
         */
        public get explicitWidth():number {
            return this._explicitWidth;
        }

        public _explicitHeight:number = NaN;

        /**
         * 显式设置高度
         * @returns {number}
         */
        public get explicitHeight():number {
            return this._explicitHeight;
        }

        /**
         * 表示显示对象的宽度，以像素为单位。
         * 宽度是根据显示对象内容的范围来计算的。优先顺序为 显式设置宽度 > 测量宽度。
         * @member {number} egret.DisplayObject#width
         * @returns {number}
         */
        public get width():number {
            return this._getWidth();
        }

        public _getWidth():number {
            return this._getSize(Rectangle.identity).width;
        }

        /**
         * 表示显示对象的高度，以像素为单位。
         * 高度是根据显示对象内容的范围来计算的。优先顺序为 显式设置高度 > 测量高度。
         * @member {number} egret.DisplayObject#height
         * @returns {number}
         */
        public get height():number {
            return this._getHeight();
        }

        public _getHeight():number {
            return this._getSize(Rectangle.identity).height;
        }

        public _hasWidthSet:boolean = false;

        public set width(value:number) {
            this._setWidth(value);
        }

        /**
         * @inheritDoc
         */
        public _setWidth(value:number):void {
            this._setSizeDirty();
            this._setCacheDirty();
            this._explicitWidth = value;
            this._hasWidthSet = NumberUtils.isNumber(value);
        }

        public _hasHeightSet:boolean = false;

        public set height(value:number) {
            this._setHeight(value);
        }

        /**
         * @inheritDoc
         */
        public _setHeight(value:number):void {
            this._setSizeDirty();
            this._setCacheDirty();
            this._explicitHeight = value;
            this._hasHeightSet = NumberUtils.isNumber(value);
        }

        /**
         * 调用显示对象被指定的 mask 对象遮罩。
         * 要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。但不绘制 mask 对象本身。
         * 将 mask 设置为 null 可删除蒙版。
         */
        public mask:Rectangle = null;

        public _worldTransform:egret.Matrix;
        public _worldBounds:egret.Rectangle = null;
        /**
         * @private
         */
        public worldAlpha:number = 1;

        public _isContainer:boolean = false;

        /**
         * @private
         * @param renderContext
         */
        public _draw(renderContext:RendererContext):void {
            var o = this;
            if (!o._visible) {
                o.destroyCacheBounds();
                return;
            }
            var hasDrawCache = o.drawCacheTexture(renderContext);
            if (hasDrawCache) {
                o.destroyCacheBounds();
                return;
            }
            var isCommandPush = MainContext.__use_new_draw && o._isContainer;
            if(o._filter && !isCommandPush) {
                renderContext.setGlobalFilter(o._filter);
            }
            if (o._colorTransform && !isCommandPush) {
                renderContext.setGlobalColorTransform(o._colorTransform.matrix);
            }
            renderContext.setAlpha(o.worldAlpha, o.blendMode);
            renderContext.setTransform(o._worldTransform);
            var mask = o.mask || o._scrollRect;
            if (mask && !isCommandPush) {
                renderContext.pushMask(mask);
            }
            o._render(renderContext);
            if (mask && !isCommandPush) {
                renderContext.popMask();
            }
            if (o._colorTransform && !isCommandPush) {
                renderContext.setGlobalColorTransform(null);
            }
            if(o._filter && !isCommandPush) {
                renderContext.setGlobalFilter(null);
            }
            o.destroyCacheBounds();
        }

        public _setGlobalFilter(renderContext:RendererContext):void {
            var o = this;
            renderContext.setGlobalFilter(o._filter);
        }

        public _removeGlobalFilter(renderContext:RendererContext):void {
            renderContext.setGlobalFilter(null);
        }

        public _setGlobalColorTransform(renderContext:RendererContext):void {
            var o = this;
            renderContext.setGlobalColorTransform(o._colorTransform.matrix);
        }

        public _removeGlobalColorTransform(renderContext:RendererContext):void {
            renderContext.setGlobalColorTransform(null);
        }

        public _pushMask(renderContext:RendererContext):void {
            var o = this;
            renderContext.setTransform(o._worldTransform);
            var mask = o.mask || o._scrollRect;
            if (mask) {
                renderContext.pushMask(mask);
            }
        }

        public _popMask(renderContext:RendererContext):void {
            renderContext.popMask();
        }

        /**
         * @private
         */
        private drawCacheTexture(renderContext:RendererContext):boolean {
            var display:egret.DisplayObject = this;
            if (display._cacheAsBitmap == false) {
                return false;
            }
            var bounds = display.getBounds(Rectangle.identity);
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            if (display._cacheDirty || display._texture_to_render == null ||
                Math.round(bounds.width) != Math.round(display._texture_to_render._sourceWidth * texture_scale_factor) ||
                Math.round(bounds.height) != Math.round(display._texture_to_render._sourceHeight * texture_scale_factor)) {
                var cached = display._makeBitmapCache();
                display._cacheDirty = !cached;
            }

            //没有成功生成cache的情形
            if (display._texture_to_render == null)
                return false;
            var renderTexture = display._texture_to_render;
            var offsetX = renderTexture._offsetX;
            var offsetY = renderTexture._offsetY;
            var width = renderTexture._textureWidth;
            var height = renderTexture._textureHeight;
            display._updateTransform();
            renderContext.setAlpha(display.worldAlpha, display.blendMode);
            renderContext.setTransform(display._worldTransform);
            var renderFilter = egret.RenderFilter.getInstance();
            renderFilter.drawImage(renderContext, display, 0, 0, width, height, offsetX, offsetY, width, height);
            return true;

        }

        /**
         * 强制每帧执行_draw函数
         * @public
         * @member {string} egret.DisplayObject#blendMode
         */
        public needDraw:boolean = false;

        /**
         * @private
         * @param renderContext
         */
        public _updateTransform():void {
            var o = this;
            if (!o._visible) {
                return;
            }
            o._calculateWorldTransform();
            if(MainContext._renderLoopPhase == "updateTransform") {
                if(o.needDraw || o._texture_to_render || o._cacheAsBitmap) {
                    RenderCommand.push(o._draw, o);
                }
            }
        }

        /**
         * 计算全局数据
         * @private
         */
        public _calculateWorldTransform():void {
            var o = this;
            var worldTransform = o._worldTransform;
            var parent = o._parent;

            worldTransform.identityMatrix(parent._worldTransform);
            this._getMatrix(worldTransform);

            var scrollRect = this._scrollRect;
            if (scrollRect) {
                worldTransform.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
            }

//            if (this._texture_to_render){
//                var bounds:egret.Rectangle = DisplayObject.getTransformBounds(o._getSize(Rectangle.identity), o._worldTransform);
//                o._worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);
//            }
            o.worldAlpha = parent.worldAlpha * o._alpha;
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
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         */
        public getBounds(resultRect?:Rectangle, calculateAnchor:boolean = true):egret.Rectangle {
//            if (this._cacheBounds.x == 0 && this._cacheBounds.y == 0 && this._cacheBounds.width == 0 && this._cacheBounds.height == 0) {
            var rect:Rectangle = this._measureBounds();
            var w:number = this._hasWidthSet ? this._explicitWidth : rect.width;
            var h:number = this._hasHeightSet ? this._explicitHeight : rect.height;

            //记录测量宽高
            this._rectW = rect.width;
            this._rectH = rect.height;
            this._clearSizeDirty();

            var x:number = rect.x;
            var y:number = rect.y;
            var anchorX = 0, anchorY = 0;
            if (calculateAnchor) {
                if (this._anchorX != 0 || this._anchorY != 0) {
                    anchorX = w * this._anchorX;
                    anchorY = h * this._anchorY;
                }
                else {
                    anchorX = this._anchorOffsetX;
                    anchorY = this._anchorOffsetY;
                }
            }
            this._cacheBounds.initialize(x - anchorX, y - anchorY, w, h);
//            }
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
            //todo:采用local_matrix模式下这里的逻辑需要修改
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
                if (o._scrollRect) {
                    matrix.prepend(1, 0, 0, 1, -o._scrollRect.x, -o._scrollRect.y);
                }
                o = o._parent;
            }
            return matrix;
        }

        /**
         * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
         * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
         * @method egret.DisplayObject#localToGlobal
         * @param x {number} 本地x坐标
         * @param y {number} 本地y坐标
         * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
         * @returns {egret.Point} 具有相对于舞台的坐标的 Point 对象。
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
         * @returns {egret.Point} 具有相对于显示对象的坐标的 Point 对象。
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
         * @param x {number} 检测坐标的x轴
         * @param y {number} 检测坐标的y轴
         * @param ignoreTouchEnabled {boolean} 是否忽略 touchEnabled 属性
         * @returns {*}
         */
        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):DisplayObject {
            if (!this._visible || (!ignoreTouchEnabled && !this._touchEnabled)) {
                return null;
            }
            var bound:Rectangle = this.getBounds(Rectangle.identity, false);
            x -= bound.x;
            y -= bound.y;
            if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {
                if (this.mask || this._scrollRect) {
                    if (this._scrollRect
                        && x > this._scrollRect.x
                        && y > this._scrollRect.y
                        && x < this._scrollRect.x + this._scrollRect.width
                        && y < this._scrollRect.y + this._scrollRect.height) {
                        return this;
                    }
                    else if (this.mask
                        && this.mask.x <= x
                        && x < this.mask.x + this.mask.width
                        && this.mask.y <= y
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

        private _hitTestPointTexture:RenderTexture = null;

        /**
         * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
         * 注意，不要在大量物体中使用精确碰撞像素检测，这回带来巨大的性能开销
         * @method egret.DisplayObject#hitTestPoint
         * @param x {number}  要测试的此对象的 x 坐标。
         * @param y {number}  要测试的此对象的 y 坐标。
         * @param shapeFlag {boolean} 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
         * @returns {boolean} 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
         */
        public hitTestPoint(x:number, y:number, shapeFlag?:boolean):boolean {
            var p:egret.Point = this.globalToLocal(x, y);
            if (!shapeFlag) {
                return !!this.hitTest(p.x, p.y, true);
            }
            else {
                if (!this._hitTestPointTexture) {
                    this._hitTestPointTexture = new RenderTexture();
                }
                var testTexture:Texture = this._hitTestPointTexture;
                (<RenderTexture>testTexture).drawToTexture(this);
                var pixelData:number[] = testTexture.getPixel32(p.x - this._hitTestPointTexture._offsetX, p.y - this._hitTestPointTexture._offsetY);
                if (pixelData[3] != 0) {
                    return true;
                }
                return false;
            }
        }


        public _getMatrix(parentMatrix?:Matrix):Matrix {

            if (!parentMatrix) {
                parentMatrix = Matrix.identity.identity();
            }


            var anchorX, anchorY;
            var resultPoint = this._getOffsetPoint();
            anchorX = resultPoint.x;
            anchorY = resultPoint.y;

            var matrix = this.__hack_local_matrix;
            if (matrix) {
                parentMatrix.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                parentMatrix.append(1, 0, 0, 1, -anchorX, -anchorY);
            }
            else {
                parentMatrix.appendTransform(this._x, this._y, this._scaleX, this._scaleY, this._rotation,
                    this._skewX, this._skewY, anchorX, anchorY);
            }

            return parentMatrix;
        }

        public _getSize(resultRect:Rectangle):Rectangle {
            if (this._hasHeightSet && this._hasWidthSet) {
                this._clearSizeDirty();
                return resultRect.initialize(0, 0, this._explicitWidth, this._explicitHeight);
            }

            this._measureSize(resultRect);
            if (this._hasWidthSet){
                resultRect.width = this._explicitWidth;
            }
            if (this._hasHeightSet){
                resultRect.height = this._explicitHeight;
            }
            return resultRect;
        }

        private _rectW:number = 0;
        private _rectH:number = 0;

        /**
         * 测量显示对象坐标与大小
         */
        public _measureSize(resultRect:Rectangle):egret.Rectangle {
            if (this._sizeDirty) {
                resultRect = this._measureBounds();
                this._rectW = resultRect.width;
                this._rectH = resultRect.height;
                this._clearSizeDirty();
            }
            else {
                resultRect.width = this._rectW;
                resultRect.height = this._rectH;
            }
            resultRect.x = 0;
            resultRect.y = 0;
            return resultRect;
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
            DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST.push(this);
        }

        public _stage:Stage = null;

        /**
         * 显示对象的舞台。
         * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指相同的 Stage 对象。
         * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
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
                this._insertEventBin(list, listener, thisObject, priority, this);
            }
        }

        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false):void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            var isEnterFrame:boolean = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                var list:Array<any> = isEnterFrame ? DisplayObject._enterFrameCallBackList : DisplayObject._renderCallBackList;
                this._removeEventBin(list, listener, thisObject, this);
            }
        }

        public dispatchEvent(event:Event):boolean {
            if (!event._bubbles) {
                return super.dispatchEvent(event);
            }

            var list:Array<DisplayObject> = [];
            var target:DisplayObject = this;
            while (target) {
                list.push(target);
                target = target._parent;
            }
            event._reset();
            this._dispatchPropagationEvent(event, list);
            return !event._isDefaultPrevented;
        }

        public _dispatchPropagationEvent(event:Event, list:Array<DisplayObject>, targetIndex?:number):void {
            var length:number = list.length;
            var eventPhase:number = 1;
            for (var i:number = length - 1; i >= 0; i--) {
                var currentTarget:DisplayObject = list[i];
                event._currentTarget = currentTarget;
                event._target = this;
                event._eventPhase = eventPhase;
                currentTarget._notifyListener(event);
                if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
                    return;
                }
            }

            var eventPhase:number = 2;
            var currentTarget:DisplayObject = list[0];
            event._currentTarget = currentTarget;
            event._target = this;
            event._eventPhase = eventPhase;
            currentTarget._notifyListener(event);
            if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
                return;
            }

            var eventPhase:number = 3;
            for (i = 1; i < length; i++) {
                var currentTarget:DisplayObject = list[i];
                event._currentTarget = currentTarget;
                event._target = this;
                event._eventPhase = eventPhase;
                currentTarget._notifyListener(event);
                if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
                    return;
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


        private _cacheAsBitmap:boolean = false;

        /**
         * 如果设置为 true，则 egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 具有已缓存位图的显示对象的所有矢量数据都将被绘制到位图而不是主显示。像素按一对一与父对象进行映射。如果位图的边界发生更改，则将重新创建位图而不会拉伸它。
         * 除非将 cacheAsBitmap 属性设置为 true，否则不会创建内部位图。
         * @member {number} egret.DisplayObject#cacheAsBitmap
         */
        public get cacheAsBitmap():boolean {
            return this._cacheAsBitmap;
        }

        private renderTexture:RenderTexture = null;

        public set cacheAsBitmap(bool:boolean) {
            this._cacheAsBitmap = bool;
            if (bool) {
                egret.callLater(this._makeBitmapCache, this);
            }
            else {
                this._texture_to_render = null;
            }
        }

        public _makeBitmapCache():boolean {
            if (!this.renderTexture) {
                this.renderTexture = new egret.RenderTexture();
            }
            var result:boolean = this.renderTexture.drawToTexture(this);
            if (result) {
                this._texture_to_render = this.renderTexture;
            }
            else {
                this._texture_to_render = null;
            }
            return result;
        }

        private _cacheDirty:boolean = false;

        private _setCacheDirty(dirty = true) {
            this._cacheDirty = dirty;
        }

        public static getTransformBounds(bounds:egret.Rectangle, mtx:egret.Matrix):egret.Rectangle {
            var x = bounds.x, y = bounds.y;
//            var x, y;
            var width = bounds.width, height = bounds.height;

            if (x || y) {
                mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
            }
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


        /**
         * beta功能，请勿调用此方法
         */
        public _colorTransform:ColorTransform = null;

        public get colorTransform():ColorTransform {
            return this._colorTransform;
        }

        public set colorTransform(value:ColorTransform) {
            this._colorTransform = value;
        }

        /**
         * beta功能，请勿调用此方法
         */
        public _filter:Filter = null;

        public get filter():Filter {
            return this._filter;
        }

        public set filter(value:Filter) {
            this._filter = value;
        }
    }

    /**
     * @private
     */
    export class ColorTransform {

        public matrix:Array<number> = null;

        public updateColor(r:number, g:number, b:number, a:number, addR:number, addG:number, addB:number, addA:number):void {
            //todo;
        }

    }
}



