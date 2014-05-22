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

/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="../geom/Point.ts"/>

module ns_egret {

    export class TouchEvent extends Event {

        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @class ns_egret.TouchEvent
         * @classdesc TouchEvent数据类
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
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
         * @constant {string} ns_egret.TouchEvent.TOUCH_TAP
         */
        public static TOUCH_TAP:string = "touchTap";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         * @constant {string} ns_egret.TouchEvent.TOUCH_MOVE
         */
        public static TOUCH_MOVE:string = "touchMove";

        /**
         * 开始触摸,参考Flash的MouseEvent.MOUSE_DOWN
         * @constant {string} ns_egret.TouchEvent.TOUCH_BEGAN
         */
        public static TOUCH_BEGAN:string = "touchBegan";

        /**
         * 在同一对象上结束触摸,参考Flash的MouseEvent.MOUSE_UP
         * @constant {string} ns_egret.TouchEvent.TOUCH_END
         */
        public static TOUCH_END:string = "touchEnd";

        /**
         * 在对象外部结束触摸，参考Flash的MouseEvent.RELEASE_OUTSIDE
         * @constant {string} ns_egret.TouchEvent.TOUCH_RELEASE_OUTSIDE
         */
        public static TOUCH_RELEASE_OUTSIDE:string = "touchReleaseOutside";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         * @member ns_egret.TouchEvent.TOUCH_MOVE
         */
        public static TOUCH_ROLL_OUT:string = "touchRollOut";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         * @member ns_egret.TouchEvent.TOUCH_MOVE
         */
        public static TOUCH_ROLL_OVER:string = "touchRollOver";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        public static TOUCH_OUT:string = "touchOut";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         * @member ns_egret.TouchEvent.TOUCH_MOVE
         */
        public static TOUCH_OVER:string = "touchOver";


        public _stageX:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的水平坐标。
         * @member {number} ns_egret.TouchEvent#stageX
         */
        public get stageX():number {
            return this._stageX;
        }

        public _stageY:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的垂直坐标。
         * @member {number} ns_egret.TouchEvent#stageY
         */
        public get stageY():number {
            return this._stageY;
        }

        private _localX:number = 0;
        /**
         * 事件发生点相对于currentTarget的水平坐标。
         * @member {number} ns_egret.TouchEvent#localX
         */
        public get localX():number {
            return this._localX;
        }

        private _localY:number = 0;
        /**
         * 事件发生点相对于currentTarget的垂直坐标。
         * @member {number} ns_egret.TouchEvent#localY
         */
        public get localY():number {
            return this._localY;
        }

        /**
         * 分配给触摸点的唯一标识号
         */
        public touchPointID:number;
        /**
         * 事件发生时ctrl键是否被按下。 (Mac OS下为 Cmd 或 Ctrl)
         */
        public ctrlKey:boolean;
        /**
         * 事件发生时shift键是否被按下。
         */
        public shiftKey:boolean;
        /**
         * 事件发生时alt键是否被按下。
         */
        public altKey:boolean;
        /**
         * 表示触摸已按下 (true) 还是未按下 (false)。
         */
        public touchDown:boolean;

        public _setCurrentTarget(target:any):void {
            super._setCurrentTarget(target);
            if (target instanceof DisplayObject) {
                var dp:DisplayObject = <DisplayObject> target;
                var point:Point = dp.globalToLocal(this._stageX, this._stageY);
                this._localX = point.x;
                this._localY = point.y;
            }
        }

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.TouchEvent.dispathTouchEvent
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