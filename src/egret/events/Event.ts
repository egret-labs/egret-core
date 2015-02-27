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
     * @classdesc
     * Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * Event 类的属性包含有关事件的基本信息，例如事件的类型或者是否可以取消事件的默认行为。
     * 对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置以及在触摸事件期间是否按下了任何键的其他信息。
     * 您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。
     * Event 类的方法可以在事件侦听器函数中使用以影响事件对象的行为。
     * 某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @link http://docs.egret-labs.org/post/manual/event/eventclass.html Event类
     */
    export class Event extends HashObject{


        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
            super();
            this._type = type;
            this._bubbles = bubbles;
            this._cancelable = cancelable;
        }


        /**
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         * @constant {string} egret.Event.ADDED_TO_STAGE
         */
        public static ADDED_TO_STAGE:string = "addedToStage";
        /**
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         * @constant {string} egret.Event.REMOVED_FROM_STAGE
         */
        public static REMOVED_FROM_STAGE:string = "removedFromStage";
        /**
         * 将显示对象添加到显示列表中时调度。以下方法会触发此事件：
         * DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         * @constant {string} egret.Event.ADDED
         */
        public static ADDED:string = "added";
        /**
         * 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         * @constant {string} egret.Event.REMOVED
         */
        public static REMOVED:string = "removed";
        /**
         * 完成
         * @constant {string} egret.Event.COMPLETE
         */
        public static COMPLETE:string = "complete";

        /**
         * 循环完成
         * @constant {string} egret.Event.LOOP_COMPLETE
         */
        public static LOOP_COMPLETE:string = "loopcomplete";

        /**
         * 主循环：进入新的一帧
         * @constant {string} egret.Event.ENTER_FRAME
         */
        public static ENTER_FRAME:string = "enterFrame";
        /**
         * 主循环：开始渲染
         * @constant {string} egret.Event.RENDER
         */
        public static RENDER:string = "render";
        /**
         * 主循环：渲染完毕
         * @constant {string} egret.Event.FINISH_RENDER
         */
        public static FINISH_RENDER:string = "finishRender";
        /**
         * 主循环：updateTransform完毕
         * @constant {string} egret.Event.FINISH_UPDATE_TRANSFORM
         */
        public static FINISH_UPDATE_TRANSFORM:string = "finishUpdateTransform";
        /**
         * 离开舞台。
         * @constant {string} egret.Event.LEAVE_STAGE
         */
        public static LEAVE_STAGE:string = "leaveStage";
        /**
         * 舞台尺寸发生改变
         * @constant {string} egret.Event.RESIZE
         */
        public static RESIZE:string = "resize";
        /**
         * 状态改变
         * @constant {string} egret.Event.CHANGE
         */
        public static CHANGE:string = "change";

        /**
         * 游戏激活
         * @constant {string} egret.Event.ACTIVATE
         */
        public static ACTIVATE:string = "activate";

        /**
         * 取消激活
         * @constant {string} egret.Event.DEACTIVATE
         */
        public static DEACTIVATE:string = "deactivate";


        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @constant {string} egret.Event.CLOSE
         */
        public static CLOSE:string = "close";

        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @constant {string} egret.Event.CONNECT
         */
        public static CONNECT:string = "connect";



        public data:any = null;

        public _type:string = "";
        /**
         * 事件的类型。类型区分大小写。
         * @member {string} egret.Event#type
         */
        public get type():string {
            return this._type;
        }

        public _bubbles:boolean = false;
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         * @member {boolean} egret.Event#bubbles
         */
        public get bubbles():boolean {
            return this._bubbles;
        }

        private _cancelable:boolean = false;
        /**
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         * @member {boolean} egret.Event#cancelable
         */
        public get cancelable():boolean {
            return this._cancelable;
        }

        public _eventPhase:number = 2;
        /**
         * 事件流中的当前阶段。此属性可以包含以下数值：
         * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
         * 目标阶段 (EventPhase.AT_TARGET)。
         * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
         * @member {boolean} egret.Event#eventPhase
         */
        public get eventPhase():number {
            return this._eventPhase;
        }

        public _currentTarget:any = null;
        /**
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
         * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
         * @member {any} egret.Event#currentTarget
         */
        public get currentTarget():any {
            return this._currentTarget;
        }

        public _target:any = null;
        /**
         * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
         * @member {any} egret.Event#target
         */
        public get target():any {
            return this._target;
        }

        public _isDefaultPrevented:boolean = false;

        /**
         * 检查是否已对事件调用 preventDefault() 方法。
         * @method egret.Event#isDefaultPrevented
         * @returns {boolean} 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         */
        public isDefaultPrevented():boolean {
            return this._isDefaultPrevented;
        }

        /**
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 注意：当cancelable属性为false时，此方法不可用。
         * @method egret.Event#preventDefault
         */
        public preventDefault():void {
            if (this._cancelable)
                this._isDefaultPrevented = true;
        }

        public _isPropagationStopped:boolean = false;

        /**
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @method egret.Event#stopPropagation
         */
        public stopPropagation():void {
            if (this._bubbles)
                this._isPropagationStopped = true;
        }

        public _isPropagationImmediateStopped:boolean = false;

        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @method egret.Event#stopImmediatePropagation
         */
        public stopImmediatePropagation():void {
            if (this._bubbles)
                this._isPropagationImmediateStopped = true;
        }

        private isNew:boolean = true;

        public _reset():void {
            if (this.isNew) {
                this.isNew = false;
                return;
            }
            this._isDefaultPrevented = false;
            this._isPropagationStopped = false;
            this._isPropagationImmediateStopped = false;
            this._target = null;
            this._currentTarget = null;
            this._eventPhase = 2;
        }

        public __recycle():void {
            this._currentTarget = null;
            this._target = null;
            this.data = null;
        }

        public static _dispatchByTarget(EventClass:any,target:IEventDispatcher,type:string,props?:Object,
                                        bubbles:boolean=false,cancelable:boolean = false):boolean{
            var recycler:Recycler = EventClass.eventRecycler;
            if(!recycler){
                recycler = EventClass.eventRecycler = new Recycler();
            }
            var event:Event = recycler.pop();
            if(!event){
                event = new EventClass(type);
            }
            else{
                event._type = type;
            }
            event._bubbles = bubbles;
            event._cancelable = cancelable;
            if(props){
                for(var key in props){
                    event[key] = props[key];
                    if(event[key]!==null){
                        props[key] = null;
                    }

                }
            }
            var result:boolean = target.dispatchEvent(event);
            recycler.push(event);
            return result;
        }

        public static _getPropertyData(EventClass:any):any{
            var props:any = EventClass._props;
            if(!props)
                props = EventClass._props = {};
            return props;
        }


        /**
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         */
        public static dispatchEvent(target:IEventDispatcher,type:string,bubbles:boolean=false,data?:any):void{
            var eventClass:any = Event;
            var props:any = Event._getPropertyData(eventClass);
            if(data){
                props.data = data;
            }
            Event._dispatchByTarget(eventClass,target,type,props,bubbles);
        }

    }
}