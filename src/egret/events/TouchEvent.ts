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
         * 开始触摸,参考Flash MouseDown
         */
        static TOUCH_BEGAN:string = "touchBegan";

        /**
         * 结束触摸,参考Flash MouseUp
         */
        static TOUCH_END:string = "touchEnd";

        /**
         * 取消触摸,touchBegan目标会派发此事件
         */
        static TOUCH_CANCEL:string = "touchCancel";

        /**
         * 轻触，参考Flash MouseClick
         */
        static TOUCH_TAP:string = "touchTap";

        /**
         * 移动，参考FLash MouseMove
         */
        static TOUCH_MOVE:string = "touchMove";

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
         * todo 调用渲染接口
         */
        public updateAfterEvent():void{

        }

    }
}