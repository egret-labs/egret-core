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

/// <reference path="../Browser.ts"/>
/// <reference path="../StageDelegate.ts"/>
/// <reference path="../../utils/HashObject.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.StageText
	 * @classdesc
	 * @extends ns_egret.HashObject
	 */
    export class StageText extends HashObject{

        private div:HTMLDivElement;
        private inputElement:HTMLInputElement;

        constructor() {
            super();
        }

		/**
		 * @method ns_egret.StageText#getText
		 * @returns {string}
		 */
        public _getText():string {
            return this.inputElement.value;
        }

		/**
		 * @method ns_egret.StageText#setText
		 * @param value {string} 
		 */
        public _setText(value:string):void {
            this.inputElement.value = value;
        }

		/**
		 * @method ns_egret.StageText#setTextType
		 * @param type {string} 
		 */
        public _setTextType(type:string):void {
            this.inputElement.type = type;
        }

		/**
		 * @method ns_egret.StageText#getTextType
		 * @returns {string}
		 */
        public _getTextType():string {
            return this.inputElement.type;
        }

		/**
		 * @method ns_egret.StageText#open
		 * @param x {number} 
		 * @param y {number} 
		 * @param width {number} 
		 * @param height {number} 
		 */
        public _open(x:number, y:number, width:number = 160, height:number = 21):void {


            var scaleX = ns_egret.StageDelegate.getInstance().getScaleX();
            var scaleY = ns_egret.StageDelegate.getInstance().getScaleY();

            var inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.style.fontSize = "20px";
            inputElement.style.color = "#FFFFFF";
            inputElement.style.borderStyle = "none";
            inputElement.style.background = "none";
            inputElement.style.width = width * scaleX + "px";
            inputElement.style.height = height * scaleY + "px";
            inputElement.style.outline = "medium";

            var div = ns_egret.Browser.getInstance().$new("div");
            div.style.position = 'absolute';
            div.position.x = x * scaleX;
            div.style.width = width * scaleX + "px";
            div.style.height = height * scaleY + "px";
            div.position.y = y * scaleY;
            div.transforms();
            div.appendChild(inputElement);

            var stageDelegateDiv = ns_egret.Browser.getInstance().$("#StageDelegateDiv");
            if (!stageDelegateDiv) {
                var container = document.getElementById(ns_egret.StageDelegate.canvas_div_name);
                var height = container.clientHeight;
                var width = container.clientWidth;
                stageDelegateDiv = ns_egret.Browser.getInstance().$new("div");
                stageDelegateDiv.id = "StageDelegateDiv";
                stageDelegateDiv.style.position = 'absolute';
                stageDelegateDiv.style.width = width + "px";
                stageDelegateDiv.style.maxHeight = height + "px";
                stageDelegateDiv.style.margin = 0 + "px";

                var canvas = document.getElementById(ns_egret.StageDelegate.canvas_div_name);
                canvas.appendChild(stageDelegateDiv);
                stageDelegateDiv.position.y = -height;
                stageDelegateDiv.transforms();
            }
            stageDelegateDiv.appendChild(div);
            this.div = div;
            this.inputElement = inputElement;
        }

		/**
		 * @method ns_egret.StageText#remove
		 */
        public _remove():void {
            var div = this.div;
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }

        }

    }
}