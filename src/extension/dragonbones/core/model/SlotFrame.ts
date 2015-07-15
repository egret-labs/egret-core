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
	 * @class dragonBones.SlotFrame
	 * @extends dragonBones.Frame
	 * @classdesc
	 * 插槽的关键帧数据，包含
	 * 插槽的显示序号，可见度，zOrder，colorTransform数据
	 */
	export class SlotFrame extends Frame{
		/**
		 * NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
		 * 缓动值，
		 * 当值为NaN时，没有缓动
		 * 当值为10时，为自动
		 * 当值为[-1,0)时，为缓进
		 * 当值为0时，为线性缓动
		 * 当值为(0, 1]时，为缓出
		 * 当值为(1, 2]时，为缓进缓出
		 * @member {number} dragonBones.TransformFrame#tweenEasing
		 */
		public tweenEasing:number;

		/**
		 *绑定到该插槽的显示序号，当插槽有多个显示对象时，指定显示哪一个显示对象
		 * @member {number} dragonBones.SlotFrame#displayIndex
		 */
		public displayIndex:number = 0;
		/**
		 *是否可见
		 * @member {boolean} dragonBones.SlotFrame#visible
		 */
		public visible:boolean;
		/**
		 *绑定到该插槽的zOrder值
		 * @member {number} dragonBones.SlotFrame#zOrder
		 */
		public zOrder:number;
		/**
		 *绑定到插槽的颜色transform，颜色的transform可以表示颜色在红蓝绿透明四个通道的变化
		 * @member {dragonBones.ColorTransform} dragonBones.SlotFrame#color
		 */
		public color:ColorTransform;
		
		/**
		 *构造函数，实例化一个SlotFrame
		 */
		public constructor(){
			super();
			
			this.tweenEasing = 10;
			this.displayIndex = 0;
			this.visible = true;
			this.zOrder = NaN;
		}
		
		/**
		 *释放资源
		 */
		public dispose():void{
			super.dispose();
			this.color = null;
		}
	}
}