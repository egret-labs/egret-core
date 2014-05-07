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

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="Group.ts"/>
/// <reference path="SkinnableComponent.ts"/>
/// <reference path="../core/IInvalidating.ts"/>
/// <reference path="../core/IViewport.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../core/NavigationUnit.ts"/>
/// <reference path="../events/PropertyChangeEvent.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	export class Scroller extends SkinnableComponent implements IVisualElementContainer{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.focusEnabled = true;
		}
		
		private _layout:LayoutBase;
		/**
		 * 此容器的布局对象,若不设置，默认使用ScrollerLayout。
		 */
		public get layout():LayoutBase{
			return this._layout;
		}
		
		public set layout(value:LayoutBase){
			if(this._layout==value)
				return;
			this._layout = value;
			if (this.contentGroup){
				this.contentGroup.layout = this._layout;
			}
		}
		/**
		 * 实体容器
		 */		
		private contentGroup:Group
		/**
		 * @inheritDoc
		 */
		public createChildren():void{
			this.contentGroup = new Group();
			if(!this._layout)
				this._layout = new ScrollerLayout();
			this.contentGroup.layout = this._layout;
			this.addToDisplayList(this.contentGroup);
			this.contentGroup.addEventListener(TouchEvent.MOUSE_WHEEL, this.contentGroup_mouseWheelHandler, this);
			super.createChildren();
		}
		/**
		 * @inheritDoc
		 */
		public measure():void{
			this.measuredWidth = this.contentGroup.preferredWidth;
			this.measuredHeight = this.contentGroup.preferredHeight;
		}
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			this.contentGroup.setLayoutBoundsSize(unscaledWidth,unscaledHeight);
		}

		private _verticalScrollPolicy:string = "auto";

		/**
		 * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
		 */		
		public get verticalScrollPolicy():string{
			return this._verticalScrollPolicy;
		}

		public set verticalScrollPolicy(value:string){
			if(this._verticalScrollPolicy  == value)
				return;
			this._verticalScrollPolicy = value;
			this.invalidateSkin();
		}

		private _horizontalScrollPolicy:string = "auto";

		/**
		 * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
		 */		
		public get horizontalScrollPolicy():string{
			return this._horizontalScrollPolicy;
		}
		public set horizontalScrollPolicy(value:string){
			if(this._horizontalScrollPolicy == value)
				return;
			this._horizontalScrollPolicy = value;
			this.invalidateSkin();
		}

		/**
		 * 标记皮肤需要更新尺寸和布局
		 */		
		private invalidateSkin():void{
			if(this.contentGroup){
				this.contentGroup.invalidateSize();
				this.contentGroup.invalidateDisplayList();
			}
		}    
		
		/**
		 * [SkinPart]水平滚动条
		 */		
		public horizontalScrollBar:HScrollBar;

		/**
		 * [SkinPart]垂直滚动条
		 */		
		public verticalScrollBar:VScrollBar;
		
		private _viewport:IViewport;
		
		/**
		 * 要滚动的视域组件。 
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
			this.dispatchEvent(new Event("viewportChanged"));
		}
		
		private _useMouseWheelDelta:boolean = true;
		/**
		 * 用户在操作系统中可以设置将鼠标滚轮每滚动一个单位应滚动多少行。
		 * 当使用鼠标滚轮滚动此组件的目标容器时，true表示根据用户系统设置的值滚动对应的行数。
		 * false则忽略系统设置，始终只滚动一行。默认值为true。
		 */
		public get useMouseWheelDelta():boolean{
			return this._useMouseWheelDelta;
		}
		public set useMouseWheelDelta(value:boolean){
			if(this._useMouseWheelDelta==value)
				return;
			this._useMouseWheelDelta = value;
			if(this.horizontalScrollBar)
				this.horizontalScrollBar.useMouseWheelDelta = this._useMouseWheelDelta;
			if(this.verticalScrollBar)
				this.verticalScrollBar.useMouseWheelDelta = this._useMouseWheelDelta;
		}
		
		/**
		 * 安装并初始化视域组件
		 */		
		private installViewport():void{
			if (this.skinObject && this.viewport){ 
				this.viewport.clipAndEnableScrolling = true;
				this.contentGroup.addElementAt(this.viewport,0);
				this.viewport.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.viewport_propertyChangeHandler, this);
			}
			if (this.verticalScrollBar)
				this.verticalScrollBar.viewport = this.viewport;
			if (this.horizontalScrollBar)
				this.horizontalScrollBar.viewport = this.viewport;
		}
		
		/**
		 * 卸载视域组件
		 */		
		private uninstallViewport():void{
			if (this.horizontalScrollBar)
				this.horizontalScrollBar.viewport = null;
			if (this.verticalScrollBar)
				this.verticalScrollBar.viewport = null;        
			if (this.skin && this.viewport){
				this.viewport.clipAndEnableScrolling = false;
				this.contentGroup.removeElement(this.viewport);
				this.viewport.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.viewport_propertyChangeHandler, this);
			}
		}
		
		
		private _minViewportInset:number = 0;
		
		/**
		 * Scroller四个边与视域组件的最小间隔距离。
		 * 如果滚动条都不可见，则四个边的间隔为此属性的值。
		 * 如果滚动条可见，则取滚动条的宽度和此属性的值的较大值。
		 */		
		public get minViewportInset():number{
			return this._minViewportInset;
		}
		public set minViewportInset(value:number){
			if (value == this._minViewportInset)
				return;
			
			this._minViewportInset = value;
			this.invalidateSkin();
		}
		
		private _measuredSizeIncludesScrollBars:boolean = true;
		/**
		 * 如果为 true，Scroller的测量大小会加上滚动条所占的空间，否则 Scroller的测量大小仅取决于其视域组件的尺寸。
		 */		
		public get measuredSizeIncludesScrollBars():boolean{
			return this._measuredSizeIncludesScrollBars;
		}
		public set measuredSizeIncludesScrollBars(value:boolean){
			if (value == this._measuredSizeIncludesScrollBars)
				return;
			
			this._measuredSizeIncludesScrollBars = value;
			this.invalidateSkin();
		}   
		
		/**
		 * 视域组件的属性改变
		 */		
		private viewport_propertyChangeHandler(event:PropertyChangeEvent):void{
			switch(event.property) {
				case "contentWidth": 
				case "contentHeight": 
					this.invalidateSkin();
					break;
			}
		}
		
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
		 * @inheritDoc
		 */
		public getElementAt(index:number):IVisualElement{
			if (this.viewport && index == 0)
				return this.viewport;
			else
				this.throwRangeError(index);
			return null;
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			if (element != null && element == this.viewport)
				return 0;
			else
				return -1;
		}
		/**
		 * @inheritDoc
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
		 * @inheritDoc
		 */
		public addElement(element:IVisualElement):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @inheritDoc
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @inheritDoc
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @inheritDoc
		 */
		public removeElementAt(index:number):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @inheritDoc
		 */
		public removeAllElements():void{
			this.throwNotSupportedError();
		}
		/**
		 * @inheritDoc
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.throwNotSupportedError();
		}
		/**
		 * @inheritDoc
		 */
		public swapElements(element1:IVisualElement, element2:IVisualElement):void{
			this.throwNotSupportedError();
		}
		/**
		 * @inheritDoc
		 */
		public swapElementsAt(index1:number, index2:number):void{
			this.throwNotSupportedError();
		}

		/**
		 * @inheritDoc
		 */
		public attachSkin(skin:any):void{
			super.attachSkin(skin);
			this.installViewport();
		}
		
		/**
		 * @inheritDoc
		 */
		public detachSkin(skin:any):void{    
			this.uninstallViewport();
			super.detachSkin(skin);
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.verticalScrollBar){
				this.verticalScrollBar.viewport = this.viewport;
				this.verticalScrollBar.useMouseWheelDelta = this._useMouseWheelDelta;
				this.contentGroup.addElement(this.verticalScrollBar);
			}
			else if (instance == this.horizontalScrollBar){
				this.horizontalScrollBar.viewport = this.viewport;
				this.horizontalScrollBar.useMouseWheelDelta = this._useMouseWheelDelta;
				this.contentGroup.addElement(this.horizontalScrollBar);
			}
			
		}
		
		/**
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.verticalScrollBar){
				this.verticalScrollBar.viewport = null;
				if(this.verticalScrollBar.parent==this.contentGroup)
					this.contentGroup.removeElement(this.verticalScrollBar);
			}
			else if (instance == this.horizontalScrollBar){
				this.horizontalScrollBar.viewport = null;
				if(this.horizontalScrollBar.parent==this.contentGroup)
					this.contentGroup.removeElement(this.horizontalScrollBar);
			}
		}
		
		
		/**
		 * 皮肤上鼠标滚轮事件
		 */		
		private contentGroup_mouseWheelHandler(event:TouchEvent):void{
			const vp:IViewport = this.viewport;
			if (event.isDefaultPrevented() || !vp || !vp.visible)
				return;
			
			var nSteps:number = Math.abs(event.delta);
			var navigationUnit:number;
			if (this.verticalScrollBar && this.verticalScrollBar.visible){
				navigationUnit = (event.delta < 0) ? NavigationUnit.DOWN : NavigationUnit.UP;
				for (var vStep:number = 0; vStep < nSteps; vStep++){
					var vspDelta:number = vp.getVerticalScrollPositionDelta(navigationUnit);
					if (!isNaN(vspDelta)){
						vp.verticalScrollPosition += vspDelta;
						if (vp is IInvalidating)
							(<IInvalidating> vp).validateNow();
					}
				}
				event.preventDefault();
			}
			else if (this.horizontalScrollBar && this.horizontalScrollBar.visible){
				navigationUnit = (event.delta < 0) ? NavigationUnit.RIGHT : NavigationUnit.LEFT;
				for (var hStep:number = 0; hStep < nSteps; hStep++){
					var hspDelta:number = vp.getHorizontalScrollPositionDelta(navigationUnit);
					if (!isNaN(hspDelta)){
						vp.horizontalScrollPosition += hspDelta;
						if (vp is IInvalidating)
							(<IInvalidating> vp).validateNow();
					}
				}
				event.preventDefault();
			}            
		}
		
	}
	
}