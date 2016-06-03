module egret {
    export interface FPSDisplay extends DisplayObject {
        /**
         * 更新FPS信息
         */
        update(drawCalls:number, dirtyRatio:number, ...args):void;

        /**
         * 插入一条日志信息
         */
        updateInfo(info:string):void;
    }
    export var FPSDisplay:{
        new (stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string,styles:Object): FPSDisplay
    };
}