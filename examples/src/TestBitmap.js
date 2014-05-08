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
function getResourceList(){
    return ["daisy.png"];
}

function getDescription(){
    return "这个项目展示了Bitmap的正常显示、位移、缩放、旋转、斜切";
}



function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");

    var bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap1);
    bitmap1.x = bitmap1.y = 50;
    container.touchEnabled = true;
    bitmap1.touchEnabled = true;
    bitmap1.width = bitmap1.height = 100;

    var bitmap2 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap2);
    bitmap2.x = 150;
    bitmap2.y = 50;
    bitmap2.scaleX = bitmap2.scaleY = 0.5;

    var bitmap3 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap3);
    bitmap3.x = 50;
    bitmap3.y = 150;
    bitmap3.rotation = 45;

    var bitmap4 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap4);
    bitmap4.x = 150;
    bitmap4.y = 150;
    bitmap4.skewX = 45;

    container.cacheAsBitmap(true);

}