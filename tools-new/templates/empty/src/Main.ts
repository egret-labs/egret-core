class Main extends egret.Sprite {

    public constructor() {
        super();
        var imageLoader = new egret.ImageLoader();
        imageLoader.load("http://img.lark.egret.com/lark.png");
        imageLoader.once(egret.Event.COMPLETE, this.showIcon, this);
    }

    public showIcon(e:egret.Event) {
        var imageLoader:egret.ImageLoader = e.target;
        var bitmap = new egret.Bitmap(imageLoader.data);
        var container = new egret.Sprite();
        container.addChild(bitmap);
        var text = new egret.TextField("Hello Lark");
        container.addChild(text);
        text.y = bitmap.height + 10;
        bitmap.x = (text.width-bitmap.width)*0.5;
        var stage = this.stage;
        container.x = (stage.stageWidth - bitmap.width) * 0.5;
        container.y = (stage.stageHeight - bitmap.height) * 0.5;
        this.addChild(container);
    }
}