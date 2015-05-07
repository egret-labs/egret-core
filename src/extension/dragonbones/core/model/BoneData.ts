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
	 * @class dragonBones.BoneData
	 * @classdesc
	 * 骨骼数据
	 */
	export class BoneData{
		/**
		 * 骨骼的名字
		 * @member {string} dragonBones.BoneData#name
		 */
		public name:string;
		/**
		 * 父骨骼的名字
		 * @member {string} dragonBones.BoneData#parent
		 */
		public parent:string;
		/**
		 * 长度，目前没什么用，默认值为0
		 * @member {number} dragonBones.BoneData#length
		 */
		public length:number;
		/**
		 * 绝对的transform
		 * @member {dragonBones.DBTransform} dragonBones.BoneData#global
		 */
		public global:DBTransform;
		/**
		 * 相对的transform
		 * @member {dragonBones.DBTransform} dragonBones.BoneData#transform
		 */
		public transform:DBTransform;
		/**
		 * 是否继承父骨骼的缩放属性
		 * @member {boolean} dragonBones.BoneData#inheritScale
		 */
		public inheritScale:boolean;
		/**
		 * 是否继承父骨骼的旋转属性
		 * @member {boolean} dragonBones.BoneData#inheritRotation
		 */
		public inheritRotation:boolean;
		/**
		 * 初始化各个属性
		 */
		public constructor(){
			this.length = 0;
			this.global = new DBTransform();
			this.transform = new DBTransform();
			this.inheritRotation = true;
			this.inheritScale = false;
		}
		/**
		 *释放资源
		 */
		public dispose():void{
			this.global = null;
			this.transform = null;
		}
	}
}