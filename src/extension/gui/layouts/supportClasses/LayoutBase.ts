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
/// <reference path="../../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../components/supportClasses/GroupBase.ts"/>
/// <reference path="../../core/NavigationUnit.ts"/>
/// <reference path="../../events/PropertyChangeEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.LayoutBase
	 * @classdesc
	 * 容器布局基类
	 * @extends ns_egret.EventDispatcher
	 */
	export class LayoutBase extends EventDispatcher{
		/**
		 * @method ns_egret.LayoutBase#constructor
		 */
		public constructor(){
			super();
		}
		
		private _target:GroupBase;
		/**
		 * 目标容器
		 * @member ns_egret.LayoutBase#target
		 */		
		public get target():GroupBase{
			return this._target;
		}
		
		public set target(value:GroupBase){
			if (this._target == value)
				return;
			this._target = value;
			this.clearVirtualLayoutCache();
		}
		
		private _horizontalScrollPosition:number = 0;
		/**
		 * 可视区域水平方向起始点
		 * @member ns_egret.LayoutBase#horizontalScrollPosition
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
		 * @member ns_egret.LayoutBase#verticalScrollPosition
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
		
		private _clipAndEnableScrolling:boolean = false;
		/**
		 * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。
		 * @member ns_egret.LayoutBase#clipAndEnableScrolling
		 */	
		public get clipAndEnableScrolling():boolean {
			return this._clipAndEnableScrolling;
		}
		
		public set clipAndEnableScrolling(value:boolean) {
			if (value == this._clipAndEnableScrolling) 
				return;
			
			this._clipAndEnableScrolling = value;
			if (this.target!=null)
				this.updateScrollRect(this.target.width, this.target.height);
		}
		/**
		 * 返回对水平滚动位置的更改以处理不同的滚动选项。
		 * 下列选项是由 NavigationUnit 类定义的：END、HOME、LEFT、PAGE_LEFT、PAGE_RIGHT 和 RIGHT。 
		 * @method ns_egret.LayoutBase#getHorizontalScrollPositionDelta
		 * @param navigationUnit {number} 采用以下值： 
		 *  <li> 
		 *  <code>END</code>
		 *  返回滚动 delta，它将使 scrollRect 与内容区域右对齐。 
		 *  </li> 
		 *  <li> 
		 *  <code>HOME</code>
		 *  返回滚动 delta，它将使 scrollRect 与内容区域左对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>LEFT</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的左边或在其左边左侧的第一个元素左对齐。 
		 *  </li>
		 *  <li>
		 *  <code>PAGE_LEFT</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的左边或在其左边左侧的第一个元素右对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>PAGE_RIGHT</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的右边或在其右边右侧的第一个元素左对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>RIGHT</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的右边或在其右边右侧的第一个元素右对齐。 
		 *  </li>
		 *  </ul>
		 * @returns {number}
		 */		
		public getHorizontalScrollPositionDelta(navigationUnit:number):number{
			var g:GroupBase = this.target;
			if (!g)
				return 0;     
			
			var scrollRect:Rectangle = this.getScrollRect();
			if (!scrollRect)
				return 0;
			
			if ((scrollRect.x == 0) && (scrollRect.width >= g.contentWidth))
				return 0;  
			
			var maxDelta:number = g.contentWidth - scrollRect.right;
			var minDelta:number = -scrollRect.x;
			var getElementBounds:Rectangle;
			switch(navigationUnit){
				case NavigationUnit.LEFT:
				case NavigationUnit.PAGE_LEFT:
					getElementBounds = this.getElementBoundsLeftOfScrollRect(scrollRect);
					break;
				
				case NavigationUnit.RIGHT:
				case NavigationUnit.PAGE_RIGHT:
					getElementBounds = this.getElementBoundsRightOfScrollRect(scrollRect);
					break;
				
				case NavigationUnit.HOME: 
					return minDelta;
					
				case NavigationUnit.END: 
					return maxDelta;
					
				default:
					return 0;
			}
			
			if (!getElementBounds)
				return 0;
			
			var delta:number = 0;
			switch (navigationUnit){
				case NavigationUnit.LEFT:
					delta = Math.max(getElementBounds.x - scrollRect.x, -scrollRect.width);
					break;    
				case NavigationUnit.RIGHT:
					delta = Math.min(getElementBounds.right - scrollRect.right, scrollRect.width);
					break;    
				case NavigationUnit.PAGE_LEFT:{
					delta = getElementBounds.right - scrollRect.right;
					
					if (delta >= 0)
						delta = Math.max(getElementBounds.x - scrollRect.x, -scrollRect.width);  
				}
					break;
				case NavigationUnit.PAGE_RIGHT:{
					delta = getElementBounds.x - scrollRect.x;
					
					if (delta <= 0)
						delta = Math.min(getElementBounds.right - scrollRect.right, scrollRect.width);
				}
					break;
			}
			
			return Math.min(maxDelta, Math.max(minDelta, delta));
		}
		/**
		 * 返回对垂直滚动位置的更改以处理不同的滚动选项。
		 * 下列选项是由 NavigationUnit 类定义的：DOWN、END、HOME、PAGE_DOWN、PAGE_UP 和 UP。
		 * @method ns_egret.LayoutBase#getVerticalScrollPositionDelta
		 * @param navigationUnit {number} 采用以下值： DOWN 
		 *  <ul>
		 *  <li> 
		 *  <code>DOWN</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的底边或在其底边之下的第一个元素底对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>END</code>
		 *  返回滚动 delta，它将使 scrollRect 与内容区域底对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>HOME</code>
		 *  返回滚动 delta，它将使 scrollRect 与内容区域顶对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>PAGE_DOWN</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的底边或在其底边之下的第一个元素顶对齐。
		 *  </li>
		 *  <code>PAGE_UP</code>
		 *  <li>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的顶边或在其顶边之上的第一个元素底对齐。 
		 *  </li>
		 *  <li> 
		 *  <code>UP</code>
		 *  返回滚动 delta，它将使 scrollRect 与跨越 scrollRect 的顶边或在其顶边之上的第一个元素顶对齐。 
		 *  </li>
		 *  </ul>
		 * @returns {number}
		 */		
		public getVerticalScrollPositionDelta(navigationUnit:number):number{
			var g:GroupBase = this.target;
			if (!g)
				return 0;     
			
			var scrollRect:Rectangle = this.getScrollRect();
			if (!scrollRect)
				return 0;
			
			if ((scrollRect.y == 0) && (scrollRect.height >= g.contentHeight))
				return 0;  
			
			var maxDelta:number = g.contentHeight - scrollRect.bottom;
			var minDelta:number = -scrollRect.y;
			var getElementBounds:Rectangle;
			switch(navigationUnit){
				case NavigationUnit.UP:
				case NavigationUnit.PAGE_UP:
					getElementBounds = this.getElementBoundsAboveScrollRect(scrollRect);
					break;
				
				case NavigationUnit.DOWN:
				case NavigationUnit.PAGE_DOWN:
					getElementBounds = this.getElementBoundsBelowScrollRect(scrollRect);
					break;
				
				case NavigationUnit.HOME: 
					return minDelta;
					
				case NavigationUnit.END: 
					return maxDelta;
					
				default:
					return 0;
			}
			
			if (!getElementBounds)
				return 0;
			
			var delta:number = 0;
			switch (navigationUnit){
				case NavigationUnit.UP:
					delta = Math.max(getElementBounds.y - scrollRect.y, -scrollRect.height);
					break;    
				case NavigationUnit.DOWN:
					delta = Math.min(getElementBounds.bottom - scrollRect.bottom, scrollRect.height);
					break;    
				case NavigationUnit.PAGE_UP:{
					delta = getElementBounds.bottom - scrollRect.bottom;
					
					if (delta >= 0)
						delta = Math.max(getElementBounds.y - scrollRect.y, -scrollRect.height);  
				}
					break;
				case NavigationUnit.PAGE_DOWN:{
					delta = getElementBounds.y - scrollRect.y;
					
					if (delta <= 0)
						delta = Math.min(getElementBounds.bottom - scrollRect.bottom, scrollRect.height);
				}
					break;
			}
			
			return Math.min(maxDelta, Math.max(minDelta, delta));
		}
		
		/**
		 * 返回布局坐标中目标的滚动矩形的界限。
		 * @method ns_egret.LayoutBase#getScrollRect
		 * @returns {Rectangle}
		 */		
		public getScrollRect():Rectangle{
			var g:GroupBase = this.target;
			if (!g || !g.clipAndEnableScrolling)
				return null;     
			var vsp:number = g.verticalScrollPosition;
			var hsp:number = g.horizontalScrollPosition;
			return new Rectangle(hsp, vsp, g.width, g.height);
		}
		/**
		 * 返回跨越 scrollRect 的左边或在其左边左侧的第一个布局元素的界限。 
		 * @method ns_egret.LayoutBase#getElementBoundsLeftOfScrollRect
		 * @param scrollRect {Rectangle} 
		 * @returns {Rectangle}
		 */		
		public getElementBoundsLeftOfScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.x = scrollRect.x - 1;
			bounds.right = scrollRect.x; 
			return bounds;
		} 
		/**
		 * 返回跨越 scrollRect 的右边或在其右边右侧的第一个布局元素的界限。 
		 * @method ns_egret.LayoutBase#getElementBoundsRightOfScrollRect
		 * @param scrollRect {Rectangle} 
		 * @returns {Rectangle}
		 */		
		public getElementBoundsRightOfScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.x = scrollRect.right;
			bounds.right = scrollRect.right + 1;
			return bounds;
		} 
		/**
		 * 返回跨越 scrollRect 的顶边或在其顶边之上的第一个布局元素的界限。
		 * @method ns_egret.LayoutBase#getElementBoundsAboveScrollRect
		 * @param scrollRect {Rectangle} 
		 * @returns {Rectangle}
		 */
		public getElementBoundsAboveScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.y = scrollRect.y - 1;
			bounds.bottom = scrollRect.y;
			return bounds;
		} 
		/**
		 * 返回跨越 scrollRect 的底边或在其底边之下的第一个布局元素的界限。 
		 * @method ns_egret.LayoutBase#getElementBoundsBelowScrollRect
		 * @param scrollRect {Rectangle} 
		 * @returns {Rectangle}
		 */		
		public getElementBoundsBelowScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.y = scrollRect.bottom;
			bounds.bottom = scrollRect.bottom + 1;
			return bounds;
		}
		
		/**
		 * 滚动条位置改变
		 * @method ns_egret.LayoutBase#scrollPositionChanged
		 */		
		public scrollPositionChanged():void{
			if (this.target==null)
				return;
			this.updateScrollRect(this.target.width, this.target.height);
			this.target.invalidateDisplayListExceptLayout();
		}
		/**
		 * 更新可视区域
		 * @method ns_egret.LayoutBase#updateScrollRect
		 * @param w {number} 
		 * @param h {number} 
		 */		
		public updateScrollRect(w:number, h:number):void{
			if (this.target==null)
				return;
			if (this._clipAndEnableScrolling){
				this.target.scrollRect = new Rectangle(this._horizontalScrollPosition, this._verticalScrollPosition, w, h);
			}
			else{
				this.target.scrollRect = null;
			}
		}
		
		
		private _useVirtualLayout:boolean = false;
		/**
		 * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true。
		 * 只有布局设置为 VerticalLayout、HorizontalLayout 
		 * 或 TileLayout 的 DataGroup 或 SkinnableDataContainer 
		 * 才支持虚拟布局。不支持虚拟化的布局子类必须禁止更改此属性。
		 * @member ns_egret.LayoutBase#useVirtualLayout
		 */
		public get useVirtualLayout():boolean{
			return this._useVirtualLayout;
		}
		
		public set useVirtualLayout(value:boolean){
			if (this._useVirtualLayout == value)
				return;
			
			this._useVirtualLayout = value;
			this.dispatchEvent(new Event("useVirtualLayoutChanged"));
			
			if (this._useVirtualLayout && !value) 
				this.clearVirtualLayoutCache();
			if (this.target)
				this.target.invalidateDisplayList();
		}
		
		private _typicalLayoutRect:Rectangle;
		
		/**
		 * 由虚拟布局所使用，以估计尚未滚动到视图中的布局元素的大小。 
		 * @member ns_egret.LayoutBase#typicalLayoutRect
		 */
		public get typicalLayoutRect():Rectangle{
			return this._typicalLayoutRect;
		}
		
		public set typicalLayoutRect(value:Rectangle){
			if(this._typicalLayoutRect==value)
				return;
			this._typicalLayoutRect = value;
			if (this.target)
				this.target.invalidateSize();
		}
		
		
		
		/**
		 * 清理虚拟布局缓存的数据
		 * @method ns_egret.LayoutBase#clearVirtualLayoutCache
		 */		
		public clearVirtualLayoutCache():void{
		}
		/**
		 * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
		 * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。 
		 * @method ns_egret.LayoutBase#elementAdded
		 * @param index {number} 
		 */		
		public elementAdded(index:number):void{
		}
		/**
		 * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
		 * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。 
		 * @method ns_egret.LayoutBase#elementRemoved
		 * @param index {number} 
		 */		
		public elementRemoved(index:number):void{
		}
		
		/**
		 * 测量组件尺寸大小
		 * @method ns_egret.LayoutBase#measure
		 */		
		public measure():void{
		}
		/**
		 * 更新显示列表
		 * @method ns_egret.LayoutBase#updateDisplayList
		 * @param width {number} 
		 * @param height {number} 
		 */		
		public updateDisplayList(width:number, height:number):void{
		} 
	}
}