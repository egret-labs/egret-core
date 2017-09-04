//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace eui {

    let scrollerThrowEvent:ScrollerThrowEvent;

    /**
     * @private
     */
    const enum Keys {
        scrollPolicyV,
        scrollPolicyH,
        autoHideTimer,
        touchStartX,
        touchStartY,
        touchMoved,
        horizontalCanScroll,
        verticalCanScroll,
        touchScrollH,
        touchScrollV,
        viewport,
        viewprotRemovedEvent, //表示是被移除触发的viewport设空
        touchCancle
    }
    /**
     * The Scroller component displays a single scrollable component,
     * called a viewport, and horizontal and vertical scroll bars.
     * The viewport must implement the IViewport interface.
     * <p>The Group components implement the IViewport interface
     * and can be used as the children of the Scroller control,
     * as the following example shows:</p>
     * <pre>
     *       <s:Scroller width="100" height="100">
     *           <s:Group>
     *               <s:Image width="300" height="400" source="assets/logo.jpg"/>
     *           </s:Group>
     *       </s:Scroller>
     * </pre>
     * <p>The size of the Image control is set larger than that of its parent Group container.
     * By default, the child extends past the boundaries of the parent container.
     * Rather than allow the child to extend past the boundaries of the parent container,
     * the Scroller specifies to clip the child to the boundaries and display scroll bars.</p>
     *
     * @event eui.UIEvent.CHANGE_START Dispatched when the scroll position is going to change
     * @event eui.UIEvent.CHANGE_END Dispatched when the scroll position changed complete
     * @event egret.Event.CHANGE Dispatched when the scroll position is changing
     * @event egret.TouchEvent.TOUCH_CANCEL canceled the touch
     *
     * @defaultProperty viewport
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ScrollerExample.ts
     * @language en_US
     */
    /**
     * Scroller 组件显示一个称为视域的单个可滚动组件，以及水平滚动条和垂直滚动条。该视域必须实现 IViewport 接口。
     * <p>Group 组件实现 IViewport 接口，且可以用作 Scroller 控件的子代，如下例所示：</p>
     * <pre>
     *       <s:Scroller width="100" height="100">
     *           <s:Group>
     *               <s:Image width="300" height="400" source="assets/logo.jpg"/>
     *           </s:Group>
     *       </s:Scroller>
     * </pre>
     * Image 控件的大小比其父 Group 容器设置得大。默认情况下，子代超过父容器的边界。
     * Scroller 会指定将子代剪切到边界并显示滚动条，而不是让子代超过父容器的边界。
     *
     * @event eui.UIEvent.CHANGE_START 滚动位置改变开始
     * @event eui.UIEvent.CHANGE_END 滚动位置改变结束
     * @event egret.Event.CHANGE 滚动位置改变的时候
     * @event egret.TouchEvent.TOUCH_CANCEL 取消触摸事件
     *
     * @defaultProperty viewport
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ScrollerExample.ts
     * @language zh_CN
     */
    export class Scroller extends Component {

        /**
         * The threshold value(in pixels) trigger the rolling.
         * when the touch points deviate from the initial touch point than this value will trigger the rolling.
         *
         * @default 5
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 开始触发滚动的阈值（以像素为单位），当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动。
         *
         * @default 5
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public static scrollThreshold:number = 5;

        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
            let touchScrollH = new sys.TouchScroll(this.horizontalUpdateHandler, this.horizontalEndHandler, this);
            let touchScrollV = new sys.TouchScroll(this.verticalUpdateHandler, this.verticalEndHanlder, this);
            this.$Scroller = {
                0: "auto",          //scrollPolicyV,
                1: "auto",          //scrollPolicyH,
                2: null,            //autoHideTimer,
                3: 0,               //touchStartX,
                4: 0,               //touchStartY,
                5: false,           //touchMoved,
                6: false,           //horizontalCanScroll,
                7: false,           //verticalCanScroll,
                8: touchScrollH,    //touchScrollH,
                9: touchScrollV,    //touchScrollV
                10: null,           //viewport
                11: false,          //viewprotRemovedEvent
                12: false           //touchCancle
            };
        }

        private $bounces:boolean = true;

        /**
         * Whether to enable rebound, rebound When enabled, ScrollView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
         * @default true
         * @version Egret 2.5.6
         * @language en_US
         */
        /**
         * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * @default true
         * @version Egret 2.5.6
         * @language zh_CN
         */
        public get bounces():boolean {
            return this.$bounces;
        }

        public set bounces(value:boolean) {
            this.$bounces = !!value;
            let touchScrollH = this.$Scroller[Keys.touchScrollH];
            if (touchScrollH) {
                touchScrollH.$bounces = this.$bounces;
            }
            let touchScrollV = this.$Scroller[Keys.touchScrollV];
            if (touchScrollV) {
                touchScrollV.$bounces = this.$bounces;
            }
        }

        /**
         * Adjust the speed to get out of the slide end.When equal to 0,the scroll animation will not be play.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 调节滑动结束时滚出的速度。等于0时，没有滚动动画
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public set throwSpeed(val:number) {
            val = +val;
            if (val < 0) val = 0;
            this.$Scroller[Keys.touchScrollH].$scrollFactor = val;
            this.$Scroller[Keys.touchScrollV].$scrollFactor = val;
        }

        public get throwSpeed():number {
            return this.$Scroller[Keys.touchScrollH].$scrollFactor;
        }


        /**
         * @private
         */
        $getThrowInfo(currentPos:number, toPos:number):eui.ScrollerThrowEvent {
            if (!scrollerThrowEvent) {
                scrollerThrowEvent = new eui.ScrollerThrowEvent(ScrollerThrowEvent.THROW, false, false, currentPos, toPos);
            }
            else {
                scrollerThrowEvent.currentPos = currentPos;
                scrollerThrowEvent.toPos = toPos;
            }
            return scrollerThrowEvent;
        }

        /**
         * @private
         */
        $Scroller:Object;
        /**
         * the horizontal scroll bar
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 水平滚动条
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public horizontalScrollBar:eui.HScrollBar = null;
        /**
         * the vertical scroll bar
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 垂直滚动条
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public verticalScrollBar:eui.VScrollBar = null;

        /**
         * Indicates under what conditions the scroller can be moved and the vertical scroll bar is displayed.
         * <p><code>ScrollPolicy.ON</code> - the scroller can be moved, and the scroll bar is displayed when it's move.</p>
         * <p><code>ScrollPolicy.OFF</code> - the scroller can not be moved, the scroll bar is never displayed.</p>
         * <p><code>ScrollPolicy.AUTO</code> - the scroller can not be moved when
         *  the viewport's contentHeight is larger than its height. the scroll bar is displayed when it's move.
         *
         * @default ScrollPolicy.AUTO
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示在哪些条件可以滚动并且显示垂直滑动条。
         * <p><code>ScrollPolicy.ON</code> - 可以滚动，滚动时显示滚动条。</p>
         * <p><code>ScrollPolicy.OFF</code> - 不可以滚动并且不显示滚动条。</p>
         * <p><code>ScrollPolicy.AUTO</code> - 当视域的 contentHeight 大于其自身的高度时可以滚动，滚动时显示滚动条。</p>
         *
         * @default ScrollPolicy.AUTO
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get scrollPolicyV():string {
            return this.$Scroller[Keys.scrollPolicyV];
        }

        public set scrollPolicyV(value:string) {
            let values = this.$Scroller;
            if (values[Keys.scrollPolicyV] == value) {
                return;
            }
            values[Keys.scrollPolicyV] = value;
            this.checkScrollPolicy();
        }

        /**
         * Indicates under what conditions the scroller can be moved and the horizontal scroll bar is displayed.
         * <p><code>ScrollPolicy.ON</code> - the scroller can be moved, and the scroll bar is displayed when it's move.</p>
         * <p><code>ScrollPolicy.OFF</code> - the scroller can not be moved, the scroll bar is never displayed.</p>
         * <p><code>ScrollPolicy.AUTO</code> - the can not be moved  when
         *  the viewport's contentWidth is larger than its width. the scroll bar is displayed when it's move.
         *
         * @default ScrollPolicy.AUTO
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示在哪些条件下可以滚动并且显示水平滑动条。
         * <p><code>ScrollPolicy.ON</code> - 可以滚动，滚动时显示滚动条。</p>
         * <p><code>ScrollPolicy.OFF</code> - 不可以滚动并且不显示滚动条。</p>
         * <p><code>ScrollPolicy.AUTO</code> - 当视域的 contentWidth 大于其自身的宽度时可以滚动，滚动时显示滚动条。</p>
         *
         * @default ScrollPolicy.AUTO
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get scrollPolicyH():string {
            return this.$Scroller[Keys.scrollPolicyH];
        }

        public set scrollPolicyH(value:string) {
            let values = this.$Scroller;
            if (values[Keys.scrollPolicyH] == value) {
                return;
            }
            values[Keys.scrollPolicyH] = value;
            this.checkScrollPolicy();
        }

        /**
         * Stop the scroller animation
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 停止滚动的动画
         *
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public stopAnimation():void {
            let values = this.$Scroller;
            let scrollV = values[Keys.touchScrollV];
            let scrollH = values[Keys.touchScrollH];
            if (scrollV.animation.isPlaying) {
                UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
            } else if (scrollH.animation.isPlaying) {
                UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
            }
            scrollV.stop();
            scrollH.stop();
            let verticalBar = this.verticalScrollBar;
            let horizontalBar = this.horizontalScrollBar;
            if (verticalBar && verticalBar.autoVisibility) {
                verticalBar.visible = false;
            }
            if (horizontalBar && horizontalBar.autoVisibility) {
                horizontalBar.visible = false;
            }
        }

        /**
         * The viewport component to be scrolled.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要滚动的视域组件。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get viewport():IViewport {
            return this.$Scroller[Keys.viewport];
        }

        public set viewport(value:IViewport) {
            let values = this.$Scroller;
            if (value == values[Keys.viewport])
                return;
            this.uninstallViewport();
            values[Keys.viewport] = value;
            values[Keys.viewprotRemovedEvent] = false;
            this.installViewport();
        }

        /**
         * @private
         * 安装并初始化视域组件
         */
        private installViewport():void {
            let viewport = this.viewport;
            if (viewport) {
                this.addChildAt(viewport, 0);
                viewport.scrollEnabled = true;
                viewport.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
                viewport.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
                viewport.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
                viewport.addEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
            }
            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.viewport = viewport;
            }
            if (this.verticalScrollBar) {
                this.verticalScrollBar.viewport = viewport;
            }
        }

        /**
         * @private
         * 卸载视域组件
         */
        private uninstallViewport():void {
            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.viewport = null;
            }
            if (this.verticalScrollBar) {
                this.verticalScrollBar.viewport = null;
            }
            let viewport = this.viewport;
            if (viewport) {
                viewport.scrollEnabled = false;
                viewport.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
                viewport.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
                viewport.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
                viewport.removeEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
                if (this.$Scroller[Keys.viewprotRemovedEvent] == false) {
                    this.removeChild(viewport);
                }
            }
        }

        private onViewPortRemove(event:egret.Event):void {
            if (event.target == this.viewport) {
                this.$Scroller[Keys.viewprotRemovedEvent] = true;
                this.viewport = null;
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setSkin(skin:Skin):void {
            super.setSkin(skin);
            let viewport = this.viewport;
            if (viewport) {
                this.addChildAt(viewport, 0);
            }
        }

        /**
         * @private
         * @param event
         */
        private onTouchBeginCapture(event:egret.TouchEvent):void {
            this.$Scroller[Keys.touchCancle] = false;
            let canScroll:boolean = this.checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this.onTouchBegin(event);
        }

        /**
         * @private
         * @param event
         */
        private onTouchEndCapture(event:egret.TouchEvent):void {
            if (this.$Scroller[Keys.touchCancle]) {
                event.$bubbles = false;
                this.dispatchBubbleEvent(event);

                event.$bubbles = true;
                event.stopPropagation();
                this.onTouchEnd(event);
            }
        }

        /**
         * @private
         * @param event
         */
        private onTouchTapCapture(event:egret.TouchEvent):void {
            if (this.$Scroller[Keys.touchCancle]) {
                event.$bubbles = false;
                this.dispatchBubbleEvent(event);

                event.$bubbles = true;
                event.stopPropagation();

            }
        }

        /**
         * @private
         * 检查当前滚动策略，若有一个方向可以滚动，返回true。
         */
        private checkScrollPolicy():boolean {
            let values = this.$Scroller;
            let viewport:IViewport = values[Keys.viewport];
            if (!viewport) {
                return false;
            }
            let hCanScroll:boolean;
            let uiValues = viewport.$UIComponent;
            switch (values[Keys.scrollPolicyH]) {
                case "auto":
                    if (viewport.contentWidth > uiValues[sys.UIKeys.width] || viewport.scrollH !== 0) {
                        hCanScroll = true;
                    }
                    else {
                        hCanScroll = false;
                    }
                    break;
                case "on":
                    hCanScroll = true;
                    break;
                case "off":
                    hCanScroll = false;
                    break;
            }
            values[Keys.horizontalCanScroll] = hCanScroll;

            let vCanScroll:boolean;
            switch (values[Keys.scrollPolicyV]) {
                case "auto":
                    if (viewport.contentHeight > uiValues[sys.UIKeys.height] || viewport.scrollV !== 0) {
                        vCanScroll = true;
                    }
                    else {
                        vCanScroll = false;
                    }
                    break;
                case "on":
                    vCanScroll = true;
                    break;
                case "off":
                    vCanScroll = false;
                    break;
            }
            values[Keys.verticalCanScroll] = vCanScroll;
            return hCanScroll || vCanScroll;
        }

        /**
         * @private
         * 记录按下的对象，touchCancle时使用
         */
        private downTarget:egret.DisplayObject;

        private tempStage:egret.Stage;

        /**
         * @private
         *
         * @param event
         */
        private onTouchBegin(event:egret.TouchEvent):void {
            if (event.isDefaultPrevented()) {
                return;
            }
            if (!this.checkScrollPolicy()) {
                return;
            }
            this.downTarget = event.target;
            let values = this.$Scroller;
            this.stopAnimation();
            values[Keys.touchStartX] = event.$stageX;
            values[Keys.touchStartY] = event.$stageY;

            if (values[Keys.horizontalCanScroll]) {
                values[Keys.touchScrollH].start(event.$stageX);
            }
            if (values[Keys.verticalCanScroll]) {
                values[Keys.touchScrollV].start(event.$stageY);
            }
            let stage = this.$stage;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
            this.tempStage = stage;
        }

        /**
         * @private
         *
         * @param event
         */
        private onTouchMove(event:egret.TouchEvent):void {
            if (event.isDefaultPrevented()) {
                return;
            }
            let values = this.$Scroller;
            if (!values[Keys.touchMoved]) {
                let outX:boolean;
                if (Math.abs(values[Keys.touchStartX] - event.$stageX) < Scroller.scrollThreshold) {
                    outX = false;
                } else {
                    outX = true;
                }
                let outY:boolean;
                if (Math.abs(values[Keys.touchStartY] - event.$stageY) < Scroller.scrollThreshold) {
                    outY = false;
                } else {
                    outY = true;
                }
                if (!outX && !outY) {
                    return;
                }
                if (!outY && outX && values[Keys.scrollPolicyH] == 'off') {
                    return;
                }
                if (!outX && outY && values[Keys.scrollPolicyV] == 'off') {
                    return;
                }

                values[Keys.touchCancle] = true;
                values[Keys.touchMoved] = true;
                this.dispatchCancelEvent(event);

                let horizontalBar = this.horizontalScrollBar;
                let verticalBar = this.verticalScrollBar;
                if (horizontalBar && horizontalBar.autoVisibility && values[Keys.horizontalCanScroll]) {
                    horizontalBar.visible = true;
                }
                if (verticalBar && verticalBar.autoVisibility && values[Keys.verticalCanScroll]) {
                    verticalBar.visible = true;
                }
                if (values[Keys.autoHideTimer]) {
                    values[Keys.autoHideTimer].reset();
                }
                UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
                this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            }

            event.preventDefault();

            let viewport = values[Keys.viewport];
            let uiValues = viewport.$UIComponent;
            if (values[Keys.horizontalCanScroll]) {
                values[Keys.touchScrollH].update(event.$stageX, viewport.contentWidth - uiValues[sys.UIKeys.width], viewport.scrollH);
            }
            if (values[Keys.verticalCanScroll]) {
                values[Keys.touchScrollV].update(event.$stageY, viewport.contentHeight - uiValues[sys.UIKeys.height], viewport.scrollV);
            }
        }

        /**
         * @private
         * @param event
         */
        private onTouchCancel(event:egret.TouchEvent):void {
            if (!this.$Scroller[Keys.touchMoved]) {
                this.onRemoveListeners();
            }
        }

        /**
         * @private
         * @param event
         */
        private dispatchBubbleEvent(event:egret.TouchEvent) {
            let viewport = this.$Scroller[Keys.viewport];
            if (!viewport) {
                return;
            }
            let cancelEvent = egret.Event.create(egret.TouchEvent, event.type, event.bubbles, event.cancelable);
            cancelEvent.$initTo(event.$stageX,event.$stageY,event.touchPointID);
            let target:egret.DisplayObject = this.downTarget;
            cancelEvent.$setTarget(target);
            let list = this.$getPropagationList(target);
            let length = list.length;
            let targetIndex = list.length * 0.5;
            let startIndex = -1;

            for (let i = 0; i < length; i++) {
                if (list[i] === viewport) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, list.length - startIndex + 1);
            targetIndex = 0;

            this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
            egret.Event.release(cancelEvent);
        }


        /**
         * @private
         * @param event
         */
        private dispatchCancelEvent(event:egret.TouchEvent) {
            let viewport = this.$Scroller[Keys.viewport];
            if (!viewport) {
                return;
            }
            let cancelEvent = egret.Event.create(egret.TouchEvent, egret.TouchEvent.TOUCH_CANCEL, event.bubbles, event.cancelable);
            cancelEvent.$initTo(event.$stageX,event.$stageY,event.touchPointID);
            let target:egret.DisplayObject = this.downTarget;
            cancelEvent.$setTarget(target);
            let list = this.$getPropagationList(target);
            let length = list.length;
            let targetIndex = list.length * 0.5;
            let startIndex = -1;

            for (let i = 0; i < length; i++) {
                if (list[i] === viewport) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, startIndex + 1 - 2);
            list.splice(list.length - 1 - startIndex + 2, startIndex + 1 - 2);

            targetIndex -= startIndex + 1;
            this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
            egret.Event.release(cancelEvent);
        }


        /**
         * @private
         * @param event
         */
        private onTouchEnd(event:egret.Event):void {
            let values = this.$Scroller;
            values[Keys.touchMoved] = false;

            this.onRemoveListeners();

            let viewport:IViewport = values[Keys.viewport];
            let uiValues = viewport.$UIComponent;
            if (values[Keys.touchScrollH].isStarted()) {
                values[Keys.touchScrollH].finish(viewport.scrollH, viewport.contentWidth - uiValues[sys.UIKeys.width]);
            }
            if (values[Keys.touchScrollV].isStarted()) {
                values[Keys.touchScrollV].finish(viewport.scrollV, viewport.contentHeight - uiValues[sys.UIKeys.height]);
            }
        }

        /**
         * @private
         */
        private onRemoveListeners():void {
            let stage = this.tempStage || this.$stage;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
        }

        /**
         * @private
         *
         * @param scrollPos
         */
        private horizontalUpdateHandler(scrollPos:number):void {
            this.$Scroller[Keys.viewport].scrollH = scrollPos;
            this.dispatchEventWith(egret.Event.CHANGE);
        }

        /**
         * @private
         *
         * @param scrollPos
         */
        private verticalUpdateHandler(scrollPos:number):void {
            this.$Scroller[Keys.viewport].scrollV = scrollPos;
            this.dispatchEventWith(egret.Event.CHANGE);
        }

        /**
         * @private
         *
         */
        private horizontalEndHandler():void {
            if (!this.$Scroller[Keys.touchScrollV].isPlaying()) {
                this.onChangeEnd();
            }
        }

        /**
         * @private
         *
         */
        private verticalEndHanlder():void {
            if (!this.$Scroller[Keys.touchScrollH].isPlaying()) {
                this.onChangeEnd();
            }
        }

        /**
         * @private
         *
         */
        private onChangeEnd():void {
            let values = this.$Scroller;
            let horizontalBar = this.horizontalScrollBar;
            let verticalBar = this.verticalScrollBar;
            if (horizontalBar && horizontalBar.visible || verticalBar && verticalBar.visible) {
                if (!values[Keys.autoHideTimer]) {
                    values[Keys.autoHideTimer] = new egret.Timer(200, 1);
                    values[Keys.autoHideTimer].addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onAutoHideTimer, this);
                }
                values[Keys.autoHideTimer].reset();
                values[Keys.autoHideTimer].start();
            }

            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);

        }

        /**
         * @private
         *
         * @param event
         */
        private onAutoHideTimer(event:egret.TimerEvent):void {
            let horizontalBar = this.horizontalScrollBar;
            let verticalBar = this.verticalScrollBar;
            if (horizontalBar && horizontalBar.autoVisibility) {
                horizontalBar.visible = false;
            }
            if (verticalBar && verticalBar.autoVisibility) {
                verticalBar.visible = false;
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            let viewport = this.viewport;
            if (viewport) {
                //必须先调用setLayoutBoundsSize()，因为尺寸改变会影响布局位置。
                viewport.setLayoutBoundsSize(unscaledWidth, unscaledHeight);
                viewport.setLayoutBoundsPosition(0, 0);
            }
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
            if (instance == this.horizontalScrollBar) {
                this.horizontalScrollBar.touchChildren = false;
                this.horizontalScrollBar.touchEnabled = false;
                this.horizontalScrollBar.viewport = this.viewport;
                if (this.horizontalScrollBar.autoVisibility) {
                    this.horizontalScrollBar.visible = false;
                }
            }
            else if (instance == this.verticalScrollBar) {
                this.verticalScrollBar.touchChildren = false;
                this.verticalScrollBar.touchEnabled = false;
                this.verticalScrollBar.viewport = this.viewport;
                if (this.verticalScrollBar.autoVisibility) {
                    this.verticalScrollBar.visible = false;
                }
                
            }
        }
    }

    registerProperty(Scroller, "viewport", "eui.IViewport", true);
}
