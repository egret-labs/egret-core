class GameLayer extends ns_egret.DisplayObjectContainer {
    private static instance:GameLayer = null;

    public static getInstance():GameLayer {
        if (GameLayer.instance == null) {
            GameLayer.instance = new GameLayer();
        }
        return GameLayer.instance;
    }

    public createScene():void {
        var textField:ns_egret.TextField = new ns_egret.TextField();
        this.addChild(textField);
        textField.text = "Hello World!";

        var bitmap:ns_egret.Bitmap = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("daisy.png"));
        bitmap.x = 50;
        bitmap.y = 50;
        this.addChild(bitmap);
    }
}
