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
	 * @class egret.gui.ILayoutElement
	 * @interface
	 * @classdesc
	 * 可布局元素接口
	 * @extends egret.IEventDispatcher
	 */
	export interface ILayoutElement extends IEventDispatcher{
		/**
		 * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
		 * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
		 * @member egret.gui.ILayoutElement#includeInLayout
		 */		
		includeInLayout:boolean;
		/**
		 * 距父级容器离左边距离
		 * @member egret.gui.ILayoutElement#left
		 */		
		left:number;
		/**
		 * 距父级容器右边距离
		 * @member egret.gui.ILayoutElement#right
		 */
		right:number;
		/**
		 * 距父级容器顶部距离
		 * @member egret.gui.ILayoutElement#top
		 */
		top:number;
		/**
		 * 距父级容器底部距离
		 * @member egret.gui.ILayoutElement#bottom
		 */		
		bottom:number;
		/**
		 * 在父级容器中距水平中心位置的距离
		 * @member egret.gui.ILayoutElement#horizontalCenter
		 */		
		horizontalCenter:number;
		/**
		 * 在父级容器中距竖直中心位置的距离
		 * @member egret.gui.ILayoutElement#verticalCenter
		 */	
		verticalCenter:number;
		/**
		 * 相对父级容器宽度的百分比
		 * @member egret.gui.ILayoutElement#percentWidth
		 */		
		percentWidth:number;
		/**
		 * 相对父级容器高度的百分比
		 * @member egret.gui.ILayoutElement#percentHeight
		 */		
		percentHeight:number;
		
		/**
		 * 组件的首选x坐标,常用于父级的measure()方法中
		 * @member egret.gui.ILayoutElement#preferredX
		 */		
		preferredX:number;
		
		/**
		 * 组件的首选y坐标,常用于父级的measure()方法中
		 * @member egret.gui.ILayoutElement#preferredY
		 */
		preferredY:number;
		
		/**
		 * 组件水平方向起始坐标
		 * @member egret.gui.ILayoutElement#layoutBoundsX
		 */		
		layoutBoundsX:number;
		/**
		 * 组件竖直方向起始坐标
		 * @member egret.gui.ILayoutElement#layoutBoundsY
		 */		
		layoutBoundsY:number;
		
		
		/**
		 * 组件的首选宽度,常用于父级的measure()方法中
		 * 按照：外部显式设置宽度>测量宽度 的优先级顺序返回宽度
		 * 注意:此数值已经包含了scaleX的值
		 * @member egret.gui.ILayoutElement#preferredWidth
		 */		
		preferredWidth:number;
		
		/**
		 * 组件的首选高度,常用于父级的measure()方法中
		 * 按照：外部显式设置高度>测量高度 的优先级顺序返回高度
		 * 注意:此数值已经包含了scaleY的值
		 * @member egret.gui.ILayoutElement#preferredHeight
		 */
		preferredHeight:number;
		/**
		 * 组件的布局宽度,常用于父级的updateDisplayList()方法中
		 * 按照：布局宽度>外部显式设置宽度>测量宽度 的优先级顺序返回宽度
		 * 注意:此数值已经包含了scaleX的值
		 * @member egret.gui.ILayoutElement#layoutBoundsWidth
		 */		
		layoutBoundsWidth:number;
		/**
		 * 组件的布局高度,常用于父级的updateDisplayList()方法中
		 * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
		 * 注意:此数值已经包含了scaleY的值
		 * @member egret.gui.ILayoutElement#layoutBoundsHeight
		 */		
		layoutBoundsHeight:number;
		/**
		 * 表示从注册点开始应用的对象的水平缩放比例（百分比）。默认注册点为 (0,0)。1.0 等于 100% 缩放。 
		 * @member egret.gui.ILayoutElement#scaleX
		 */		
		scaleX:number;
		/**
		 * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。默认注册点为 (0,0)。1.0 是 100% 缩放。
		 * @member egret.gui.ILayoutElement#scaleY
		 */		
		scaleY:number;
		/**
		 * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
		 * @member egret.gui.ILayoutElement#maxWidth
		 */	
		maxWidth:number;
		/**
		 * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
		 * @member egret.gui.ILayoutElement#minWidth
		 */
		minWidth:number;
		/**
		 * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
		 * @member egret.gui.ILayoutElement#maxHeight
		 */
		maxHeight:number;
		/**
		 * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
		 * @member egret.gui.ILayoutElement#minHeight
		 */
		minHeight:number;
		/**
		 * 设置组件的布局宽高,此值应已包含scaleX,scaleY的值
		 * @method egret.gui.ILayoutElement#setLayoutBoundsSize
		 * @param width {number} 
		 * @param height {number} 
		 */		
		setLayoutBoundsSize(width:number,height:number):void;
		/**
		 * 设置组件的布局位置
		 * @method egret.gui.ILayoutElement#setLayoutBoundsPosition
		 * @param x {number} 
		 * @param y {number} 
		 */		
		setLayoutBoundsPosition(x:number,y:number):void;
	}
}