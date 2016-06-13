module egret {
    export interface FPSDisplay extends DisplayObject {
        /**
         * 更新FPS信息
         */
        update(datas:FPSData):void;

        /**
         * 插入一条日志信息
         */
        updateInfo(info:string):void;
    }
    export var FPSDisplay:{
        new (stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string,styles:Object): FPSDisplay
    };
}
interface FPSData extends Object{
    fps:number;
    draw:number;
    dirty:number;
    costTicker:number;
    costDirty:number;
    costRender:number;
}