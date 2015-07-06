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


module egret {
    /**
     * @class egret.ScrollView
     * @classdesc
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可。可以在指定的尺寸范围内显示超过该范围的显示对象。并可以在此范围内随意拖动。
     * @extends egret.DisplayObjectContainer
     * @version Egret 2.0
     * @platform Web,Native
     */
    export class ScrollView extends DisplayObjectContainer {

        /**
         * @private
         */
        public _ScrV_Props_:ScrollViewProperties;

        /**
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @member {number} egret.ScrollView#scrollBeginThreshold
         * @version Egret 2.0
         * @platform Web,Native
         */
        public scrollBeginThreshold: number = 10;


        /**
         * 滚动速度，这个值为需要的速度与默认速度的比值。
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @member {number} egret.ScrollView#scrollSpeed
         * @version Egret 2.0
         * @platform Web,Native
         */
        public scrollSpeed: number = 1;
        /**
         * 创建一个 egret.ScrollView 对象
         * @method egret.ScrollView#constructor
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.0
         * @platform Web,Native
         */
        constructor(content: DisplayObject = null) {
            super();
            this.touchEnabled = true;
            this._ScrV_Props_ = new egret.ScrollViewProperties();
            if (content) {
                this.setContent(content);
            }
        }
        /**
         * @private
         */
        public _content: DisplayObject = null;
        /**
         * 设置需要滚动的对象
         * @method egret.ScrollView#setContent
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.0
         * @platform Web,Native
         */
        public setContent(content: DisplayObject):void {
            if (this._content === content)
                return;
            this.removeContent();
            if (content) {
                this._content = content;
                super.addChild(content);
                this._addEvents();
            }
        }

        /**
         * 移除滚动的对象
         * @method egret.ScrollView#removeContent
         * @version Egret 2.0
         * @platform Web,Native
         */
        public removeContent():void {
            if (this._content) {
                this._removeEvents();
                super.removeChildAt(0);
            }
            this._content = null;
        }

        /**
         * 垂直滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#verticalScrollPolicy
         * @version Egret 2.0
         * @platform Web,Native
         */
        public get verticalScrollPolicy(): string {
            return this._ScrV_Props_._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._ScrV_Props_._verticalScrollPolicy)
                return;
            this._ScrV_Props_._verticalScrollPolicy = value;
        }


        /**
         * 水平滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#horizontalScrollPolicy
         * @version Egret 2.0
         * @platform Web,Native
         */
        public get horizontalScrollPolicy(): string {
            return this._ScrV_Props_._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value: string) {
            if (value == this._ScrV_Props_._horizontalScrollPolicy)
                return;
            this._ScrV_Props_._horizontalScrollPolicy = value;
        }

        /**
         * 获取或设置水平滚动位置,
         * @member {number} egret.ScrollView#scrollLeft
         * @returns {number}
         * @version Egret 2.0
         * @platform Web,Native
         */
        public get scrollLeft():number {
            return this._ScrV_Props_._scrollLeft;
        }
        public set scrollLeft(value: number) {
            if (value == this._ScrV_Props_._scrollLeft)
                return;
            this._ScrV_Props_._scrollLeft = value;
            this._validatePosition(false, true);
            this._updateContentPosition();
        }

        /**
         * 获取或设置垂直滚动位置,
         * @member {number} egret.ScrollView#scrollTop
         * @returns {number}
         * @version Egret 2.0
         * @platform Web,Native
         */
        public get scrollTop():number {
            return this._ScrV_Props_._scrollTop;
        }
        public set scrollTop(value: number) {
            if (value == this._ScrV_Props_._scrollTop)
                return;
            this._ScrV_Props_._scrollTop = value;
            this._validatePosition(true, false);
            this._updateContentPosition();
        }

        /**
         * 设置滚动位置
         * @method egret.ScrollView#setScrollPosition
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         * @version Egret 2.0
         * @platform Web,Native
         */
        public setScrollPosition(top: number, left: number, isOffset: boolean = false): void {
            if (isOffset && top == 0 && left == 0)
                return;
            if (!isOffset && this._ScrV_Props_._scrollTop == top
                && this._ScrV_Props_._scrollLeft == left)
                return;
            if (isOffset) {
                var isEdgeV = this._isOnTheEdge(true);
                var isEdgeH = this._isOnTheEdge(false);
                this._ScrV_Props_._scrollTop += isEdgeV ? top / 2 : top;
                this._ScrV_Props_._scrollLeft += isEdgeH ? left / 2 : left;
            }
            else {
                this._ScrV_Props_._scrollTop = top;
                this._ScrV_Props_._scrollLeft = left;
            }
            this._validatePosition(true, true);
            this._updateContentPosition();
        }

        /**
         * @private
         * 
         * @param isVertical 
         * @returns 
         */
        private _isOnTheEdge(isVertical=true):boolean {
            var top = this._ScrV_Props_._scrollTop,
                left = this._ScrV_Props_._scrollLeft;
            if (isVertical)
                return top < 0 || top > this.getMaxScrollTop();
            else
                return left < 0 || left > this.getMaxScrollLeft();
        }

        /**
         * @private
         * 
         * @param top 
         * @param left 
         */
        private _validatePosition(top = false,left = false):void {
            if (top) {
                var height = this.height;
                var contentHeight = this._getContentHeight();
                this._ScrV_Props_._scrollTop = Math.max(this._ScrV_Props_._scrollTop, (0 - height) / 2);
                this._ScrV_Props_._scrollTop = Math.min(this._ScrV_Props_._scrollTop, contentHeight > height ? (contentHeight - height / 2) : height / 2);
            }
            if (left) {
                var width = this.width;
                var contentWidth = this._getContentWidth();
                this._ScrV_Props_._scrollLeft = Math.max(this._ScrV_Props_._scrollLeft, (0 - width) / 2);
                this._ScrV_Props_._scrollLeft = Math.min(this._ScrV_Props_._scrollLeft, contentWidth > width ? (contentWidth - width / 2) : width / 2);
            }
        }

        /**
         * @private
         * @inheritDoc
         */
        public $setWidth(value: number): void {
            if (this.$getExplicitWidth() == value) {
                return;
            }

            super.$setWidth(value);
            this._updateContentPosition();
        }
        /**
         * @private
         * @inheritDoc
         */
        public $setHeight(value: number): void {
            if (this.$getExplicitHeight() == value)
                return;
            super.$setHeight(value);
            this._updateContentPosition();
        }
        /**
         * @private
         * 
         */
        public _updateContentPosition():void {
            var size = this.getBounds(egret.$TempRectangle);
            var height = size.height;
            var width = size.width;
            //这里将坐标取整，避免有些浏览器精度低产生“黑线”问题
            this.scrollRect = new Rectangle(Math.round(this._ScrV_Props_._scrollLeft), Math.round(this._ScrV_Props_._scrollTop), width, height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }
        /**
         * @private
         * 
         * @returns 
         */
        public _checkScrollPolicy():boolean {
            var hpolicy = this._ScrV_Props_._horizontalScrollPolicy;
            var hCanScroll = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
            this._ScrV_Props_._hCanScroll = hCanScroll;
            var vpolicy = this._ScrV_Props_._verticalScrollPolicy;
            var vCanScroll = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
            this._ScrV_Props_._vCanScroll = vCanScroll;
            return hCanScroll || vCanScroll;
        }
        /**
         * @private
         * 
         * @param policy 
         * @param contentLength 
         * @param viewLength 
         * @returns 
         */
        private __checkScrollPolicy(policy: string, contentLength, viewLength):boolean {
            if (policy == "on")
                return true;
            if (policy == "off")
                return false;
            return contentLength > viewLength;
        }


        /**
         * @private
         * 
         * @returns 
         */
        public _addEvents(): void {
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.addEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        /**
         * @private
         * 
         * @returns 
         */
        public _removeEvents(): void {
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        /**
         * @private
         * 
         * @param e 
         */
        public _onTouchBegin(e: TouchEvent):void {
            if (e.$isDefaultPrevented) {
                return;
            }
            var canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this._ScrV_Props_._touchStartPosition.x = e.stageX;
            this._ScrV_Props_._touchStartPosition.y = e.stageY;
            if (this._ScrV_Props_._isHTweenPlaying || this._ScrV_Props_._isVTweenPlaying) {
                this._onScrollFinished();
            }
            this.stage.addEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this.stage.addEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this.stage.addEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._logTouchEvent(e);
            e.preventDefault();
        }
        /**
         * @private
         */
        private delayTouchBeginEvent: TouchEvent = null;
        /**
         * @private
         */
        private touchBeginTimer: Timer = null;
        /**
         * @private
         * 
         * @param event 
         */
        public _onTouchBeginCapture(event: TouchEvent):void {
            var canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }

            var target: DisplayObject = event.target;
            while (target != this) {
                if ("_checkScrollPolicy" in target) {
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

        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        private _onTouchEndCapture(event: TouchEvent): void {
            if (!this.delayTouchBeginEvent) {
                return;
            }
            this._onTouchBeginTimer();
        }
        /**
         * @private
         * 
         */
        private _onTouchBeginTimer():void {
            this.touchBeginTimer.stop();
            var event: TouchEvent = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null;
            //Dispatch event only if the scroll view is still on the stage
            if(this.stage)
                this.dispatchPropagationEvent(event);
        }

        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        private dispatchPropagationEvent(event: TouchEvent): void {
            var target:egret.DisplayObject = event.$target;
            var list = this.$getPropagationList(target);
            var length = list.length;
            var targetIndex = list.length * 0.5;
            var startIndex = -1;
            for (var i = 0; i < length; i++) {
                if (list[i] === this._content) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, startIndex + 1);
            targetIndex -= startIndex + 1;
            this.$emitPropagationEvent(event, list, targetIndex);
            egret.Event.release(event);
        }

        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        public _onTouchMove(event: TouchEvent): void {
            if (this._ScrV_Props_._lastTouchPosition.x == event.stageX && this._ScrV_Props_._lastTouchPosition.y == event.stageY)
                return;
            if (!this._ScrV_Props_._scrollStarted) {
                var x = event.stageX - this._ScrV_Props_._touchStartPosition.x,
                    y = event.stageY - this._ScrV_Props_._touchStartPosition.y;
                var distance = Math.sqrt(x * x + y * y);
                if (distance < this.scrollBeginThreshold) {
                    this._logTouchEvent(event);
                    return;
                }
            }
            this._ScrV_Props_._scrollStarted = true;
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

        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        public _onTouchEnd(event: TouchEvent): void {
            this.touchChildren = true;
            this._ScrV_Props_._scrollStarted = false;
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.removeEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._moveAfterTouchEnd();
        }


        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        public _onEnterFrame(event: Event): void {
            var time = getTimer();
            if (time - this._ScrV_Props_._lastTouchTime > 100 && time - this._ScrV_Props_._lastTouchTime < 300) {
                this._calcVelocitys(this._ScrV_Props_._lastTouchEvent);
            }
        }

        /**
         * @private
         * 
         * @param e 
         * @returns 
         */
        private _logTouchEvent(e: TouchEvent): void {
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
            this._ScrV_Props_._lastTouchEvent = this.cloneTouchEvent(e);
            this._ScrV_Props_._lastTouchTime = egret.getTimer();
        }

        /**
         * @private
         * 
         * @param e 
         * @returns 
         */
        private _getPointChange(e: TouchEvent): { x: number; y: number } {
            return {
                x: this._ScrV_Props_._hCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.x - e.stageX),
                y: this._ScrV_Props_._vCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.y - e.stageY)
            };
        }

        /**
         * @private
         * 
         * @param e 
         * @returns 
         */
        private _calcVelocitys(e: TouchEvent): void {
            var time = getTimer();
            if (this._ScrV_Props_._lastTouchTime == 0) {
                this._ScrV_Props_._lastTouchTime = time;
                return;
            }
            var change = this._getPointChange(e);
            var timeoffset = time - this._ScrV_Props_._lastTouchTime;
            change.x /= timeoffset;
            change.y /= timeoffset;
            this._ScrV_Props_._velocitys.push(change);
            if (this._ScrV_Props_._velocitys.length > 5)
                this._ScrV_Props_._velocitys.shift();
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
        }
        /**
         * @private
         * 
         * @returns 
         */
        public _getContentWidth():number {
            return this._content.$getExplicitWidth() || this._content.width;
        }
        /**
         * @private
         * 
         * @returns 
         */
        public _getContentHeight(): number {
            return this._content.$getExplicitHeight() || this._content.height;
        }
        /**
         * 
         * @returns 
         * @version Egret 2.0
         * @platform Web,Native
         */
        public getMaxScrollLeft(): number {
            var max = this._getContentWidth() - this.width;
            return Math.max(0, max);
        }
        /**
         * 
         * @returns 
         * @version Egret 2.0
         * @platform Web,Native
         */
        public getMaxScrollTop(): number {
            var max = this._getContentHeight() - this.height;
            return Math.max(0, max);
        }
        /**
         * @private
         */
        private static weight = [1, 1.33, 1.66, 2, 2.33];
        /**
         * @private
         * 
         */
        private _moveAfterTouchEnd():void {
            if (this._ScrV_Props_._velocitys.length == 0)
                return;
            var sum = { x: 0, y: 0 }, totalW = 0;
            for (var i = 0; i < this._ScrV_Props_._velocitys.length; i++) {
                var v = this._ScrV_Props_._velocitys[i];
                var w = ScrollView.weight[i];
                sum.x += v.x * w;
                sum.y += v.y * w;
                totalW += w;
            }
            this._ScrV_Props_._velocitys.length = 0;

            if (this.scrollSpeed <= 0)
                this.scrollSpeed = 1;
            var x = sum.x / totalW * this.scrollSpeed, y = sum.y / totalW * this.scrollSpeed;
            var pixelsPerMSX = Math.abs(x), pixelsPerMSY = Math.abs(y);
            var maxLeft = this.getMaxScrollLeft();
            var maxTop = this.getMaxScrollTop();
            var datax = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._ScrV_Props_._scrollLeft, maxLeft) : { position: this._ScrV_Props_._scrollLeft,duration:1};
            var datay = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._ScrV_Props_._scrollTop, maxTop) : { position: this._ScrV_Props_._scrollTop, duration: 1 };
            this.setScrollLeft(datax.position, datax.duration);
            this.setScrollTop(datay.position, datay.duration);
        }

        /**
         * @private
         * 
         * @param tw 
         */
        public _onTweenFinished(tw: Tween) {
            if (tw == this._ScrV_Props_._vScrollTween)
                this._ScrV_Props_._isVTweenPlaying = false;
            if (tw == this._ScrV_Props_._hScrollTween)
                this._ScrV_Props_._isHTweenPlaying = false;
            if (this._ScrV_Props_._isHTweenPlaying == false && this._ScrV_Props_._isVTweenPlaying == false) {
                this._onScrollFinished();
            }
        }

        /**
         * @private
         * 
         * @returns 
         */
        public _onScrollStarted(): void {

        }

        /**
         * @private
         * 
         * @returns 
         */
        public _onScrollFinished(): void {
            Tween.removeTweens(this);
            this._ScrV_Props_._hScrollTween = null;
            this._ScrV_Props_._vScrollTween = null;
            this._ScrV_Props_._isHTweenPlaying = false;
            this._ScrV_Props_._isVTweenPlaying = false
            this.dispatchEvent(new Event(Event.COMPLETE));
        }
        /**
         * 
         * @param scrollTop 
         * @param duration 
         * @returns 
         * @version Egret 2.0
         * @platform Web,Native
         */
        public setScrollTop(scrollTop: number, duration: number = 0): egret.Tween {
            var finalPosition = Math.min(this.getMaxScrollTop(), Math.max(scrollTop, 0));
            if (duration == 0) {
                this.scrollTop = finalPosition;
                return null;
            }
            var vtween = egret.Tween.get(this).to({ scrollTop: scrollTop }, duration, egret.Ease.quartOut);
            if (finalPosition != scrollTop) {
                vtween.to({ scrollTop: finalPosition }, 300, egret.Ease.quintOut);
            }
            this._ScrV_Props_._isVTweenPlaying = true;
            this._ScrV_Props_._vScrollTween = vtween;
            vtween.call(this._onTweenFinished, this, [vtween]);
            if(!this._ScrV_Props_._isHTweenPlaying)
                this._onScrollStarted();
            return vtween;
        }
        /**
         * 
         * @param scrollLeft 
         * @param duration 
         * @returns 
         * @version Egret 2.0
         * @platform Web,Native
         */
        public setScrollLeft(scrollLeft: number, duration: number = 0): egret.Tween {
            var finalPosition = Math.min(this.getMaxScrollLeft(), Math.max(scrollLeft, 0));
            if (duration == 0) {
                this.scrollLeft = finalPosition;
                return null;
            }
            var htween = egret.Tween.get(this).to({ scrollLeft: scrollLeft }, duration, egret.Ease.quartOut);
            if (finalPosition != scrollLeft) {
                htween.to({ scrollLeft: finalPosition }, 300, egret.Ease.quintOut);
            }
            this._ScrV_Props_._isHTweenPlaying = true;
            this._ScrV_Props_._hScrollTween = htween;
            htween.call(this._onTweenFinished, this, [htween]);
            if (!this._ScrV_Props_._isVTweenPlaying)
                this._onScrollStarted();
            return htween;
        }

        /**
         * @private
         * 
         * @param pixelsPerMS 
         * @param curPos 
         * @param maxPos 
         * @returns 
         */
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
                position: Math.min(maxPos + 50, Math.max(posTo, -50)),//允许越界50px
                duration: duration
            };
            return result;
        }
        /**
         * @private
         * 
         * @param event 
         * @returns 
         */
        private cloneTouchEvent(event: TouchEvent): TouchEvent {
            var evt: TouchEvent = new TouchEvent(event.type, event.bubbles, event.cancelable);
            evt.touchPointID = event.touchPointID
            evt.$stageX = event.stageX;
            evt.$stageY = event.stageY;
            //evt.ctrlKey = event.ctrlKey;
            //evt.altKey = event.altKey;
            //evt.shiftKey = event.shiftKey;
            evt.touchDown = event.touchDown;
            evt.$isDefaultPrevented = false;
            evt.$target = event.target;
            return evt;
        }

        /**
         * @private
         * 
         * @returns 
         */
        private throwNotSupportedError(): void {
            throw new Error(getString(1023));
        }

        /**
         * @method egret.ScrollView#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         * @version Egret 2.0
         * @platform Web,Native
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
         * @version Egret 2.0
         * @platform Web,Native
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
         * @version Egret 2.0
         * @platform Web,Native
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
         * @version Egret 2.0
         * @platform Web,Native
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
         * @version Egret 2.0
         * @platform Web,Native
         */
        public setChildIndex(child: DisplayObject, index: number): void {
            this.throwNotSupportedError();
        }
        /**
         * @method egret.ScrollView#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         * @version Egret 2.0
         * @platform Web,Native
         */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
            this.throwNotSupportedError();
        }
        /**
         * @method egret.ScrollView#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         * @version Egret 2.0
         * @platform Web,Native
         */
        public swapChildrenAt(index1: number, index2: number): void {
            this.throwNotSupportedError();
        }

    }
}