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
	 * @class dragonBones.Frame
	 * @classdesc
	 *关键帧数据
	 */
	export class Frame{
		/**
		 *位置
		 * @member {number} dragonBones.Frame#position
		 */
		public position:number = 0;
		/**
		 *持续时间
		 * @member {number} dragonBones.Frame#duration
		 */
		public duration:number = 0;
		/**
		 *帧标签
		 * @member {string} dragonBones.Frame#action
		 */
		public action:string;
		/**
		 *帧事件
		 * @member {string} dragonBones.Frame#event
		 */
		public event:string;
		/**
		 *帧声音
		 * @member {string} dragonBones.Frame#sound
		 */
		public sound:string;

		public curve:CurveData;

		/**
		 *构造函数
		 */
		public constructor(){
			this.position = 0;
			this.duration = 0;
		}

		/**
		 *释放资源
		 */
		public dispose():void{
		}
	}
}