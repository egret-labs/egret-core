/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module ns_egret{

    export class Event {

        /**
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         */
        public static ADDED_TO_STAGE:string = "addedToStage";
        /**
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         */
        public static REMOVED_FROM_STAGE:string = "removedFromStage";
        /**
         * 将显示对象添加到显示列表中时调度。以下方法会触发此事件：
         * DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         */
        public static ADDED:string = "added";
        /**
         * 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         */
        public static REMOVED:string = "removed";
        /**
         * 完成
         */
        public static COMPLETE:string = "complete";

        /**
         * 主循环：进入新的一帧
         */
        public static ENTER_FRAME:string = "enterFrame";
        /**
         * 主循环：开始渲染
         */
        public static RENDER:string = "render";
        /**
         * 主循环：渲染完毕
         */
        public static FINISH_RENDER:string = "finishRender";
        /**
         * 主循环：updateTransform完毕
         */
        public static FINISH_UPDATE_TRANSFORM:string = "finishUpdateTransform";
        /**
         * 离开舞台，参考Flash的Event.MOUSE_LEAVE
         */
        public static LEAVE_STAGE:string = "leaveStage";



        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
            this._type = type;
            this._bubbles = bubbles;
            this._cancelable = cancelable;
        }

        public data:any;

        public _type:string;
        /**
         * 事件的类型。类型区分大小写。
         */
        public get type():string{
            return this._type;
        }

        public _bubbles:boolean;
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        public get bubbles():boolean{
            return this.bubbles;
        }

        private _cancelable:boolean;
        /**
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         */
        public get cancelable():boolean{
            return this._cancelable;
        }

        public _eventPhase:number = 2;
        /**
         * 事件流中的当前阶段。此属性可以包含以下数值：
         * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
         * 目标阶段 (EventPhase.AT_TARGET)。
         * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
         */
        public get eventPhase():number{
            return this._eventPhase;
        }

        private _currentTarget:any;
        /**
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
         * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
         */
        public get currentTarget():any{
            return this._currentTarget;
        }

        public _setCurrentTarget(target:any):void{
            this._currentTarget = target;
        }

        public _target:any;
        /**
         * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
         */
        public get target():any{
            return this._target;
        }

        private _isDefaultPrevented:boolean = false;
        /**
         * 检查是否已对事件调用 preventDefault() 方法。如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         */
        public isDefaultPrevented():boolean{
            return this._isDefaultPrevented;
        }

        /**
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 注意：当cancelable属性为false时，此方法不可用。
         */
        public preventDefault():void{
            if(this._cancelable)
                this._isDefaultPrevented = true;
        }

        public _isPropagationStopped:boolean = false;
        /**
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 (currentTarget) 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         */
        public stopPropagation():void{
            if(this._bubbles)
                this._isPropagationStopped = true;
        }

        public _isPropagationImmediateStopped:boolean = false;
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         */
        public stopImmediatePropagation():void{
            if(this._bubbles)
                this._isPropagationImmediateStopped = true;
        }

        private isNew:boolean = true;

        public _reset():void{
            if(this.isNew){
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


    }
}