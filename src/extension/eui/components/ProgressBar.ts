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
     * The ProgressBar control provides a visual representation of the progress of a task over time.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ProgressBarExample.ts
     */
    /**
     * @language zh_CN
     * ProgressBar 控件为随时间而变的任务进度提供了形象化的表示。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ProgressBarExample.ts
     */
    export class ProgressBar extends Range {

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
            this.animation = new sys.Animation(this.animationUpdateHandler, this);
        }

        /**
         * @language en_US
         * this hightlight component of the progressbar.
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 进度高亮显示对象。
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public thumb:eui.UIComponent = null;
        /**
         * @language en_US
         * the label of the progressbar.
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 进度条文本
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public labelDisplay:Label = null;

        /**
         * @private
         */
        private _labelFunction:(value:number, maximum:number)=>string = null;
        /**
         * @language en_US
         * a text format callback function。example：
         * <code>labelFunction(value:Number,maximum:Number):String;</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 进度条文本格式化回调函数。示例：
         * <code>labelFunction(value:Number,maximum:Number):String;</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get labelFunction():(value:number, maximum:number)=>string {
            return this._labelFunction;
        }

        public set labelFunction(value:(value:number, maximum:number)=>string) {
            if (this._labelFunction == value)
                return;
            this._labelFunction = value;
            this.invalidateDisplayList();
        }

        /**
         * @language en_US
         * Convert the current value to display text
         *
         * @param value the current value
         * @param maximum the maximum value
         *
         * @return a converted text
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将当前value转换成文本
         *
         * @param value 当前值
         * @param maximum 最大值
         *
         * @return 转换后的文本
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected valueToLabel(value:number, maximum:number):string {
            if (this.labelFunction != null) {
                return this._labelFunction(value, maximum);
            }
            return value + " / " + maximum;
        }

        /**
         * @private
         */
        private _slideDuration:number = 500;

        /**
         * @language en_US
         * Duration in milliseconds for a sliding animation
         * when the value changing. If the vlaue is 0, no animation will be done.
         *
         * @default 500
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * value改变时更新视图的缓动动画时间(毫秒为单位)。设置为0则不执行缓动。
         *
         * @default 500
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get slideDuration():number {
            return this._slideDuration;
        }

        public set slideDuration(value:number) {
            value = +value | 0;
            if (this._slideDuration === value)
                return;
            this._slideDuration = value;
            if (this.animation.isPlaying) {
                this.animation.stop();
                this.setValue(this.slideToValue);
            }
        }

        /**
         * @private
         */
        private _direction:string = Direction.LTR;
        /**
         * @language en_US
         * Direction in which the fill of the ProgressBar expands toward completion.
         * you should use the <code>Direction</code> class constants to set the property.
         *
         * @default Direction.LTR
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * ProgressBar 填充在逐步完成过程中扩展的方向。使用 <code>Direction</code> 类定义的常量。
         *
         * @default Direction.LTR
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get direction():string {
            return this._direction;
        }

        public set direction(value:string) {
            if (this._direction == value)
                return;
            this._direction = value;
            this.invalidateDisplayList();
        }

        /**
         * @private
         * 动画实例
         */
        private animation:sys.Animation;
        /**
         * @private
         * 动画播放结束时要到达的value。
         */
        private slideToValue:number = 0;

        /**
         * @private
         * 
         * @param newValue 
         */
        $setValue(newValue:number):boolean {
            if (this.value === newValue)
                return false;
            var values = this.$Range;
            var result:boolean = super.$setValue(newValue);
            if (this._slideDuration > 0 && this.$stage) {
                this.validateProperties();//最大值最小值发生改变时要立即应用，防止当前起始值不正确。
                var animation = this.animation;
                if (animation.isPlaying) {
                    this.animationValue = this.slideToValue;
                    this.invalidateDisplayList();
                    animation.stop();
                }
                this.slideToValue = this.nearestValidValue(newValue, values[sys.RangeKeys.snapInterval]);
                if (this.slideToValue === this.animationValue)
                    return result;
                var duration = this._slideDuration *
                    (Math.abs(this.animationValue - this.slideToValue) / (values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum]));
                animation.duration = duration === Infinity ? 0 : duration;
                animation.from = this.animationValue;
                animation.to = this.slideToValue;
                animation.play();
            }
            else {
                this.animationValue = this.value;
            }
            return result;
        }

        /**
         * @private
         */
        private animationValue:number = 0;

        /**
         * @private
         * 动画播放更新数值
         */
        private animationUpdateHandler(animation:sys.Animation):void {
            var values = this.$Range;
            var value = this.nearestValidValue(animation.currentValue, values[sys.RangeKeys.snapInterval]);
            this.animationValue = Math.min(values[sys.RangeKeys.maximum], Math.max(values[sys.RangeKeys.minimum], value));
            this.invalidateDisplayList();
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            if (instance === this.thumb) {
                this.thumb.addEventListener(egret.Event.RESIZE, this.onThumbResize, this);
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);
            if (instance === this.thumb) {
                this.thumb.removeEventListener(egret.Event.RESIZE, this.onThumbResize, this);
            }
        }

        /**
         * @private
         * thumb的位置或尺寸发生改变
         */
        private onThumbResize(event:egret.Event):void {
            this.updateSkinDisplayList();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateSkinDisplayList():void {
            var currentValue = this.animation.isPlaying ? this.animationValue : this.value;
            var maxValue = this.maximum;
            var thumb = this.thumb;
            if (thumb) {
                var thumbWidth = thumb.width;
                var thumbHeight = thumb.height;
                var clipWidth = Math.round((currentValue / maxValue) * thumbWidth);
                if (clipWidth < 0 || clipWidth === Infinity)
                    clipWidth = 0;
                var clipHeight = Math.round((currentValue / maxValue) * thumbHeight);
                if (clipHeight < 0 || clipHeight === Infinity)
                    clipHeight = 0;

                var rect = thumb.$scrollRect;
                if (!rect) {
                    rect = egret.$TempRectangle;
                }
                rect.setTo(0,0,thumbWidth,thumbHeight);
                var thumbPosX = thumb.x - rect.x;
                var thumbPosY = thumb.y - rect.y;
                switch (this._direction) {
                    case Direction.LTR:
                        rect.width = clipWidth;
                        thumb.x = thumbPosX;
                        break;
                    case Direction.RTL:
                        rect.width = clipWidth;
                        rect.x = thumbWidth - clipWidth;
                        thumb.x = rect.x;
                        break;
                    case Direction.TTB:
                        rect.height = clipHeight;
                        thumb.y = thumbPosY;
                        break;
                    case Direction.BTT:
                        rect.height = clipHeight;
                        rect.y = thumbHeight - clipHeight;
                        thumb.y = rect.y;
                        break;
                }
                thumb.scrollRect = rect;
            }
            if (this.labelDisplay) {
                this.labelDisplay.text = this.valueToLabel(currentValue, maxValue);
            }
        }
    }
}