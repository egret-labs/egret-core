/**
 * Created by apple on 14-3-22.
 */

class LoadingUI implements ILoadingView {

    private container;
    private textField;

    addToStage():void {
        this.container = new ns_egret.DisplayObjectContainer();
        this.textField = new ns_egret.TextField();
        ns_egret.MainContext.instance.stage.addChild(this.container);
        this.container.addChild(this.textField);
        this.textField.x = 120;
        this.textField.y = 300;
        this.textField.setContentSize(480, 100);
        this.textField.align = "middle";
    }

    removeFromStage():void {
        this.container.parent.removeChild(this.container);
    }

    onProgress(current, total):void {
        this.textField.text = "游戏加载中..." + current + "/" + total;
    }
}
