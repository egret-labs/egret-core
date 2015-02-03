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
    export class HScrollBar extends HSlider {

        private _thumbLengthRatio = 1;
        public _setViewportMetric(width:number, contentWidth:number) {
            var max = Math.max(0, contentWidth - width);
            this._setMaximun(max);
            this._setMinimun(0);
            this._thumbLengthRatio = (contentWidth > width) ? width / contentWidth : 1;
        }

        public set trackAlpha(value:number){
            Logger.warningWithErrorId(1016, "HScrollBar.trackAlpha");
        }
        public get trackAlpha():number {
            return 1;
        }

        public set thumbAlpha(value: number) {
            Logger.warningWithErrorId(1016, "HScrollBar.thumbAlpha");
        }
        public get thumbAlpha():number {
            return 1;
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

        public updateSkinDisplayList(): void {
            if (!this.thumb || !this.track)
                return;

            var thumbWidth = this.track.layoutBoundsWidth * this._thumbLengthRatio;
            var oldThumbWidth: number = this.thumb.layoutBoundsWidth;
            var thumbRange: number = this.track.layoutBoundsWidth - this.thumb.layoutBoundsWidth;
            var range: number = this.maximum - this.minimum;
            var thumbPosTrackX: number = (range > 0) ? ((this.pendingValue - this.minimum) / range) * thumbRange : 0;
            var thumbPos: Point = this.track.localToGlobal(thumbPosTrackX, 0);
            var thumbPosX: number = thumbPos.x;
            var thumbPosY: number = thumbPos.y;
            var thumbPosParentX: number = this.thumb.parent.globalToLocal(thumbPosX, thumbPosY, Point.identity).x;
            this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), this.thumb.layoutBoundsY);
            if (thumbWidth != oldThumbWidth)
                this.thumb.setLayoutBoundsSize(thumbWidth, this.thumb.layoutBoundsHeight);
        }
    }
}