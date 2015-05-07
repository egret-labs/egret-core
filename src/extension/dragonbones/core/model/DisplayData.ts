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


module dragonBones {

	/**
	 * @class dragonBones.DisplayData
	 * @classdesc
	 * 显示对象的数据，目前支持图片和子骨架
	 */
	export class DisplayData{
		/**
		 * 子骨架类型
		 */
		public static ARMATURE:string = "armature";
		/**
		 * 图片类型
		 */
		public static IMAGE:string = "image";
		/**
		 * 显示对象的名字
		 * @member {string} dragonBones.DisplayData#name
		 */
		public name:string;
		/**
		 * 显示对象的类型，枚举型，目前支持图片IMAGE和子骨架ARMATURE
		 * @member {string} dragonBones.DisplayData#type
		 */
		public type:string;
		/**
		 * 变换矩阵Transform表示位移，旋转，缩放，三种属性
		 * @member {dragonBones.DBTransform} dragonBones.DisplayData#transform
		 */
		public transform:DBTransform;
		/**
		 * 注册点，旋转中心
		 * @member {dragonBones.Point} dragonBones.DisplayData#pivot
		 */
		public pivot:Point;

		/**
		 * 初始化变换矩阵为单位矩阵
		 * 注册点为{0，0}点
		 */
		public constructor(){
			this.transform = new DBTransform();
			this.pivot = new Point();
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
			this.transform = null;
			this.pivot = null;
		}
	}
}