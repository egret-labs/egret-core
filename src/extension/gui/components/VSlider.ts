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

/// <reference path="../../../egret/geom/Point.ts"/>
/// <reference path="supportClasses/SliderBase.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.VSlider
	 * @classdesc
	 * 垂直滑块控件
	 * @extends ns_egret.SliderBase
	 */
	export class VSlider extends SliderBase{
		/**
		 * 构造函数
		 * @method ns_egret.VSlider#constructor
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * @method ns_egret.VSlider#pointToValue
		 * @param x {number} 
		 * @param y {number} 
		 * @returns {number}
		 */
		public pointToValue(x:number, y:number):number{
			if (!this.thumb || !this.track)
				return 0;
			
			var range:number = this.maximum - this.minimum;
			var thumbRange:number = this.track.layoutBoundsHeight - this.thumb.layoutBoundsHeight;
			return this.minimum + ((thumbRange != 0) ? ((thumbRange - y) / thumbRange) * range : 0); 
		}
		
		/**
		 * @method ns_egret.VSlider#updateSkinDisplayList
		 */
		public updateSkinDisplayList():void{
			if (!this.thumb || !this.track)
				return;
			
			var thumbRange:number = this.track.layoutBoundsHeight - this.thumb.layoutBoundsHeight;
			var range:number = this.maximum - this.minimum;
			var thumbPosTrackY:number = (range > 0) ? thumbRange - (((this.pendingValue - this.minimum) / range) * thumbRange) : 0;
			var thumbPos:Point = this.track.localToGlobal(0, thumbPosTrackY);
            var thumbPosX:number = thumbPos.x;
            var thumbPosY:number = thumbPos.y;
			var thumbPosParentY:number = this.thumb.parent.globalToLocal(thumbPosX,thumbPosY).y;
			
			this.thumb.setLayoutBoundsPosition(this.thumb.layoutBoundsX, Math.round(thumbPosParentY));
			if(this.showTrackHighlight&&this.trackHighlight&&this.trackHighlight.parent){
				var trackHighlightY:number = this.trackHighlight.parent.globalToLocal(thumbPosX,thumbPosY).y-thumbPosTrackY;
				this.trackHighlight.y = Math.round(trackHighlightY);
				this.trackHighlight.height = Math.round(thumbPosTrackY);
			}
		}
	}
	
}