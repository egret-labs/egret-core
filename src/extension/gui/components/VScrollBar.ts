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
    export class VScrollBar extends VSlider {
        public constructor() {
            super();
            this.hostComponentKey = "egret.gui.VScrollBar";
        }

        public _setViewportMetric(height: number, contentHeight: number) {
            this._setMaximun(contentHeight - height);
            this._setMinimun(0);
            this._setValue(contentHeight - height);
            this._setVisible(height < contentHeight);

            var thumbLength = height * height / contentHeight;
            this.thumb._setHeight(thumbLength);
        }

        private _autoHideTimer = NaN;
        private _autoHideDelay = 3000;
        public trackAlpha = 0.4;
        public thumbAlpha = 0.8;

        public setPosition(value: number) {
            this._setValue(this._maximum - value);
        }
        public getPosition() {
            return this._maximum - this._getValue();
        }

        public _setValue(value: number) {
            value = Math.max(0, value);
            super._setValue(value);
            //被赋值时自动显示
            this.hideOrShow(true);
            this.autoHide();
        }

        public setValue(value: number) {
            super.setValue(value);
            //被赋值时自动显示
            this.hideOrShow(true);
            this.autoHide();
        }

        private autoHide() {
            if (this._autoHideDelay != NaN) {
                egret.clearTimeout(this._autoHideDelay);
            }
            this._autoHideTimer = egret.setTimeout(this.hideOrShow.bind(this, false), this, this._autoHideDelay);
        }

        private _autoHideShowAnimat: Animation = null;
        private _animatTargetIsShow: boolean = false;

        private hideOrShow(show: boolean) {
            if (this._autoHideShowAnimat == null) {
                this._autoHideShowAnimat = new Animation(b=> {
                    var a = b.currentValue["alpha"]
                    this.thumb.alpha = this.thumbAlpha * a;
                    this.track.alpha = this.trackAlpha * a;
                }, this);
            }
            else {
                if (this._animatTargetIsShow == show)
                    return;
                this._autoHideShowAnimat.isPlaying && this._autoHideShowAnimat.stop();
            }
            this._animatTargetIsShow = show;
            var animat = this._autoHideShowAnimat;
            animat.motionPaths = [{
                prop: "alpha",
                from: this.thumb.alpha / this.thumbAlpha,
                to: show ? 1 : 0
            }];
            animat.duration = show ? 100 : 500;
            animat.play();
        }

        public _animationUpdateHandler(animation: Animation): void {
            this.pendingValue = animation.currentValue["value"];
            this.value = animation.currentValue["value"];
            this.dispatchEventWith(Event.CHANGE);
        }
        /**
         * @method egret.gui.SkinnableComponent#createChildren
         */
        //public createChildren(): void {
        //    super.createChildren();
        //    if (this.thumb == null) {
        //        var skin = new egret.gui.Skin();

        //        var rect = new egret.gui.Rect();
        //        rect.fillColor = 0x666666;
        //        rect.width = 10;
        //        rect.percentHeight = 100;

        //        var rectb = new egret.gui.Rect();
        //        rectb.fillColor = 0x333333;
        //        rectb.width = 10;

        //        skin["track"] = rect;
        //        skin["thumb"] = rectb;

        //        skin.elementsContent = [rect, rectb];
        //        skin["skinParts"] = ["track", "thumb"];
        //        this._setSkin(skin);
        //    }
        //}
    }
}