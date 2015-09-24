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
     * @classic
     * VScrollBar（垂直 ScrollBar）控件可以在因数据太多而不能在显示区域中以垂直方向完全显示时控制显示的数据部分
     */
    export class VScrollBar extends VSlider {
        public constructor() {
            super();
            
        }
        private _thumbLengthRatio = 1;

        /**
         *
         * @param height
         * @param contentHeight
         * @private
         */
        public _setViewportMetric(height: number, contentHeight: number) {
            var max = Math.max(0, contentHeight - height);
            this._thumbLengthRatio = contentHeight <= height ? 1 : height / contentHeight;
            this._setMaximun(max);
            this._setMinimun(0);
        }

        public get trackAlpha(): number {
            return 1;
        }

        /**
         * @deprecated
         */
        public set trackAlpha(value: number) {
            egret.$warn(1016, "VScrollBar.trackAlpha");
        }

        public get thumbAlpha(): number {
            return 1;
        }

        /**
         * @deprecated
         */
        public set thumbAlpha(value: number) {
            egret.$warn(1016, "VScrollBar.thumbAlpha");
        }

        public setPosition(value: number) {
            this._setValue(value);
        }
        public getPosition() {
            return this._getValue();
        }

        public _setValue(value: number) {
            value = Math.max(0, value);
            super._setValue(value);
        }

        public setValue(value: number) {
            super.setValue(value);
        }

        public _animationUpdateHandler(animation: Animation): void {
            this.pendingValue = animation.currentValue["value"];
            this.value = animation.currentValue["value"];
            this.dispatchEventWith(Event.CHANGE);
        }
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值
         * @param x {number}
         * @param y {number} 
         * @returns {number}
         */
        public pointToValue(x: number, y: number): number {
            if (!this.thumb || !this.track)
                return 0;

            var range: number = this.maximum - this.minimum;
            var thumbRange: number = this.track.layoutBoundsHeight - this.thumb.layoutBoundsHeight;
            return this.minimum + ((thumbRange != 0) ? ( y / thumbRange) * range : 0);
        }

        /**
         * 设置外观部件（通常为滑块）的边界，这些外观部件的几何图形不是完全由外观的布局指定的
         */
        public updateSkinDisplayList(): void {
            if (!this.thumb || !this.track)
                return;

            var thumbHeight = this.track.layoutBoundsHeight * this._thumbLengthRatio;
            var oldThumbHeight: number = this.thumb.layoutBoundsHeight;
            var thumbRange: number = this.track.layoutBoundsHeight - thumbHeight;
            var range: number = this.maximum - this.minimum;
            var thumbPosTrackY: number = (range > 0) ? ((this.pendingValue - this.minimum) / range) * thumbRange : 0;
            var thumbPos: Point = this.track.localToGlobal(0, thumbPosTrackY);
            var thumbPosX: number = thumbPos.x;
            var thumbPosY: number = thumbPos.y;
            var thumbPosParentY: number = this.thumb.parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).y;
            this.thumb.setLayoutBoundsPosition(this.thumb.layoutBoundsX, Math.round(thumbPosParentY));
            if (thumbHeight != oldThumbHeight)
                this.thumb.setLayoutBoundsSize(this.thumb.layoutBoundsWidth, thumbHeight);
        }
    }
}