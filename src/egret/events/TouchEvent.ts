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
     * @language en_US
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
     * @version Lark 1.0
     * @platform Web,Runtime,Native
     */
    /**
     * @language zh_CN
     * 使用 TouchEvent 类，您可以处理设备上那些检测用户与设备之间的接触的事件。
     * 当用户与带有触摸屏的移动电话或平板电脑等设备交互时，用户通常使用手指或指针设备接触屏幕。可使用 TouchEvent
     * 类开发响应基本触摸事件（如单个手指点击）的应用程序。使用此类中定义的事件类型创建事件侦听器。
     * 注意：当对象嵌套在显示列表中时，触摸事件的目标将是显示列表中可见的最深的可能嵌套对象。
     * 此对象称为目标节点。要使目标节点的祖代（祖代是一个包含显示列表中所有目标节点的对象，从舞台到目标节点的父节点均包括在内）
     * 接收触摸事件的通知，请对祖代节点使用 EventDispatcher.on() 并将 type 参数设置为要检测的特定触摸事件。
     *
     * @version Lark 1.0
     * @platform Web,Runtime,Native
     */
    export class TouchEvent extends Event {

        /**
         * @language en_US
         * Emitted when the user touches the device, and is continuously dispatched until the point of contact is removed.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static TOUCH_MOVE:string = "touchMove";

        /**
         * @language en_US
         * Emitted when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static TOUCH_BEGIN:string = "touchBegin";

        /**
         * @language en_US
         * Emitted when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
         * or tablet with a touch screen).
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static TOUCH_END:string = "touchEnd";

        /**
         * @language en_US
         * Emitted when the user lifts the point of contact over the same DisplayObject instance on which the contact
         * was initiated on a touch-enabled device.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static TOUCH_TAP:string = "touchTap";
        /**
         * @language en_US
         * Emitted when the user lifts the point of contact over the different DisplayObject instance on which the contact
         * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
         * object on a mobile phone or tablet with a touch screen).
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static TOUCH_RELEASE_OUTSIDE:string = "touchReleaseOutside";

        /**
         * @deprecated
         */
        public static TOUCH_ROLL_OUT:string = "touchRollOut";

        /**
         * @deprecated
         */
        public static TOUCH_ROLL_OVER:string = "touchRollOver";

        /**
         * @language en_US
         * Creates an Event object that contains information about touch events.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number assigned to the touch point.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TouchEvent 对象，其中包含有关Touch事件的信息
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean, stageX?:number,
                           stageY?:number, touchPointID?:number) {
            super(type, bubbles, cancelable);
            this.$setTo(stageX, stageY, touchPointID);
        }

        /**
         * @private
         */
        $setTo(stageX:number, stageY:number, touchPointID:number):void {
            this.touchPointID = +touchPointID || 0;
            this.$stageX = +stageX || 0;
            this.$stageY = +stageY || 0;
        }

        /**
         * @private
         */
        $stageX:number;

        /**
         * @language en_US
         * The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 事件发生点在全局舞台坐标中的水平坐标。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public get stageX():number {
            return this.$stageX;
        }

        /**
         * @private
         */
        $stageY:number;

        /**
         * @language en_US
         * The vertical coordinate at which the event occurred in global Stage coordinates.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 事件发生点在全局舞台坐标中的垂直坐标。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public get stageY():number {
            return this.$stageY;
        }

        /**
         * @private
         */
        private localPoint:Point;

        /**
         * @private
         */
        private getLocalXY():Point {
            if (!this.localPoint) {
                this.localPoint = new Point();
                var m = (<DisplayObject>this.target).$getInvertedConcatenatedMatrix();
                m.transformPoint(this.stageX, this.stageY, this.localPoint);
            }
            return this.localPoint;
        }

        /**
         * @language en_US
         * The horizontal coordinate at which the event occurred relative to the display object.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 事件发生点相对于所属显示对象的水平坐标。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public get localX():number {
            return this.getLocalXY().x;
        }

        /**
         * @language en_US
         * The vertical coordinate at which the event occurred relative to the display object.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 事件发生点相对于所属显示对象的垂直坐标。
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public get localY():number {
            return this.getLocalXY().y;
        }

        /**
         * @language en_US
         * A unique identification number assigned to the touch point.
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 分配给触摸点的唯一标识号
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public touchPointID:number;

        /**
         * @language en_US
         * Instructs Lark runtime to render after processing of this event completes, if the display list has been modified.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public updateAfterEvent():void {
            sys.$requestRenderingFlag = true;
        }

        /**
         * 表示触摸已按下 (true) 还是未按下 (false)。
         * @member {boolean} egret.TouchEvent#touchDown
         */
        public touchDown:boolean = false;
        /**
         * @language en_US
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
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventEmitter对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
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
         * @version Lark 1.0
         * @platform Web,Runtime,Native
         */
        public static emitTouchEvent(target:IEventDispatcher, type:string, bubbles?:boolean, cancelable?:boolean,
                                     stageX?:number, stageY?:number, touchPointID?:number):boolean {
            if (!bubbles && !target.hasEventListener(type)) {
                return true;
            }
            var event = Event.create(TouchEvent, type, bubbles, cancelable);
            event.$setTo(stageX, stageY, touchPointID);
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }

        protected clean():void {
            super.clean();
            this.localPoint = null;
        }

    }

    registerClass(TouchEvent, Types.TouchEvent);

    if(DEBUG){
        egret.$markReadOnly(TouchEvent.prototype,"stageX");
        egret.$markReadOnly(TouchEvent.prototype,"stageY");
        egret.$markReadOnly(TouchEvent.prototype,"localX");
        egret.$markReadOnly(TouchEvent.prototype,"localY");
    }
}