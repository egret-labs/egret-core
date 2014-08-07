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


module egret.gui {

	/**
	 * @class egret.gui.LayoutUtil
	 * @classdesc
	 * 布局工具类
	 */
	export class LayoutUtil{
		/**
		 * 根据对象当前的xy坐标调整其相对位置属性，使其在下一次的父级布局中过程中保持当前位置不变。
		 * @method egret.gui.LayoutUtil.adjustRelativeByXY
		 * @param element {IVisualElement} 要调整相对位置属性的对象
		 * @param parent {DisplayObjectContainer} element的父级容器。若不设置，则取element.parent的值。若两者的值都为空，则放弃调整。
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