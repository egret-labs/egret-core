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
    return "Simple-GUI-TableView";
}


function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var scroll = new ns_egret.TableView();
    container.addChild(scroll);
    scroll.x = 200;
    scroll.y = 100;
    scroll.width = 200;
    scroll.height = 240;
    scroll.setList([1, 2, 3, 4, 5, 6, 7, 8, 9], ns_egret.Direction.HORIZONTAL, this, 40, 40);
}

function createItemRenderer() {
    var item = new ns_egret.DisplayObjectContainer();
    var texture = ns_egret.TextureCache.getInstance().getTexture("b_1.png");
    var bitmap1 = ns_egret.Bitmap.initWithTexture(texture);
    item.addChild(bitmap1);

    return item;
}

function updateItemRenderer(){

}

