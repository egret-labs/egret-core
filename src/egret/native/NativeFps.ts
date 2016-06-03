module egret.native {
    export class NativeFps extends egret.DisplayObject implements egret.FPSDisplay {
        constructor(stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string,styles:Object){
            super();
        }
        public update(drawCalls:number, dirtyRatio:number, ...args){

        };
        public updateInfo(info:string){

        }
    }
    egret.FPSDisplay = NativeFps;
}