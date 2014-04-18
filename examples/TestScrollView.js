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
    return ["sprite_sheet.png", "b_1.png", "b_2.png"];
}

function getDescription() {
    return "这个项目展示了Bitmap的正常显示、位移、缩放、旋转、斜切";
}


function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var scroll = new ns_egret.ScrollView();
    container.addChild(scroll);
    scroll.x = 200;
    scroll.y = 100;
    scroll.width = scroll.height = 200;
    scroll.direction = ns_egret.Direction.HORIZONTAL;
    scroll.touchEnabled = true;

    var child = new ns_egret.DisplayObjectContainer();
    var texture = ns_egret.TextureCache.getInstance().getTexture("sprite_sheet.png");
    var bitmap = ns_egret.Bitmap.initWithTexture(texture);
    child.addChild(bitmap);
    var size = bitmap.getBounds();
    scroll.setContainer(child, size.width, size.height);

}