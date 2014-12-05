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

module egret {

    /**
     * @class egret.ScrollView
     * @classdesc
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可
     * @extends egret.DisplayObjectContainer
     */
    export class ScrollView extends DisplayObjectContainer {
        private _lastTouchPosition: egret.Point = new Point(0, 0);
        private _lastTouchTime: number = 0;
        private _lastTouchEvent: TouchEvent = null;
        private _velocitys: Array<{ x: number; y: number }> = [];
        
        /**
         * 创建一个 egret.ScrollView 对象
		 * @method egret.ScrollView#constructor
         * @param content {egret.DisplayObject} 需要滚动的对象
         */
        constructor(content: DisplayObject = null) {
            super();
            this.touchEnabled = true;
            if (content) {
                this.setContent(content);
            }
        }
        public _content: DisplayObject = null;
        /**
         * 设置需要滚动的对象
		 * @method egret.ScrollView#setContent
         * @param content {egret.DisplayObject} 需要滚动的对象
         */
        public setContent(content: DisplayObject) {
            if (this._content) {
                this._removeEvents();
                super.removeChildAt(0);
            }
            this._content = content;
            super.addChild(content);
            this._addEvents();
            var w = this._explicitWidth || this._getContentWidth();
            var h = this._explicitHeight || this._getContentHeight();
            //this.scrollRect = new Rectangle(0, 0, w, h);
        }

        private _verticalScrollPolicy: string = "auto";
        /**
         * 垂直滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#verticalScrollPolicy
         */
        public get verticalScrollPolicy(): string {
            return this._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._verticalScrollPolicy)
                return;
            this._verticalScrollPolicy = value;
        }

        private _horizontalScrollPolicy: string = "auto";

        /**
         * 水平滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy(): string {
            return this._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == this._horizontalScrollPolicy)
                return;
            this._horizontalScrollPolicy = value;
        }

        public _scrollLeft = 0;
        /**
         * 获取或设置水平滚动位置,
         * @member {number} egret.ScrollView#scrollLeft
         * @returns {number}
         */
        public get scrollLeft():number {
            return this._scrollLeft;
        }
        public set scrollLeft(value: number) {
            if (value == this._scrollLeft)
                return;
            this._scrollLeft = value;
            this._updateContentPosition();
        }

        public _scrollTop = 0;
        /**
         * 获取或设置垂直滚动位置,
         * @member {number} egret.ScrollView#scrollTop
         * @returns {number}
         */
        public get scrollTop() {
            return this._scrollTop;
        }
        public set scrollTop(value: number) {
            if (value == this._scrollTop)
                return;
            this._scrollTop = value;
            this._updateContentPosition();
        }
        
        /**
         * 设置滚动位置
         * @method egret.ScrollView#setScrollPosition
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         */
        public setScrollPosition(top: number, left: number, isOffset= false) {
            if (isOffset && top == 0 && left == 0)
                return;
            if (!isOffset && this._scrollTop == top
                && this._scrollLeft == left)
                return;
            if (isOffset) {
                this._scrollTop += top;
                this._scrollLeft += left;
            }
            else {
                this._scrollTop = top;
                this._scrollLeft = left;
            }
            this._updateContentPosition();
        }

        /**
         * @inheritDoc
         */
        public _setWidth(value: number): void {
            if (this._explicitWidth == value)
                return;
            super._setWidth(value);
            this._updateContentPosition();
        }
        /**
         * @inheritDoc
         */
        public _setHeight(value: number): void {
            if (this._explicitHeight == value)
                return;
            super._setHeight(value);
            this._updateContentPosition();
        }
        public _updateContentPosition() {
            this.scrollRect = new Rectangle(this._scrollLeft, this._scrollTop, this.width, this.height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }
        private _hCanScroll = false;
        private _vCanScroll = false;
        private _checkScrollPolicy() {
            var hpolicy = this._horizontalScrollPolicy;
            var hCanScroll = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
            this._hCanScroll = hCanScroll;
            var vpolicy = this._verticalScrollPolicy;
            var vCanScroll = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
            this._vCanScroll = vCanScroll;
            return hCanScroll || vCanScroll;
        }
        private __checkScrollPolicy(policy: string, contentLength, viewLength) {
            if (policy == "on")
                return true;
            if (policy == "off")
                return false;
            return contentLength > viewLength;
        }
        

        public _addEvents() {
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.addEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        public _removeEvents() {
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        public _onTouchBegin(e: TouchEvent) {
            if (e._isDefaultPrevented)
                return;
            Tween.removeTweens(this);
            this.stage.addEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this.stage.addEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this.stage.addEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._logTouchEvent(e);
            e.preventDefault();
        }
        delayTouchBeginEvent;
        touchBeginTimer;
        public _onTouchBeginCapture(event: TouchEvent) {
            var canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }

            var target: DisplayObject = event.target;
            while (target != this) {
                if (target instanceof ScrollView) {
                    canScroll = (<ScrollView><any> target)._checkScrollPolicy();
                    if (canScroll) {
                        return;
                    }
                }
                target = target.parent;
            }
            event.stopPropagation();
            var evt: TouchEvent = this.cloneTouchEvent(event);
            this.delayTouchBeginEvent = evt;
            if (!this.touchBeginTimer) {
                this.touchBeginTimer = new egret.Timer(100, 1);
                this.touchBeginTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this._onTouchBeginTimer, this);
            }
            this.touchBeginTimer.start();
            this._onTouchBegin(event);
        }

        private _onTouchEndCapture(event: TouchEvent): void {
            if (!this.delayTouchBeginEvent) {
                return;
            }
            this._onTouchBeginTimer();
        }
        private _onTouchBeginTimer() {
            this.touchBeginTimer.stop();
            var event: TouchEvent = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null;
            this.dispatchPropagationEvent(event);
        }

        private dispatchPropagationEvent(event: TouchEvent): void {
            var list: Array<DisplayObject> = [];

            var target: DisplayObject = event._target;
            while (target) {
                list.push(target);
                target = target.parent;
            }

            var content = this._content;
            for (var i: number = 1; ; i += 2) {
                target = list[i];
                if (!target || target === content) {
                    break;
                }
                list.unshift(target);
            }
            this._dispatchPropagationEvent(event, list);
        }

        //todo 此处代码是为了兼容之前的实现，应该尽快更优化的实现后删除
        public _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void {
            var length: number = list.length;
            for (var i: number = 0; i < length; i++) {
                var currentTarget: DisplayObject = list[i];
                event._currentTarget = currentTarget;
                event._target = this;
                if (i < targetIndex)
                    event._eventPhase = 1;
                else if (i == targetIndex)
                    event._eventPhase = 2;
                else
                    event._eventPhase = 3;
                currentTarget._notifyListener(event);
                if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
                    break;
                }
            }
        }

        public _onTouchMove(event: TouchEvent) {
            if (this._lastTouchPosition.x == event.stageX && this._lastTouchPosition.y == event.stageY)
                return;
            if (this.delayTouchBeginEvent) {
                this.delayTouchBeginEvent = null;
                this.touchBeginTimer.stop();
            }
            this.touchChildren = false;   
            var offset = this._getPointChange(event);
            this.setScrollPosition(offset.y, offset.x, true);
            this._calcVelocitys(event);
            this._logTouchEvent(event);
        }

        public _onTouchEnd(event: TouchEvent) {
            this.touchChildren = true;
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.removeEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);
            
            this._moveAfterTouchEnd();
        }


        public _onEnterFrame(event: Event) {
            var time = getTimer();
            if (time - this._lastTouchTime > 100 && time - this._lastTouchTime < 300) {
                this._calcVelocitys(this._lastTouchEvent);
            }
        }

        private _logTouchEvent(e: TouchEvent) {
            this._lastTouchPosition.x = e.stageX;
            this._lastTouchPosition.y = e.stageY;
            this._lastTouchEvent = this.cloneTouchEvent(e);
            this._lastTouchTime = egret.getTimer();
        }

        private _getPointChange(e: TouchEvent) {
            return {
                x: this._hCanScroll === false ? 0 : (this._lastTouchPosition.x - e.stageX),
                y: this._vCanScroll === false ? 0 : (this._lastTouchPosition.y - e.stageY)
            };
        }

        private _calcVelocitys(e: TouchEvent) {
            var time = getTimer();
            if (this._lastTouchTime == 0) {
                this._lastTouchTime = time;
                return;
            }
            var change = this._getPointChange(e);
            var timeoffset = time - this._lastTouchTime;
            change.x /= timeoffset;
            change.y /= timeoffset;
            this._velocitys.push(change);
            if (this._velocitys.length > 5)
                this._velocitys.shift();
            this._lastTouchPosition.x = e.stageX;
            this._lastTouchPosition.y = e.stageY;
        }
        public _getContentWidth() {
            return this._content.explicitWidth || this._content.width;
        }
        public _getContentHeight() {
            return this._content.explicitHeight || this._content.height;
        }
        public getMaxScrollLeft() {
            var max = this._getContentWidth() - this.width;
            return Math.max(0, max);
        }
        public getMaxScrollTop() {
            var max = this._getContentHeight() - this.height;
            return Math.max(0, max);
        }
        static weight = [1, 1.33, 1.66, 2, 2.33];
        private _moveAfterTouchEnd() {
            if (this._velocitys.length == 0)
                return;
            var sum = { x: 0, y: 0 }, totalW = 0;
            for (var i = 0; i < this._velocitys.length; i++) {
                var v = this._velocitys[i];
                var w = ScrollView.weight[i];
                sum.x += v.x * w;
                sum.y += v.y * w;
                totalW += w;
            }
            this._velocitys.length = 0;

            var x = sum.x / totalW, y = sum.y / totalW;
            var pixelsPerMSX = Math.abs(x), pixelsPerMSY = Math.abs(y);
            var maxLeft = this.getMaxScrollLeft();
            var maxTop = this.getMaxScrollTop();
            var datax = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._scrollLeft, maxLeft) : { position: this._scrollLeft,duration:1};
            var datay = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._scrollTop, maxTop) : { position: this._scrollTop, duration: 1 };
            this.setScrollLeft(datax.position, datax.duration);
            this.setScrollTop(datay.position, datay.duration);
        }

        public setScrollTop(scrollTop: number, duration: number = 0): egret.Tween {
            var finalPosition = Math.min(this.getMaxScrollTop(), Math.max(scrollTop, 0));
            if (duration == 0) {
                this.scrollTop = finalPosition;
                return null;
            }
            var twy = egret.Tween.get(this).to({ scrollTop: scrollTop }, duration, egret.Ease.quartOut);
            if (finalPosition != scrollTop) {
                twy.to({ scrollTop: finalPosition }, 300, egret.Ease.quintOut);
            }
        }
        public setScrollLeft(scrollLeft: number, duration: number = 0): egret.Tween {
            var finalPosition = Math.min(this.getMaxScrollLeft(), Math.max(scrollLeft, 0));
            if (duration == 0) {
                this.scrollLeft = finalPosition;
                return null;
            }
            var tw = egret.Tween.get(this).to({ scrollLeft: scrollLeft }, duration, egret.Ease.quartOut);
            if (finalPosition != scrollLeft) {
                tw.to({ scrollLeft: finalPosition }, 300, egret.Ease.quintOut);
            }
        }

        private getAnimationDatas(pixelsPerMS: number, curPos: number, maxPos: number): { position: number; duration: number } {
            var absPixelsPerMS: number = Math.abs(pixelsPerMS);
            var extraFricition: number = 0.95;
            var duration: number = 0;
            var friction: number = 0.998;
            var minVelocity: number = 0.02;
            var posTo: number = curPos + pixelsPerMS * 500;
            if (posTo < 0 || posTo > maxPos) {
                posTo = curPos;
                while (Math.abs(pixelsPerMS)!=Infinity && Math.abs(pixelsPerMS) > minVelocity) {
                    posTo += pixelsPerMS;
                    if (posTo < 0 || posTo > maxPos) {
                        pixelsPerMS *= friction * extraFricition;
                    }
                    else {
                        pixelsPerMS *= friction;
                    }
                    duration++;
                }
            }
            else {
                duration = - Math.log(minVelocity / absPixelsPerMS) * 500;
            }

            var result = {
                position: Math.min(maxPos+50, Math.max(posTo, -50)),//允许越界50px
                duration : duration
            }
            return result;
        }
        private cloneTouchEvent(event: TouchEvent): TouchEvent {
            var evt: TouchEvent = new TouchEvent(event._type, event._bubbles, event.cancelable);
            evt.touchPointID = event.touchPointID
            evt._stageX = event._stageX;
            evt._stageY = event._stageY;
            evt.ctrlKey = event.ctrlKey;
            evt.altKey = event.altKey;
            evt.shiftKey = event.shiftKey;
            evt.touchDown = event.touchDown;
            evt._isDefaultPrevented = false;
            evt._target = event._target;
            return evt;
        }

        private throwNotSupportedError(): void {
            throw new Error("此方法在ScrollView内不可用!");
        }

        /**
         * @method egret.ScrollView#addChild
         * @deprecated
         * @param child {DisplayObject} 
         * @returns {DisplayObject}
         */
        public addChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @method egret.ScrollView#addChildAt
         * @deprecated
         * @param child {DisplayObject} 
         * @param index {number} 
         * @returns {DisplayObject}
         */
        public addChildAt(child: DisplayObject, index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @method egret.ScrollView#removeChild
         * @deprecated
         * @param child {DisplayObject} 
         * @returns {DisplayObject}
         */
        public removeChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @method egret.ScrollView#removeChildAt
         * @deprecated
         * @param index {number} 
         * @returns {DisplayObject}
         */
        public removeChildAt(index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @method egret.ScrollView#setChildIndex
         * @deprecated
         * @param child {DisplayObject} 
         * @param index {number} 
         */
        public setChildIndex(child: DisplayObject, index: number): void {
            this.throwNotSupportedError();
        }
        /**
         * @method egret.ScrollView#swapChildren
         * @deprecated
         * @param child1 {DisplayObject} 
         * @param child2 {DisplayObject} 
         */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
            this.throwNotSupportedError();
        }
        /**
         * @method egret.ScrollView#swapChildrenAt
         * @deprecated
         * @param index1 {number} 
         * @param index2 {number} 
         */
        public swapChildrenAt(index1: number, index2: number): void {
            this.throwNotSupportedError();
        }
    }
} 