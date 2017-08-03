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

/// <reference path="../geom/Point.ts" />

namespace egret {

    export interface DisplayObject {

        addEventListener<Z>(type:   "touchMove"   |
                                    "touchBegin"  |
                                    "touchEnd"    |
                                    "touchCancel" |
                                    "touchTap"    |
                                    "touchReleaseOutside" |
                                    "touchRollOut"|
                                    "touchRollOver"
                                   , listener: (this: Z, e: TouchEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    }

    let localPoint: Point = new Point();

    /**
     * The TouchEvent class lets you handle events on devices that detect user contact with the device (such as a finger
     * on a touch screen).When a user interacts with a device such as a mobile phone or tablet with a touch screen, the
     * user typically touches the screen with his or her fingers or a pointing device. You can develop applications that
     * respond to basic touch events (such as a single finger tap) with the TouchEvent class. Create event listeners using
     * the event types defined in this class.
     * Note: When objects are nested on the display list, touch events target the deepest possible nested object that is
     * visible in the display list. This object is called the target node. To have a target node's ancestor (an object
     * containing the target node in the display list) receive notification of a touch event, use EventDispatcher.addEventListener()
     * on the ancestor node with the type parameter set to the specific touch event you want to detect.
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     * @language en_US
     */
    /**
     * 使用 TouchEvent 类，您可以处理设备上那些检测用户与设备之间的接触的事件。
     * 当用户与带有触摸屏的移动电话或平板电脑等设备交互时，用户通常使用手指或指针设备接触屏幕。可使用 TouchEvent
     * 类开发响应基本触摸事件（如单个手指点击）的应用程序。使用此类中定义的事件类型创建事件侦听器。
     * 注意：当对象嵌套在显示列表中时，触摸事件的目标将是显示列表中可见的最深的可能嵌套对象。
     * 此对象称为目标节点。要使目标节点的祖代（祖代是一个包含显示列表中所有目标节点的对象，从舞台到目标节点的父节点均包括在内）
     * 接收触摸事件的通知，请对祖代节点使用 EventDispatcher.on() 并将 type 参数设置为要检测的特定触摸事件。
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     * @language zh_CN
     */
    export class TouchEvent extends Event {

        /**
         * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_MOVE: "touchMove" = "touchMove";

        /**
         * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_BEGIN: "touchBegin" = "touchBegin";

        /**
         * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
         * or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_END: "touchEnd" = "touchEnd";
        /**
         * Dispatched when an event of some kind occurred that canceled the touch.
         * Such as the eui.Scroller will dispatch 'TOUCH_CANCEL' when it start move, the 'TOUCH_END' and 'TOUCH_TAP' will not be triggered.
         * @version Egret 3.0.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 由于某个事件取消了触摸时触发。比如 eui.Scroller 在开始滚动后会触发 'TOUCH_CANCEL' 事件，不再触发后续的 'TOUCH_END' 和 'TOUCH_TAP' 事件
         * @version Egret 3.0.1
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_CANCEL: "touchCancel" = "touchCancel";

        /**
         * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
         * was initiated on a touch-enabled device.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_TAP: "touchTap" = "touchTap";
        /**
         * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
         * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
         * object on a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static TOUCH_RELEASE_OUTSIDE: "touchReleaseOutside" = "touchReleaseOutside";

        /**
         * Creates an Event object that contains information about touch events.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 TouchEvent 对象，其中包含有关Touch事件的信息
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number,
            stageY?: number, touchPointID?: number) {
            super(type, bubbles, cancelable);
            this.$initTo(stageX, stageY, touchPointID);
        }

        /**
         * @private
         */
        $initTo(stageX: number, stageY: number, touchPointID: number): void {
            this.touchPointID = +touchPointID || 0;
            this.$stageX = +stageX || 0;
            this.$stageY = +stageY || 0;
        }

        /**
         * @private
         */
        $stageX: number;

        /**
         * The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 事件发生点在全局舞台坐标中的水平坐标。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get stageX(): number {
            return this.$stageX;
        }

        /**
         * @private
         */
        $stageY: number;

        /**
         * The vertical coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 事件发生点在全局舞台坐标中的垂直坐标。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get stageY(): number {
            return this.$stageY;
        }

        private _localX: number;
        /**
         * The horizontal coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 事件发生点相对于所属显示对象的水平坐标。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get localX(): number {
            if (this.targetChanged) {
                this.getLocalXY();
            }
            return this._localX;
        }

        private _localY: number;
        /**
         * The vertical coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 事件发生点相对于所属显示对象的垂直坐标。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get localY(): number {
            if (this.targetChanged) {
                this.getLocalXY();
            }
            return this._localY;
        }

        private targetChanged: boolean = true;

        /**
         * @private
         */
        private getLocalXY(): void {
            this.targetChanged = false;
            let m = (<DisplayObject>this.$target).$getInvertedConcatenatedMatrix();
            m.transformPoint(this.$stageX, this.$stageY, localPoint);
            this._localX = localPoint.x;
            this._localY = localPoint.y;
        }

        $setTarget(target: any): boolean {
            this.$target = target;
            this.targetChanged = !!target;
            return true;
        }

        /**
         * A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 分配给触摸点的唯一标识号
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public touchPointID: number;

        /**
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public updateAfterEvent(): void {
            sys.$requestRenderingFlag = true;
        }

        /**
         * Whether the touch is pressed (true) or not pressed (false).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示触摸已按下 (true) 还是未按下 (false)。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public touchDown: boolean = false;

        /**
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number (as an int) assigned to the touch point.
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static dispatchTouchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean,
            stageX?: number, stageY?: number, touchPointID?: number, touchDown: boolean = false): boolean {
            if (!bubbles && !target.hasEventListener(type)) {
                return true;
            }
            let event: TouchEvent = Event.create(TouchEvent, type, bubbles, cancelable);
            event.$initTo(stageX, stageY, touchPointID);
            event.touchDown = touchDown;
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }

}