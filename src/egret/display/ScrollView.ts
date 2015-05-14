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
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可。可以在指定的尺寸范围内显示超过该范围的显示对象。并可以在此范围内随意拖动。
     * @extends egret.DisplayObjectContainer
     */
    export class ScrollView extends DisplayObjectContainer {
        private _lastTouchPosition: egret.Point = new Point(0, 0);
        private _touchStartPosition: egret.Point = new Point(0, 0);
        private _scrollStarted: boolean = false;
        private _lastTouchTime: number = 0;
        private _lastTouchEvent: TouchEvent = null;
        private _velocitys: Array<{ x: number; y: number }> = [];
        private _isHTweenPlaying: boolean = false;
        private _isVTweenPlaying: boolean = false;
        private _hScrollTween: Tween = null;
        private _vScrollTween: Tween = null;

        /**
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @member {number} egret.ScrollView#scrollBeginThreshold
         */
        public scrollBeginThreshold: number = 10;

        
        /**
         * 滚动速度，这个值为需要的速度与默认速度的比值。 
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @member {number} egret.ScrollView#scrollSpeed
         */
        public scrollSpeed: number = 1;
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
         */
        public removeContent():void {
            if (this._content) {
                this._removeEvents();
                super.removeChildAt(0);
            }
            this._content = null;
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
            this._validatePosition(false, true);
            this._updateContentPosition();
        }

        public _scrollTop: number = 0;
        /**
         * 获取或设置垂直滚动位置,
         * @member {number} egret.ScrollView#scrollTop
         * @returns {number}
         */
        public get scrollTop():number {
            return this._scrollTop;
        }
        public set scrollTop(value: number) {
            if (value == this._scrollTop)
                return;
            this._scrollTop = value;
            this._validatePosition(true, false);
            this._updateContentPosition();
        }
        
        /**
         * 设置滚动位置
         * @method egret.ScrollView#setScrollPosition
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         */
        public setScrollPosition(top: number, left: number, isOffset: boolean = false): void {
            if (isOffset && top == 0 && left == 0)
                return;
            if (!isOffset && this._scrollTop == top
                && this._scrollLeft == left)
                return;
            if (isOffset) {
                var isEdgeV = this._isOnTheEdge(true);
                var isEdgeH = this._isOnTheEdge(false);
                this._scrollTop += isEdgeV ? top / 2 : top;
                this._scrollLeft += isEdgeH ? left / 2 : left;
            }
            else {
                this._scrollTop = top;
                this._scrollLeft = left;
            }
            this._validatePosition(true, true);
            this._updateContentPosition();
        }

        private _isOnTheEdge(isVertical=true):boolean { 
            var top = this._scrollTop,
                left = this._scrollLeft;
            if (isVertical)
                return top < 0 || top > this.getMaxScrollTop();
            else
                return left < 0 || left > this.getMaxScrollLeft();
        }

        private _validatePosition(top = false,left = false):void {
            if (top) {
                var height = this.height;
                var contentHeight = this._getContentHeight();
                this._scrollTop = Math.max(this._scrollTop, (0 - height) / 2);
                this._scrollTop = Math.min(this._scrollTop, contentHeight > height ? (contentHeight - height / 2) : height / 2);
            }
            if (left) {
                var width = this.width;
                var contentWidth = this._getContentWidth();
                this._scrollLeft = Math.max(this._scrollLeft, (0 - width) / 2);
                this._scrollLeft = Math.min(this._scrollLeft, contentWidth > width ? (contentWidth - width / 2) : width / 2);
            }
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
        public _updateContentPosition():void {
            var size = this.getBounds(egret.Rectangle.identity);
            var height = size.height;
            var width = size.width;
            this.scrollRect = new Rectangle(this._scrollLeft, this._scrollTop, width, height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }
        public _hCanScroll:boolean = false;
        public _vCanScroll:boolean = false;
        public _checkScrollPolicy():boolean {
            var hpolicy = this._horizontalScrollPolicy;
            var hCanScroll = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
            this._hCanScroll = hCanScroll;
            var vpolicy = this._verticalScrollPolicy;
            var vCanScroll = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
            this._vCanScroll = vCanScroll;
            return hCanScroll || vCanScroll;
        }
        private __checkScrollPolicy(policy: string, contentLength, viewLength):boolean {
            if (policy == "on")
                return true;
            if (policy == "off")
                return false;
            return contentLength > viewLength;
        }
        

        public _addEvents(): void {
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.addEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        public _removeEvents(): void {
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        public _onTouchBegin(e: TouchEvent):void {
            if (e._isDefaultPrevented)
                return;
            var canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this._touchStartPosition.x = e.stageX;
            this._touchStartPosition.y = e.stageY;
            if (this._isHTweenPlaying || this._isVTweenPlaying) {
                this._onScrollFinished();
            }
            this.stage.addEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this.stage.addEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this.stage.addEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._logTouchEvent(e);
            e.preventDefault();
        }
        private delayTouchBeginEvent: TouchEvent = null;
        private touchBeginTimer: Timer = null;
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

        private _onTouchEndCapture(event: TouchEvent): void {
            if (!this.delayTouchBeginEvent) {
                return;
            }
            this._onTouchBeginTimer();
        }
        private _onTouchBeginTimer():void {
            this.touchBeginTimer.stop();
            var event: TouchEvent = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null;
            //Dispatch event only if the scroll view is still on the stage
            if(this.stage)
                this.dispatchPropagationEvent(event);
        }

        private dispatchPropagationEvent(event: TouchEvent): void {
            var list: Array<DisplayObject> = [];

            var target: DisplayObject = event._target;
            var scrollerIndex = 0;
            while (target) {
                if (target == this)
                    scrollerIndex = list.length;
                list.push(target);
                target = target.parent;
            }

            var captureList = list.slice(0, scrollerIndex);
            captureList = captureList.reverse();
            list = captureList.concat(list);
            var targetIndex = scrollerIndex;
            this._dispatchPropagationEvent(event, list, targetIndex);
        }

        
        public _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void {
            var length: number = list.length;
            for (var i: number = 0; i < length; i++) {
                var currentTarget: DisplayObject = list[i];
                event._currentTarget = currentTarget;
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

        public _onTouchMove(event: TouchEvent): void {
            if (this._lastTouchPosition.x == event.stageX && this._lastTouchPosition.y == event.stageY)
                return;
            if (!this._scrollStarted) {
                var x = event.stageX - this._touchStartPosition.x,
                    y = event.stageY - this._touchStartPosition.y;
                var distance = Math.sqrt(x * x + y * y);
                if (distance < this.scrollBeginThreshold) {
                    this._logTouchEvent(event);
                    return;
                }
            }
            this._scrollStarted = true;
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

        public _onTouchEnd(event: TouchEvent): void {
            this.touchChildren = true;
            this._scrollStarted = false;
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            egret.MainContext.instance.stage.removeEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.removeEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);
            
            this._moveAfterTouchEnd();
        }


        public _onEnterFrame(event: Event): void {
            var time = getTimer();
            if (time - this._lastTouchTime > 100 && time - this._lastTouchTime < 300) {
                this._calcVelocitys(this._lastTouchEvent);
            }
        }

        private _logTouchEvent(e: TouchEvent): void {
            this._lastTouchPosition.x = e.stageX;
            this._lastTouchPosition.y = e.stageY;
            this._lastTouchEvent = this.cloneTouchEvent(e);
            this._lastTouchTime = egret.getTimer();
        }

        private _getPointChange(e: TouchEvent): { x: number; y: number } {
            return {
                x: this._hCanScroll === false ? 0 : (this._lastTouchPosition.x - e.stageX),
                y: this._vCanScroll === false ? 0 : (this._lastTouchPosition.y - e.stageY)
            };
        }

        private _calcVelocitys(e: TouchEvent): void {
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
        public _getContentWidth():number {
            return this._content.explicitWidth || this._content.width;
        }
        public _getContentHeight(): number {
            return this._content.explicitHeight || this._content.height;
        }
        public getMaxScrollLeft(): number {
            var max = this._getContentWidth() - this.width;
            return Math.max(0, max);
        }
        public getMaxScrollTop(): number {
            var max = this._getContentHeight() - this.height;
            return Math.max(0, max);
        }
        private static weight = [1, 1.33, 1.66, 2, 2.33];
        private _moveAfterTouchEnd():void {
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

            if (this.scrollSpeed <= 0)
                this.scrollSpeed = 1;
            var x = sum.x / totalW * this.scrollSpeed, y = sum.y / totalW * this.scrollSpeed;
            var pixelsPerMSX = Math.abs(x), pixelsPerMSY = Math.abs(y);
            var maxLeft = this.getMaxScrollLeft();
            var maxTop = this.getMaxScrollTop();
            var datax = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._scrollLeft, maxLeft) : { position: this._scrollLeft,duration:1};
            var datay = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._scrollTop, maxTop) : { position: this._scrollTop, duration: 1 };
            this.setScrollLeft(datax.position, datax.duration);
            this.setScrollTop(datay.position, datay.duration);
        }

        public _onTweenFinished(tw: Tween) {
            if (tw == this._vScrollTween)
                this._isVTweenPlaying = false;
            if (tw == this._hScrollTween)
                this._isHTweenPlaying = false;
            if (this._isHTweenPlaying == false && this._isVTweenPlaying == false) {
                this._onScrollFinished();
            }
        }

        public _onScrollStarted(): void {

        }

        public _onScrollFinished(): void {
            Tween.removeTweens(this);
            this._hScrollTween = null;
            this._vScrollTween = null;
            this._isHTweenPlaying = false;
            this._isVTweenPlaying = false
            this.dispatchEvent(new Event(Event.COMPLETE));
        }
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
            this._isVTweenPlaying = true;
            this._vScrollTween = vtween;
            vtween.call(this._onTweenFinished, this, [vtween]);
            if(!this._isHTweenPlaying)
                this._onScrollStarted();
            return vtween;
        }
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
            this._isHTweenPlaying = true;
            this._hScrollTween = htween;
            htween.call(this._onTweenFinished, this, [htween]);
            if (!this._isVTweenPlaying)
                this._onScrollStarted();
            return htween;
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
                position: Math.min(maxPos + 50, Math.max(posTo, -50)),//允许越界50px
                duration: duration
            };
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
            throw new Error(getString(1023));
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

        public hitTest(x: number, y: number, ignoreTouchEnabled: boolean = false): DisplayObject {
            var childTouched = super.hitTest(x, y, ignoreTouchEnabled);
            if (childTouched)
                return childTouched;
            return DisplayObject.prototype.hitTest.call(this, x, y, ignoreTouchEnabled);
        }
    }
} 