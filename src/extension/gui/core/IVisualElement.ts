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


module egret.gui {

	/**
	 * @class egret.gui.IVisualElement
	 * @interface
	 * @classdesc
	 * 可视元素接口
	 * @extends egret.gui.ILayoutElement
	 */	
	export interface IVisualElement extends ILayoutElement{
		/**
		 * 此IVisualElement对象的所有者。<br/>
		 * 0.默认情况下，owner指向parent属性的值。<br/>
		 * 1.当此对象被PopUpAnchor组件弹出时，owner指向PopUpAnchor<br/>
		 * 2.当此对象作为皮肤内contentGroup的子项时，owner指向主机组件SkinnableContainer<br/>
		 * 3.当此对象作为ItemRenderer时，owner指向DataGroup或者主机组件SkinnableDataContainer<br/>
		 * 4.当此对象作为非显示对象容器IContainer的子项时,owner指向IContainer。
		 * @member egret.gui.IVisualElement#owner
		 */		
		owner:any;
		/**
		 * owner属性由框架内部管理，请不要自行改变它的值，否则可能引发未知的问题。
		 * @method egret.gui.IVisualElement#ownerChanged
		 * @param value {Object} 
		 */		
		ownerChanged(value:Object):void;
		/**
		 * 元素名称。此属性在TabNavigator里作为选项卡显示的字符串。
		 * @member egret.gui.IVisualElement#name
		 */		
		name:string;
		/**
		 * 此组件的父容器或组件。
		 * 只有可视元素应该具有 parent 属性。
		 * 非可视项目应该使用其他属性引用其所属对象。
		 * 一般而言，非可视对象使用 owner 属性引用其所属对象。
		 * @member egret.gui.IVisualElement#parent
		 */
		parent:DisplayObjectContainer;
		
		/**
		 * 控制此可视元素的可见性。如果为 true，则对象可见。 
		 * @member egret.gui.IVisualElement#visible
		 */		
		visible:boolean;
		
		/**
		 * 表示指定对象的 Alpha 透明度值。有效值为 0（完全透明）到 1（完全不透明）。默认值为 1。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
		 * @member egret.gui.IVisualElement#alpha
		 */		
		alpha:number;
		/**
		 * 组件宽度
		 * @member egret.gui.IVisualElement#width
		 */		
		width:number;
		
		/**
		 * 组件高度
		 * @member egret.gui.IVisualElement#height
		 */		
		height:number;
		
		/**
		 * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
		 * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 
		 * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 
		 * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
		 * @constant egret.gui.IVisualElement#x
		 */		
		x:number;
		/**
		 * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
		 * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 
		 * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 
		 * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
		 * @constant egret.gui.IVisualElement#y
		 */		
		y:number;
	}
}