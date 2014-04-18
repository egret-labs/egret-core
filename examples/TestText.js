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
function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);




    var colorLabel = new ns_egret.TextField();
//    colorLabel.width = colorLabel.height = 0;
    colorLabel.textColor = "#ff0000";
    colorLabel.textAlign = "left";
    colorLabel.text = "这是一段居左的文字\n可以支持多行";
    container.addChild(colorLabel);


    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 0;
    colorLabel.y = 100;
    colorLabel.width = 120;
    colorLabel.height = 0;
    colorLabel.textColor = "#ff0000";
    colorLabel.textAlign = "center";
    colorLabel.text = "这是一段居中的文字，宽度设置120,字号设置30px,所以正好显示4个";
    container.addChild(colorLabel);


    var colorLabel = new ns_egret.TextField();
    colorLabel.x = 400;
    colorLabel.y = 250;
    colorLabel.width = 160;
    colorLabel.height = 0;
    colorLabel.relativeAnchorPointX = 1;
    colorLabel.textColor = "#FFFFFF";
    colorLabel.textAlign = "right";
    colorLabel.text = "这个文字居右对齐";
    container.addChild(colorLabel);



    var strokeLabel = new ns_egret.TextField();
    strokeLabel.x = 400;
    strokeLabel.y = 20;
    strokeLabel.textColor = "#FFFFFF";
    strokeLabel.text = "描边";
    strokeLabel.strokeColor = "#FF0000";
    strokeLabel.stroke = 2;
    container.addChild(strokeLabel);


}

function getResourceList(){
    return [];
}

function getDescription(){
    return "这个项目展示了文本的字号、颜色、自动换行";
}