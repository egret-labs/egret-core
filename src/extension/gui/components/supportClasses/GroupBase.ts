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
	 * @class egret.gui.GroupBase
	 * @classdesc
	 * 自动布局容器基类
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IViewport
	 */
    export class GroupBase extends UIComponent implements IViewport{
		/**
         * 构造函数
		 * @method egret.gui.GroupBase#constructor
		 */
        public constructor(){
            super();
            this.touchEnabled = false;
        }

        /**
         * 如果尚未设置布局对象，则 createChildren() 会为该容器指定默认布局对象 BasicLayout
         * @method egret.gui.GroupBase#createChildren
         */
        public createChildren():void{
            super.createChildren();
            if(!this._layout){
                this.layout = new BasicLayout;
            }
        }

        private _contentWidth:number = 0;

        /**
         * 视域的内容的宽度
		 * @member egret.gui.GroupBase#contentWidth
         */
        public get contentWidth():number {
            return this._contentWidth;
        }

        /**
         * 设置setContentWidth
         * @param value
         */
        private setContentWidth(value:number):void {
            if (value == this._contentWidth)
                return;
            var oldValue:number = this._contentWidth;
            this._contentWidth = value;
            if (this.hasEventListener("propertyChange"))
                PropertyChangeEvent.dispatchPropertyChangeEvent(this,
                    PropertyChangeEventKind.UPDATE,"contentWidth",oldValue,value,this);
        }

        private _contentHeight:number = 0;

        /**
         * 视域的内容的高度
		 * @member egret.gui.GroupBase#contentHeight
         */
        public get contentHeight():number {
            return this._contentHeight;
        }

        /**
         * 设置ContentHeight
         * @param value
         */
        private setContentHeight(value:number):void {
            if (value == this._contentHeight)
                return;
            var oldValue:number = this._contentHeight;
            this._contentHeight = value;
            if (this.hasEventListener("propertyChange"))
                PropertyChangeEvent.dispatchPropertyChangeEvent(this,
                    PropertyChangeEventKind.UPDATE,"contentHeight",oldValue,value,this);
        }
        /**
         * 设置 contentWidth 和 contentHeight 属性，此方法由Layout类调用
		 * @method egret.gui.GroupBase#setContentSize
         * @private
         *
		 * @param width {number} 
		 * @param height {number} 
         */
        public setContentSize(width:number, height:number):void{
            if ((width == this._contentWidth) && (height == this._contentHeight))
                return;
            this.setContentWidth(width);
            this.setContentHeight(height);
        }

        public _layout: LayoutBase = null;
        /**
         * 此容器的布局对象
		 * @member egret.gui.GroupBase#layout
         */
        public get layout():LayoutBase{
            return this._layout;
        }

        public set layout(value:LayoutBase){
            this._setLayout(value);
        }

        public _setLayout(value:LayoutBase):void{
            if (this._layout == value)
                return;
            if (this._layout){
                this._layout.target = null;
            }

            this._layout = value;

            if (this._layout){
                this._layout.target = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
            this.dispatchEventWith("layoutChanged");
        }

        private _clipAndEnableScrolling:boolean = false;
        /**
         * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
         * @member egret.gui.GroupBase#clipAndEnableScrolling
         */
        public get clipAndEnableScrolling():boolean {
            return this._clipAndEnableScrolling;
        }

        public set clipAndEnableScrolling(value:boolean) {
            if (value == this._clipAndEnableScrolling)
                return;
            this._clipAndEnableScrolling = value;
            if (this._clipAndEnableScrolling){
                this.scrollRect = new Rectangle(this._horizontalScrollPosition,
                    this._verticalScrollPosition, this.width, this.height);
            }
            else{
                this.scrollRect = null;
            }
        }


        private _horizontalScrollPosition:number = 0;
        /**
         * 可视区域水平方向起始点
         * @member egret.gui.GroupBase#horizontalScrollPosition
         */
        public get horizontalScrollPosition():number {
            return this._horizontalScrollPosition;
        }

        public set horizontalScrollPosition(value:number) {
            if (value == this._horizontalScrollPosition)
                return;
            var oldValue:number = this._horizontalScrollPosition;
            this._horizontalScrollPosition = value;
            this.scrollPositionChanged();
            PropertyChangeEvent.dispatchPropertyChangeEvent(this,
                PropertyChangeEventKind.UPDATE,"horizontalScrollPosition",oldValue,value,this);
        }

        private _verticalScrollPosition:number = 0;
        /**
         * 可视区域竖直方向起始点
         * @member egret.gui.GroupBase#verticalScrollPosition
         */
        public get verticalScrollPosition():number {
            return this._verticalScrollPosition;
        }

        public set verticalScrollPosition(value:number) {
            if (value == this._verticalScrollPosition)
                return;
            var oldValue:number = this._verticalScrollPosition;
            this._verticalScrollPosition = value;
            this.scrollPositionChanged();
            PropertyChangeEvent.dispatchPropertyChangeEvent(this,
                PropertyChangeEventKind.UPDATE,"verticalScrollPosition",oldValue,value,this);
        }

        /**
         * 滚动条位置改变
         */
        private scrollPositionChanged():void{
            if(!this._clipAndEnableScrolling){
                return;
            }
            this.updateScrollRect(this.width,this.height);
            this._invalidateDisplayListExceptLayout();
            if(this._layout){
                this._layout.scrollPositionChanged();
            }
        }

        /**
         * 更新可视区域
         * @param w {number}
         * @param h {number}
         */
        private updateScrollRect(w:number, h:number):void{

            var rect:Rectangle = this._scrollRect;
            if(this._clipAndEnableScrolling){
                if(rect){
                    rect.x = this._horizontalScrollPosition;
                    rect.y = this._verticalScrollPosition;
                    rect.width = w;
                    rect.height = h;
                }
                else{
                    this._scrollRect = new Rectangle(this._horizontalScrollPosition,
                        this._verticalScrollPosition, w, h)
                }
            }
            else if(rect){
                this._scrollRect = null;
            }

        }

        /**
         * 计算组件的默认大小和（可选）默认最小大小
		 * @method egret.gui.GroupBase#measure
         */
        public measure():void{
            if(!this._layout||!this._layoutInvalidateSizeFlag)
                return;
            super.measure();
            this._layout.measure();
        }

        /**
         * 在更新显示列表时是否需要更新布局标志
         */
        public _layoutInvalidateDisplayListFlag:boolean = false;

        /**
         * 标记需要更新显示列表但不需要更新布局
         */
        public _invalidateDisplayListExceptLayout():void{
            super.invalidateDisplayList();
        }

        /**
         * 标记组件，以便在稍后屏幕更新期间调用该组件的 updateDisplayList() 方法
		 * @method egret.gui.GroupBase#invalidateDisplayList
         */
        public invalidateDisplayList():void{
            super.invalidateDisplayList();
            this._layoutInvalidateDisplayListFlag = true;
        }

        public _childXYChanged():void{
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * 在测量尺寸时是否需要测量布局的标志
         */
        public _layoutInvalidateSizeFlag:boolean = false;

        /**
         * 标记需要更新显示列表但不需要更新布局
         */
        public _invalidateSizeExceptLayout():void{
            super.invalidateSize();
        }

        /**
         * 标记组件，以便在稍后屏幕更新期间调用该组件的 measure() 方法
		 * @method egret.gui.GroupBase#invalidateSize
         */
        public invalidateSize():void{
            super.invalidateSize();
            this._layoutInvalidateSizeFlag = true;
        }

        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth
         * @param unscaledHeight
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this._layoutInvalidateDisplayListFlag&&this._layout){
                this._layoutInvalidateDisplayListFlag = false;
                this._layout.updateDisplayList(unscaledWidth, unscaledHeight);
                this.updateScrollRect(unscaledWidth, unscaledHeight);
            }
        }
        /**
         * 此容器中的可视元素的数量。
		 * @member egret.gui.GroupBase#numElements
         */
        public get numElements():number{
            return -1;
        }

        /**
         * 返回指定索引处的可视元素。
		 * @method egret.gui.GroupBase#getElementAt
         * @param index {number} 要检索的元素的索引。
         * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            return null;
        }

        /**
         * 返回可视元素的索引位置。若不存在，则返回-1。
		 * @method egret.gui.GroupBase#getElementIndex
         * @param element {IVisualElement} 可视元素。
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            return -1;
        }

        /**
         * 返回在容器可视区域内的布局元素索引列表,此方法忽略不是布局元素的普通的显示对象
		 * @method egret.gui.GroupBase#getElementIndicesInView
		 * @returns {number}
         */
        public getElementIndicesInView():Array<number>{
            var visibleIndices:Array<number> = [];
            var index:number
            if(!this.scrollRect){
                for(index = 0;index < this.numChildren;index++){
                    visibleIndices.push(index);
                }
            }
            else{
                for(index = 0;index < this.numChildren;index++){
                    var layoutElement:ILayoutElement = <ILayoutElement><any> (this.getChildAt(index));
                    if (!layoutElement)
                        continue;
                    var eltR:Rectangle = new Rectangle();
                    eltR.x = layoutElement.layoutBoundsX;
                    eltR.y = layoutElement.layoutBoundsY;
                    eltR.width = layoutElement.layoutBoundsWidth;
                    eltR.height = layoutElement.layoutBoundsHeight;
                    if(this.scrollRect.intersects(eltR))
                        visibleIndices.push(index);
                }
            }
            return visibleIndices;
        }
        /**
         * 在支持虚拟布局的容器中，设置容器内可见的子元素索引范围。此方法在不支持虚拟布局的容器中无效。
         * 通常在即将连续调用getVirtualElementAt()之前需要显式设置一次，以便容器提前释放已经不可见的子元素。
		 * @method egret.gui.GroupBase#setVirtualElementIndicesInView
         * @param startIndex {number} 可视元素起始索引
         * @param endIndex {number} 可视元素结束索引
         */
        public setVirtualElementIndicesInView(startIndex:number,endIndex:number):void{

        }

        /**
         * 支持useVirtualLayout属性的布局类在updateDisplayList()中使用此方法来获取“处于视图中”的布局元素
		 * @method egret.gui.GroupBase#getVirtualElementAt
         * @param index {number} 要检索的元素的索引。
		 * @returns {IVisualElement}
         */
        public getVirtualElementAt(index:number):IVisualElement{
            return this.getElementAt(index);
        }
    }
}