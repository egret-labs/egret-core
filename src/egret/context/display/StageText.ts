/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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