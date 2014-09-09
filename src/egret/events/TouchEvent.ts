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

    export class TouchEvent extends Event {

        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
		 *
         * @class egret.TouchEvent
         * @classdesc
         * TouchEvent事件类
         * @extends egret.Event
         * @constructor egret.TouchEvent
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
		 * @param touchPointID {number} 
		 * @param stageX {number} 
		 * @param stageY {number} 
		 * @param ctrlKey {boolean} 
		 * @param altKey {boolean} 
		 * @param shiftKey {boolean} 
		 * @param touchDown {boolean} 
         */
        public constructor(type:string, bubbles:boolean = true, cancelable:boolean = true,
                           touchPointID:number = 0, stageX:number = 0, stageY:number = 0,
                           ctrlKey:boolean=false,altKey:boolean=false,shiftKey:boolean=false,touchDown:boolean=false) {
            super(type, bubbles, cancelable);
            this.touchPointID = touchPointID
            this._stageX = stageX;
            this._stageY = stageY;
            this.ctrlKey = ctrlKey;
            this.altKey = altKey;
            this.touchDown = touchDown;
        }

        /**
         * 轻触，参考Flash的MouseEvent.CLICK
		 * @constant {string} egret.TouchEvent.TOUCH_TAP
         */
        public static TOUCH_TAP:string = "touchTap";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
		 * @constant {string} egret.TouchEvent.TOUCH_MOVE
         */
        public static TOUCH_MOVE:string = "touchMove";

        /**
         * 开始触摸,参考Flash的MouseEvent.MOUSE_DOWN
		 * @constant {string} egret.TouchEvent.TOUCH_BEGIN
         */
        public static TOUCH_BEGIN:string = "touchBegin";

        /**
         * 在同一对象上结束触摸,参考Flash的MouseEvent.MOUSE_UP
		 * @constant {string} egret.TouchEvent.TOUCH_END
         */
        public static TOUCH_END:string = "touchEnd";

        /**
         * 在对象外部结束触摸，参考Flash的MouseEvent.RELEASE_OUTSIDE
		 * @constant {string} egret.TouchEvent.TOUCH_RELEASE_OUTSIDE
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
         * @deprecated
         */
        public static TOUCH_OUT:string = "touchOut";

        /**
         * @deprecated
         */
        public static TOUCH_OVER:string = "touchOver";


        public _stageX:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的水平坐标。
		 * @member {number} egret.TouchEvent#stageX
         */
        public get stageX():number {
            return this._stageX;
        }

        public _stageY:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的垂直坐标。
		 * @member {number} egret.TouchEvent#stageY
         */
        public get stageY():number {
            return this._stageY;
        }

        /**
         * 事件发生点相对于currentTarget的水平坐标。
		 * @member {number} egret.TouchEvent#localX
         */
        public get localX():number {
            var dp:DisplayObject = <DisplayObject> this._currentTarget;
            var point:Point = dp.globalToLocal(this._stageX, this._stageY,Point.identity);
            return point.x;
        }

        /**
         * 事件发生点相对于currentTarget的垂直坐标。
		 * @member {number} egret.TouchEvent#localY
         */
        public get localY():number {
            var dp:DisplayObject = <DisplayObject> this._currentTarget;
            var point:Point = dp.globalToLocal(this._stageX, this._stageY,Point.identity);
            return point.y;
        }

        /**
         * 分配给触摸点的唯一标识号
		 * @member {number} egret.TouchEvent#touchPointID
         */
        public touchPointID:number;
        /**
         * 事件发生时ctrl键是否被按下。 (Mac OS下为 Cmd 或 Ctrl)
         * @deprecated
		 * @member {boolean} egret.TouchEvent#ctrlKey
         */
        public ctrlKey:boolean;
        /**
         * 事件发生时shift键是否被按下。
         * @deprecated
		 * @member {boolean} egret.TouchEvent#shiftKey
         */
        public shiftKey:boolean;
        /**
         * 事件发生时alt键是否被按下。
         * @deprecated
		 * @member {boolean} egret.TouchEvent#altKey
         */
        public altKey:boolean;
        /**
         * 表示触摸已按下 (true) 还是未按下 (false)。
		 * @member {boolean} egret.TouchEvent#touchDown
         */
        public touchDown:boolean;

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @method egret.TouchEvent.dispatchTouchEvent
		 * @param target {egret.IEventDispatcher} 
		 * @param type {string} 
		 * @param touchPointID {number} 
		 * @param stageX {number} 
		 * @param stageY {number} 
		 * @param ctrlKey {boolean} 
		 * @param altKey {boolean} 
		 * @param shiftKey {boolean} 
		 * @param touchDown {boolean} 
         */
        public static dispatchTouchEvent(target:IEventDispatcher,type:string,touchPointID:number = 0, stageX:number = 0, stageY:number = 0,
                                         ctrlKey:boolean=false,altKey:boolean=false,shiftKey:boolean=false,touchDown:boolean=false):void{
            var eventClass:any = TouchEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.touchPointID = touchPointID
            props._stageX = stageX;
            props._stageY = stageY;
            props.ctrlKey = ctrlKey;
            props.altKey = altKey;
            props.shiftKey = shiftKey;
            props.touchDown = touchDown;
            Event._dispatchByTarget(eventClass,target,type,props,true,true);
        }
    }
}