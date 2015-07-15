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


module egret.gui {

	/**
	 * @class egret.gui.BasicLayout
	 * @classdesc
	 * 基本布局
	 * @extends egret.gui.LayoutBase
	 */
	export class BasicLayout extends LayoutBase{
		/**
		 * @method egret.gui.BasicLayout#constructor
		 */
		public constructor(){
			super();
		}
		
		/**
		 * 此布局不支持虚拟布局，设置这个属性无效
		 */		
		public set useVirtualLayout(value:boolean){
		}
		
		private _mouseWheelSpeed:number = 20;
		/**
		 * 鼠标滚轮每次滚动时目标容器的verticalScrollPosition
		 * 或horizontalScrollPosition改变的像素距离。必须大于0， 默认值20。
		 * @member egret.gui.BasicLayout#mouseWheelSpeed
		 */
		public get mouseWheelSpeed():number{
			return this._mouseWheelSpeed;
		}
		public set mouseWheelSpeed(value:number){
			if(value==0)
				value = 1;
			this._mouseWheelSpeed = value;
		}

		public getElementBoundsLeftOfScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.x = scrollRect.x - this._mouseWheelSpeed;
			bounds.right = scrollRect.x;
			return bounds;
		}

		public getElementBoundsRightOfScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.x = scrollRect.right;
			bounds.right = scrollRect.right + this._mouseWheelSpeed;
			return bounds;
		}

		public getElementBoundsAboveScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.y = scrollRect.y - this._mouseWheelSpeed;
			bounds.bottom = scrollRect.y;
			return bounds;
		}

		public getElementBoundsBelowScrollRect(scrollRect:Rectangle):Rectangle{
			var bounds:Rectangle = new Rectangle();
			bounds.y = scrollRect.bottom;
			bounds.bottom = scrollRect.bottom + this._mouseWheelSpeed;
			return bounds;
		}

		/**
		 *基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
		 */
		public measure():void{
			super.measure();

			if (this.target==null)
				return;

			var width:number = 0;
			var height:number = 0;

			var count:number = this.target.numElements;
			for (var i:number = 0; i < count; i++){
				var layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(i));
				if (!layoutElement||!layoutElement.includeInLayout)
					continue;

				var hCenter:number   = layoutElement.horizontalCenter;
				var vCenter:number   = layoutElement.verticalCenter;
				var left:number      = layoutElement.left;
				var right:number     = layoutElement.right;
				var top:number       = layoutElement.top;
				var bottom:number    = layoutElement.bottom;

				var extX:number;
				var extY:number;

				if (!isNaN(left) && !isNaN(right)){
					extX = left + right;
				}
				else if (!isNaN(hCenter)){
					extX = Math.abs(hCenter) * 2;
				}
				else if (!isNaN(left) || !isNaN(right)){
					extX = isNaN(left) ? 0 : left;
					extX += isNaN(right) ? 0 : right;
				}
				else{
					extX = layoutElement.preferredX;
				}

				if (!isNaN(top) && !isNaN(bottom)){
					extY = top + bottom;
				}
				else if (!isNaN(vCenter)){
					extY = Math.abs(vCenter) * 2;
				}
				else if (!isNaN(top) || !isNaN(bottom)){
					extY = isNaN(top) ? 0 : top;
					extY += isNaN(bottom) ? 0 : bottom;
				}
				else{
					extY = layoutElement.preferredY;
				}

				var preferredWidth:number = layoutElement.preferredWidth;
				var preferredHeight:number = layoutElement.preferredHeight;

				width = Math.ceil(Math.max(width, extX + preferredWidth));
				height = Math.ceil(Math.max(height, extY + preferredHeight));
			}

			this.target.measuredWidth = width;
			this.target.measuredHeight = height;
		}


		/**
		 * 调整目标的元素的大小并定位这些元素
		 * @param unscaledWidth
		 * @param unscaledHeight
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth, unscaledHeight);

			if (this.target==null)
				return;

			var count:number = this.target.numElements;

			var maxX:number = 0;
			var maxY:number = 0;
			for (var i:number = 0; i < count; i++){
				var layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(i));
				if (layoutElement==null||!layoutElement.includeInLayout)
					continue;

				var hCenter:number          = layoutElement.horizontalCenter;
				var vCenter:number          = layoutElement.verticalCenter;
				var left:number             = layoutElement.left;
				var right:number            = layoutElement.right;
				var top:number              = layoutElement.top;
				var bottom:number           = layoutElement.bottom;
				var percentWidth:number     = layoutElement.percentWidth;
				var percentHeight:number    = layoutElement.percentHeight;
				
				var childWidth:number = NaN;
				var childHeight:number = NaN;
				
				
				if(!isNaN(left) && !isNaN(right)){
					childWidth = unscaledWidth - right - left;
				}
				else if (!isNaN(percentWidth)){
					childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
				}
				
				if (!isNaN(top) && !isNaN(bottom)){
					childHeight = unscaledHeight - bottom - top;
				}
				else if (!isNaN(percentHeight)){
					childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
				}
				
				layoutElement.setLayoutBoundsSize(childWidth, childHeight);
				
				var elementWidth:number = layoutElement.layoutBoundsWidth;
				var elementHeight:number = layoutElement.layoutBoundsHeight;
				
				
				var childX:number = NaN;
				var childY:number = NaN;
				
				if (!isNaN(hCenter))
					childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
				else if (!isNaN(left))
					childX = left;
				else if (!isNaN(right))
					childX = unscaledWidth - elementWidth - right;
				else
					childX = layoutElement.layoutBoundsX;
				
				if (!isNaN(vCenter))
					childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
				else if (!isNaN(top))
					childY = top;
				else if (!isNaN(bottom))
					childY = unscaledHeight - elementHeight - bottom;
				else
					childY = layoutElement.layoutBoundsY;
				
				layoutElement.setLayoutBoundsPosition(childX, childY);
				
				maxX = Math.max(maxX,childX+elementWidth);
				maxY = Math.max(maxY,childY+elementHeight);
			}
			this.target.setContentSize(maxX,maxY);
		}
	}
}