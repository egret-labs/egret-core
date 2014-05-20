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

/// <reference path="IItemRenderer.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ITreeItemRenderer
	 * @interface
	 * @classdesc
	 * 树状列表组件的项呈示器接口
	 * @extends ns_egret.IItemRenderer
	 */
	export interface ITreeItemRenderer extends IItemRenderer{
		/**
		 * 图标的皮肤名
		 * @member ns_egret.ITreeItemRenderer#iconSkinName
		 */
		iconSkinName:any;
		
		/**
		 * 缩进深度。0表示顶级节点，1表示第一层子节点，以此类推。
		 * @member ns_egret.ITreeItemRenderer#depth
		 */
		depth:number;
		
		/**
		 * 是否含有子节点。
		 * @member ns_egret.ITreeItemRenderer#hasChildren
		 */
		hasChildren:boolean;

		/**
		 * 节点是否处于开启状态。
		 * @member ns_egret.ITreeItemRenderer#opened
		 */
		opened:boolean;
	}
}