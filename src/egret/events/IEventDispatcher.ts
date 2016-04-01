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
     * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific types
     * of event listeners are registered, and dispatches events. Event targets are an important part of the Egret event model.
     * The event target serves as the focal point for how events flow through the display list hierarchy. When an event 
     * such as a touch tap occurs, an event object is dispatched into the event flow from the root of the display list.
     * The event object makes a round-trip journey to the event target, which is conceptually divided into three phases: <br/>
     * the capture phase includes the journey from the root to the last node before the event target's node; the target 
     * phase includes only the event target node; and the bubbling phase includes any subsequent nodes encountered on the
     * return trip to the root of the display list.In general, the easiest way for a user-defined class to gain event 
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already
     * extending another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member,
     * and write simple hooks to route calls into the aggregated EventDispatcher.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IEventDispatcher.ts
     */
    /**
     * @language zh_CN
     * IEventDispatcher 接口定义用于添加或删除事件侦听器的方法，检查是否已注册特定类型的事件侦听器，并调度事件。
     * 事件目标是 Egret 事件模型的重要组成部分。事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生触摸轻拍事件时，
     * 会将事件对象调度到从显示列表根开始的事件流中。事件对象进行到事件目标的往返行程，在概念上，此往返行程被划分为三个阶段：<br/>
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括到显示列表的根的回程上遇到的任何后续节点。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），
     * 则可以实现 IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的挂钩，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IEventDispatcher.ts
     */
    export interface IEventDispatcher extends HashObject {

        /**
         * @language en_US
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. You can register event listeners on all nodes in the display list for a specific type of event, phase,
         * and priority.After you successfully register an event listener, you cannot change its priority through additional 
         * calls to on(). To change a listener's priority, you must first call removeEventListener(). Then you can register the
         * listener again with the new priority level.After the listener is registered, subsequent calls to on() with a 
         * different value for either type or useCapture result in the creation of a separate listener registration. <br/>
         * When you no longer need an event listener, remove it by calling EventDispatcher.removeEventListener(); otherwise, memory
         * problems might result. Objects with registered event listeners are not automatically removed from memory because
         * the garbage collector does not remove objects that still have references.Copying an EventDispatcher instance does
         * not copy the event listeners attached to it. (If your newly created node needs an event listener, you must attach 
         * the listener after creating the node.) However, if you move an EventDispatcher instance, the event listeners attached
         * to it move along with it.If the event listener is being registered on a node while an event is also being processed 
         * on this node, the event listener is not triggered during the current phase but may be triggered during a later phase
         * in the event flow, such as the bubbling phase.If an event listener is removed from a node while an event is being 
         * processed on the node, it is still triggered by the current actions. After it is removed, the event listener is
         * never invoked again (unless it is registered again for future processing).
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is
         * @see #once()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件、阶段和优先级在显示列表的所有节
         * 点上注册事件侦听器。成功注册一个事件侦听器后，无法通过额外调用 on() 来更改其优先级。要更改侦听器的优先级，必须
         * 先调用 removeEventListener()。然后，可以使用新的优先级再次注册该侦听器。注册该侦听器后，如果继续调用具有不同 type 或 useCapture
         * 值的 on()，则会创建单独的侦听器注册。<br/>
         * 如果不再需要某个事件侦听器，可调用 EventDispatcher.removeEventListener()
         * 删除它；否则会产生内存问题。由于垃圾回收器不会删除仍包含引用的对象，因此不会从内存中自动删除使用已注册事件侦听器的对象。复制
         * EventDispatcher 实例时并不复制其中附加的事件侦听器。（如果新近创建的节点需要一个事件侦听器，必须在创建该节点后附加该侦听器。）
         * 但是，如果移动 EventDispatcher 实例，则其中附加的事件侦听器也会随之移动。如果在正在处理事件的节点上注册事件侦听器，则不会在当
         * 前阶段触发事件侦听器，但会在事件流的稍后阶段触发，如冒泡阶段。如果从正在处理事件的节点中删除事件侦听器，则该事件侦听器仍由当前操
         * 作触发。删除事件侦听器后，决不会再次调用该事件侦听器（除非再次注册以备将来处理）。
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在冒泡阶段处理事件。
         * 要在两个阶段都侦听事件，请调用 on() 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号的整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @see #once()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        /**
         * @language en_US
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. Different from the on() method,the listener receives notification only once,and then it will be removed
         * automatically.
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is
         * @see #on()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 添加仅回调一次的事件侦听器，此方法与on()方法不同，on()方法会持续产生回调，而此方法在第一次回调时就会自动移除监听。
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在冒泡阶段处理事件。
         * 要在两个阶段都侦听事件，请调用 once() 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @see #on()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        /**
         * @language en_US
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
         * EventDispatcher object, a call to this method has no effect.
         * @param type The type of event.
         * @param listener The listener object to remove.
         * @param thisObject the listener function's "this"
         * @param useCapture Specifies whether the listener was registered for the capture phase or the bubbling phases.
         * If the listener was registered for both the capture phase and the bubbling phases, two calls to removeEventListener()
         * are required to remove both: one call with useCapture set to true, and another call with useCapture set to false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 EventDispatcher 对象中删除侦听器。如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
         * @param type 事件的类型。
         * @param listener 要删除的侦听器对象
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 指出是为捕获阶段还是为冒泡阶段注册了侦听器。如果为捕获阶段以及冒泡阶段注册了侦听器，则需要对
         * removeEventListener() 进行两次调用才能将这两个侦听器删除：一次调用将 useCapture 设置为 true，另一次调用将 useCapture 设置为 false。。
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void;

        /**
         * @language en_US
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This allows
         * you to determine where an EventDispatcher object has altered handling of an event type in the event flow hierarchy.
         * To determine whether a specific event type will actually trigger an event listener, use IEventDispatcher.willTrigger().
         * The difference between hasEventListener() and willTrigger() is that hasEventListener() examines only the object to
         * which it belongs, whereas willTrigger() examines the entire event flow for the event specified by the type parameter.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type is registered; false otherwise.
         * @see #willTrigger()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。这样，您就可以确定 EventDispatcher 对象在事件流层次结构中的哪个
         * 位置改变了对事件类型的处理。要确定特定事件类型是否确实会触发事件侦听器，请使用 IEventDispatcher.willTrigger()。hasEventListener()
         * 与 willTrigger() 的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 检查整个事件流以查找由 type 参数指定的事件。
         * @param type 事件的类型。
         * @returns 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         * @see #willTrigger()
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasEventListener(type:string):boolean;

        /**
         * @language en_US
         * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which dispatchEvent() is called.
         * @param event The event object dispatched into the event flow.
         * @returns A value of true unless preventDefault() is called on the event, in which case it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
         * @param event 调度到事件流中的 Event 对象。
         * @returns 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatchEvent(event:Event):boolean;

        /**
         * @language en_US
         * Checks whether an event listener is registered with this EventDispatcher object or any of its ancestors for the
         * specified event type. This method returns true if an event listener is triggered during any phase of the event
         * flow when an event of the specified type is dispatched to this EventDispatcher object or any of its descendants.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type will be triggered; false otherwise.
         * @see #hasEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
         * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
         * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
         * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
         * @param type 事件类型
         * @returns 是否注册过监听器，如果注册过返回true，反之返回false
         * @see #hasEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        willTrigger(type:string):boolean;
    }
}