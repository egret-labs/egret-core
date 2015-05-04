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

        public _DO_Props_:DisplayObjectProperties;
        private _DO_Privs_:DisplayObjectPrivateProperties;

        /**
         * 创建一个 egret.DisplayObject 对象
         */
        public constructor() {
            super();

            this._DO_Props_ = new egret.DisplayObjectProperties();
            this._DO_Privs_ = new egret.DisplayObjectPrivateProperties();

            this._worldTransform = new egret.Matrix();
            this._worldBounds = new egret.Rectangle(0, 0, 0, 0);
            this._DO_Privs_._cacheBounds = new egret.Rectangle(0, 0, 0, 0);
        }

        public _texture_to_render:Texture = null;
        public _worldTransform:egret.Matrix;
        public _worldBounds:egret.Rectangle = null;

        public __hack_local_matrix:any = null;
        //尺寸发生改变的回调函数。若此对象被添加到UIAsset里，此函数将被赋值，在尺寸发生改变时通知UIAsset重新测量。
        public _sizeChangeCallBack:Function = null;
        public _sizeChangeCallTarget:any = null;

        public _setDirty():void {
            this._DO_Props_._normalDirty = true;
        }

        public getDirty():boolean {
            return this._DO_Props_._normalDirty || this._DO_Props_._sizeDirty;
        }


        public _setParentSizeDirty():void {
            var parent = this._DO_Props_._parent;
            if (parent) {
                if(!(parent._DO_Props_._hasWidthSet || parent._DO_Props_._hasHeightSet)) {
                    parent._setSizeDirty();
                }
                else {
                    parent._setCacheDirty();
                }
            }
        }
        public _setSizeDirty():void {
            var self = this;
            var do_props = self._DO_Props_;
            if (do_props._sizeDirty) {
                return;
            }
            do_props._sizeDirty = true;

            this._setDirty();
            this._setCacheDirty();
            this._setParentSizeDirty();
            if(self._sizeChangeCallBack!=null){
                if(self._sizeChangeCallTarget==do_props._parent){
                    self._sizeChangeCallBack.call(self._sizeChangeCallTarget);
                }
                else{
                    self._sizeChangeCallBack = null;
                    self._sizeChangeCallTarget = null;
                }
            }
        }

        public _clearDirty():void {
            //todo 这个除了文本的，其他都没有clear过
            this._DO_Props_._normalDirty = false;
        }

        public _clearSizeDirty():void {
            //todo 最好在enterFrame都重新算一遍
            this._DO_Props_._sizeDirty = false;
        }

        /**
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @member {string} egret.DisplayObject#name
         */
        public set name(value:string) {
            this._DO_Props_._name = value;
        }

        public get name():string {
            return this._DO_Props_._name;
        }

        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
         * @member {egret.DisplayObjectContainer} egret.DisplayObject#parent
         */
        public get parent():DisplayObjectContainer {
            return this._DO_Props_._parent;
        }

        public _parentChanged(parent:DisplayObjectContainer):void {
            this._DO_Props_._parent = parent;
        }


        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#x
         */
        public get x():number {
            return this._DO_Props_._x;
        }

        public set x(value:number) {
            this._setX(value);
        }

        public _setX(value:number):void {
            if (NumberUtils.isNumber(value) && this._DO_Props_._x != value) {
                this._DO_Props_._x = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#y
         */
        public get y():number {
            return this._DO_Props_._y;
        }

        public set y(value:number) {
            this._setY(value);
        }

        public _setY(value:number):void {
            if (NumberUtils.isNumber(value) && this._DO_Props_._y != value) {
                this._DO_Props_._y = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleX
         * @default 1
         */
        public get scaleX():number {
            return this._DO_Props_._scaleX;
        }

        public set scaleX(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._scaleX != value) {
                this._DO_Props_._scaleX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleY
         * @default 1
         */
        public get scaleY():number {
            return this._DO_Props_._scaleY;
        }

        public set scaleY(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._scaleY != value) {
                this._DO_Props_._scaleY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从对象绝对锚点X。
         * @member {number} egret.DisplayObject#anchorOffsetX
         * @default 0
         */
        public get anchorOffsetX():number {
            return this._DO_Props_._anchorOffsetX;
        }

        public set anchorOffsetX(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._anchorOffsetX != value) {
                this._DO_Props_._anchorOffsetX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从对象绝对锚点Y。
         * @member {number} egret.DisplayObject#anchorOffsetY
         * @default 0
         */
        public get anchorOffsetY():number {
            return this._DO_Props_._anchorOffsetY;
        }

        public set anchorOffsetY(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._anchorOffsetY != value) {
                this._DO_Props_._anchorOffsetY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从对象相对锚点X。
         * @member {number} egret.DisplayObject#anchorX
         * @default 0
         */
        public get anchorX():number {
            return this._DO_Props_._anchorX;
        }

        public set anchorX(value:number) {
            this._setAnchorX(value);
        }

        public _setAnchorX(value:number):void {
            if (NumberUtils.isNumber(value) && this._DO_Props_._anchorX != value) {
                this._DO_Props_._anchorX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示从对象相对锚点Y。
         * @member {number} egret.DisplayObject#anchorY
         * @default 0
         */
        public get anchorY():number {
            return this._DO_Props_._anchorY;
        }

        public set anchorY(value:number) {
            this._setAnchorY(value);
        }

        public _setAnchorY(value:number):void {
            if (NumberUtils.isNumber(value) && this._DO_Props_._anchorY != value) {
                this._DO_Props_._anchorY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 显示对象是否可见。
         * 不可见的显示对象已被禁用。例如，如果实例的 visible=false，则无法单击该对象。
         * 默认值为 true 可见
         * @member {boolean} egret.DisplayObject#visible
         */
        public get visible():boolean {
            return this._DO_Props_._visible;
        }

        public set visible(value:boolean) {
            this._setVisible(value);
        }

        public _setVisible(value:boolean):void {
            if (this._DO_Props_._visible != value) {
                this._DO_Props_._visible = value;
                this._setSizeDirty();
            }
        }


        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。例如，my_video.rotation = 450语句与 my_video.rotation = 90 是相同的。
         * @member {number} egret.DisplayObject#rotation
         * @default 0 默认值为 0 不旋转。
         */
        public get rotation():number {
            return this._DO_Props_._rotation;
        }

        public set rotation(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._rotation != value) {
                this._DO_Props_._rotation = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
         * @member {number} egret.DisplayObject#alpha
         *  @default 1 默认值为 1。
         */
        public get alpha():number {
            return this._DO_Props_._alpha;
        }

        public set alpha(value:number) {
            this._setAlpha(value);
        }

        public _setAlpha(value:number):void {
            if (NumberUtils.isNumber(value) && this._DO_Props_._alpha != value) {
                this._DO_Props_._alpha = value;

                this._setDirty();
                this._setCacheDirty();
            }
        }


        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         */
        public get skewX():number {
            return this._DO_Props_._skewX;
        }

        public set skewX(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._skewX != value) {
                this._DO_Props_._skewX = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         */
        public get skewY():number {
            return this._DO_Props_._skewY;
        }

        public set skewY(value:number) {
            if (NumberUtils.isNumber(value) && this._DO_Props_._skewY != value) {
                this._DO_Props_._skewY = value;

                this._setDirty();
                this._setParentSizeDirty();
            }
        }


        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} egret.DisplayObject#touchEnabled
         * @default false 默认为 false 即不可以接收。
         */
        public get touchEnabled():boolean {
            return this._DO_Props_._touchEnabled;
        }

        public set touchEnabled(value:boolean) {
            this._setTouchEnabled(value);
        }

        public _setTouchEnabled(value:boolean):void {
            this._DO_Props_._touchEnabled = value;
        }

        /**
         * BlendMode 类中的一个值，用于指定要使用的混合模式。
         * 内部绘制位图的方法有两种。 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @member {string} egret.DisplayObject#blendMode
         */
        public get blendMode():string {
            return this._DO_Props_._blendMode;
        }

        public set blendMode(value:string) {
            this._DO_Props_._blendMode = value;
        }

        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         *  @member {egret.Rectangle} egret.DisplayObject#scrollRect
         */
        public get scrollRect():Rectangle {
            return this._DO_Props_._scrollRect;
        }

        public set scrollRect(value:Rectangle) {
            this._setScrollRect(value);
        }

        public _setScrollRect(value:Rectangle):void {
            this._DO_Props_._scrollRect = value;

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


        /**
         * 显式设置宽度
         * @returns {number}
         */
        public get explicitWidth():number {
            return this._DO_Props_._explicitWidth;
        }


        /**
         * 显式设置高度
         * @returns {number}
         */
        public get explicitHeight():number {
            return this._DO_Props_._explicitHeight;
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


        public set width(value:number) {
            this._setWidth(value);
        }

        /**
         * @inheritDoc
         */
        public _setWidth(value:number):void {
            this._setSizeDirty();
            this._setCacheDirty();
            this._DO_Props_._explicitWidth = value;
            this._DO_Props_._hasWidthSet = NumberUtils.isNumber(value);
        }


        public set height(value:number) {
            this._setHeight(value);
        }

        /**
         * @inheritDoc
         */
        public _setHeight(value:number):void {
            this._setSizeDirty();
            this._setCacheDirty();
            this._DO_Props_._explicitHeight = value;
            this._DO_Props_._hasHeightSet = NumberUtils.isNumber(value);
        }

        /**
         * 调用显示对象被指定的 mask 对象遮罩。
         * 要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。但不绘制 mask 对象本身。
         * 将 mask 设置为 null 可删除蒙版。
         */
        public mask:Rectangle = null;

        /**
         * @private
         */
        public set worldAlpha(value:number) {
            this._DO_Props_._worldAlpha = value;
        }

        public get worldAlpha():number {
            return this._DO_Props_._worldAlpha;
        }


        /**
         * @private
         * @param renderContext
         */
        public _draw(renderContext:RendererContext):void {
            var o = this;
            if (!o._DO_Props_._visible) {
                o.destroyCacheBounds();
                return;
            }
            var hasDrawCache = o.drawCacheTexture(renderContext);
            if (hasDrawCache) {
                o.destroyCacheBounds();
                return;
            }
            var isCommandPush = MainContext.__use_new_draw && o._DO_Props_._isContainer;
            if(o._DO_Props_._filter && !isCommandPush) {
                renderContext.setGlobalFilter(o._DO_Props_._filter);
            }
            if (o._DO_Props_._colorTransform && !isCommandPush) {
                renderContext.setGlobalColorTransform(o._DO_Props_._colorTransform.matrix);
            }
            renderContext.setAlpha(o.worldAlpha, o.blendMode);
            renderContext.setTransform(o._worldTransform);
            var mask = o.mask || o._DO_Props_._scrollRect;
            if (mask && !isCommandPush) {
                renderContext.pushMask(mask);
            }
            o._render(renderContext);
            if (mask && !isCommandPush) {
                renderContext.popMask();
            }
            if (o._DO_Props_._colorTransform && !isCommandPush) {
                renderContext.setGlobalColorTransform(null);
            }
            if(o._DO_Props_._filter && !isCommandPush) {
                renderContext.setGlobalFilter(null);
            }
            o.destroyCacheBounds();
        }

        public _setGlobalFilter(renderContext:RendererContext):void {
            var o = this;
            renderContext.setGlobalFilter(o._DO_Props_._filter);
        }

        public _removeGlobalFilter(renderContext:RendererContext):void {
            renderContext.setGlobalFilter(null);
        }

        public _setGlobalColorTransform(renderContext:RendererContext):void {
            var o = this;
            renderContext.setGlobalColorTransform(o._DO_Props_._colorTransform.matrix);
        }

        public _removeGlobalColorTransform(renderContext:RendererContext):void {
            renderContext.setGlobalColorTransform(null);
        }

        public _pushMask(renderContext:RendererContext):void {
            var o = this;
            renderContext.setTransform(o._worldTransform);
            var mask = o.mask || o._DO_Props_._scrollRect;
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
            if (display._DO_Props_._cacheAsBitmap == false) {
                return false;
            }
            var bounds = display.getBounds(Rectangle.identity);
            if (display._DO_Privs_._cacheDirty || display._texture_to_render == null ||
                Math.round(bounds.width) - display._texture_to_render._textureWidth >= 1 ||
                Math.round(bounds.height) - display._texture_to_render._textureHeight >= 1) {
                var cached = display._makeBitmapCache();
                display._DO_Privs_._cacheDirty = !cached;
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
        public set needDraw(value:boolean) {
            this._DO_Props_._needDraw = value;
        }

        public get needDraw():boolean {
            return this._DO_Props_._needDraw;
        }

        /**
         * @private
         * @param renderContext
         */
        public _updateTransform():void {
            var o = this;
            var do_props = o._DO_Props_;
            if (!do_props._visible) {
                return;
            }
            o._calculateWorldTransform();
            if(MainContext._renderLoopPhase == "updateTransform") {
                if(o.needDraw || o._texture_to_render || do_props._cacheAsBitmap) {
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
            var do_props = o._DO_Props_;
            var worldTransform = o._worldTransform;
            var parent = do_props._parent;

            worldTransform.identityMatrix(parent._worldTransform);
            this._getMatrix(worldTransform);

            var scrollRect = do_props._scrollRect;
            if (scrollRect) {
                worldTransform.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
            }

//            if (this._texture_to_render){
//                var bounds:egret.Rectangle = DisplayObject.getTransformBounds(o._getSize(Rectangle.identity), o._worldTransform);
//                o._worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);
//            }
            o.worldAlpha = parent.worldAlpha * do_props._alpha;
        }

        /**
         * @private
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {

        }


        /**
         * 获取显示对象的测量边界
         * @method egret.DisplayObject#getBounds
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         */
        public getBounds(resultRect?:Rectangle, calculateAnchor:boolean = true):egret.Rectangle {

            var do_props = this._DO_Props_;
            var do_privs = this._DO_Privs_;
//            if (do_props._cacheBounds.x == 0 && do_props._cacheBounds.y == 0 && do_props._cacheBounds.width == 0 && do_props._cacheBounds.height == 0) {
            var rect:Rectangle = this._measureBounds();
            var w:number = do_props._hasWidthSet ? do_props._explicitWidth : rect.width;
            var h:number = do_props._hasHeightSet ? do_props._explicitHeight : rect.height;

            //记录测量宽高
            do_privs._rectW = rect.width;
            do_privs._rectH = rect.height;
            this._clearSizeDirty();

            var x:number = rect.x;
            var y:number = rect.y;
            var anchorX = 0, anchorY = 0;
            if (calculateAnchor) {
                if (do_props._anchorX != 0 || do_props._anchorY != 0) {
                    anchorX = w * do_props._anchorX;
                    anchorY = h * do_props._anchorY;
                }
                else {
                    anchorX = do_props._anchorOffsetX;
                    anchorY = do_props._anchorOffsetY;
                }
            }
            do_privs._cacheBounds.initialize(x - anchorX, y - anchorY, w, h);
//            }
            var result:egret.Rectangle = do_privs._cacheBounds;
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            return resultRect.initialize(result.x, result.y, result.width, result.height);
        }

        private destroyCacheBounds():void {
            var do_privs = this._DO_Privs_;
            do_privs._cacheBounds.x = 0;
            do_privs._cacheBounds.y = 0;
            do_privs._cacheBounds.width = 0;
            do_privs._cacheBounds.height = 0;
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
                var do_props = o._DO_Props_;
                if (do_props._anchorX != 0 || do_props._anchorY != 0) {
                    var bounds = o._getSize(Rectangle.identity);
                    matrix.prependTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation, do_props._skewX, do_props._skewY,
                        bounds.width * do_props._anchorX, bounds.height * do_props._anchorY);
                }
                else {
                    matrix.prependTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation, do_props._skewX, do_props._skewY, do_props._anchorOffsetX, do_props._anchorOffsetY);
                }
                if (do_props._scrollRect) {
                    matrix.prepend(1, 0, 0, 1, -do_props._scrollRect.x, -do_props._scrollRect.y);
                }
                o = do_props._parent;
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
            var self = this;
            var do_props = self._DO_Props_;
            if (!do_props._visible || (!ignoreTouchEnabled && !do_props._touchEnabled)) {
                return null;
            }
            var bound:Rectangle = self.getBounds(Rectangle.identity, false);
            x -= bound.x;
            y -= bound.y;
            if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {
                if (self.mask || do_props._scrollRect) {
                    if (do_props._scrollRect
                        && x > do_props._scrollRect.x
                        && y > do_props._scrollRect.y
                        && x < do_props._scrollRect.x + do_props._scrollRect.width
                        && y < do_props._scrollRect.y + do_props._scrollRect.height) {
                        return self;
                    }
                    else if (self.mask
                        && self.mask.x <= x
                        && x < self.mask.x + self.mask.width
                        && self.mask.y <= y
                        && y < self.mask.y + self.mask.height) {
                        return self;
                    }
                    return null;
                }
                return self;
            }
            else {
                return null;
            }
        }


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
            var self = this;
            var do_props = self._DO_Props_;
            var do_privs = self._DO_Privs_;
            var p:egret.Point = self.globalToLocal(x, y);
            if (!shapeFlag) {
                return !!self.hitTest(p.x, p.y, true);
            }
            else {
                if (!do_privs._hitTestPointTexture) {
                    do_privs._hitTestPointTexture = new RenderTexture();
                }
                var testTexture:Texture = do_privs._hitTestPointTexture;
                (<RenderTexture>testTexture).drawToTexture(self);
                var pixelData:number[] = testTexture.getPixel32(p.x - do_privs._hitTestPointTexture._offsetX, p.y - do_privs._hitTestPointTexture._offsetY);
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
            var self = this;
            var do_props = self._DO_Props_;

            var anchorX, anchorY;
            var resultPoint = this._getOffsetPoint();
            anchorX = resultPoint.x;
            anchorY = resultPoint.y;

            var matrix = self.__hack_local_matrix;
            if (matrix) {
                parentMatrix.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                parentMatrix.append(1, 0, 0, 1, -anchorX, -anchorY);
            }
            else {
                parentMatrix.appendTransform(do_props._x, do_props._y, do_props._scaleX, do_props._scaleY, do_props._rotation,
                    do_props._skewX, do_props._skewY, anchorX, anchorY);
            }

            return parentMatrix;
        }

        public _getSize(resultRect:Rectangle):Rectangle {
            var self = this;
            var do_props = self._DO_Props_;
            if (do_props._hasHeightSet && do_props._hasWidthSet) {
                this._clearSizeDirty();
                return resultRect.initialize(0, 0, do_props._explicitWidth, do_props._explicitHeight);
            }

            this._measureSize(resultRect);
            if (do_props._hasWidthSet){
                resultRect.width = do_props._explicitWidth;
            }
            if (do_props._hasHeightSet){
                resultRect.height = do_props._explicitHeight;
            }
            return resultRect;
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureSize(resultRect:Rectangle):egret.Rectangle {
            var self = this;
            var do_props = self._DO_Props_;
            var do_privs = self._DO_Privs_;
            if (do_props._sizeDirty) {
                resultRect = this._measureBounds();
                do_privs._rectW = resultRect.width;
                do_privs._rectH = resultRect.height;
                this._clearSizeDirty();
            }
            else {
                resultRect.width = do_privs._rectW;
                resultRect.height = do_privs._rectH;
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
            var do_props = o._DO_Props_;
            var regX = do_props._anchorOffsetX;
            var regY = do_props._anchorOffsetY;
            if (do_props._anchorX != 0 || do_props._anchorY != 0) {
                var bounds = o._getSize(Rectangle.identity);
                regX = do_props._anchorX * bounds.width;
                regY = do_props._anchorY * bounds.height;
            }
            var result = Point.identity;
            result.x = regX;
            result.y = regY;
            return result;
        }

        public _onAddToStage():void {
            this._DO_Props_._stage = MainContext.instance.stage;
            DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST.push(this);
        }

        public _onRemoveFromStage():void {
            DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST.push(this);
        }


        /**
         * 显示对象的舞台。
         * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指相同的 Stage 对象。
         * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
         * @member {number} egret.DisplayObject#stage
         * @returns {egret.Stage}
         */
        public get stage():Stage {
            return this._DO_Props_._stage;
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
                target = target._DO_Props_._parent;
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
                parent = parent._DO_Props_._parent;
            }
            return false;
        }



        /**
         * 如果设置为 true，则 egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 具有已缓存位图的显示对象的所有矢量数据都将被绘制到位图而不是主显示。像素按一对一与父对象进行映射。如果位图的边界发生更改，则将重新创建位图而不会拉伸它。
         * 除非将 cacheAsBitmap 属性设置为 true，否则不会创建内部位图。
         * @member {number} egret.DisplayObject#cacheAsBitmap
         */
        public get cacheAsBitmap():boolean {
            return this._DO_Props_._cacheAsBitmap;
        }


        public set cacheAsBitmap(bool:boolean) {
            this._DO_Props_._cacheAsBitmap = bool;
            if (bool) {
                egret.callLater(this._makeBitmapCache, this);
            }
            else {
                this._texture_to_render = null;
            }
        }

        public renderTexture:RenderTexture = null;
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

        public _setCacheDirty(dirty = true) {
            this._DO_Privs_._cacheDirty = dirty;
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



        public get colorTransform():ColorTransform {
            return this._DO_Props_._colorTransform;
        }

        public set colorTransform(value:ColorTransform) {
            this._DO_Props_._colorTransform = value;
        }

        public get filter():Filter {
            return this._DO_Props_._filter;
        }

        public set filter(value:Filter) {
            this._DO_Props_._filter = value;
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



