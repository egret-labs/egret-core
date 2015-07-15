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
	 * @class egret.gui.ITreeCollection
	 * @interface
	 * @classdesc
	 * Tree组件的集合类数据源对象接口 
	 * @extends egret.gui.ICollection
	 */
	export interface ITreeCollection extends ICollection{
		/**
		 * 检查指定的节点是否含有子节点
		 * @method egret.gui.ITreeCollection#hasChildren
		 * @param item {any} 要检查的节点
		 * @returns {boolean}
		 */		
		hasChildren(item:any):boolean;

		/**
		 * 指定的节点是否打开
		 * @method egret.gui.ITreeCollection#isItemOpen
		 * @param item {any} 
		 * @returns {boolean}
		 */		
		isItemOpen(item:any):boolean;

		/**
		 * 打开或关闭一个节点
		 * @method egret.gui.ITreeCollection#expandItem
		 * @param item {any} 要打开或关闭的节点
		 * @param open? {boolean} true表示打开节点，反之关闭。
		 */		
		expandItem(item:any,open?:boolean):void;

		/**
		 * 获取节点的深度
		 * @method egret.gui.ITreeCollection#getDepth
		 * @param item {any} 
		 * @returns {number}
		 */		
		getDepth(item:any):number;
	}
}