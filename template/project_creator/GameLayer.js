var GameLayer = (function (_super) {
    __extends(GameLayer, _super);
    function GameLayer() {
        _super.call(this);
    }
    GameLayer.instance = null;
    GameLayer.getInstance = function () {
        if (GameLayer.instance == null) {
            GameLayer.instance = new GameLayer();
        }
        return GameLayer.instance;
    };

    GameLayer.prototype.createScene = function () {
        var textField = new ns_egret.TextField();
        this.addChild(textField);
        textField.text = "Hello World!";

        var bitmap = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("daisy.png"));
        bitmap.x = 50;
        bitmap.y = 50;
        this.addChild(bitmap);
    };
    return GameLayer;
})(ns_egret.DisplayObjectContainer);
