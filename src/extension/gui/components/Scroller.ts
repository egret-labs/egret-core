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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../egret/utils/getTimer.ts"/>
/// <reference path="supportClasses/Animation.ts"/>
/// <reference path="../core/IViewport.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../core/UIGlobals.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.Scroller
	 * @classdesc
	 * 滚动条组件
	 * @extends ns_egret.UIComponent
	 * @implements ns_egret.IVisualElementContainer
	 */	
    export class Scroller extends UIComponent implements IVisualElementContainer{
        /**
         * 构造函数
		 * @method ns_egret.Scroller#constructor
         */
        public constructor(){
            super();
        }

        /**
		 * @method ns_egret.Scroller#measure
         */
        public measure():void{
            if(!this._viewport)
                return;
            this.measuredWidth = this._viewport.preferredWidth;
            this.measuredHeight = this._viewport.preferredHeight;
        }
        /**
		 * @method ns_egret.Scroller#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            this._viewport.setLayoutBoundsSize(unscaledWidth,unscaledHeight);
        }

        private _verticalScrollPolicy:string = "auto";

        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member ns_egret.Scroller#verticalScrollPolicy
         */
        public get verticalScrollPolicy():string
        {
            return this._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value:string){
            this._verticalScrollPolicy = value;
        }

        private _horizontalScrollPolicy:string = "auto";

        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
		 * @member ns_egret.Scroller#horizontalScrollPolicy
         */
        public get horizontalScrollPolicy():string
        {
            return this._horizontalScrollPolicy;
        }
        public set horizontalScrollPolicy(value:string){
            this._horizontalScrollPolicy = value;
        }

        private _viewport:IViewport;

        /**
         * 要滚动的视域组件。
		 * @member ns_egret.Scroller#viewport
         */
        public get viewport():IViewport{
            return this._viewport;
        }
        public set viewport(value:IViewport){
            if (value == this._viewport)
                return;

            this.uninstallViewport();
            this._viewport = value;
            this.installViewport();
            this.dispatchEventWith("viewportChanged");
        }

        /**
         * 安装并初始化视域组件
         */
        private installViewport():void{
            if (this.viewport){
                this.viewport.clipAndEnableScrolling = true;
                this.viewport.addEventListener(TouchEvent.TOUCH_BEGAN,this.onTouchBegan,this)
                this._addToDisplayListAt(<DisplayObject><any> this.viewport,0);
            }
        }

        /**
         * 卸载视域组件
         */
        private uninstallViewport():void{
            if (this.viewport){
                this.viewport.clipAndEnableScrolling = false;
                this.viewport.removeEventListener(TouchEvent.TOUCH_BEGAN,this.onTouchBegan,this)
                this._removeFromDisplayList(<DisplayObject><any> this.viewport);
            }
        }
        /**
         * 鼠标按下时的偏移量
         */
        private _offsetPointX:number;
        private _offsetPointY:number;

        private _horizontalCanScroll:boolean;
        private _verticalCanScroll:boolean;

        private checkScrollPolicy():void{
            var viewport:IViewport = this._viewport;
            switch (this._horizontalScrollPolicy){
                case "auto":
                    if(viewport.contentWidth>viewport.width){
                        this._horizontalCanScroll = true;
                    }
                    else{
                        this._horizontalCanScroll = false;
                    }
                    break;
                case "on":
                    this._horizontalCanScroll = true;
                    break;
                case "off":
                    this._horizontalCanScroll = false;
                    break;
            }
            switch (this._verticalScrollPolicy){
                case "auto":
                    if(viewport.contentHeight>viewport.height){
                        this._verticalCanScroll = true;
                    }
                    else{
                        this._verticalCanScroll = false;
                    }
                    break;
                case "on":
                    this._verticalCanScroll = true;
                    break;
                case "off":
                    this._verticalCanScroll = false;
                    break;
            }
        }

        private onTouchBegan(event:TouchEvent):void{
            if (this.verticalAnimator&&this.verticalAnimator.isPlaying)
                this.verticalAnimator.stop();
            if (this.horizontalAnimator&&this.horizontalAnimator.isPlaying)
                this.horizontalAnimator.stop();
            this.checkScrollPolicy();
            var viewport:IViewport = this._viewport;
            var hsp:number = viewport.horizontalScrollPosition;
            var vsp:number = viewport.verticalScrollPosition;
            this._offsetPointX = hsp + event.stageX;
            this._offsetPointY = vsp + event.stageY;

            this._velocityX = 0;
            this._velocityY = 0;
            this._previousVelocityX.length = 0;
            this._previousVelocityY.length = 0;
            this._previousTouchTime = getTimer();
            this._previousTouchX = this._startTouchX = this._currentTouchX = event.stageX;
            this._previousTouchY = this._startTouchY = this._currentTouchY = event.stageY;
            this._startHorizontalScrollPosition = hsp;
            this._startVerticalScrollPosition = vsp;

            UIGlobals.stage.addEventListener(
                TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            UIGlobals.stage.addEventListener(
                TouchEvent.TOUCH_END, this.onTouchEnd, this);
            UIGlobals.stage.addEventListener(
                Event.LEAVE_STAGE, this.onTouchEnd, this);
            this.addEventListener(Event.ENTER_FRAME,
                this.enterFrameHandler, this);
        }

        private onTouchMove(event:TouchEvent):void{
            this._currentTouchX = event.stageX;
            this._currentTouchY = event.stageY;

            var viewport:IViewport = this._viewport;
            if(this._horizontalCanScroll){
                var hsp:number = this._offsetPointX - event.stageX;
                if(hsp<0){
                    hsp *= 0.5;
                }
                if(hsp>viewport.contentWidth-viewport.width){
                    hsp = (hsp+viewport.contentWidth-viewport.width)*0.5
                }
                viewport.horizontalScrollPosition = hsp;
            }

            if(this._verticalCanScroll){
                var vsp:number = this._offsetPointY - event.stageY;
                if(vsp<0){
                    vsp *= 0.5;
                }
                if(vsp>viewport.contentHeight-viewport.height){
                    vsp = (vsp+viewport.contentHeight-viewport.height)*0.5;
                }
                viewport.verticalScrollPosition = vsp;
            }
        }

        private onTouchEnd(event:Event):void{
            UIGlobals.stage.removeEventListener(
                TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            UIGlobals.stage.removeEventListener(
                TouchEvent.TOUCH_END, this.onTouchEnd, this);
            UIGlobals.stage.removeEventListener(
                Event.LEAVE_STAGE, this.onTouchEnd, this);
            this.removeEventListener(Event.ENTER_FRAME,
                this.enterFrameHandler, this);

            if(this._horizontalCanScroll){
                this.checkHorizontalScrollPosition();
            }
            if(this._verticalCanScroll){
                this.checkVerticalScrollPosition();
            }
        }


        private static VELOCITY_WEIGHTS:Array<number> = [1, 1.33, 1.66, 2];

        private static easeOut(ratio:number):number
        {
            var invRatio:number = ratio - 1.0;
            return invRatio * invRatio * invRatio + 1;
        }

        private _previousTouchTime:number;
        private _velocityX:number = 0;
        private _velocityY:number = 0;
        private _previousVelocityX:Array<number> = [];
        private _previousVelocityY:Array<number> = [];
        private _currentTouchX:number;
        private _currentTouchY:number;
        private _previousTouchX:number;
        private _previousTouchY:number;
        public _startTouchX:number;
        public _startTouchY:number;
        public _startHorizontalScrollPosition:number;
        public _startVerticalScrollPosition:number;

        private enterFrameHandler(event:Event):void{
            var now:number = getTimer();
            var maxVelocityCount:number = 4;
            var timeOffset:number = now - this._previousTouchTime;
            if(timeOffset > 0){
                this._previousVelocityX[this._previousVelocityX.length] = this._velocityX;
                if(this._previousVelocityX.length > maxVelocityCount){
                    this._previousVelocityX.shift();
                }
                this._previousVelocityY[this._previousVelocityY.length] = this._velocityY;
                if(this._previousVelocityY.length > maxVelocityCount){
                    this._previousVelocityY.shift();
                }
                this._velocityX = (this._currentTouchX - this._previousTouchX) / timeOffset;
                this._velocityY = (this._currentTouchY - this._previousTouchY) / timeOffset;
                this._previousTouchTime = now;
                this._previousTouchX = this._currentTouchX;
                this._previousTouchY = this._currentTouchY;
            }
            var horizontalInchesMoved:number = Math.abs(this._currentTouchX - this._startTouchX);
            var verticalInchesMoved:number = Math.abs(this._currentTouchY - this._startTouchY);
            var minimumDragDistance:number = 0.04;
            if(this._horizontalCanScroll && horizontalInchesMoved >= minimumDragDistance){
                this._startTouchX = this._currentTouchX;
                this._startHorizontalScrollPosition = this._viewport.horizontalScrollPosition;
            }
            if(this._verticalCanScroll && verticalInchesMoved >= minimumDragDistance){
                this._startTouchY = this._currentTouchY;
                this._startVerticalScrollPosition = this._viewport.verticalScrollPosition;
            }
        }

        private checkHorizontalScrollPosition():void{

            var viewport:IViewport = this._viewport;
            var hsp:number = viewport.horizontalScrollPosition;
            var maxHsp:number = viewport.contentWidth-viewport.width;

            var sum:number = this._velocityX * 2.33;
            var velocityCount:number = this._previousVelocityX.length;
            var totalWeight:number = 2.33;
            for(var i:number = 0; i < velocityCount; i++){
                var weight:number = Scroller.VELOCITY_WEIGHTS[i];
                sum += this._previousVelocityX.shift() * weight;
                totalWeight += weight;
            }

            var pixelsPerMS:number = sum / totalWeight;
            var absPixelsPerMS:number = Math.abs(pixelsPerMS);
            if(absPixelsPerMS <= 0.02){
                this.finishScrollingHorizontally()
            }
            else{
                var result:Array<number> = this.getAnimationDatas(pixelsPerMS,hsp,maxHsp);
                this.throwHorizontally(result[0],result[1]);
            }
        }

        private checkVerticalScrollPosition():void{
            var viewport:IViewport = this._viewport;
            var vsp:number = viewport.verticalScrollPosition;
            var maxVsp:number = viewport.contentHeight-viewport.height;

            var sum:number = this._velocityY * 2.33;
            var velocityCount:number = this._previousVelocityY.length;
            var totalWeight:number = 2.33;
            for(var i:number = 0; i < velocityCount; i++){
                var weight:number = Scroller.VELOCITY_WEIGHTS[i];
                sum += this._previousVelocityY.shift() * weight;
                totalWeight += weight;
            }

            var pixelsPerMS:number = sum / totalWeight;
            var absPixelsPerMS:number = Math.abs(pixelsPerMS);
            if(absPixelsPerMS <= 0.02){
                this.finishScrollingVertically()
            }
            else{
                var result:Array<number> = this.getAnimationDatas(pixelsPerMS,vsp,maxVsp);
                this.throwVertically(result[0],result[1]);
            }
        }

        private static animationData:Array<number>;

        private getAnimationDatas(pixelsPerMS:number,curPos:number,maxPos:number):Array<number>{
            var absPixelsPerMS:number = Math.abs(pixelsPerMS);
            var extraFricition:number = 0.95;
            var duration:number = 0;
            var friction:number = 0.998;
            var minVelocity:number = 0.02;
            var posTo:number = curPos + (pixelsPerMS - minVelocity) / Math.log(friction);
            if(posTo < 0 || posTo > maxPos){
                posTo = curPos;
                while(Math.abs(pixelsPerMS) > minVelocity){
                    posTo -= pixelsPerMS;
                    if(posTo < 0 || posTo > maxPos){
                        pixelsPerMS *= friction * extraFricition;
                    }
                    else{
                        pixelsPerMS *= friction;
                    }
                    duration++;
                }
            }
            else{
                duration = Math.log(minVelocity / absPixelsPerMS) / Math.log(friction);
            }
            if(!Scroller.animationData){
                Scroller.animationData = [0,0];
            }
            var result:Array<number> = Scroller.animationData;
            result[0] = posTo;
            result[1] = duration;
            return result;
        }

        /**
         * 停止触摸时继续滚动的动画实例
         */
        private horizontalAnimator:Animation;

        private finishScrollingHorizontally(animation?:Animation):void{
            var viewport:IViewport = this._viewport;
            var hsp:number = viewport.horizontalScrollPosition;
            var maxHsp:number = viewport.contentWidth-viewport.width;
            var hspTo:number = hsp;
            if(hsp<0){
                hspTo = 0;
            }
            if(hsp>maxHsp){
                hspTo = maxHsp;
            }
            this.throwHorizontally(hspTo,300);
        }

        /**
         * 缓动到水平滚动位置
		 * @method ns_egret.Scroller#throwHorizontally
		 * @param hspTo {number} 
		 * @param duration {number} 
         */
        public throwHorizontally(hspTo:number,duration:number=500):void{
            var hsp:number = this._viewport.horizontalScrollPosition;
            if(hsp==hspTo){
                return;
            }
            if (!this.horizontalAnimator){
                this.horizontalAnimator = new Animation(this.horizontalUpdateHandler,this);
                this.horizontalAnimator.endFunction = this.finishScrollingHorizontally;
                this.horizontalAnimator.easerFunction = Scroller.easeOut;
            }
            if (this.horizontalAnimator.isPlaying)
                this.horizontalAnimator.stop();
            this.horizontalAnimator.duration = duration;
            this.horizontalAnimator.motionPaths = [{prop:"hsp", from:hsp, to:hspTo}];
            this.horizontalAnimator.play();
        }
        /**
         * 更新水平滚动位置
         */
        private horizontalUpdateHandler(animation:Animation):void {
            this._viewport.horizontalScrollPosition = animation.currentValue["hsp"];
        }

        /**
         * 滚动回正确位置的动画实例
         */
        private verticalAnimator:Animation;

        private finishScrollingVertically(animation?:Animation):void{
            var viewport:IViewport = this._viewport;
            var vsp:number = viewport.verticalScrollPosition;
            var maxVsp:number = viewport.contentHeight-viewport.height;
            var vspTo:number = vsp;
            if(vsp<0){
                vspTo = 0;
            }
            if(vsp>maxVsp){
                vspTo = maxVsp;
            }
            this.throwVertically(vspTo,300);
        }
        /**
         * 缓动到垂直滚动位置
		 * @method ns_egret.Scroller#throwVertically
		 * @param vspTo {number} 
		 * @param duration {number} 
         */
        public throwVertically(vspTo:number,duration:number=500):void{
            var vsp:number = this._viewport.verticalScrollPosition;
            if(vsp==vspTo){
                return;
            }
            if (!this.verticalAnimator){
                this.verticalAnimator = new Animation(this.verticalUpdateHandler,this);
                this.verticalAnimator.endFunction = this.finishScrollingVertically;
                this.verticalAnimator.easerFunction = Scroller.easeOut;
            }
            if (this.verticalAnimator.isPlaying)
                this.verticalAnimator.stop();
            this.verticalAnimator.duration = duration;
            this.verticalAnimator.motionPaths = [{prop:"vsp", from:vsp, to:vspTo}];
            this.verticalAnimator.play();
        }

        /**
         * 更新垂直滚动位置
         */
        private verticalUpdateHandler(animation:Animation):void {
            this._viewport.verticalScrollPosition = animation.currentValue["vsp"];
        }


		/**
		 * @member ns_egret.Scroller#numElements
		 */
        public get numElements():number{
            return this.viewport ? 1 : 0;
        }

        /**
         * 抛出索引越界异常
         */
        private throwRangeError(index:number):void{
            throw new RangeError("索引:\""+index+"\"超出可视元素索引范围");
        }
        /**
		 * @method ns_egret.Scroller#getElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            if (this.viewport && index == 0)
                return this.viewport;
            else
                this.throwRangeError(index);
            return null;
        }

        /**
		 * @method ns_egret.Scroller#getElementIndex
		 * @param element {IVisualElement} 
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            if (element != null && element == this.viewport)
                return 0;
            else
                return -1;
        }
        /**
		 * @method ns_egret.Scroller#containsElement
		 * @param element {IVisualElement} 
		 * @returns {boolean}
         */
        public containsElement(element:IVisualElement):boolean{
            if (element != null && element == this.viewport)
                return true;
            return false;
        }

        private throwNotSupportedError():void{
            throw new Error("此方法在Scroller组件内不可用!");
        }
        /**
		 * @method ns_egret.Scroller#addElement
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public addElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#addElementAt
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public addElementAt(element:IVisualElement, index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#removeElement
         * @deprecated
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
         */
        public removeElement(element:IVisualElement):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#removeElementAt
         * @deprecated
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public removeElementAt(index:number):IVisualElement{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#removeAllElements
         * @deprecated
         */
        public removeAllElements():void{
            this.throwNotSupportedError();
        }
        /**
		 * @method ns_egret.Scroller#setElementIndex
         * @deprecated
		 * @param element {IVisualElement} 
		 * @param index {number} 
         */
        public setElementIndex(element:IVisualElement, index:number):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method ns_egret.Scroller#swapElements
         * @deprecated
		 * @param element1 {IVisualElement} 
		 * @param element2 {IVisualElement} 
         */
        public swapElements(element1:IVisualElement, element2:IVisualElement):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method ns_egret.Scroller#swapElementsAt
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapElementsAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }

        /**
		 * @method ns_egret.Scroller#addChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#addChildAt
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#removeChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#removeChildAt
         * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
		 * @method ns_egret.Scroller#setChildIndex
         * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method ns_egret.Scroller#swapChildren
         * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            this.throwNotSupportedError();
        }
        /**
		 * @method ns_egret.Scroller#swapChildrenAt
         * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
         */
        public swapChildrenAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }
    }

}