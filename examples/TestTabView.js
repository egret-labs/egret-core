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
    return ["daisy.png", "b_1.png", "b_2.png"];
}

function getDescription(){
    return "Simple-GUI-TabView";
}



function createExample(){

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);

    var tab = new ns_egret.TabView();
    for (var i = 0; i < 5; i++) {
        var btn = new ns_egret.SimpleButton();
        btn.relativeAnchorPointX = 0.5;
        btn.relativeAnchorPointY = 0.5;

        tab.addChild(btn);
        var texture1 = ns_egret.TextureCache.getInstance().getTexture("b_1.png");
        var frame1 = ns_egret.Bitmap.initWithTexture(texture1);
        frame1.relativeAnchorPointX = 0.5;
        frame1.relativeAnchorPointY = 0.5;
        var rect = frame1.getBounds();
        btn.width = rect.width;
        btn.height = rect.height;
        frame1.x = rect.width / 2;
        frame1.y = rect.height / 2;
        btn.addChild(frame1);
        btn.initFrameRes("b_1.png", 1, frame1);
        btn.x = 50 + i * 80;
        btn.y = 250;
    }
    tab.init();
    tab.setDefaultTag(1);

    var tagCall = function (tag) {

    }
    tab.addOnClick(tagCall, this);

    container.addChild(tab);
}