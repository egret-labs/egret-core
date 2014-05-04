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

/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../egret/geom/Point.ts"/>
/// <reference path="supportClasses/ScrollBarBase.ts"/>
/// <reference path="../core/IInvalidating.ts"/>
/// <reference path="../core/IViewport.ts"/>
/// <reference path="../core/NavigationUnit.ts"/>
/// <reference path="../events/PropertyChangeEvent.ts"/>
/// <reference path="../events/ResizeEvent.ts"/>

module ns_egret {

	export class VScrollBar extends ScrollBarBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		public get hostComponentKey():any{
			return VScrollBar;
		}
		
		/**
		 * 更新最大值和分页大小
		 */
		private updateMaximumAndPageSize():void{
			var vsp:number = this.viewport.verticalScrollPosition;
			var viewportHeight:number = isNaN(this.viewport.height) ? 0 : this.viewport.height;
			var cHeight:number = this.viewport.contentHeight;
			this.maximum = (cHeight == 0) ? vsp : cHeight - viewportHeight;
			this.pageSize = viewportHeight;
		}
		
		/**
		 * @inheritDoc
		 */
		public set viewport(newViewport:IViewport){
			const oldViewport:IViewport = super.viewport;
			if (oldViewport == newViewport)
				return;
			
			if (oldViewport){
				oldViewport.removeEventListener(TouchEvent.MOUSE_WHEEL, this.mouseWheelHandler, this);
				this.removeEventListener(TouchEvent.MOUSE_WHEEL, this.mouseWheelHandler, this);
			}
			
			super.viewport = newViewport;
			
			if (newViewport){
				this.updateMaximumAndPageSize()
				this.value = newViewport.verticalScrollPosition;;
				newViewport.addEventListener(TouchEvent.MOUSE_WHEEL, this.mouseWheelHandler, this);
				this.addEventListener(TouchEvent.MOUSE_WHEEL, this.mouseWheelHandler, this);  
			}
		}   
		
		/**
		 * @inheritDoc
		 */
		public pointToValue(x:number, y:number):number{
			if (!this.thumb || !this.track)
				return 0;
			
			var r:number = this.track.layoutBoundsHeight - this.thumb.layoutBoundsHeight;
			return this.minimum + ((r != 0) ? (y / r) * (this.maximum - this.minimum) : 0); 
		}
		
		/**
		 * @inheritDoc
		 */
		public updateSkinDisplayList():void{
			if (!this.thumb || !this.track)
				return;
			
			var trackSize:number = this.track.layoutBoundsHeight;
			var range:number = this.maximum - this.minimum;
			
			var thumbPos:Point;
			var thumbPosTrackY:number = 0;
			var thumbPosParentY:number = 0;
			var thumbSize:number = trackSize;
			if (range > 0){
				if (this.fixedThumbSize === false){
					thumbSize = Math.min((this.pageSize / (range + this.pageSize)) * trackSize, trackSize)
					thumbSize = Math.max(this.thumb.minHeight, thumbSize);
				}
				else{
					thumbSize = this.thumb ? this.thumb.height : 0;
				}
				thumbPosTrackY = (this.value - this.minimum) * ((trackSize - thumbSize) / range);
			}
			
			if (this.fixedThumbSize === false)
				this.thumb.height = Math.ceil(thumbSize);
			if (this.autoThumbVisibility === true)
				this.thumb.visible = thumbSize < trackSize;
			thumbPos = this.track.localToGlobal(new Point(0, thumbPosTrackY));
			thumbPosParentY = this.thumb.parent.globalToLocal(thumbPos).y;
			
			this.thumb.setLayoutBoundsPosition(this.thumb.layoutBoundsX, Math.round(thumbPosParentY));
		}
		
		/**
		 * @inheritDoc
		 */
		public setValue(value:number):void{
			super.setValue(value);
			if (this.viewport)
				this.viewport.verticalScrollPosition = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public changeValueByPage(increase:boolean = true):void{
			var oldPageSize:number;
			if (this.viewport){
				oldPageSize = this.pageSize;
				this.pageSize = Math.abs(this.viewport.getVerticalScrollPositionDelta(
					(increase) ? NavigationUnit.PAGE_DOWN : NavigationUnit.PAGE_UP));
			}
			super.changeValueByPage(increase);
			if (this.viewport)
				this.pageSize = oldPageSize;
		} 
		
		/**
		 * @inheritDoc
		 */
		public animatePaging(newValue:number, pageSize:number):void{
			if (this.viewport){
				var vpPageSize:number = Math.abs(this.viewport.getVerticalScrollPositionDelta(
					(newValue > this.value) ? NavigationUnit.PAGE_DOWN : NavigationUnit.PAGE_UP));
				super.animatePaging(newValue, vpPageSize);
				return;
			}        
			super.animatePaging(newValue, pageSize);
		}
		
		/**
		 * @inheritDoc
		 */
		public changeValueByStep(increase:boolean = true):void{
			var oldStepSize:number;
			if (this.viewport){
				oldStepSize = this.stepSize;
				this.stepSize = Math.abs(this.viewport.getVerticalScrollPositionDelta(
					(increase) ? NavigationUnit.DOWN : NavigationUnit.UP));
			}
			super.changeValueByStep(increase);
			if (this.viewport)
				this.stepSize = oldStepSize;
		} 
		    
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			if (instance == this.thumb){
				this.thumb.top = undefined;
				this.thumb.bottom = undefined;
				this.thumb.verticalCenter = undefined;
			}      
			super.partAdded(partName, instance);
		}     
		
		/**
		 * @inheritDoc
		 */
		public viewportVerticalScrollPositionChangeHandler(event:PropertyChangeEvent):void{
			if (this.viewport)
				this.value = this.viewport.verticalScrollPosition;
		}
		
		/**
		 * @inheritDoc
		 */
		public viewportResizeHandler(event:ResizeEvent):void{
			if (this.viewport)
				this.updateMaximumAndPageSize();
		}
		
		/**
		 * @inheritDoc
		 */
		public viewportContentHeightChangeHandler(event:PropertyChangeEvent):void{
			if (this.viewport){
				var viewportHeight:number = isNaN(this.viewport.height) ? 0 : this.viewport.height;
				this.maximum = this.viewport.contentHeight - this.viewport.height;
			}
		}
		
		/**
		 * 根据event.delta滚动指定步数的距离。
		 */	
		public mouseWheelHandler(event:TouchEvent):void{
			const vp:IViewport = this.viewport;
			if (event.isDefaultPrevented() || !vp || !vp.visible||!this.visible)
				return;
			
			var nSteps:number = this.useMouseWheelDelta?Math.abs(event.delta):1;
			var navigationUnit:number;
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
		
	}
}
