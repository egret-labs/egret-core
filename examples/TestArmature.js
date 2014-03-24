/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-1-9
 * Time: PM8:40
 * To change this template use File | Settings | File Templates.
 */

function getResourceList() {
    return ["armature/texture.png","armature/skeleton.json","armature/texture.json"];
}

function getDescription() {
    return "骨骼动画";
}

getJsonData = function (fileName) {
    return ns_egret.ResourceLoader.create(fileName).data;
}

function createExample() {
    var container = new ns_egret.DisplayObjectContainer();

    context.stage.addChild(container);
    context.stage.touchEnabled = true;
    container.x = 50;

    var skeletonData = this.getJsonData("armature/skeleton.json");
    var textureData = this.getJsonData("armature/texture.json");
    var texture = ns_egret.TextureCache.getInstance().getTexture("armature/texture.png");

    var factory = new dragonBones.factorys.EgretFactory();
    factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
    factory.addTextureAtlas(new dragonBones.textures.EgretTextureAtlas(texture, textureData));

    var armature = factory.buildArmature("Dragon");
    var armatureDisplay = armature.getDisplay();
    dragonBones.animation.WorldClock.clock.add(armature);
    container.addChild(armatureDisplay);
    container.blendMode = ns_egret.BlendMode.NORMAL;
    armatureDisplay.x = 300;
    armatureDisplay.y = 350;
    armature.animation.gotoAndPlay("walk");

    ns_egret.Ticker.getInstance().register(function (advancedTime) {
        dragonBones.animation.WorldClock.clock.advanceTime(advancedTime / 1000);
    }, this);
}