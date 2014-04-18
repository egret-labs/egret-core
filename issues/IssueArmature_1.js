/**
 * Created with JetBrains WebStorm.
 * User: 王泽
 * Date: 14-3-12
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 */

function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);


    var skeletonData = this.getJsonData("action_fightWin_top_skeleton.json");
    var textureData = this.getJsonData("action_fightWin_top_texture.json");
    var texture = ns_egret.TextureCache.getInstance().getTexture("action_fightWin_top_texture.png");

    console.log (skeletonData,textureData,texture);
    var factory = new dragonBones.factorys.EgretFactory();
    factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
    factory.addTextureAtlas(new dragonBones.textures.EgretTextureAtlas(texture, textureData));


    var factory = new dragonBones.factorys.EgretFactory();
    factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
    factory.addTextureAtlas(new dragonBones.textures.EgretTextureAtlas(texture, textureData));

    var armature = factory.buildArmature("action_fightWin_top");
    var self = this;
    var onMovementEventHandler = function (e) {
        console.log("动画播放完成");
    }

    armature.addEventListener(dragonBones.events.AnimationEvent.LOOP_COMPLETE, onMovementEventHandler);

    var armatureDisplay = armature.getDisplay();

    dragonBones.animation.WorldClock.clock.add(armature);
    container.addChild(armatureDisplay);
    container.blendMode = ns_egret.BlendMode.NORMAL;
    armatureDisplay.x = 300;
    armatureDisplay.y = 500;
    armature.animation.gotoAndPlay(1);

    ns_egret.Ticker.getInstance().register(function (advancedTime) {
        dragonBones.animation.WorldClock.clock.advanceTime(advancedTime / 1000);
    }, this);

}

function getResourceList(){
    return [
        "action_fightWin_top_skeleton.json",
        "action_fightWin_top_texture.json",
        "action_fightWin_top_texture.png"
    ];
}

function getDescription(){
    return "特定动画一开始播放的时候会'抖动'";
}


getJsonData = function (fileName) {
    var data = ns_egret.ResourceLoader.create(fileName).data;
    return data;
}