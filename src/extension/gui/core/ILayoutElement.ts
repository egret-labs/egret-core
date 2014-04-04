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

	export interface ILayoutElement extends IEventDispatcher{
		/**
		 * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
		 * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
		 */		
		includeInLayout:boolean;
		/**
		 * 距父级容器离左边距离
		 */		
		left:number;
		/**
		 * 距父级容器右边距离
		 */
		right:number;
		/**
		 * 距父级容器顶部距离
		 */
		top:number;
		/**
		 * 距父级容器底部距离
		 */		
		bottom:number;
		/**
		 * 在父级容器中距水平中心位置的距离
		 */		
		horizontalCenter:number;
		/**
		 * 在父级容器中距竖直中心位置的距离
		 */	
		verticalCenter:number;
		/**
		 * 相对父级容器宽度的百分比
		 */		
		percentWidth:number;
		/**
		 * 相对父级容器高度的百分比
		 */		
		percentHeight:number;
		
		/**
		 * 组件的首选x坐标,常用于父级的measure()方法中
		 */		
		preferredX:number;
		
		/**
		 * 组件的首选y坐标,常用于父级的measure()方法中
		 */
		preferredY:number;
		
		/**
		 * 组件水平方向起始坐标
		 */		
		layoutBoundsX:number;
		/**
		 * 组件竖直方向起始坐标
		 */		
		layoutBoundsY:number;
		
		
		/**
		 * 组件的首选宽度,常用于父级的measure()方法中
		 * 按照：外部显式设置宽度>测量宽度 的优先级顺序返回宽度
		 * 注意:此数值已经包含了scaleX的值
		 */		
		preferredWidth:number;
		
		/**
		 * 组件的首选高度,常用于父级的measure()方法中
		 * 按照：外部显式设置高度>测量高度 的优先级顺序返回高度
		 * 注意:此数值已经包含了scaleY的值
		 */
		preferredHeight:number;
		/**
		 * 组件的布局宽度,常用于父级的updateDisplayList()方法中
		 * 按照：布局宽度>外部显式设置宽度>测量宽度 的优先级顺序返回宽度
		 * 注意:此数值已经包含了scaleX的值
		 */		
		layoutBoundsWidth:number;
		/**
		 * 组件的布局高度,常用于父级的updateDisplayList()方法中
		 * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
		 * 注意:此数值已经包含了scaleY的值
		 */		
		layoutBoundsHeight:number;
		/**
		 * 表示从注册点开始应用的对象的水平缩放比例（百分比）。默认注册点为 (0,0)。1.0 等于 100% 缩放。 
		 */		
		scaleX:number;
		/**
		 * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。默认注册点为 (0,0)。1.0 是 100% 缩放。
		 */		
		scaleY:number;
		/**
		 * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
		 */	
		maxWidth:number;
		/**
		 * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
		 */
		minWidth:number;
		/**
		 * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
		 */
		maxHeight:number;
		/**
		 * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
		 */
		minHeight:number;
		/**
		 * 设置组件的布局宽高,此值应已包含scaleX,scaleY的值
		 */		
		setLayoutBoundsSize(width:number,height:number):void;
		/**
		 * 设置组件的布局位置
		 */		
		setLayoutBoundsPosition(x:number,y:number):void;
	}
}