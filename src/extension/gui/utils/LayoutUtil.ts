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

/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../core/IVisualElement.ts"/>

module ns_egret {

	export class LayoutUtil{
		/**
		 * 根据对象当前的xy坐标调整其相对位置属性，使其在下一次的父级布局中过程中保持当前位置不变。
		 * @param element 要调整相对位置属性的对象
		 * @param parent element的父级容器。若不设置，则取element.parent的值。若两者的值都为空，则放弃调整。
		 */		
		public static adjustRelativeByXY(element:IVisualElement,parent:DisplayObjectContainer=null):void{
			if(!element)
				return;
			if(!parent)
				parent = element.parent;
			if(!parent)
				return;
			var x:number = element.x;
			var y:number = element.y;
			var h:number = element.layoutBoundsHeight;
			var w:number = element.layoutBoundsWidth;
			var parentW:number = parent.width;
			var parentH:number = parent.height;
			if(!isNaN(element.left)){
				element.left = x;
			}
			if(!isNaN(element.right)){
				element.right = parentW - x - w;
			}
			if(!isNaN(element.horizontalCenter)){
				element.horizontalCenter = x + w*0.5 - parentW*0.5;
			}
			
			if(!isNaN(element.top)){
				element.top = y;
			}
			if(!isNaN(element.bottom)){
				element.bottom = parentH - y - h;
			}
			if(!isNaN(element.verticalCenter)){
				element.verticalCenter = h*0.5-parentH*0.5+y;
			}
		}
	}
}