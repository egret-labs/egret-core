/**
*   以下示例使用 Timer 创建计时器,并侦听egret.TimerEvent.TIMER与egret.TimerEvent.TIMER_COMPLETE事件。
*/
class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        var timer: egret.Timer = new egret.Timer(1000, 5);

        timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);

        timer.start();
    }

    private timerFunc(event:egret.TimerEvent) {
        console.log("timerFunc count" + (<egret.Timer>event.target).currentCount);
        //timerFunc count1
        //timerFunc count2
        //timerFunc count3
        //timerFunc count4
        //timerFunc count5
    }

    private timerComFunc(event: egret.TimerEvent) {
        console.log("timerComFunc count" + (<egret.Timer>event.target).currentCount);
        ////timerFunc count5
    }

}