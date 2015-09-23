module eui {

    /**
     * @private
     */
    export class ScrollerThrowEvent extends egret.Event {

        public static THROW:string = "throw";

        /**
         * 滚动区域当前滚动位置
         */
        public currentPos:number;

        /**
         * 要滚动到的位置
         * 修改当前值会修改要滚动到得位置，但是当 moveFlag 为 false 时修改此值依然不会滚动，若此时依然要调整滚动区域的位置可以自己设置
         */
        public toPos:number;

        /**
         * 动画信息，可调节或修改
         */
        //public tween;


        public constructor(type:string, bubbles?:boolean, cancelable?:boolean,currentPos?:number,toPos?:number) {
            super(type, bubbles, cancelable);
            currentPos = +currentPos;
            toPos = +toPos;
            this.currentPos = currentPos;
            this.toPos = toPos;
        }
    }
}