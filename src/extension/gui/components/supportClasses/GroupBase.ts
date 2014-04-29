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

	export class GroupBase extends UIComponent implements IViewport{
		public constructor(){
			super();
            this.touchEnabled = false;
		}
		
		private _contentWidth:number = 0;
		
		/**
		 * @inheritDoc
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
		 * @inheritDoc
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
		 * @private
		 * 设置 contentWidth 和 contentHeight 属性，此方法由Layout类调用
		 */		
		public setContentSize(width:number, height:number):void{
			if ((width == this._contentWidth) && (height == this._contentHeight))
				return;
			this.setContentWidth(width);
			this.setContentHeight(height);
		}
		
		/**
		 * 布局发生改变时传递的参数
		 */		
		private _layoutProperties:any;
		
		public _layout:LayoutBase;
		/**
		 * 此容器的布局对象
		 */
		public get layout():LayoutBase{
			return this._layout;
		}

		public set layout(value:LayoutBase){
			
			if (this._layout == value)
				return;
			if (this._layout){
				this._layout.target = null;
				this._layout.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.redispatchLayoutEvent, this);
				this._layoutProperties = {"clipAndEnableScrolling": this._layout.clipAndEnableScrolling};
			}
			
			this._layout = value; 
			
			if (this._layout){
				this._layout.target = this;
				this._layout.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.redispatchLayoutEvent, this);
				if (this._layoutProperties){
					if (this._layoutProperties.clipAndEnableScrolling !== undefined)
						value.clipAndEnableScrolling = this._layoutProperties.clipAndEnableScrolling;
					
					if (this._layoutProperties.verticalScrollPosition !== undefined)
						value.verticalScrollPosition = this._layoutProperties.verticalScrollPosition;
					
					if (this._layoutProperties.horizontalScrollPosition !== undefined)
						value.horizontalScrollPosition = this._layoutProperties.horizontalScrollPosition;
					
					this._layoutProperties = null;
				}
			}
			this.invalidateSize();
			this.invalidateDisplayList();
			this.dispatchEvent(new Event("layoutChanged"));
		}
		
		/**
		 * 抛出滚动条位置改变事件
		 */		
		private redispatchLayoutEvent(event:Event):void{
			var pce:PropertyChangeEvent = <PropertyChangeEvent> event;
			if (pce)
				switch (pce.property){
					case "verticalScrollPosition":
					case "horizontalScrollPosition":
						this.dispatchEvent(event);
						break;
				}
		}  
		
		/**
		 * @inheritDoc
		 */
		public createChildren():void{
			super.createChildren();
			if(!this._layout){
				this.layout = new BasicLayout;
			}
		}
		
		/**
		 * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
		 */
		public get clipAndEnableScrolling():boolean{
			if (this._layout){
				return this._layout.clipAndEnableScrolling;
			}
			else if (this._layoutProperties && 
				this._layoutProperties.clipAndEnableScrolling !== undefined){
				return this._layoutProperties.clipAndEnableScrolling;
			}
			else{
				return false;
			}
		}
		/**
		 * @inheritDoc
		 */
		public set clipAndEnableScrolling(value:boolean){
			if (this._layout){
				this._layout.clipAndEnableScrolling = value;
			}
			else if (this._layoutProperties){
				this._layoutProperties.clipAndEnableScrolling = value;
			}
			else{
				this._layoutProperties = {clipAndEnableScrolling: value};
			}
			
			this.invalidateSize();
		}
		/**
		 * @inheritDoc
		 */
		public getHorizontalScrollPositionDelta(navigationUnit:number):number{
			return (this.layout) ? this.layout.getHorizontalScrollPositionDelta(navigationUnit) : 0;     
		}
		/**
		 * @inheritDoc
		 */
		public getVerticalScrollPositionDelta(navigationUnit:number):number{
			return (this.layout) ? this.layout.getVerticalScrollPositionDelta(navigationUnit) : 0;     
		}
		
		/**
		 * 可视区域水平方向起始点
		 */
		public get horizontalScrollPosition():number{
			if (this._layout){
				return this._layout.horizontalScrollPosition;
			}
			else if (this._layoutProperties && 
				this._layoutProperties.horizontalScrollPosition !== undefined){
				return this._layoutProperties.horizontalScrollPosition;
			}
			else{
				return 0;
			}
		}
		/**
		 * @inheritDoc
		 */
		public set horizontalScrollPosition(value:number){
			if (this._layout){
				this._layout.horizontalScrollPosition = value;
			}
			else if (this._layoutProperties){
				this._layoutProperties.horizontalScrollPosition = value;
			}
			else{
				this._layoutProperties = {horizontalScrollPosition: value};
			}
		}
		
		/**
		 * 可视区域竖直方向起始点
		 */
		public get verticalScrollPosition():number{
			if (this._layout){
				return this._layout.verticalScrollPosition;
			}
			else if (this._layoutProperties && 
				this._layoutProperties.verticalScrollPosition !== undefined){
				return this._layoutProperties.verticalScrollPosition;
			}
			else{
				return 0;
			}
		}
		/**
		 * @inheritDoc
		 */
		public set verticalScrollPosition(value:number){
			if (this._layout){
				this._layout.verticalScrollPosition = value;
			}
			else if (this._layoutProperties){
				this._layoutProperties.verticalScrollPosition = value;
			}
			else{
				this._layoutProperties = {verticalScrollPosition: value};
			}
		}
		/**
		 * @inheritDoc
		 */
		public measure():void{
			if(!this._layout||!this.layoutInvalidateSizeFlag)
				return;
			super.measure();
			this._layout.measure();
		}
		
		/**
		 * 在更新显示列表时是否需要更新布局标志 
		 */
		public layoutInvalidateDisplayListFlag:boolean = false;

		/**
		 * 标记需要更新显示列表但不需要更新布局
		 */		
		public invalidateDisplayListExceptLayout():void{
			super.invalidateDisplayList();
		}
		
		/**
		 * @inheritDoc
		 */
		public invalidateDisplayList():void{
			super.invalidateDisplayList();
			this.layoutInvalidateDisplayListFlag = true;
		}
		
		/**
		 * @inheritDoc
		 */
		public childXYChanged():void{
			this.invalidateSize();
			this.invalidateDisplayList();
		}

		/**
		 * 在测量尺寸时是否需要测量布局的标志
		 */
		public layoutInvalidateSizeFlag:boolean = false;
			
		/**
		 * 标记需要更新显示列表但不需要更新布局
		 */
		public invalidateSizeExceptLayout():void{
			super.invalidateSize();
		}
		
		/**
		 * @inheritDoc
		 */
		public invalidateSize():void{
			super.invalidateSize();
			this.layoutInvalidateSizeFlag = true;
		}
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth, unscaledHeight);
			if (this.layoutInvalidateDisplayListFlag&&this._layout){
				this.layoutInvalidateDisplayListFlag = false;
				this._layout.updateDisplayList(unscaledWidth, unscaledHeight);
				this._layout.updateScrollRect(unscaledWidth, unscaledHeight);
			}
		}
		/**
		 * 此容器中的可视元素的数量。
		 */
		public get numElements():number{
			return -1;
		}
		
		/**
		 * 返回指定索引处的可视元素。
		 * @param index 要检索的元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 */	
		public getElementAt(index:number):IVisualElement{
			return null;
		}
		
		/**
		 * 返回可视元素的索引位置。若不存在，则返回-1。
		 * @param element 可视元素。
		 */
		public getElementIndex(element:IVisualElement):number{
			return -1;
		}

		/**
		 * 返回在容器可视区域内的布局元素索引列表,此方法忽略不是布局元素的普通的显示对象
		 */		
		public getElementIndicesInView():Array{
			var visibleIndices:Array = [];
			var index:number
			if(!this.scrollRect){
				for(index = 0;index < this.numChildren;index++){
					visibleIndices.push(index);
				}
			}
			else{
				for(index = 0;index < this.numChildren;index++){
					var layoutElement:ILayoutElement = <ILayoutElement> (this.getChildAt(index));
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
		 * @param startIndex 可视元素起始索引
		 * @param endIndex 可视元素结束索引
		 */		
		public setVirtualElementIndicesInView(startIndex:number,endIndex:number):void{
			
		}
		
		/**
		 * 支持useVirtualLayout属性的布局类在updateDisplayList()中使用此方法来获取“处于视图中”的布局元素 
		 * @param index 要检索的元素的索引。
		 */		
		public getVirtualElementAt(index:number):IVisualElement{
			return this.getElementAt(index);            
		}
		/**
		 * @inheritDoc
		 */
		public set scrollRect(value:Rectangle){
			super.scrollRect = value;
			if(this.hasEventListener("scrollRectChange"))
				this.dispatchEvent(new Event("scrollRectChange"));
		}
	}
}