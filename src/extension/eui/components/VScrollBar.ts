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
     * The VScrollBar (vertical scrollbar) control lets you control
     * the portion of data that is displayed when there is too much data
     * to fit vertically in a display area.
     *
     * <p>Although you can use the VScrollBar control as a stand-alone control,
     * you usually combine it as part of another group of components to
     * provide scrolling functionality.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VScrollBarExample.ts
     */
    /**
     * @language zh_CN
     * VScrollBar（垂直 ScrollBar）控件可以在因数据太多而不能在显示区域中以垂直方向完全显示时控制显示的数据部分。
     * <p>虽然 VScrollBar 控件可以单独使用，但通常将它与其他组件一起使用来提供滚动功能。</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VScrollBarExample.ts
     */
    export class VScrollBar extends ScrollBarBase {

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            var thumb = this.thumb;
            var viewport = this.$viewport;
            if (!thumb || !viewport) {
                return;
            }
            var bounds = egret.$TempRectangle;
            thumb.getPreferredBounds(bounds);
            var thumbHeight = bounds.height;
            var thumbX = bounds.x;
            var vsp = viewport.scrollV;
            var contentHeight = viewport.contentHeight;
            var height = viewport.height;
            if (vsp <= 0) {
                var scaleHeight = thumbHeight * (1-(-vsp) / (height * 0.5));
                scaleHeight = Math.max(5,Math.round(scaleHeight));
                thumb.setLayoutBoundsSize(NaN, scaleHeight);
                thumb.setLayoutBoundsPosition(thumbX, 0);
            }
            else if (vsp >= contentHeight - height) {
                scaleHeight = thumbHeight * (1-(vsp - contentHeight + height) / (height * 0.5));
                scaleHeight = Math.max(5,Math.round(scaleHeight));
                thumb.setLayoutBoundsSize(NaN, scaleHeight);
                thumb.setLayoutBoundsPosition(thumbX, unscaledHeight - scaleHeight);
            }
            else {
                var thumbY = (unscaledHeight - thumbHeight) * vsp / (contentHeight - height);
                thumb.setLayoutBoundsSize(NaN, NaN);
                thumb.setLayoutBoundsPosition(thumbX, thumbY);
            }
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onPropertyChanged(event:eui.PropertyEvent):void {
            switch (event.property) {
                case "scrollV":
                case "contentHeight":
                    this.invalidateDisplayList();
                    break;
            }
        }
    }

}