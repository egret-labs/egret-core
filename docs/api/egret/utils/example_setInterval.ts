/**
*   以下示例使用 setInterval() 方法创建一个计时间隔，以 1 秒的固定间隔调用 myRepeatingFunction() 方法。
*/
class Main extends egret.DisplayObjectContainer {

    private intervalDuration:number = 1000; // duration between intervals, in milliseconds

    public constructor() {
        super();
        this.SetIntervalExample();
    }

    public SetIntervalExample() {
        var intervalId: number = egret.setInterval(this.myRepeatingFunction,this,this.intervalDuration, ["Hello", "World"]);
    }
    private myRepeatingFunction(obj:any): void {
        console.log(obj[0] + " " + obj[1]);
    }

}