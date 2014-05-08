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
    return "这个项目展示了box2d";
}

function createExample(){
    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var texture = ns_egret.TextureCache.getInstance().getTexture("daisy.png");
    var scaleBitmap = new ns_egret.Scale9Bitmap(texture);
    scaleBitmap.setScaleGrid(5,5,5,5);
    scaleBitmap.width = scaleBitmap.height = 200;
    scaleBitmap.x = 200;
    scaleBitmap.y = 200;
    container.addChild(scaleBitmap);
}