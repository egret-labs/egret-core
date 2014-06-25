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

/// <reference path="Event.ts"/>
/// <reference path="IEventDispatcher.ts"/>
/// <reference path="../utils/HashObject.ts"/>
/// <reference path="../utils/Recycler.ts"/>
/// <reference path="../../jslib/DEBUG.d.ts"/>

module egret {
    /**
     *
     * @class egret.EventDispatcher
     * @classdesc
     * EventDispatcher是egret的事件派发器类，负责进行事件的发送和侦听。
     * @extends egret.HashObject
     * @implements egret.IEventDispatcher
     *
     */
    export class EventDispatcher extends HashObject implements IEventDispatcher {

        /**
         * EventDispatcher 类是可调度事件的所有类的基类。EventDispatcher 类实现 IEventDispatcher 接口
         * ，并且是 DisplayObject 类的基类。EventDispatcher 类允许显示列表上的任何对象都是一个事件目标，
         * 同样允许使用 IEventDispatcher 接口的方法。
         */
        public constructor(target:IEventDispatcher = null) {
            super();
            if (target){
                this._eventTarget = target;
            }
            else{
                this._eventTarget = this;
            }

        }
        /**
         * 事件抛出对象
         */
        private _eventTarget:IEventDispatcher;
        /**
         * 引擎内部调用
         * @private
         */
        public _eventsMap:Object;
        /**
         * 引擎内部调用
         * @private
         */
        public _captureEventsMap:Object;

        /**
         * 引擎内部调用
         * @private
         */
        public _isUseCapture:boolean = false;

        /**
         * 添加事件侦听器
         * @method egret.EventDispatcher#addEventListener
         * @param type {string} 事件的类型。
         * @param listener {Function} 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject {any} 侦听函数绑定的this对象
         * @param useCapture {boolean} 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
         * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         */
        public addEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false, priority:number = 0):void {
            if (DEBUG && DEBUG.ADD_EVENT_LISTENER) {
                DEBUG.checkAddEventListener(type, listener, thisObject, useCapture, priority);
            }
            var eventMap:Object;
            if(useCapture){
                if(!this._captureEventsMap)
                    this._captureEventsMap = {};
                eventMap = this._captureEventsMap;
            }
            else{
                if(!this._eventsMap)
                    this._eventsMap = {};
                eventMap = this._eventsMap;
            }
            var list:Array<any> = eventMap[type];
            if(!list){
                list = eventMap[type] = [];
            }
            this._insertEventBin(list,listener, thisObject,priority)
        }
        /**
         * 在一个事件列表中按优先级插入事件对象
         */
        public _insertEventBin(list:Array<any>,listener:Function, thisObject:any,priority:number):boolean{
            var insertIndex:number = -1;
            var length:number = list.length;
            for (var i:number = 0; i < length; i++) {
                var bin:any = list[i];
                if (bin.listener === listener&&bin.thisObject===thisObject) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var eventBin = {listener: listener, thisObject: thisObject, priority: priority};
            if (insertIndex != -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        }

        /**
         * 移除事件侦听器
         * @method egret.EventDispatcher#removeEventListener
         * @param type {string} 事件名
         * @param listener {Function} 侦听函数
         * @param thisObject {any} 侦听函数绑定的this对象
         * @param useCapture {boolean} 是否使用捕获，这个属性只在显示列表中生效。
         */
        public removeEventListener(type:string, listener:Function,thisObject:any,useCapture:boolean = false):void {

            var eventMap:Object = useCapture ? this._captureEventsMap : this._eventsMap;
            if(!eventMap)
                return;
            var list:Array<any> = eventMap[type];
            if (!list) {
                return;
            }
            this._removeEventBin(list,listener,thisObject);
            if(list.length==0){
                delete eventMap[type];
            }
        }
        /**
         * 在一个事件列表中按优先级插入事件对象
         */
        public _removeEventBin(list:Array<any>,listener:Function,thisObject:any):boolean{
            var length:number = list.length;
            for (var i:number = 0; i < length; i++) {
                var bin:any = list[i];
                if (bin.listener === listener&&bin.thisObject===thisObject) {
                    list.splice(i, 1);
                    return true
                }
            }
            return false;
        }

        /**
         * 检测是否存在监听器
         * @method egret.EventDispatcher#hasEventListener
         * @param type 事件名
         * @returns {boolean}
         * @stable A
         */
        public hasEventListener(type:string):boolean {
            return (this._eventsMap&&this._eventsMap[type] ||
                this._captureEventsMap&&this._captureEventsMap[type]);
        }
        /**
         * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
         * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
         * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
         * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
         * @method egret.EventDispatcher#willTrigger
         * @param type 事件名
         * @returns {boolean}
         */
        public willTrigger(type:string):boolean{
            return this.hasEventListener(type);
        }


        /**
         * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
         * @method egret.EventDispatcher#dispatchEvent
         * @param event {egret.Event} 调度到事件流中的 Event 对象。如果正在重新分派事件，则会自动创建此事件的一个克隆。 在调度了事件后，其 _eventTarget 属性将无法更改，因此您必须创建此事件的一个新副本以能够重新调度。
         * @returns {boolean} 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
         */
        public dispatchEvent(event:Event):boolean {
            event._reset();
            event._target = this._eventTarget;
            event._setCurrentTarget(this._eventTarget);
            return this._notifyListener(event);
        }

        public _notifyListener(event:Event):boolean{
            var eventMap:Object = event._eventPhase==1 ? this._captureEventsMap : this._eventsMap;
            if(!eventMap)
                return true;
            var list:Array<any> = eventMap[event.type];
            if (!list) {
                return true;
            }
            list = list.concat();
            var length:number = list.length;
            for(var i:number = 0;i<length;i++){
                var eventBin:any = list[i];
                eventBin.listener.call(eventBin.thisObject,event);
                if(event._isPropagationImmediateStopped){
                    break;
                }
            }
            return !event.isDefaultPrevented();
        }

        /**
         * 派发一个包含了特定参数的事件到所有注册了特定类型侦听器的对象中。 这个方法使用了一个内部的事件对象池因避免重复的分配导致的额外开销。
         * @method egret.EventDispatcher#dispatchEventWith
         * @param type {string} 事件类型
         * @param bubbles {boolean} 是否冒泡，默认false
         * @param data {any}附加数据(可选)
         */
        public dispatchEventWith(type:string, bubbles:boolean = false, data?:Object):void{
           Event.dispatchEvent(this,type,bubbles,data);
        }
    }
}