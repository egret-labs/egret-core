
module egret.gui {

    export class InterruptionBehavior{
        /**
         * 指定一个过渡（可中断另一个正在运行的过渡）在开始之前结束另一个过渡。
         * 通过对过渡中的所有效果调用 end() 方法来结束过渡。end() 方法导致所有效果到达结束状态。
         */
        public static END:string = "end";

        /**
         * 指定一个过渡（可中断另一个正在运行的过渡）在开始之前停止正在进行的其它过渡。
         * 通过对过渡中的所有效果调用 stop() 方法来停止过渡。
         */
        public static STOP:string = "stop";

        public constructor(){
        }
    }
}