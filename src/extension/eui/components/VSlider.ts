//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace eui {

    /**
     * The VSlider (vertical slider) control lets users select a value
     * by moving a slider thumb between the end points of the slider track.
     * The current value of the slider is determined by the relative location of the thumb between
     * the end points of the slider, corresponding to the slider's minimum and maximum values.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VSliderExample.ts
     * @language en_US
     */
    /**
     * 使用 VSlider（垂直滑块）控件，用户可通过在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VSliderExample.ts
     * @language zh_CN
     */
    export class VSlider extends SliderBase {
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
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

            let values = this.$Range;
            let range = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            let thumbRange = this.getThumbRange();
            return values[sys.RangeKeys.minimum] + ((thumbRange != 0) ? ((thumbRange - y) / thumbRange) * range : 0);
        }

        /**
         * @private
         * 
         * @returns 
         */
        private getThumbRange():number {
            let bounds = egret.$TempRectangle;
            this.track.getLayoutBounds(bounds);
            let thumbRange = bounds.height;
            this.thumb.getLayoutBounds(bounds);
            return thumbRange - bounds.height;
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateSkinDisplayList():void {
            if (!this.thumb || !this.track)
                return;
            let values = this.$Range
            let thumbRange = this.getThumbRange();
            let range = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            let thumbPosTrackY:number = (range > 0) ? thumbRange - (((this.pendingValue - values[sys.RangeKeys.minimum]) / range) * thumbRange) : 0;
            let thumbPos = this.track.localToGlobal(0, thumbPosTrackY,egret.$TempPoint);
            let thumbPosX = thumbPos.x;
            let thumbPosY = thumbPos.y;
            let thumbPosParentY = this.thumb.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).y;

            let bounds = egret.$TempRectangle;
            let thumbHeight = bounds.height;
            this.thumb.getLayoutBounds(bounds);
            this.thumb.setLayoutBoundsPosition(bounds.x, Math.round(thumbPosParentY));
            if (this.trackHighlight) {
                let trackHighlightY = this.trackHighlight.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).y;
                this.trackHighlight.y = Math.round(trackHighlightY + thumbHeight);
                this.trackHighlight.height = Math.round(thumbRange - trackHighlightY);
            }
        }
    }

}