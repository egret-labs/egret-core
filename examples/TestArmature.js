/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
    armatureDisplay.x = 300;
    armatureDisplay.y = 350;
    armature.animation.gotoAndPlay("walk");

    ns_egret.Ticker.getInstance().register(function (advancedTime) {
        dragonBones.animation.WorldClock.clock.advanceTime(advancedTime / 1000);
    }, this);
}