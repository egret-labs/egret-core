//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module eui {

	/**
	 * @language en_US
	 * The IViewport interface is implemented by components that support a viewport.
	 *
	 * If a component's children are larger than the component,
	 * and you want to clip the children to the component boundaries, you can define a viewport.
	 *
	 * A viewport is a rectangular subset of the area of a component that you want to display,
	 * rather than displaying the entire component.
	 *
	 * @see eui.Scroller
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	/**
	 * @language zh_CN
	 * 支持视区的组件接口。
	 *
	 * 如果组件的内容子项比组件要大，而且您向往子项可以在父级组件的边缘处被裁减，您可以定义一个视区。
	 *
	 * 视区是您希望显示的组件的区域的矩形子集，而不是显示整个组件。
	 *
	 * @see eui.Scroller
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	export interface IViewport extends UIComponent{
		/**
		 * @language en_US
		 * The width of the viewport's contents.
		 *
		 * If <code>scrollEnabled</code> is true, the viewport's
		 * <code>contentWidth</code> defines the limit for horizontal scrolling
		 * and the viewport's actual width defines how much of the content is visible.
		 *
		 * To scroll through the content horizontally, vary the
		 * <code>scrollH</code> between 0 and
		 * <code>contentWidth - width</code>.
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 视域的内容的宽度。
		 *
		 * 如果 <code>scrollEnabled</code> 为 true， 则视域的 <code>contentWidth</code> 为水平滚动定义限制，
		 * 且视域的实际宽度定义可见的内容量。
		 *
		 * 要在内容中水平滚动， 请在 0 和 contentWidth - width 之间更改 <code>scrollH</code> 。
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		contentWidth:number;
		
		/**
		 * @language en_US
		 * The height of the viewport's content.
		 *
		 * If <code>scrollEnabled</code> is true, the viewport's
		 * <code>contentHeight</code> defines the limit for vertical scrolling
		 * and the viewport's actual height defines how much of the content is visible.
		 *
		 * To scroll through the content vertically, vary the
		 * <code>scrollV</code> between 0 and
		 * <code>contentHeight - height</code>.
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 视域的内容的高度。
		 *
		 * 如果 <code>scrollEnabled</code> 为 true，则视域的 <code>contentHeight</code> 为垂直滚动定义限制，
		 * 且视域的实际高度定义可见的内容量。要在内容中垂直滚动，请在 0 和 contentHeight - height
		 * 之间更改 <code>scrollV</code>。
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		contentHeight:number;
		
		/**
		 * @language en_US
		 * The x coordinate of the origin of the viewport in the component's coordinate system,
		 * where the default value is (0,0) corresponding to the upper-left corner of the component.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 可视区域水平方向起始点。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollH:number;
		
		/**
		 * @language en_US
		 * The y coordinate of the origin of the viewport in the component's coordinate system,
		 * where the default value is (0,0) corresponding to the upper-left corner of the component.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 可视区域竖直方向起始点。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollV:number;
		
		/**
		 * @language en_US
		 * If <code>true</code>, specifies to clip the children to the boundaries of the viewport.
		 * If <code>false</code>, the container children extend past the container boundaries,
		 * regardless of the size specification of the component.
		 *
		 * @default false
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 是否启用容器滚动。如果为 true，则将子项剪切到视区的边界，配合设置scrollH和scrollV属性将能滚动视区。
		 * 如果为 false，则容器子代会从容器边界扩展过去，而设置scrollH和scrollV也无效。默认false。
		 *
		 * @default false
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollEnabled:boolean;
	}
	
}