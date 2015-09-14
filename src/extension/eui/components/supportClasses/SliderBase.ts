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
     * @private
     */
    export const enum Keys {
        clickOffsetX,
        clickOffsetY,
        moveStageX,
        moveStageY,
        touchDownTarget,
        animation,
        slideDuration,
        pendingValue,
        slideToValue,
        liveDragging
    }

    /**
     * @language en_US
     * The SliderBase class lets users select a value by moving a slider thumb between
     * the end points of the slider track.
     * The current value of the slider is determined by the relative location of
     * the thumb between the end points of the slider,
     * corresponding to the slider's minimum and maximum values.
     * The SliderBase class is a base class for HSlider and VSlider.
     *
     * @see eui.HSlider
     * @see eui.VSlider
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 滑块控件基类，通过使用 SliderBase 类，用户可以在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     * SliderBase 类是 HSlider 和 VSlider 的基类。
     *
     * @see eui.HSlider
     * @see eui.VSlider
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class SliderBase extends Range {
        /**
         * @language en_US
         * Constructor
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 SliderBase 实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$SliderBase = {
                0: 0,        //clickOffsetX,
                1: 0,        //clickOffsetY,
                2: 0,        //moveStageX,
                3: 0,        //moveStageY,
                4: null,     //touchDownTarget
                5: null,     //animation,
                6: 300,      //slideDuration,
                7: 0,        //pendingValue
                8: 0,        //slideToValue,
                9: true,     //liveDragging
            };
            this.maximum = 10;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @private
         */
        $SliderBase:Object;

        /**
         * @language en_US
         * [SkinPart] Highlight of track.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [SkinPart] 轨道高亮显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public trackHighlight:egret.DisplayObject = null;
        /**
         * @language en_US
         * [SkinPart] Thumb display object.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [SkinPart]滑块显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public thumb:eui.UIComponent = null;

        /**
         * @language en_US
         * [SkinPart] Track display object.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [SkinPart]轨道显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public track:eui.UIComponent = null;

        /**
         * @language en_US
         * Duration in milliseconds for the sliding animation when you tap on the track to move a thumb.
         *
         * @default 300
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。设置为0将不执行缓动。
         *
         * @default 300
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get slideDuration():number {
            return this.$SliderBase[Keys.slideDuration];
        }

        public set slideDuration(value:number) {
            this.$SliderBase[Keys.slideDuration] = +value || 0;
        }

        /**
         * @language en_US
         * Converts a track-relative x,y pixel location into a value between
         * the minimum and maximum, inclusive.
         *
         * @param x The x coordinate of the location relative to the track's origin.
         * @param y The y coordinate of the location relative to the track's origin.
         * @return A value between the minimum and maximum, inclusive.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。
         *
         * @param x 相对于轨道原点的位置的x坐标。
         * @param y 相对于轨道原点的位置的y坐标。
         * @return 介于最小值和最大值（包括两者）之间的一个值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected pointToValue(x:number, y:number):number {
            return this.minimum;
        }

        /**
         * @language en_US
         * Specifies whether live dragging is enabled for the slider. If true, sets the value
         * and values properties and dispatches the change event continuously as
         * the user moves the thumb.
         *
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
         *
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get liveDragging():boolean {
            return this.$SliderBase[Keys.liveDragging];
        }

        public set liveDragging(value:boolean) {
            this.$SliderBase[Keys.liveDragging] = !!value;
        }


        /**
         * @language en_US
         * The value the slider will have when the touch is end.
         * This property is updated when the slider thumb moves, even if <code>liveDragging</code> is false.<p/>
         * If the <code>liveDragging</code> style is false, then the slider's value is only set
         * when the touch is end.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触摸结束时滑块将具有的值。
         * 无论 liveDragging 是否为 true，在滑块拖动期间始终更新此属性。
         * 而 value 属性在当 liveDragging 为 false 时，只在触摸释放时更新一次。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get pendingValue():number {
            return this.$SliderBase[Keys.pendingValue];
        }

        public set pendingValue(value:number) {
            value = +value || 0;
            var values = this.$SliderBase;
            if (value === values[Keys.pendingValue])
                return;
            values[Keys.pendingValue] = value;
            this.invalidateDisplayList();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setValue(value:number):void {
            this.$SliderBase[Keys.pendingValue] = value;
            super.setValue(value);
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

            if (instance == this.thumb) {
                this.thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance === this.trackHighlight) {
                this.trackHighlight.touchEnabled = false;
                if (egret.is(this.trackHighlight, "egret.DisplayObjectContainer")) {
                    (<egret.DisplayObjectContainer> this.trackHighlight).touchChildren = false;
                }
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

            if (instance == this.thumb) {
                this.thumb.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
        }

        /**
         * @private
         * 滑块或轨道尺寸改变事件
         */
        private onTrackOrThumbResize(event:egret.Event):void {
            this.updateSkinDisplayList();
        }


        /**
         * @language en_US
         * Handle touch-begin events on the scroll thumb. Records the touch begin point in clickOffset.
         *
         * @param The <code>egret.TouchEvent</code> object.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 滑块触摸开始事件，记录触碰开始的坐标偏移量。
         *
         * @param event 事件 <code>egret.TouchEvent</code> 的对象.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onThumbTouchBegin(event:egret.TouchEvent):void {
            var values = this.$SliderBase;
            if (values[Keys.animation] && values[Keys.animation].isPlaying)
                this.stopAnimation();

            var stage = this.$stage;
            stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);

            var clickOffset = this.thumb.globalToLocal(event.stageX, event.stageY, egret.$TempPoint);

            values[Keys.clickOffsetX] = clickOffset.x;
            values[Keys.clickOffsetY] = clickOffset.y;
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
        }

        /**
         * @private
         * 舞台上触摸移动事件
         */
        private onStageTouchMove(event:egret.TouchEvent):void {
            var values = this.$SliderBase;
            values[Keys.moveStageX] = event.$stageX;
            values[Keys.moveStageY] = event.$stageY;
            var track = this.track;
            if (!track)
                return;
            var p = track.globalToLocal(values[Keys.moveStageX], values[Keys.moveStageY], egret.$TempPoint);
            var newValue = this.pointToValue(p.x - values[Keys.clickOffsetX], p.y - values[Keys.clickOffsetY]);
            newValue = this.nearestValidValue(newValue, this.snapInterval);
            this.updateWhenTouchMove(newValue);
            event.updateAfterEvent();
        }

        /**
         * @language en_US
         * Capture touch-move events anywhere on or off the stage.
         * @param newValue new value
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 监听舞台的触碰移动事件。
         * @param newValue 新的值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateWhenTouchMove(newValue:number):void {
            if (newValue != this.$SliderBase[Keys.pendingValue]) {
                if (this.liveDragging) {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
                else {
                    this.pendingValue = newValue;
                }
            }
        }

        /**
         * @language en_US
         * Handle touch-end events anywhere on or off the stage.
         *
         * @param The <code>egret.Event</code> object.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触摸结束事件
         *
         * @param event 事件 <code>egret.Event</code> 的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onStageTouchEnd(event:egret.Event):void {
            var stage:egret.Stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
            var values = this.$SliderBase;
            if (!this.liveDragging && this.value != values[Keys.pendingValue]) {
                this.setValue(values[Keys.pendingValue]);
                this.dispatchEventWith(egret.Event.CHANGE);
            }
        }

        /**
         * @private
         * 当在组件上按下时记录被按下的子显示对象
         */
        private onTouchBegin(event:egret.TouchEvent):void {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            this.$SliderBase[Keys.touchDownTarget] = <egret.DisplayObject> (event.$target);
        }

        /**
         * @private
         * 当结束时，若不是在 touchDownTarget 上弹起，而是另外的子显示对象上弹起时，额外抛出一个触摸单击事件。
         */
        private stageTouchEndHandler(event:egret.TouchEvent):void {
            var target:egret.DisplayObject = event.$target;
            var values = this.$SliderBase;
            event.$currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            if (values[Keys.touchDownTarget] != target && this.contains(<egret.DisplayObject> (target))) {
                egret.TouchEvent.dispatchTouchEvent(this, egret.TouchEvent.TOUCH_TAP, true, true,
                    event.$stageX, event.$stageY, event.touchPointID);
            }
            values[Keys.touchDownTarget] = null;
        }


        /**
         * @private
         * 动画播放更新数值
         */
        $animationUpdateHandler(animation:sys.Animation):void {
            this.pendingValue = animation.currentValue;
        }

        /**
         * @private
         * 动画播放完毕
         */
        private animationEndHandler(animation:sys.Animation):void {
            this.setValue(this.$SliderBase[Keys.slideToValue]);
            this.dispatchEventWith(egret.Event.CHANGE);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
        }

        /**
         * @private
         * 停止播放动画
         */
        private stopAnimation():void {
            this.$SliderBase[Keys.animation].stop();
            this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
            this.dispatchEventWith(egret.Event.CHANGE);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
        }

        /**
         * @language en_US
         * Handle touch-begin events for the slider track. We
         * calculate the value based on the new position and then
         * move the thumb to the correct location as well as
         * commit the value.
         * @param The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 轨道的触碰开始事件。我们会在这里根据新的坐标位置计算value，然后移动滑块到当前位置。
         *
         * @param event 事件 <code>egret.TouchEvent</code> 的对象.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTrackTouchBegin(event:egret.TouchEvent):void {
            var thumbW = this.thumb ? this.thumb.width : 0;
            var thumbH = this.thumb ? this.thumb.height : 0;
            var offsetX = event.$stageX - (thumbW / 2);
            var offsetY = event.$stageY - (thumbH / 2);
            var p = this.track.globalToLocal(offsetX, offsetY, egret.$TempPoint);

            var rangeValues = this.$Range
            var newValue = this.pointToValue(p.x, p.y);
            newValue = this.nearestValidValue(newValue, rangeValues[sys.RangeKeys.snapInterval]);

            var values = this.$SliderBase;
            if (newValue != values[Keys.pendingValue]) {
                if (values[Keys.slideDuration] != 0) {
                    if (!values[Keys.animation]) {
                        values[Keys.animation] = new sys.Animation(this.$animationUpdateHandler, this);
                        values[Keys.animation].endFunction = this.animationEndHandler;
                    }
                    var animation = values[Keys.animation];
                    if (animation.isPlaying)
                        this.stopAnimation();
                    values[Keys.slideToValue] = newValue;
                    animation.duration = values[Keys.slideDuration] *
                        (Math.abs(values[Keys.pendingValue] - values[Keys.slideToValue]) / (rangeValues[sys.RangeKeys.maximum] - rangeValues[sys.RangeKeys.minimum]));
                    animation.from = values[Keys.pendingValue];
                    animation.to = values[Keys.slideToValue];
                    UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
                    animation.play();
                }
                else {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
        }

    }

}
