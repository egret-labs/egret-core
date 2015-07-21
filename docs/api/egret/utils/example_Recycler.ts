/**
*   以下示例使用 RecyclerExample() 方法创建一个象缓存复用类，180帧后删除（稳定在1秒60帧）。
*/
class Main extends egret.DisplayObjectContainer {

    private intervalRecycler:number = 180; 

    private recycler: egret.Recycler
    public constructor() {
        super();
        this.RecyclerExample();
    }

    public RecyclerExample() {
        this.recycler = new egret.Recycler(this.intervalRecycler);
        for (var i: number = 0; i <= 20; ++i){
            this.recycler.push(this.creatShape());
        }
        console.log(this.recycler.length);//21
        var temp:egret.Shape = this.recycler.pop();
        this.addEventListener(egret.Event.ENTER_FRAME,this.enterFrameFunction,this);
    }

    private enterFrameFunction(event:egret.Event): void {
        console.log(this.recycler.length);
        //20
        //20
        //..
        //0
    }

    private creatShape(): egret.Shape{
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.lineStyle(11, 0xff0000);
        shape.graphics.drawCircle(0, 0, 50)
        shape.graphics.beginFill(0xff0000);
        shape.graphics.endFill();
        return shape;
    }

}