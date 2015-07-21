/**
*   以下示例使用 ProfilerExample() 方法打开一个性能分析面板。
*/
class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.ProfilerExample();
    }

    public ProfilerExample() {
        //draw 渲染次数 
        //cost EnterFrame阶段的开销，引擎updateTransform开销，引擎draw开销，HTML5中canvas.draw的开销。
        //FPS  当前画面的帧频
        egret.Profiler.getInstance().run();
    }
}