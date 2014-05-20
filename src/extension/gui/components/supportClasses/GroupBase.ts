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

/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../core/ILayoutElement.ts"/>
/// <reference path="../../core/IViewport.ts"/>
/// <reference path="../../core/IVisualElement.ts"/>
/// <reference path="../../core/UIComponent.ts"/>
/// <reference path="../../events/PropertyChangeEvent.ts"/>
/// <reference path="../../layouts/BasicLayout.ts"/>
/// <reference path="../../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.GroupBase
	 * @classdesc
	 * 自动布局容器基类
	 * @extends ns_egret.UIComponent
	 * @implements ns_egret.IViewport
	 */
    export class GroupBase extends UIComponent implements IViewport{
		/**
		 * @method ns_egret.GroupBase#constructor
		 */
        public constructor(){
            super();
            this.touchEnabled = false;
        }

        /**
         * @method ns_egret.GroupBase#createChildren
         */
        public createChildren():void{
            super.createChildren();
            if(!this._layout){
                this.layout = new BasicLayout;
            }
        }

        private _contentWidth:number = 0;

        /**
		 * @member ns_egret.GroupBase#contentWidth
         */
        public get contentWidth():number {
            return this._contentWidth;
        }

        private setContentWidth(value:number):void {
            if (value == this._contentWidth)
                return;
            var oldValue:number = this._contentWidth;
            this._contentWidth = value;
            this.dispatchPropertyChangeEvent("contentWidth", oldValue, value);
        }

        private _contentHeight:number = 0;

        /**
		 * @member ns_egret.GroupBase#contentHeight
         */
        public get contentHeight():number {
            return this._contentHeight;
        }

        private setContentHeight(value:number):void {
            if (value == this._contentHeight)
                return;
            var oldValue:number = this._contentHeight;
            this._contentHeight = value;
            this.dispatchPropertyChangeEvent("contentHeight", oldValue, value);
        }
        /**
         * 设置 contentWidth 和 contentHeight 属性，此方法由Layout类调用
		 * @method ns_egret.GroupBase#setContentSize
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

        public _layout:LayoutBase;
        /**
         * 此容器的布局对象
		 * @member ns_egret.GroupBase#layout
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
         * @member ns_egret.GroupBase#clipAndEnableScrolling
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
         * @member ns_egret.GroupBase#horizontalScrollPosition
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
            this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(
                this, "horizontalScrollPosition", oldValue, value));
        }

        private _verticalScrollPosition:number = 0;
        /**
         * 可视区域竖直方向起始点
         * @member ns_egret.GroupBase#verticalScrollPosition
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
            this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(
                this, "verticalScrollPosition", oldValue, value));
        }

        /**
         * 滚动条位置改变
         */
        private scrollPositionChanged():void{
            if(!this._clipAndEnableScrolling){
                return;
            }
            this.updateScrollRect(this.width,this.height);
            this.invalidateDisplayListExceptLayout();
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
		 * @method ns_egret.GroupBase#measure
         */
        public measure():void{
            if(!this._layout||!this.layoutInvalidateSizeFlag)
                return;
            super.measure();
            this._layout.measure();
        }

        /**
         * 在更新显示列表时是否需要更新布局标志
		 * @member ns_egret.GroupBase#layoutInvalidateDisplayListFlag
         */
        public layoutInvalidateDisplayListFlag:boolean = false;

        /**
         * 标记需要更新显示列表但不需要更新布局
		 * @method ns_egret.GroupBase#invalidateDisplayListExceptLayout
         */
        public invalidateDisplayListExceptLayout():void{
            super.invalidateDisplayList();
        }

        /**
		 * @method ns_egret.GroupBase#invalidateDisplayList
         */
        public invalidateDisplayList():void{
            super.invalidateDisplayList();
            this.layoutInvalidateDisplayListFlag = true;
        }

        /**
		 * @method ns_egret.GroupBase#childXYChanged
         */
        public childXYChanged():void{
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * 在测量尺寸时是否需要测量布局的标志
		 * @member ns_egret.GroupBase#layoutInvalidateSizeFlag
         */
        public layoutInvalidateSizeFlag:boolean = false;

        /**
         * 标记需要更新显示列表但不需要更新布局
		 * @method ns_egret.GroupBase#invalidateSizeExceptLayout
         */
        public invalidateSizeExceptLayout():void{
            super.invalidateSize();
        }

        /**
		 * @method ns_egret.GroupBase#invalidateSize
         */
        public invalidateSize():void{
            super.invalidateSize();
            this.layoutInvalidateSizeFlag = true;
        }

        /**
		 * @method ns_egret.GroupBase#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this.layoutInvalidateDisplayListFlag&&this._layout){
                this.layoutInvalidateDisplayListFlag = false;
                this._layout.updateDisplayList(unscaledWidth, unscaledHeight);
                this.updateScrollRect(unscaledWidth, unscaledHeight);
            }
        }
        /**
         * 此容器中的可视元素的数量。
		 * @member ns_egret.GroupBase#numElements
         */
        public get numElements():number{
            return -1;
        }

        /**
         * 返回指定索引处的可视元素。
		 * @method ns_egret.GroupBase#getElementAt
         * @param index {number} 要检索的元素的索引。
         * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            return null;
        }

        /**
         * 返回可视元素的索引位置。若不存在，则返回-1。
		 * @method ns_egret.GroupBase#getElementIndex
         * @param element {IVisualElement} 可视元素。
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            return -1;
        }

        /**
         * 返回在容器可视区域内的布局元素索引列表,此方法忽略不是布局元素的普通的显示对象
		 * @method ns_egret.GroupBase#getElementIndicesInView
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
		 * @method ns_egret.GroupBase#setVirtualElementIndicesInView
         * @param startIndex {number} 可视元素起始索引
         * @param endIndex {number} 可视元素结束索引
         */
        public setVirtualElementIndicesInView(startIndex:number,endIndex:number):void{

        }

        /**
         * 支持useVirtualLayout属性的布局类在updateDisplayList()中使用此方法来获取“处于视图中”的布局元素
		 * @method ns_egret.GroupBase#getVirtualElementAt
         * @param index {number} 要检索的元素的索引。
		 * @returns {IVisualElement}
         */
        public getVirtualElementAt(index:number):IVisualElement{
            return this.getElementAt(index);
        }
    }
}