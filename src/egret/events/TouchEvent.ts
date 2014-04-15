/**
 * Created by DOM on 2014/4/12.
 */
///<reference path="Event.ts"/>
module ns_egret{
    /**
     * Touch数据类
     */
    export class TouchEvent extends Event{

        /**
         * 轻触，参考Flash的MouseEvent.CLICK
         */
        static TOUCH_TAP:string = "touchTap";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        static TOUCH_MOVE:string = "touchMove";

        /**
         * 开始触摸,参考Flash的MouseEvent.MOUSE_DOWN
         */
        static TOUCH_BEGAN:string = "touchBegan";

        /**
         * 在同一对象上结束触摸,参考Flash的MouseEvent.MOUSE_UP
         */
        static TOUCH_END:string = "touchEnd";

        /**
         * 在对象外部结束触摸，参考Flash的MouseEvent.RELEASE_OUTSIDE
         */
        static TOUCH_RELEASE_OUTSIDE:string = "touchReleaseOutside";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        static TOUCH_ROLL_OUT:string = "touchRollOut";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        static TOUCH_ROLL_OVER:string = "touchRollOver";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        static TOUCH_OUT:string = "touchOut";

        /**
         * 移动，参考FLash的MouseEvent.MOVE
         */
        static TOUCH_OVER:string = "touchOver";

        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         */
        public constructor(type:string, bubbles:boolean=true, cancelable:boolean=true,
                           touchPointID:number=0,stageX:number=0,stageY:number=0){
            super(type,bubbles,cancelable);
            this.touchPointID = touchPointID
            this._stageX = stageX;
            this._stageX = stageY;
        }

        public _stageX:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的水平坐标。
         */
        public get stageX():number{
            return this._stageX;
        }

        public _stageY:number = 0;
        /**
         * 事件发生点在全局舞台坐标中的垂直坐标。
         */
        public get stageY():number{
            return this._stageY;
        }

        private _localX:number = 0;
        /**
         * 事件发生点相对于currentTarget的水平坐标。
         */
        public get localX():number{
            return this._localX;
        }

        private _localY:number = 0;
        /**
         * 事件发生点相对于currentTarget的垂直坐标。
         */
        public get localY():number{
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

        public _setCurrentTarget(target:any):void{
            super._setCurrentTarget(target);
            if(target instanceof DisplayObject){
                var dp:DisplayObject = <DisplayObject> target;
                var point:Point = dp.globalToLocal(this._stageX,this._stageY);
                this._localX = point.x;
                this._localY = point.y;
            }
        }
        /**
         * 立即刷新屏幕，此方法主要使用在当用户执行拖拽等操作过程中，强制立即刷新屏幕已提高流畅程度。
         */
        public updateAfterEvent():void{

        }

    }
}