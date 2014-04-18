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
    return "ns_egret.RenderFilter.getInstance().addDrawArea(new ns_egret.Rectangle(100,0,500,500));\n\n" +
        "ns_egret.MainContext.instance.rendererContext.canvasContext.setTransform(1, 0, 0, 1, 0, 0);" +
        "ns_egret.MainContext.instance.rendererContext.canvasContext.clearRect(0,0,500,500);\n\n" +
        "测试cacheAsBitmap:\n" +
        "container.cacheAsBitmap(true);\n" +
        "bitmap1.cacheAsBitmap(true);\n" +
        "bitmap2.cacheAsBitmap(true);\n" +
        "bitmap3.cacheAsBitmap(true);\n" +
        "bitmap4.cacheAsBitmap(true);\n\n" +
        "container.mask = {x:100,y:100,width:100,height:100}";
}

function createExample(){

    container = new ns_egret.DisplayObjectContainer();
    container.scaleX = 2;
    context.stage.addChild(container);
    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");

    bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap1);
    bitmap1.x = bitmap1.y = 50;

    bitmap2 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap2);
    bitmap2.x = 75;
    bitmap2.y = 75;

    bitmap3 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap3);
    bitmap3.scaleX = bitmap3.scaleY = 2;
    bitmap3.x = 50;
    bitmap3.y = 150;

    bitmap4 = ns_egret.Bitmap.initWithTexture(texture);
    container.addChild(bitmap4);
    bitmap4.x = 250;
    bitmap4.y = 250;
    bitmap4.rotation = 90;

//    for(var i = 0 ; i < 1000;i++)
//    {
//        scaleBitmap = new ns_egret.Scale9Bitmap(texture);
//        scaleBitmap.setScaleGrid(15,15,35,35);
//        scaleBitmap.width = scaleBitmap.height = 190;
//        scaleBitmap.x = 40;
//        scaleBitmap.y = 100;
//        container.addChild(scaleBitmap);
//    }
}