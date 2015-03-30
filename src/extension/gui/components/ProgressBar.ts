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
	 * @class egret.gui.ProgressBar
	 * @classdesc
	 * 进度条控件。
	 * @extends egret.gui.Range
	 */
    export class ProgressBar extends Range {
		/**
		 * @method egret.gui.ProgressBar#constructor
		 */
        public constructor() {
            super();
            
        }

        /**
         * [SkinPart]进度高亮显示对象。
		 * @member egret.gui.ProgressBar#thumb
         */
        public thumb:DisplayObject = null;
        /**
         * [SkinPart]轨道显示对象，用于确定thumb要覆盖的区域。
		 * @member egret.gui.ProgressBar#track
         */
        public track: DisplayObject = null;
        /**
         * [SkinPart]进度条文本
		 * @member egret.gui.ProgressBar#labelDisplay
         */
        public labelDisplay: Label = null;

        private _labelFunction: Function = null;
        /**
         * 进度条文本格式化回调函数。示例：labelFunction(value:Number,maximum:Number):String;
		 * @member egret.gui.ProgressBar#labelFunction
         */
        public get labelFunction():Function {
            return this._labelFunction;
        }

        public set labelFunction(value:Function) {
            if (this._labelFunction == value)
                return;
            this._labelFunction = value;
            this.invalidateDisplayList();
        }

        /**
         * 将当前value转换成文本
		 * @method egret.gui.ProgressBar#valueToLabel
		 * @param value {number} 
		 * @param maximum {number} 
		 * @returns {string}
         */
        public valueToLabel(value:number, maximum:number):string {
            if (this.labelFunction != null) {
                return this._labelFunction(value, maximum);
            }
            return value + " / " + maximum;
        }

        private _slideDuration:number = 500;

        /**
         * value改变时调整thumb长度的缓动动画时间，单位毫秒。设置为0则不执行缓动。默认值500。
		 * @member egret.gui.ProgressBar#slideDuration
         */
        public get slideDuration():number {
            return this._slideDuration;
        }

        public set slideDuration(value:number) {
            if (this._slideDuration == value)
                return;
            this._slideDuration = value;
            if (this.animator && this.animator.isPlaying) {
                this.animator.stop();
                this._setValue(this.slideToValue);
            }
        }

        private _direction:string = ProgressBarDirection.LEFT_TO_RIGHT;
        /**
         * 进度条增长方向。请使用ProgressBarDirection定义的常量。默认值：ProgressBarDirection.LEFT_TO_RIGHT。
		 * @member egret.gui.ProgressBar#direction
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
         * 动画实例
         */
        private animator: Animation = null;
        /**
         * 动画播放结束时要到达的value。
         */
        private slideToValue:number = NaN;

        /**
         * 进度条的当前值。
         * 注意：当组件添加到显示列表后，若slideDuration不为0。设置此属性，并不会立即应用。而是作为目标值，开启缓动动画缓慢接近。
         * 若需要立即重置属性，请先设置slideDuration为0，或者把组件从显示列表移除。
		 * @member egret.gui.ProgressBar#value
         */
        public get value():number {
            return this._getValue();
        }

        public set value(newValue:number) {
            if (this._getValue() == newValue)
                return;
            this._setValue(newValue);
            if (this._slideDuration > 0 && this.stage) {
                this.validateProperties();//最大值最小值发生改变时要立即应用，防止当前起始值不正确。
                if (!this.animator) {
                    this.animator = new Animation(this.animationUpdateHandler,this);
                }
                if (this.animator.isPlaying) {
                    this.animationValue = this.slideToValue;
                    this.invalidateDisplayList();
                    this.animator.stop();
                }
                this.slideToValue = this.nearestValidValue(newValue, this.snapInterval);
                if (this.slideToValue == this.animationValue)
                    return;
                var duration:number = this._slideDuration *
                    (Math.abs(this.animationValue - this.slideToValue) / (this.maximum - this.minimum));
                this.animator.duration = duration === Infinity ? 0 : duration;
                this.animator.motionPaths = [
                    new SimpleMotionPath("value",this.animationValue,this.slideToValue)
                ];
                this.animator.play();
            }
            else{
                this.animationValue = this._getValue();
            }
        }

        private animationValue:number = 0;
        /**
         * 动画播放更新数值
         */
        private animationUpdateHandler(animation:Animation):void {
            var value:number = this.nearestValidValue(animation.currentValue["value"], this.snapInterval);
            this.animationValue = Math.min(this.maximum, Math.max(this.minimum, value));
            this.invalidateDisplayList();
        }

        /**
		 * @method egret.gui.ProgressBar#setValue
		 * @param value {number} 
         */
        public setValue(value:number):void {
            super.setValue(value);
            this.invalidateDisplayList();
        }

        /**
         * 绘制对象和/或设置其子项的大小和位置
		 * @method egret.gui.ProgressBar#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            this.updateSkinDisplayList();
        }

        /**
         * [覆盖] 添加外观部件时调用
         * @param partName
         * @param instance
         */
        public partAdded(partName:string, instance:any):void {
            if (instance == this.track) {
                if (this.track instanceof UIComponent) {
                    this.track.addEventListener(ResizeEvent.RESIZE, this.onTrackResizeOrMove, this);
                    this.track.addEventListener(MoveEvent.MOVE, this.onTrackResizeOrMove, this);
                }
            }
        }

        /**
         * [覆盖] 正删除外观部件的实例时调用
         * @param partName
         * @param instance
         */
        public partRemoved(partName:string, instance:any):void {
            if (instance == this.track) {
                if (this.track instanceof UIComponent) {
                    this.track.removeEventListener(ResizeEvent.RESIZE, this.onTrackResizeOrMove, this);
                    this.track.removeEventListener(MoveEvent.MOVE, this.onTrackResizeOrMove, this);
                }
            }
        }

        private trackResizedOrMoved:boolean = false;

        /**
         * track的位置或尺寸发生改变
         */
        private onTrackResizeOrMove(event:Event):void {
            this.trackResizedOrMoved = true;
            this.invalidateProperties();
        }

        /**
         * 处理对组件设置的属性
         */
        public commitProperties():void {
            super.commitProperties();
            if (this.trackResizedOrMoved) {
                this.trackResizedOrMoved = false;
                this.updateSkinDisplayList();
            }
        }

        /**
         * 更新皮肤部件大小和可见性。
		 * @method egret.gui.ProgressBar#updateSkinDisplayList
         */
        public updateSkinDisplayList():void {
            this.trackResizedOrMoved = false;
            var currentValue:number = this.value;
            if(this.animator&&this.animator.isPlaying){
                currentValue = this.animationValue;
            }
            else{
                currentValue = this.value;
                if(isNaN(currentValue)){
                    currentValue = 0;
                }
            }
            var maxValue:number = isNaN(this.maximum) ? 0 : this.maximum;
            if (this.thumb && this.track) {
                var trackWidth:number = isNaN(this.track.width) ? 0 : this.track.width;
                trackWidth *= this.track.scaleX;
                var trackHeight:number = isNaN(this.track.height) ? 0 : this.track.height;
                trackHeight *= this.track.scaleY;
                var thumbWidth:number = Math.round((currentValue / maxValue) * trackWidth);
                if (isNaN(thumbWidth) || thumbWidth < 0 || thumbWidth === Infinity)
                    thumbWidth = 0;
                var thumbHeight:number = Math.round((currentValue / maxValue) * trackHeight);
                if (isNaN(thumbHeight) || thumbHeight < 0 || thumbHeight === Infinity)
                    thumbHeight = 0;

                var p:Point = this.track.localToGlobal(0, 0);
                var thumbPos:Point = this.globalToLocal(p.x, p.y,Point.identity);
                var thumbPosX:number = thumbPos.x;
                var thumbPosY:number = thumbPos.y;

                switch (this._direction) {
                    case ProgressBarDirection.LEFT_TO_RIGHT:
                        this.thumb.width = thumbWidth;
                        this.thumb.height = trackHeight;
                        this.thumb.x = thumbPosX;
                        break;
                    case ProgressBarDirection.RIGHT_TO_LEFT:
                        this.thumb.width = thumbWidth;
                        this.thumb.height = trackHeight;
                        this.thumb.x = thumbPosX + trackWidth - thumbWidth;
                        break;
                    case ProgressBarDirection.TOP_TO_BOTTOM:
                        this.thumb.width = trackWidth;
                        this.thumb.height = thumbHeight;
                        this.thumb.y = thumbPosY;
                        break;
                    case ProgressBarDirection.BOTTOM_TO_TOP:
                        this.thumb.width = trackWidth;
                        this.thumb.height = thumbHeight;
                        this.thumb.y = thumbPosY + trackHeight - thumbHeight;
                        break;
                }

            }
            if (this.labelDisplay) {
                this.labelDisplay.text = this.valueToLabel(currentValue, maxValue);
            }
        }
    }
}