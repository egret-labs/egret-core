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
module ns_egret {

    export class StageText {

        private div;
        private inputElement;

        constructor() {

        }

        public getText() {
            return this.inputElement.value;
        }

        public setText(value) {
            this.inputElement.value = value;
        }

        public open(x:number, y:number, width:number = 100, height:number = 20) {

//            return;
            var div = ns_egret.Browser.getInstance().$new("div");
            var inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.style.fontSize = "20px";
            inputElement.style.color = "#FFFFFF";
            inputElement.style.border = 0;
            inputElement.style.background = "transparent";
            inputElement.style.width = "100%";
            inputElement.style.height = "100%";
            inputElement.style.active = 0;

            inputElement.style.outline = "medium";

            div.style.position = 'absolute';
            div.position.x = x * ns_egret.StageDelegate.getInstance().getScaleX();
            div.style.width = width * ns_egret.StageDelegate.getInstance().getScaleX() + "px";
            div.style.height = height * ns_egret.StageDelegate.getInstance().getScaleY() + "px";
            div.position.y = y * ns_egret.StageDelegate.getInstance().getScaleY();
            div.transforms();
            div.appendChild(inputElement);

            var stageDelegateDiv = ns_egret.Browser.getInstance().$("#StageDelegateDiv");
            if (!stageDelegateDiv) {
                var container = document.getElementById(ns_egret.StageDelegate.canvas_div_name);
                var height = container.style.height.split("px")[0];//todo
                var width = container.style.width.split("px")[0];
                stageDelegateDiv = ns_egret.Browser.getInstance().$new("div");
                stageDelegateDiv.id = "StageDelegateDiv";
                stageDelegateDiv.style.position = 'absolute';
                stageDelegateDiv.style.width = width + "px";
                stageDelegateDiv.style.maxHeight = height + "px";
                stageDelegateDiv.style.margin = 0;

                var canvas = document.getElementById(ns_egret.StageDelegate.canvas_div_name);
                canvas.appendChild(stageDelegateDiv);
                stageDelegateDiv.position.y = -height;
                stageDelegateDiv.transforms();
            }
            stageDelegateDiv.appendChild(div);
            this.div = div;
            this.inputElement = inputElement;
        }

        public remove() {
            var div = this.div;
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }

        }

    }
}