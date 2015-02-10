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
	 * @class egret.gui.HSlider
	 * @classdesc
	 * 水平滑块控件
	 * @extends egret.gui.SliderBase
	 */	
	export class HSlider extends SliderBase{
		/**
		 * 构造函数
		 * @method egret.gui.HSlider#constructor
		 */	
		public constructor(){
			super();
            
		}

		/**
		 * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值
		 * @param x
		 * @param y
		 * @returns {number}
		 */
		public pointToValue(x:number, y:number):number{
			if (!this.thumb || !this.track)
				return 0;
			
			var range:number = this.maximum - this.minimum;
			var thumbRange:number = this.track.layoutBoundsWidth - this.thumb.layoutBoundsWidth;
			return this.minimum + ((thumbRange != 0) ? (x / thumbRange) * range : 0); 
		}

		/**
		 * 设置外观部件的边界，这些外观部件的几何图形不是完全由外观的布局指定的
		 */
		public updateSkinDisplayList():void{
			if (!this.thumb || !this.track)
				return;

			var thumbRange:number = this.track.layoutBoundsWidth - this.thumb.layoutBoundsWidth;
			var range:number = this.maximum - this.minimum;
			var thumbPosTrackX:number = (range > 0) ? ((this.pendingValue - this.minimum) / range) * thumbRange : 0;
			var thumbPos:Point = this.track.localToGlobal(thumbPosTrackX, 0);
            var thumbPosX:number = thumbPos.x;
            var thumbPosY:number = thumbPos.y;
			var thumbPosParentX:number = this.thumb.parent.globalToLocal(thumbPosX,thumbPosY,Point.identity).x;
			
			this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), this.thumb.layoutBoundsY);
			if(this.showTrackHighlight&&this.trackHighlight&&this.trackHighlight.parent){
				var trackHighlightX:number = this.trackHighlight.parent.globalToLocal(thumbPosX,thumbPosY,Point.identity).x-thumbPosTrackX;
				this.trackHighlight.x = Math.round(trackHighlightX);
				this.trackHighlight.width = Math.round(thumbPosTrackX);
			}
		}
	}
	
}