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

/// <reference path="scroller/ScrollerView.ts" />
module egret.gui {

    /**
     * @class egret.gui.Scroller
     * @classdesc
     * 滚动条组件
     * @extends egret.gui.UIComponent
     * @implements egret.gui.IVisualElementContainer
     */
    export class Scroller extends SkinnableComponent implements IVisualElementContainer {

        public _Scr_Props_:ScrollerProperties;
        /**
         * 构造函数
         * @method egret.gui.Scroller#constructor
         */
        public constructor() {
            super();
            ScrollerView.call(this);

            this._Scr_Props_ = new egret.gui.ScrollerProperties();
        }

        /**
         * 是否启用回弹，当启用回弹后，Scroller中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * 默认值是 true
         */
        public bounces: boolean;

        public setContent(content: IViewport) {
            (<ScrollerView><any>this)._content = <egret.DisplayObject><any>content;
            (<ScrollerView><any>this)._removeEvents();
            (<ScrollerView><any>this)._addEvents();
            (<ScrollerView><any>this)._ScrV_Props_._scrollLeft = content.horizontalScrollPosition;
            (<ScrollerView><any>this)._ScrV_Props_._scrollTop = content.verticalScrollPosition;
        }

        public _updateContentPosition(): void {
            var content: IViewport = <any>(<ScrollerView><any>this)._content;
            content.horizontalScrollPosition = (<ScrollerView><any>this)._ScrV_Props_._scrollLeft;
            content.verticalScrollPosition = (<ScrollerView><any>this)._ScrV_Props_._scrollTop;
            content.setLayoutBoundsSize(this._UIC_Props_._uiWidth, this._UIC_Props_._uiHeight);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public getMaxScrollLeft(): number {
            var content: IViewport = <any>(<ScrollerView><any>this)._content;
            var max = content.contentWidth - content.width;
            var min = (<UIComponent><any>content).initialized ? 0 : (content.horizontalScrollPosition || 0);
            return Math.max(max, min);
        }
        public getMaxScrollTop(): number {
            var content: IViewport = <any>(<ScrollerView><any>this)._content;
            var max = content.contentHeight - content.height;
            var min = (<UIComponent><any>content).initialized ? 0 : (content.verticalScrollPosition || 0);
            return Math.max(max, min);
        }
        public _getContentWidth(): number {
            return (<any>(<ScrollerView><any>this)._content).contentWidth;
        }
        public _getContentHeight(): number {
            return (<any>(<ScrollerView><any>this)._content).contentHeight;
        }

        public _onScrollStarted(): void {
            ScrollerView.prototype._onScrollStarted.call(this);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
        }
        public _onScrollFinished(): void {
            ScrollerView.prototype._onScrollFinished.call(this);
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

        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.Scroller#measure
         */
        public measure(): void {
            if (!this._Scr_Props_._viewport)
                return;
            this.measuredWidth = this._Scr_Props_._viewport.preferredWidth;
            this.measuredHeight = this._Scr_Props_._viewport.preferredHeight;
        }
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            this.viewport && this.viewport.setLayoutBoundsSize(unscaledWidth, unscaledHeight);
            (<ScrollerView><any>this)._checkScrollPolicy();
            if ((<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy != "off") {
                var pos = this.viewport.horizontalScrollPosition;
                var maxPos = (<ScrollerView><any>this).getMaxScrollLeft();
                var pos = Math.min(pos, maxPos);
                this.setViewportHScrollPosition(pos)
                var hbar = this.horizontalScrollBar;
                if (hbar) {
                    hbar._setViewportMetric(unscaledWidth, this._Scr_Props_._viewport.contentWidth);
                    hbar.$setWidth(unscaledWidth - (hbar.left || 0) - (hbar.right || 0));
                    hbar.x = hbar.left || 0;
                    hbar.y = unscaledHeight - this.horizontalScrollBar.layoutBoundsHeight;
                    hbar.visible = (<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy == ScrollPolicy.ON || (<ScrollerView><any>this)._ScrV_Props_._hCanScroll;
                    if (this._Scr_Props_._autoHideScrollBars)
                        hbar.alpha = 0;
                }
            }
            if ((<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy != "off") {
                var pos = this.viewport.verticalScrollPosition;
                var maxPos = (<ScrollerView><any>this).getMaxScrollTop();
                pos = Math.min(pos, maxPos);
                this.setViewportVScrollPosition(pos)
                var vbar = this.verticalScrollBar;
                if (vbar) {
                    vbar._setViewportMetric(unscaledHeight, this._Scr_Props_._viewport.contentHeight);
                    vbar.$setHeight(unscaledHeight - (vbar.top || 0) - (vbar.bottom || 0));
                    vbar.y = vbar.top || 0;
                    vbar.x = unscaledWidth - this.verticalScrollBar.layoutBoundsWidth;
                    vbar.visible = (<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy == ScrollPolicy.ON || (<ScrollerView><any>this)._ScrV_Props_._vCanScroll;
                    if (this._Scr_Props_._autoHideScrollBars)
                        vbar.alpha = 0;
                }
            }
        }


        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#verticalScrollPolicy
         */
        public get verticalScrollPolicy(): string {
            return (<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == (<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy)
                return;
            (<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy = value;
            this._checkVbar();
            (<ScrollerView><any>this).verticalScrollPolicy = value;
        }


        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy(): string {
            return (<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == (<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy)
                return;
            (<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy = value;
            this._checkHbar();
            (<ScrollerView><any>this).horizontalScrollPolicy = value;
        }


        /**
         * 要滚动的视域组件。
         * @member egret.gui.Scroller#viewport
         */
        public get viewport(): IViewport {
            return this._Scr_Props_._viewport;
        }
        public set viewport(value: IViewport) {
            if (value == this._Scr_Props_._viewport)
                return;

            this.uninstallViewport();
            this._Scr_Props_._viewport = value;
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
            this.setViewportHScrollPosition((<ScrollerView><any>this).scrollLeft);
            this.setViewportVScrollPosition((<ScrollerView><any>this).scrollTop);
        }

        /**
         *
         * @param pos
         */
        private setViewportVScrollPosition(pos: number): void {
            if ((<ScrollerView><any>this).scrollTop != pos)
                (<ScrollerView><any>this).scrollTop = pos;
            if (this.verticalScrollBar && this.verticalScrollBar.value != pos) {
                this.verticalScrollBar.setPosition(pos);
                this.hideOrShow(true);
                this.setAutoHideTimer();
            }
        }
        private setViewportHScrollPosition(pos: number): void {
            if ((<ScrollerView><any>this).scrollLeft != pos)
                (<ScrollerView><any>this).scrollLeft = pos;
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
            (<ScrollerView><any>this).setScrollLeft(hspTo, duration);
        }
        /**
         * 缓动到垂直滚动位置
         * @method egret.gui.Scroller#throwVertically
         * @param vspTo {number}
         * @param duration {number}
         */
        public throwVertically(vspTo: number, duration: number= 500): void {
            (<ScrollerView><any>this).setScrollTop(vspTo, duration);
        }

        /**
         * 是否自动隐藏滚动条
         * @member egret.gui.Scroller#autoHideScrollBars
         */
        public get autoHideScrollBars(): boolean {
            return this._Scr_Props_._autoHideScrollBars;
        }

        public set autoHideScrollBars(value: boolean) {
            if (this._Scr_Props_._autoHideScrollBars == value)
                return;
            this._Scr_Props_._autoHideScrollBars = value;
            if (value)
                this.setAutoHideTimer();
            else
                this.hideOrShow(true);
        }

        /**
         * 自动隐藏滚动条延时时间(毫秒)，当autoHideScrollBars为true时有效
         * @member egret.gui.Scroller#autoHideDelay
         */
        public get autoHideDelay() {
            return this._Scr_Props_._autoHideDelay;
        }

        public set autoHideDelay(value: number) {
            if (this._Scr_Props_._autoHideDelay == value)
                return;
            this._Scr_Props_._autoHideDelay = value;
        }

        private setAutoHideTimer() {
            if (!this._Scr_Props_._autoHideScrollBars || !this.initialized)
                return;
            if (!this.horizontalScrollBar && !this.verticalScrollBar)
                return;
            if (this._Scr_Props_._autoHideTimer != NaN) {
                egret.gui.$clearTimer(this._Scr_Props_._autoHideTimer);
            }
            this._Scr_Props_._autoHideTimer = egret.gui.$addTimer(this.hideOrShow.bind(this, false), this, this._Scr_Props_._autoHideDelay);
        }

        private hideOrShow(show: boolean) {
            if (!this.initialized || (!this.horizontalScrollBar && !this.verticalScrollBar))
                return;
            if (this._Scr_Props_._autoHideShowAnimat == null) {
                this._Scr_Props_._autoHideShowAnimat = new Animation(b=> {
                    var a = b.currentValue["alpha"]
                    if (this.horizontalScrollBar)
                        this.horizontalScrollBar.alpha = a;
                    if (this.verticalScrollBar)
                        this.verticalScrollBar.alpha = a;
                }, this);
            }
            else {
                if (this._Scr_Props_._animatTargetIsShow == show)
                    return;
                this._Scr_Props_._autoHideShowAnimat.isPlaying && this._Scr_Props_._autoHideShowAnimat.stop();
            }
            this._Scr_Props_._animatTargetIsShow = show;
            var animat = this._Scr_Props_._autoHideShowAnimat;
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
            egret.$error(3011, index);
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
            egret.$error(3012);
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
            if ((<ScrollerView><any>this)._ScrV_Props_._horizontalScrollPolicy == "off") {
                this._uninstallHorizontalScrollBar();
                return;
            }
            if (!this.horizontalScrollBar)
                return;
            var bar = this.horizontalScrollBar;
            bar.addEventListener(Event.CHANGE, this.hBarChanged, this, false);
            bar._setViewportMetric(this._Scr_Props_._viewport.width, this._Scr_Props_._viewport.contentWidth);
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
            if ((<ScrollerView><any>this)._ScrV_Props_._verticalScrollPolicy == "off") {
                this._uninstallVerticalScrollBar();
                return;
            }
            if (!this.verticalScrollBar)
                return;
            if (this.verticalScrollBar.owner == this)
                return;
            var vbar = this.verticalScrollBar;
            vbar.addEventListener(Event.CHANGE, this.vBarChanged, this, false);
            vbar._setViewportMetric(this._Scr_Props_._viewport.height, this._Scr_Props_._viewport.contentHeight);
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
    }
    //增加ScrollView方法
    for (var p in ScrollerView.prototype) {
        //跳过Scroller，SkinnableComponent，UIComponent 重写的方法
        if (ScrollerView.prototype.hasOwnProperty(p)
            && !Scroller.prototype.hasOwnProperty(p)
            && !SkinnableComponent.prototype.hasOwnProperty(p)
            && !UIComponent.prototype.hasOwnProperty(p)) {

            var desc = Object.getOwnPropertyDescriptor(ScrollerView.prototype, p);
            if (desc && (desc.get || desc.set))
                Object.defineProperty(Scroller.prototype, p, desc);
            else
                Scroller.prototype[p] = ScrollerView.prototype[p];
        }
    }
}