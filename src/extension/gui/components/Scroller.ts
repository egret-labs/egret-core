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
        * @class egret.gui.ViewportScroller
        * @classdesc
        * 适用Viewport的滑动类
        * @extends egret.Scroller
        */
    class ViewportScroller extends egret.ScrollView {
        _width = 0;
        _height = 0;
        /**
            * @method egret.gui.GroupBase#constructor
            */
        public constructor(public content: DisplayObject) {
            super(content);
            this._content = content;
        }

        public _updateContentPosition() {
            var content: IViewport = <any>this.content;
            content.horizontalScrollPosition = this._scrollLeft;
            content.verticalScrollPosition = this._scrollTop;
            content.setLayoutBoundsSize(this._width, this._height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public getMaxScrollLeft() {
            var content: IViewport = <any>this.content;
            var max = content.contentWidth - content.width;
            return Math.max(max, 0);
        }
        public getMaxScrollTop() {
            var content: IViewport = <any>this.content;
            var max = content.contentHeight - content.height;
            return Math.max(max, 0);
        }
        public _getContentWidth() {
            return (<any>this._content).contentWidth;
        }
        public _getContentHeight() {
            return (<any>this._content).contentHeight;
        }

        public _setHeight(value: number) {
            this._height = value;
            var content: IViewport = <any>this.content;
            content.setLayoutBoundsSize(this._width, this._height);
        }

        public _setWidth(value:number) { 
            this._width = value;
            var content: IViewport = <any>this.content;
            content.setLayoutBoundsSize(this._width, this._height);
        }
        public get height(): number {
            return this._height;
        }
        public set height(value) { 
            this._setHeight(value);
        }

        public get width(): number {
            return this._width;
        }
        public set width(value) {
            this._setWidth(value);
        }

        invalidateSize() {
            var p = <UIComponent>this.parent;
            p && p.invalidateSize();
        }
        invalidateDisplayList(){
            var p = <UIComponent>this.parent;
            p&&p.invalidateDisplayList();
        }
    }
    
	/**
	 * @class egret.gui.Scroller
	 * @classdesc
	 * 滚动条组件
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IVisualElementContainer
	 */	
    export class Scroller extends SkinnableComponent implements IVisualElementContainer{

        /**
         * 构造函数
		 * @method egret.gui.Scroller#constructor
         */
        public constructor(){
            super();
            this.hostComponentKey = "egret.gui.Scroller";
        }
        /**
		 * [SkinPart]水平滚动条
		 */		
        public horizontalScrollBar: HScrollBar;
		/**
		 * [SkinPart]垂直滚动条
		 */		
        public verticalScrollBar: VScrollBar;

        public set hBar(value: HScrollBar) {
            Logger.warning("Scroller.hBar已废弃，请使用Scroller.horizontalScrollBar设置");
            this.horizontalScrollBar = value;
        }
        public get hBar():HScrollBar {
            Logger.warning("Scroller.hBar已废弃，请使用Scroller.horizontalScrollBar");
            return this.horizontalScrollBar;
        }
        public set vBar(value: VScrollBar) {
            Logger.warning("Scroller.vBar已废弃，请使用Scroller.verticalScrollBar设置");
            this.verticalScrollBar = value;
        }
        public get vBar():VScrollBar {
            Logger.warning("Scroller.vBar已废弃，请使用Scroller.verticalScrollBar");
            return this.verticalScrollBar;
        }

        public _scroller: egret.ScrollView;

        /**
		 * @method egret.gui.Scroller#measure
         */
        public measure():void{
            if(!this._viewport)
                return;
            this.measuredWidth = this._viewport.preferredWidth;
            this.measuredHeight = this._viewport.preferredHeight;
        }
        /**
		 * @method egret.gui.Scroller#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            this._scroller._setWidth(unscaledWidth);
            this._scroller._setHeight(unscaledHeight);
            if (this.horizontalScrollBar) {
                if (this._horizontalScrollPolicy != "off") {
                    this.horizontalScrollBar._setViewportMetric(unscaledWidth, this._viewport.contentWidth);
                    this.horizontalScrollBar._setWidth(unscaledWidth - 2);
                    this.horizontalScrollBar.x = 1;
                    this.horizontalScrollBar.y = unscaledHeight - this.horizontalScrollBar._height - 1;
                }
            }
            if (this.verticalScrollBar) {
                if (this._verticalScrollPolicy != "off") {
                    this.verticalScrollBar._setViewportMetric(unscaledHeight, this._viewport.contentHeight);
                    this.verticalScrollBar._setHeight(unscaledHeight - 2);
                    this.verticalScrollBar.y = 1;
                    this.verticalScrollBar.x = unscaledWidth - this.verticalScrollBar.width - 1;
                }
            }
        }

        private _verticalScrollPolicy:string = "auto";

        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member egret.gui.Scroller#verticalScrollPolicy
         */
        public get verticalScrollPolicy():string
        {
            return this._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._verticalScrollPolicy)
                return;
            this._verticalScrollPolicy = value;
            this._checkVbar();
            if (this._scroller)
                this._scroller.verticalScrollPolicy = value;
        }

        private _horizontalScrollPolicy:string = "auto";

        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member egret.gui.Scroller#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy():string
        {
            return this._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == this._horizontalScrollPolicy)
                return;
            this._horizontalScrollPolicy = value;
            this._checkHbar();
            if (this._scroller)
                this._scroller.horizontalScrollPolicy = value;
        }

        private _viewport:IViewport;

        /**
         * 要滚动的视域组件。
		 * @member egret.gui.Scroller#viewport
         */
        public get viewport():IViewport{
            return this._viewport;
        }
        public set viewport(value:IViewport){
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
        private installViewport():void{
            if (this.viewport){
                this.viewport.clipAndEnableScrolling = true;
                this._scroller = new ViewportScroller(<DisplayObject><any>this.viewport);
                this._scroller.addEventListener(egret.Event.CHANGE, this._scrollerChangedHandler, this);
                this._scroller.horizontalScrollPolicy = this._horizontalScrollPolicy;
                this._scroller.verticalScrollPolicy = this._verticalScrollPolicy;
                this._addToDisplayListAt(<DisplayObject><any> this._scroller, 0);
            }
            //this._addScrollBars();
        }

        _onAddToStage() {
            super._onAddToStage();
            this._scroller._stage = this.stage;
        }
        /**
         * 卸载视域组件
         */
        private uninstallViewport():void{
            if (this.viewport){
                this.viewport.clipAndEnableScrolling = false;
                this._removeFromDisplayList(<DisplayObject><any> this.viewport);
            }
            this._removeScrollBars();
        }


        private _scrollerChangedHandler(e: Event) {
            this.setViewportHScrollPosition(this._scroller.scrollLeft);
            this.setViewportVScrollPosition(this._scroller.scrollTop);
        }

        private setViewportVScrollPosition(pos: number) {
            if (this._scroller.scrollTop != pos)
                this._scroller.scrollTop = pos;
            if (this.verticalScrollBar && this.verticalScrollBar.value != pos)
                this.verticalScrollBar.setPosition(pos);
        }
        private setViewportHScrollPosition(pos: number) {
            if (this._scroller.scrollLeft != pos)
                this._scroller.scrollLeft = pos;
            if (this.horizontalScrollBar&&this.horizontalScrollBar.value != pos)
                this.horizontalScrollBar._setValue(pos);
        }

        /**
         * 缓动到水平滚动位置
         * @method egret.gui.Scroller#throwHorizontally
         * @param hspTo {number} 
         * @param duration {number} 
         */
        public throwHorizontally(hspTo: number, duration: number= 500): void {
            if (!this._scroller)
                return;
            this._scroller.setScrollLeft(hspTo, duration);
        }
        /**
         * 缓动到垂直滚动位置
         * @method egret.gui.Scroller#throwVertically
         * @param vspTo {number} 
         * @param duration {number} 
         */
        public throwVertically(vspTo: number, duration: number= 500): void {
            if (!this._scroller)
                return;
            this._scroller.setScrollTop(vspTo, duration);
        }

		/**
		 * @member egret.gui.Scroller#numElements
		 */
        public get numElements():number{
            return this.viewport ? 1 : 0;
        }

        /**
         * 抛出索引越界异常
         */
        private throwRangeError(index:number):void{
            throw new RangeError("索引:\""+index+"\"超出可视元素索引范围");
        }
        /**
		 * @method egret.gui.Scroller#getElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            if (this.viewport && index == 0)
                return this.viewport;
            else
                this.throwRangeError(index);
            return null;
        }

        /**
		 * @method egret.gui.Scroller#getElementIndex
		 * @param element {IVisualElement} 
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            if (element != null && element == this.viewport)
                return 0;
            else
                return -1;
        }
        /**
		 * @method egret.gui.Scroller#containsElement
		 * @param element {IVisualElement} 
		 * @returns {boolean}
         */
        public containsElement(element:IVisualElement):boolean{
            if (element != null && element == this.viewport)
                return true;
            return false;
        }

        private throwNotSupportedError():void{
            throw new Error("此方法在Scroller组件内不可用!");
        }
        /**
		 * @method egret.gui.Scroller#addElement
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public addElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#addElementAt
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public addElementAt(element:IVisualElement, index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#removeElement
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public removeElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#removeElementAt
         * @deprecated
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public removeElementAt(index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#removeAllElements
         * @deprecated
         */
        public removeAllElements():void{
            this.throwNotSupportedError();
        }
        /**
		 * @method egret.gui.Scroller#setElementIndex
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
         */
        public setElementIndex(element:IVisualElement, index:number):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method egret.gui.Scroller#swapElements
         * @deprecated
		 * @param element1 {IVisualElement} 
		 * @param element2 {IVisualElement} 
         */
        public swapElements(element1:IVisualElement, element2:IVisualElement):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method egret.gui.Scroller#swapElementsAt
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapElementsAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }

        /**
		 * @method egret.gui.Scroller#addChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#addChildAt
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#removeChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#removeChildAt
         * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method egret.gui.Scroller#setChildIndex
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method egret.gui.Scroller#swapChildren
         * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method egret.gui.Scroller#swapChildrenAt
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapChildrenAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }


        public _checkHbar() {
            if (this._horizontalScrollPolicy == "off") {
                if (this.horizontalScrollBar) {
                    this._removeFromDisplayList(this.horizontalScrollBar);
                }
                return;
            }
            var bar = this.horizontalScrollBar;
            bar.addEventListener(Event.CHANGE, this.hBarChanged, this, false);
            bar._setViewportMetric(this._viewport.width, this._viewport.contentWidth);
            this.horizontalScrollBar = bar;
            this._addToDisplayList(this.horizontalScrollBar);
        }
        public _checkVbar() {
            if (this._verticalScrollPolicy == "off") {
                if (this.verticalScrollBar) {
                    this._removeFromDisplayList(this.verticalScrollBar);
                }
                return;
            }
            var vbar = this.verticalScrollBar;
            vbar.addEventListener(Event.CHANGE, this.vBarChanged, this, false);
            vbar._setViewportMetric(this._viewport.height, this._viewport.contentHeight);
            this.verticalScrollBar = vbar;
            this._addToDisplayList(this.verticalScrollBar);
        }


        /**
         * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
         * @method egret.gui.Scroller#partAdded
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

        public _removeScrollBars(): void {
            if (this.horizontalScrollBar) {
                this._removeFromDisplayList(this.horizontalScrollBar);
                this.horizontalScrollBar.removeEventListener(Event.CHANGE, this.hBarChanged, this, false);
                this.horizontalScrollBar = null;
            }
            if (this.verticalScrollBar) {
                this._removeFromDisplayList(this.verticalScrollBar);
                this.verticalScrollBar.removeEventListener(Event.CHANGE, this.vBarChanged, this, false);
                this.verticalScrollBar = null;
            }
        }

        private hBarChanged(e: Event) {
            this.setViewportHScrollPosition(this.horizontalScrollBar._getValue());
        }
        private vBarChanged(e: Event) {
            this.setViewportVScrollPosition(this.verticalScrollBar.getPosition());
        }
    }

}