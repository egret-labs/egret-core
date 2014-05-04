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

	export class HSlider extends SliderBase{
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
			return HSlider;
		}
		
		/**
		 * @inheritDoc
		 */
		public pointToValue(x:number, y:number):number{
			if (!this.thumb || !this.track)
				return 0;
			
			var range:number = this.maximum - this.minimum;
			var thumbRange:number = this.track.layoutBoundsWidth - this.thumb.layoutBoundsWidth;
			return this.minimum + ((thumbRange != 0) ? (x / thumbRange) * range : 0); 
		}
		
		/**
		 * @inheritDoc
		 */
		public updateSkinDisplayList():void{
			if (!this.thumb || !this.track)
				return;
			
			var thumbRange:number = this.track.layoutBoundsWidth - this.thumb.layoutBoundsWidth;
			var range:number = this.maximum - this.minimum;
			var thumbPosTrackX:number = (range > 0) ? ((this.pendingValue - this.minimum) / range) * thumbRange : 0;
			var thumbPos:Point = this.track.localToGlobal(new Point(thumbPosTrackX, 0));
			var thumbPosParentX:number = this.thumb.parent.globalToLocal(thumbPos).x;
			
			this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), this.thumb.layoutBoundsY);
			if(this.showTrackHighlight&&this.trackHighlight&&this.trackHighlight.parent){
				var trackHighlightX:number = this.trackHighlight.parent.globalToLocal(thumbPos).x-thumbPosTrackX;
				this.trackHighlight.x = Math.round(trackHighlightX);
				this.trackHighlight.width = Math.round(thumbPosTrackX);
			}
		}
	}
	
}
