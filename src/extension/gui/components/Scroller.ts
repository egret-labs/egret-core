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


module egret.gui {

    /**
     * @class egret.gui.Scroller
     * @classdesc
     * 滚动条组件
     * @extends egret.gui.UIComponent
     * @implements egret.gui.IVisualElementContainer
        */
    export class Scroller extends SkinnableComponent implements IVisualElementContainer {

        /**
         * 构造函数
         * @method egret.gui.Scroller#constructor
            */
        public constructor() {
            super();
            ScrollView.call(this);
        }
        private _scrollLeft: number = 0;
        private _scrollTop: number = 0;
        private _content: IViewport = null;


        /**
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @member {number} egret.gui.Scroller#scrollBeginThreshold
         */
        public scrollBeginThreshold: number = 10;

        
        /**
         * 滚动速度，这个值为需要的速度与默认速度的比值。 
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @member {number} egret.gui.Scroller#scrollSpeed
         */
        public scrollSpeed: number = 1;

        public setContent(content: IViewport) {
            this._content = content;
            this._scroller._removeEvents();
            this._scroller._addEvents();
            this._scrollLeft = content.horizontalScrollPosition;
            this._scrollTop = content.verticalScrollPosition;
        }

        public _updateContentPosition(): void {
            var content: IViewport = <any>this._content;
            content.horizontalScrollPosition = this._scrollLeft;
            content.verticalScrollPosition = this._scrollTop;
            content.setLayoutBoundsSize(this._width, this._height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public getMaxScrollLeft(): number {
            var content: IViewport = <any>this._content;
            var max = content.contentWidth - content.width;
            var min = (<UIComponent><any>content).initialized ? 0 : (content.horizontalScrollPosition || 0);
            return Math.max(max, min);
        }
        public getMaxScrollTop(): number {
            var content: IViewport = <any>this._content;
            var max = content.contentHeight - content.height;
            var min = (<UIComponent><any>content).initialized ? 0 : (content.verticalScrollPosition || 0);
            return Math.max(max, min);
        }
        public _getContentWidth(): number {
            return (<any>this._content).contentWidth;
        }
        public _getContentHeight(): number {
            return (<any>this._content).contentHeight;
        }

        public _onScrollStarted(): void {
            ScrollView.prototype._onScrollStarted.call(this);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
        }
        public _onScrollFinished(): void {
            ScrollView.prototype._onScrollFinished.call(this);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
        }

        /**
             * [SkinPart]水平滚动条
             */
        public horizontalScrollBar: HScrollBar = null;
        /**
         * [SkinPart]垂直滚动条
         */
        public verticalScrollBar: VScrollBar = null;

        public _scroller: egret.ScrollView = <any>this;

        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.Scroller#measure
         */
        public measure(): void {
            if (!this._viewport)
                return;
            this.measuredWidth = this._viewport.preferredWidth;
            this.measuredHeight = this._viewport.preferredHeight;
        }
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth {number}
         * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            this.viewport && this.viewport.setLayoutBoundsSize(unscaledWidth, unscaledHeight);
            this._scroller._checkScrollPolicy();
            if (this._horizontalScrollPolicy != "off") {
                var pos = this.viewport.horizontalScrollPosition;
                var maxPos = this._scroller.getMaxScrollLeft();
                var pos = Math.min(pos, maxPos);
                this.setViewportHScrollPosition(pos)
                var hbar = this.horizontalScrollBar;
                if (hbar) {
                    hbar._setViewportMetric(unscaledWidth, this._viewport.contentWidth);
                    hbar._setWidth(unscaledWidth - (hbar.left || 0) - (hbar.right || 0));
                    hbar.x = hbar.left || 0;
                    hbar.y = unscaledHeight - this.horizontalScrollBar.layoutBoundsHeight;
                    hbar.visible = this._horizontalScrollPolicy == ScrollPolicy.ON || this._scroller._hCanScroll;
                    if (this._autoHideScrollBars)
                        hbar.alpha = 0;
                }
            }
            if (this._verticalScrollPolicy != "off") {
                var pos = this.viewport.verticalScrollPosition;
                var maxPos = this._scroller.getMaxScrollTop();
                pos = Math.min(pos, maxPos);
                this.setViewportVScrollPosition(pos)
                var vbar = this.verticalScrollBar;
                if (vbar) {
                    vbar._setViewportMetric(unscaledHeight, this._viewport.contentHeight);
                    vbar._setHeight(unscaledHeight - (vbar.top || 0) - (vbar.bottom || 0));
                    vbar.y = vbar.top || 0;
                    vbar.x = unscaledWidth - this.verticalScrollBar.layoutBoundsWidth;
                    vbar.visible = this._verticalScrollPolicy == ScrollPolicy.ON || this._scroller._vCanScroll;
                    if (this._autoHideScrollBars)
                        vbar.alpha = 0;
                }
            }
        }

        private _verticalScrollPolicy: string = "auto";

        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#verticalScrollPolicy
         */
        public get verticalScrollPolicy(): string {
            return this._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._verticalScrollPolicy)
                return;
            this._verticalScrollPolicy = value;
            this._checkVbar();
            this._scroller.verticalScrollPolicy = value;
        }

        private _horizontalScrollPolicy: string = "auto";

        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy(): string {
            return this._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == this._horizontalScrollPolicy)
                return;
            this._horizontalScrollPolicy = value;
            this._checkHbar();
            this._scroller.horizontalScrollPolicy = value;
        }

        private _viewport: IViewport = null;

        /**
         * 要滚动的视域组件。
         * @member egret.gui.Scroller#viewport
         */
        public get viewport(): IViewport {
            return this._viewport;
        }
        public set viewport(value: IViewport) {
            if (value == this._viewport)
                return;

            this.uninstallViewport();
            this._viewport = value;
            this.installViewport();
            this.dispatchEventWith("viewportChanged");
        }

        /**
         * 安装并初始化视域组件
         */
        private installViewport(): void {
            var viewport: IViewport = this.viewport;
            this.addEventListener(egret.Event.CHANGE, this._scrollerChangedHandler, this);
            if (this._createChildrenCalled && viewport) {
                viewport.clipAndEnableScrolling = true;
                this.setContent(viewport);
                this._addToDisplayListAt(<DisplayObject><any>viewport, 0);
                viewport.addEventListener(egret.gui.PropertyChangeEvent.PROPERTY_CHANGE, this._viewportChangedHandler, this);
            }
        }

        /**
         * 卸载视域组件
         */
        private uninstallViewport(): void {
            if (this.viewport) {
                this.viewport.clipAndEnableScrolling = false;
                this.viewport.removeEventListener(egret.gui.PropertyChangeEvent.PROPERTY_CHANGE, this._viewportChangedHandler, this);
                this._removeFromDisplayList(<DisplayObject><any>this.viewport);
            }
        }

        /**
         *
         * @param e
         * @private
         */
        private _viewportChangedHandler(e: egret.gui.PropertyChangeEvent): void {
            if (e.property == "horizontalScrollPosition")
                this.setViewportHScrollPosition(this.viewport.horizontalScrollPosition);
            if (e.property == "verticalScrollPosition")
                this.setViewportVScrollPosition(this.viewport.verticalScrollPosition);
            if (e.property == "contentWidth" || e.property == "contentHeight") {
                this.invalidateDisplayList();
                this.invalidateSize();
            }
        }

        /**
         *
         * @param e
         * @private
         */
        private _scrollerChangedHandler(e: Event) {
            this.setViewportHScrollPosition(this._scroller.scrollLeft);
            this.setViewportVScrollPosition(this._scroller.scrollTop);
        }

        /**
         *
         * @param pos
         */
        private setViewportVScrollPosition(pos: number): void {
            if (this._scroller.scrollTop != pos)
                this._scroller.scrollTop = pos;
            if (this.verticalScrollBar && this.verticalScrollBar.value != pos) {
                this.verticalScrollBar.setPosition(pos);
                this.hideOrShow(true);
                this.setAutoHideTimer();
            }
        }
        private setViewportHScrollPosition(pos: number): void {
            if (this._scroller.scrollLeft != pos)
                this._scroller.scrollLeft = pos;
            if (this.horizontalScrollBar && this.horizontalScrollBar.value != pos) {
                this.horizontalScrollBar._setValue(pos);
                this.hideOrShow(true);
                this.setAutoHideTimer();
            }
        }

        /**
         * 缓动到水平滚动位置
         * @method egret.gui.Scroller#throwHorizontally
         * @param hspTo {number} 
         * @param duration {number} 
         */
        public throwHorizontally(hspTo: number, duration: number= 500): void {
            this._scroller.setScrollLeft(hspTo, duration);
        }
        /**
         * 缓动到垂直滚动位置
         * @method egret.gui.Scroller#throwVertically
         * @param vspTo {number} 
         * @param duration {number} 
         */
        public throwVertically(vspTo: number, duration: number= 500): void {
            this._scroller.setScrollTop(vspTo, duration);
        }

        private _autoHideScrollBars: boolean = true;
        /**
         * 是否自动隐藏滚动条
         * @member egret.gui.Scroller#autoHideScrollBars
         */
        public set autoHideScrollBars(value: boolean) {
            if (this._autoHideScrollBars == value)
                return;
            this._autoHideScrollBars = value;
            if (value)
                this.setAutoHideTimer();
            else
                this.hideOrShow(true);
        }

        public get autoHideScrollBars(): boolean {
            return this._autoHideScrollBars;
        }

        private _autoHideTimer = NaN;
        private _autoHideDelay = 300;
        public set autoHideDelay(value: number) {
            if (this._autoHideDelay == value)
                return;
            this._autoHideDelay = value;
        }

        public get autoHideDelay() {
            return this._autoHideDelay;
        }
        private setAutoHideTimer() {
            if (!this._autoHideScrollBars || !this.initialized)
                return;
            if (!this.horizontalScrollBar && !this.verticalScrollBar)
                return;
            if (this._autoHideTimer != NaN) {
                egret.clearTimeout(this._autoHideTimer);
            }
            this._autoHideTimer = egret.setTimeout(this.hideOrShow.bind(this, false), this, this._autoHideDelay);
        }

        private _autoHideShowAnimat: Animation = null;
        private _animatTargetIsShow: boolean = false;

        private hideOrShow(show: boolean) {
            if (!this.initialized || (!this.horizontalScrollBar && !this.verticalScrollBar))
                return;
            if (this._autoHideShowAnimat == null) {
                this._autoHideShowAnimat = new Animation(b=> {
                    var a = b.currentValue["alpha"]
                    if (this.horizontalScrollBar)
                        this.horizontalScrollBar.alpha = a;
                    if (this.verticalScrollBar)
                        this.verticalScrollBar.alpha = a;
                }, this);
            }
            else {
                if (this._animatTargetIsShow == show)
                    return;
                this._autoHideShowAnimat.isPlaying && this._autoHideShowAnimat.stop();
            }
            this._animatTargetIsShow = show;
            var animat = this._autoHideShowAnimat;
            animat.motionPaths = [
                new SimpleMotionPath("alpha",show ? 0 : 1,show ? 1 : 0)
            ];
            animat.duration = show ? 100 : 300;
            animat.play();
        }

        /**
         * @member egret.gui.Scroller#numElements
         */
        public get numElements(): number {
            return this.viewport ? 1 : 0;
        }

        /**
         * 抛出索引越界异常
         */
        private throwRangeError(index: number): void {
            throw new RangeError(getString(3011, index));
        }
        /**
         * 如果存在视域，且传入的索引为 0，则返回该视域
         * @param index {number}
         * @returns {IVisualElement}
         */
        public getElementAt(index: number): IVisualElement {
            if (this.viewport && index == 0)
                return this.viewport;
            else
                this.throwRangeError(index);
            return null;
        }

        /**
         * 如果传入的元素是视域，则返回 0
         * @param element {IVisualElement}
         * @returns {number}
         */
        public getElementIndex(element: IVisualElement): number {
            if (element != null && element == this.viewport)
                return 0;
            else
                return -1;
        }
        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身
         * @param element {IVisualElement}
         * @returns {boolean}
         */
        public containsElement(element: IVisualElement): boolean {
            if (element != null && element == this.viewport)
                return true;
            return false;
        }

        private throwNotSupportedError(): void {
            throw new Error(getString(3012));
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement} 
         * @returns {IVisualElement}
         */
        public addElement(element: IVisualElement): IVisualElement {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement} 
         * @param index {number} 
         * @returns {IVisualElement}
         */
        public addElementAt(element: IVisualElement, index: number): IVisualElement {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement} 
         * @returns {IVisualElement}
         */
        public removeElement(element: IVisualElement): IVisualElement {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index {number} 
         * @returns {IVisualElement}
         */
        public removeElementAt(index: number): IVisualElement {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         */
        public removeAllElements(): void {
            this.throwNotSupportedError();
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement} 
         * @param index {number} 
         */
        public setElementIndex(element: IVisualElement, index: number): void {
            this.throwNotSupportedError();
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element1 {IVisualElement} 
         * @param element2 {IVisualElement} 
         */
        public swapElements(element1: IVisualElement, element2: IVisualElement): void {
            this.throwNotSupportedError();
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index1 {number} 
         * @param index2 {number} 
         */
        public swapElementsAt(index1: number, index2: number): void {
            this.throwNotSupportedError();
        }

        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject} 
         * @returns {DisplayObject}
         */
        public addChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject} 
         * @param index {number} 
         * @returns {DisplayObject}
         */
        public addChildAt(child: DisplayObject, index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject} 
         * @returns {DisplayObject}
         */
        public removeChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index {number} 
         * @returns {DisplayObject}
         */
        public removeChildAt(index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject} 
         * @param index {number} 
         */
        public setChildIndex(child: DisplayObject, index: number): void {
            this.throwNotSupportedError();
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child1 {DisplayObject} 
         * @param child2 {DisplayObject} 
         */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
            this.throwNotSupportedError();
        }
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index1 {number} 
         * @param index2 {number} 
         */
        public swapChildrenAt(index1: number, index2: number): void {
            this.throwNotSupportedError();
        }

        /**
         *
         * @private
         */
        public _checkHbar(): void {
            if (this._horizontalScrollPolicy == "off") {
                this._uninstallHorizontalScrollBar();
                return;
            }
            if (!this.horizontalScrollBar)
                return;
            var bar = this.horizontalScrollBar;
            bar.addEventListener(Event.CHANGE, this.hBarChanged, this, false);
            bar._setViewportMetric(this._viewport.width, this._viewport.contentWidth);
            if (bar.owner && "removeElement" in bar.owner) {
                (<IContainer>bar.owner).removeElement(bar);
            }
            this._addToDisplayList(this.horizontalScrollBar);
        }

        /**
         *
         * @private
         */
        public _checkVbar(): void {
            if (this._verticalScrollPolicy == "off") {
                this._uninstallVerticalScrollBar();
                return;
            }
            if (!this.verticalScrollBar)
                return;
            if (this.verticalScrollBar.owner == this)
                return;
            var vbar = this.verticalScrollBar;
            vbar.addEventListener(Event.CHANGE, this.vBarChanged, this, false);
            vbar._setViewportMetric(this._viewport.height, this._viewport.contentHeight);
            if (vbar.owner && "removeElement" in vbar.owner) {
                (<IContainer>vbar.owner).removeElement(vbar);
            }
            this._addToDisplayList(this.verticalScrollBar);
        }

        /**
         * 创建容器的子元素
         */
        public createChildren(): void {
            super.createChildren();
            this.installViewport();
        }

        /**
         * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
         * @param partName {string}
         * @param instance {any} 
         */
        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.horizontalScrollBar) {
                this._checkHbar();
            }
            if (instance == this.verticalScrollBar) {
                this._checkVbar();
            }
        }
        /**
         * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
         * @method egret.gui.Scroller#partRemoved
         * @param partName {string} 
         * @param instance {any} 
         */
        public partRemoved(partName: string, instance: any): void {
            super.partRemoved(partName, instance);
            if (this.horizontalScrollBar == instance) {
                if (this.horizontalScrollBar.parent == this)
                    this._uninstallHorizontalScrollBar();
                this.horizontalScrollBar = null;
            }
            if (this.verticalScrollBar == instance) {
                if (this.verticalScrollBar.parent == this)
                    this._uninstallVerticalScrollBar();
                this.verticalScrollBar = null;
            }
        }

        public _uninstallHorizontalScrollBar() {
            if (this.horizontalScrollBar == null)
                return;
            this._removeFromDisplayList(this.horizontalScrollBar);
            this.horizontalScrollBar.removeEventListener(Event.CHANGE, this.hBarChanged, this, false);
        }
        public _uninstallVerticalScrollBar() {
            if (this.verticalScrollBar == null)
                return;
            this._removeFromDisplayList(this.verticalScrollBar);
            this.verticalScrollBar.removeEventListener(Event.CHANGE, this.vBarChanged, this, false);
        }

        private hBarChanged(e: Event): void {
            this.setViewportHScrollPosition(this.horizontalScrollBar._getValue());
        }
        private vBarChanged(e: Event): void {
            this.setViewportVScrollPosition(this.verticalScrollBar.getPosition());
        }
        public hitTest(x: number, y: number, ignoreTouchEnabled: boolean = false): DisplayObject {
            var childTouched = super.hitTest(x, y, ignoreTouchEnabled);
            if (childTouched)
                return childTouched;

            if (!this._visible || (!ignoreTouchEnabled && !this._touchEnabled)) {
                return null;
            }
            if (0 <= x && x < this.width && 0 <= y && y < this.height) {
                return this;
            }
            return null;
        }
    }
    //增加ScrollView方法
    for (var p in egret.ScrollView.prototype) {
        //跳过Scroller，SkinnableComponent，UIComponent 重写的方法
        if (egret.ScrollView.prototype.hasOwnProperty(p)
            && !Scroller.prototype.hasOwnProperty(p)
            && !SkinnableComponent.prototype.hasOwnProperty(p)
            && !UIComponent.prototype.hasOwnProperty(p)) {

            var desc = Object.getOwnPropertyDescriptor(egret.ScrollView.prototype, p);
            if (desc && (desc.get || desc.set)) 
                Object.defineProperty(Scroller.prototype, p, desc);
            else
                Scroller.prototype[p] = egret.ScrollView.prototype[p];
        }
    }
}