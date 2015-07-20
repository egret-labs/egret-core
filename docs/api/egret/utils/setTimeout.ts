/**
*   以下示例使用 setTimeout() 方法在指定的延迟期之后调用另一个方法。
*/
class Main extends egret.DisplayObjectContainer {

    private delay:number = 1000; // delay before calling myDelayedFunction

    public constructor() {
        super();
        this.SetTimeoutExample();
    }

    public SetTimeoutExample():number {
        var intervalId: number = egret.setTimeout(this.myDelayedFunction,this, this.delay, ["Hello", "World"]);
        return intervalId;
    }

    private myDelayedFunction(obj:any): void {
        console.log(obj[0] + " " + obj[1]);//Hello World
    }

}