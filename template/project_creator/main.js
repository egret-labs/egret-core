var app = {
    startGame: function () {
        container = new ns_egret.DisplayObjectContainer();
        context.stage.addChild(container);

        ns_egret.ResourceLoader.prefix = "../game/assets/";
        var res = new ns_egret.LoadingController();
        res.addResource("daisy.png", ns_egret.ResourceLoader.DATA_TYPE_IMAGE);
        res.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.resourceLoadComplete, this);
        res.load();
    },

    resourceLoadComplete: function () {
        var layer = GameLayer.getInstance();
        layer.createScene();
        container.addChild(layer);
    }
};
