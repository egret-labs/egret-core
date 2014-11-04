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
    class ViewportScroller extends egret.Scroller {
        /**
            * @method egret.gui.GroupBase#constructor
            */
        public constructor(public content: DisplayObject, width= NaN, height= NaN) {
            super(content, width, height);
        }

        public _updateContentPosition() {
            var content: IViewport = <any>this.content;
            content.horizontalScrollPosition = this._scrollLeft;
            content.verticalScrollPosition = this._scrollTop;
            content.width = this.width;
            content.height = this.height;
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public getMaxScrollLeft() {
            var content: IViewport = <any>this.content;
            return content.contentWidth - content.width;
        }
        public getMaxScrollTop() {
            var content: IViewport = <any>this.content;
            return content.contentHeight - content.height;
        }
    }
    
	/**
	 * @class egret.gui.Scroller
	 * @classdesc
	 * 滚动条组件
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IVisualElementContainer
	 */	
    export class Scroller extends UIComponent implements IVisualElementContainer{
        /**
         * 构造函数
		 * @method egret.gui.Scroller#constructor
         */
        public constructor(){
            super();
        }

        public hBar: HScrollBar;
        public vBar: VScrollBar;
        public _scroller: egret.Scroller;

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
            if (this.hBar) {
                if (this._horizontalScrollPolicy != "off") {
                    this.hBar._setViewportMetric(unscaledWidth, this._viewport.contentWidth);
                    this.hBar._setWidth(unscaledWidth - 2);
                    this.hBar.x = 1;
                    this.hBar.y = unscaledHeight - this.hBar._height - 1;
                }
            }
            if (this.vBar) {
                if (this._verticalScrollPolicy != "off") {
                    this.vBar._setViewportMetric(unscaledHeight, this._viewport.contentHeight);
                    this.vBar._setHeight(unscaledHeight - 2);
                    this.vBar.y = 1;
                    this.vBar.x = unscaledWidth - this.vBar.width - 1;
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
                this._scroller._setScrollYEnabled(value != "off");
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
                this._scroller._setScrollXEnabled(value != "off");
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
                this._scroller._setScrollXEnabled(this._horizontalCanScroll);
                this._scroller._setScrollYEnabled(this._verticalCanScroll);
                this._addToDisplayListAt(<DisplayObject><any> this.viewport, 0);
            }
            this._addScrollBars();
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

        private _horizontalCanScroll:boolean;
        private _verticalCanScroll:boolean;
        /**
         * 检查当前滚动策略，若有一个方向可以滚动，返回true。
         */
        private checkScrollPolicy():boolean{
            var viewport:IViewport = this._viewport;
            var hCanScroll:boolean;
            switch (this._horizontalScrollPolicy){
                case "auto":
                    if(viewport.contentWidth>viewport.width){
                        hCanScroll = true;
                    }
                    else{
                        hCanScroll = false;
                    }
                    break;
                case "on":
                    hCanScroll = true;
                    break;
                case "off":
                    hCanScroll = false;
                    break;
            }
            this._horizontalCanScroll = hCanScroll;

            var vCanScroll:boolean;
            switch (this._verticalScrollPolicy){
                case "auto":
                    if(viewport.contentHeight>viewport.height){
                        vCanScroll = true;
                    }
                    else{
                        vCanScroll = false;
                    }
                    break;
                case "on":
                    vCanScroll = true;
                    break;
                case "off":
                    vCanScroll = false;
                    break;
            }
            this._verticalCanScroll = vCanScroll;
            return hCanScroll||vCanScroll;
        }

        private _scrollerChangedHandler(e: Event) {
            this.setViewportHScrollPosition(this._scroller.scrollLeft);
            this.setViewportVScrollPosition(this._scroller.scrollTop);
        }

        private setViewportVScrollPosition(pos: number) {
            if (this._scroller.scrollTop != pos)
                this._scroller.scrollTop = pos;
            if (this.vBar && this.vBar.value != pos)
                this.vBar.setPosition(pos);
        }
        private setViewportHScrollPosition(pos: number) {
            if (this._scroller.scrollLeft != pos)
                this._scroller.scrollLeft = pos;
            if (this.hBar&&this.hBar.value != pos)
                this.hBar._setValue(pos);
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

        /**
         * @method egret.gui.SliderBase#partAdded
         * @param partName {string} 
         * @param instance {any} 
         */
        public _addScrollBars(): void {
            this._checkHbar();
            this._checkVbar();
        }

        public _checkHbar() {
            if (this._horizontalScrollPolicy == "off") {
                if (this.hBar) {
                    this._removeFromDisplayList(this.hBar);
                }
                return;
            }
            var bar: HScrollBar = null;
            if (this.hBar) {
                bar = this.hBar
            }
            else {
                bar = new HScrollBar();
                bar.createChildren();
                if (bar.thumb == null)
                    return;
                bar.addEventListener(Event.CHANGE, this.hBarChanged, this, false);
                bar._setViewportMetric(this._viewport.width, this._viewport.contentWidth);
            }
            this.hBar = bar;
            this._addToDisplayList(this.hBar);
        }
        public _checkVbar() {
            if (this._verticalScrollPolicy == "off") {
                if (this.vBar) {
                    this._removeFromDisplayList(this.vBar);
                }
                return;
            }

            var vbar: VScrollBar = null;
            if (this.vBar) {
                vbar = this.vBar;
            }
            else {
                vbar = new VScrollBar();
                vbar.createChildren();
                if (vbar.thumb == null)
                    return;
                vbar.addEventListener(Event.CHANGE, this.vBarChanged, this, false);
                vbar._setViewportMetric(this._viewport.height, this._viewport.contentHeight);
            }
            this.vBar = vbar;
            this._addToDisplayList(this.vBar);
        }


        public _removeScrollBars(): void {
            if (this.hBar) {
                this._removeFromDisplayList(this.hBar);
                this.hBar.removeEventListener(Event.CHANGE, this.hBarChanged, this, false);
                this.hBar = null;
            }
            if (this.vBar) {
                this._removeFromDisplayList(this.vBar);
                this.vBar.removeEventListener(Event.CHANGE, this.vBarChanged, this, false);
                this.vBar = null;
            }
        }

        private hBarChanged(e: Event) {
            this.setViewportHScrollPosition(this.hBar._getValue());
        }
        private vBarChanged(e: Event) {
            this.setViewportVScrollPosition(this.vBar.getPosition());
        }
    }

}