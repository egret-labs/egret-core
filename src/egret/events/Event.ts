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
     * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
     * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
     * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
     * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
     * information. Events associated with a touch tap, for example, need to include additional information about the
     * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
     * which is what the TouchEvent class does. Egret API defines several Event subclasses for common events that require
     * additional information. Events associated with each of the Event subclasses are described in the documentation for
     * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
     * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
     * preventDefault() method. You can also make the current event listener the last one to process an event by calling
     * the stopPropagation() or stopImmediatePropagation() method.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     */
    /**
     * @language zh_CN
     * Event 类作为创建事件实例的基类，当发生事件时，Event 实例将作为参数传递给事件侦听器。Event 类的属性包含有关事件的基本信息，例如事件
     * 的类型或者是否可以取消事件的默认行为。对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置信息。您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。Event 类的方法可以在
     * 事件侦听器函数中使用以影响事件对象的行为。某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     */
    export class Event extends HashObject {
        /**
         * @language en_US
         * Dispatched when a display object is added to the on stage display list, either directly or through the addition
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ADDED_TO_STAGE:string = "addedToStage";
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static REMOVED_FROM_STAGE:string = "removedFromStage";
        /**
         * @language en_US
         * Dispatched when a display object is added to the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象添加到显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ADDED:string = "added";
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将要从显示列表中删除显示对象时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static REMOVED:string = "removed";
        /**
         * @language en_US
         * [broadcast event] Dispatched when the playhead is entering a new frame.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ENTER_FRAME:string = "enterFrame";
        /**
         * @language en_US
         * Dispatched when the display list is about to be updated and rendered.
         * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * 注意：每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
         * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static RENDER:string = "render";
        /**
         * @language en_US
         * Dispatched when the size of stage or UIComponent is changed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台尺寸或UI组件尺寸发生改变
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static RESIZE:string = "resize";

        /**
         * @language en_US
         * Dispatched when the value or selection of a property is chaned.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CHANGE:string = "change";

        /**
         * @language en_US
         * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
         * preventDefault() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CHANGING:string = "changing";
        /**
         * @language en_US
         * Dispatched when the net request is complete.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 网络请求加载完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static COMPLETE:string = "complete";

        /**
         * @language en_US
         * Dispatched when loop completed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 循环完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LOOP_COMPLETE:string = "loopComplete";

        /**
         * @language en_US
         * Dispatched when the TextInput instance gets focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例获得焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_IN:string = "focusIn";
        /**
         * @language en_US
         * Dispatched when the TextInput instance loses focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例失去焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_OUT:string = "focusOut";
        /**
         * @language en_US
         * Dispatched when the playback is ended.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画声音等播放完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ENDED:string = "ended";


        /**
         * 游戏激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ACTIVATE:string = "activate";

        /**
         * 取消激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static DEACTIVATE:string = "deactivate";

        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CLOSE:string = "close";

        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CONNECT:string = "connect";


        /**
         * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LEAVE_STAGE:string = "leaveStage";

        /**
         * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static SOUND_COMPLETE:string = "soundComplete";


        /**
         * @language en_US
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param data the optional data associated with this event
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param data 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean, data?:any) {
            super();
            this.$type = type;
            this.$bubbles = !!bubbles;
            this.$cancelable = !!cancelable;
            this.data = data;
        }

        /**
         * @language en_US
         * the optional data associated with this event
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public data:any;

        /**
         * @private
         */
        $type:string;

        /**
         * @language en_US
         * The type of event. The type is case-sensitive.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件的类型。类型区分大小写。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get type():string {
            return this.$type;
        }

        /**
         * @private
         */
        $bubbles:boolean;

        /**
         * @language en_US
         * Indicates whether an event is a bubbling event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bubbles():boolean {
            return this.$bubbles;
        }

        /**
         * @private
         */
        $cancelable:boolean;
        /**
         * @language en_US
         * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
         * canceled, this value is true; otherwise it is false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get cancelable():boolean {
            return this.$cancelable;
        }

        /**
         * @private
         */
        $eventPhase:number = 2;

        /**
         * @language en_US
         * The current phase in the event flow. This property can contain the following numeric values:
         * The capture phase (EventPhase.CAPTURING_PHASE).
         * The target phase (EventPhase.AT_TARGET)
         * The bubbling phase (EventPhase.BUBBLING_PHASE).
         * @see egret.EventPhase
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件流中的当前阶段。此属性可以包含以下数值：
         * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
         * 目标阶段 (EventPhase.AT_TARGET)。
         * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
         * @see egret.EventPhase
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get eventPhase():number {
            return this.$eventPhase;
        }

        /**
         * @private
         */
        $currentTarget:any = null;

        /**
         * @language en_US
         * The object that is actively processing the Event object with an event listener. For example, if a
         * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
         * that has registered an event listener for that event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
         * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get currentTarget():any {
            return this.$currentTarget;
        }

        /**
         * @private
         */
        $target:any = null;

        /**
         * @language en_US
         * The event target. This property contains the target node. For example, if a user clicks an OK button,
         * the target node is the display list node containing that button.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get target():any {
            return this.$target;
        }

        $setTarget(target:any):boolean {
            this.$target = target;
            return true;
        }

        /**
         * @private
         */
        $isDefaultPrevented:boolean = false;

        /**
         * @language en_US
         * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
         * called, returns true; otherwise, returns false.
         * @returns If preventDefault() has been called, returns true; otherwise, returns false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查是否已对事件调用 preventDefault() 方法。
         * @returns 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public isDefaultPrevented():boolean {
            return this.$isDefaultPrevented;
        }

        /**
         * @language en_US
         * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
         * are carried out by default. For example, if a user types a character into a text input, the default behavior
         * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
         * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
         * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
         * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
         * otherwise, preventDefault() has no effect.
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 您可以使用 Event.cancelable 属性来检查是否可以防止与特定事件关联的默认行为。如果 Event.cancelable 的值为 true，
         * 则可以使用 preventDefault() 来取消事件；否则，preventDefault() 无效。
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        public preventDefault():void {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        }

        /**
         * @private
         */
        $isPropagationStopped:boolean = false;

        /**
         * @language en_US
         * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
         * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
         * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
         * method have no effect. This method can be called in any phase of the event flow.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stopPropagation():void {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        }

        /**
         * @private
         */
        $isPropagationImmediateStopped:boolean = false;

        /**
         * @language en_US
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
         * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stopImmediatePropagation():void {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        }

        /**
         * @language en_US
         * This method will be called automatically when you pass the event object as the parameters to the Event.release() method.
         * If your custom event is designed for reusable,you should override this method to make sure all the references to external
         * objects are cleaned. if not,it may cause memory leaking.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当事件实例传递给Event.release()静态方法时，实例上的clean()方法将会被自动调用。
         * 若此自定义事件的实例设计为可以循环复用的，为了避免引起内存泄露，自定义事件需要覆盖此方法来确保实例被缓存前断开对外部对象的一切引用。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        protected clean():void {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        }


        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. Objects thrown objects will be cached in the pool for the next round robin.
         * @param target the event target
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchEvent(target:IEventDispatcher, type:string, bubbles:boolean = false, data?:any):boolean {
            var event:IOErrorEvent = Event.create(Event, type, bubbles);
            var props:any = Event._getPropertyData(Event);
            if (data != undefined) {
                props.data = data;
            }
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }

        /**
         * @private
         *
         * @param EventClass
         * @returns
         */
        public static _getPropertyData(EventClass:any):any {
            var props:any = EventClass._props;
            if (!props)
                props = EventClass._props = {};
            return props;
        }

        /**
         * @language en_US
         * Gets one event instance from the object pool or create a new one. We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: If you want to use this method to initialize your custom event object,you must make sure the constructor
         * of your custom event is the same as the constructor of egret.Event.
         * @param EventClass Event Class。
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;    //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
         * @param EventClass Event类名。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create<T extends Event>(EventClass:{new (type:string, bubbles?:boolean, cancelable?:boolean): T;eventPool?:Event[]},
                                              type:string, bubbles?:boolean, cancelable?:boolean):T {
            var eventPool:Event[] = EventClass.eventPool;
            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                var event:T = <T> eventPool.pop();
                event.$type = type;
                event.$bubbles = !!bubbles;
                event.$cancelable = !!cancelable;
                event.$isDefaultPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = EventPhase.AT_TARGET;
                return event;
            }
            return new EventClass(type, bubbles, cancelable);
        }

        /**
         * @language en_US
         * Releases an event object and cache it into the object pool.We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: The parameters of this method only accepts an instance created by the Event.create() method.
         * if not,it may throw an error.
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data; //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(event:Event):void {
            event.clean();
            var EventClass:any = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        }

    }

    if (DEBUG) {
        egret.$markReadOnly(Event, "type");
        egret.$markReadOnly(Event, "bubbles");
        egret.$markReadOnly(Event, "cancelable");
        egret.$markReadOnly(Event, "eventPhase");
        egret.$markReadOnly(Event, "currentTarget");
        egret.$markReadOnly(Event, "target");
    }
}