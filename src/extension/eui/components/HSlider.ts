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


module eui {

    /**
     * @language en_US
     * The HSlider (horizontal slider) control lets users select a value
     * by moving a slider thumb between the end points of the slider track.
     * The current value of the slider is determined by the relative location of the thumb between
     * the end points of the slider, corresponding to the slider's minimum and maximum values.
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 使用 HSlider（水平滑块）控件，用户可通过在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class HSlider extends SliderBase {

        /**
         * @language en_US
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected pointToValue(x:number, y:number):number {
            if (!this.thumb || !this.track)
                return 0;
            var values = this.$Range;
            var range = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            var thumbRange = this.getThumbRange();
            return values[sys.RangeKeys.minimum] + (thumbRange != 0 ? (x / thumbRange) * range : 0);
        }

        /**
         * @private
         * 
         * @returns 
         */
        private getThumbRange():number {
            var bounds = egret.$TempRectangle;
            this.track.getLayoutBounds(bounds);
            var thumbRange = bounds.width;
            this.thumb.getLayoutBounds(bounds);
            return thumbRange - bounds.width;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateSkinDisplayList():void {
            if (!this.thumb || !this.track)
                return;
            var values = this.$Range;
            var thumbRange = this.getThumbRange();
            var range = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            var thumbPosTrackX = (range > 0) ? ((this.pendingValue - values[sys.RangeKeys.minimum]) / range) * thumbRange : 0;
            var thumbPos = this.track.localToGlobal(thumbPosTrackX, 0, egret.$TempPoint);
            var thumbPosX = thumbPos.x;
            var thumbPosY = thumbPos.y;
            var thumbPosParentX = this.thumb.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).x;

            var bounds = egret.$TempRectangle;
            this.thumb.getLayoutBounds(bounds);
            this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), bounds.y);
            if (this.trackHighlight && this.trackHighlight.$parent) {
                var trackHighlightX = this.trackHighlight.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).x - thumbPosTrackX;
                this.trackHighlight.x = Math.round(trackHighlightX);
                this.trackHighlight.width = Math.round(thumbPosTrackX);
            }
        }
    }

}