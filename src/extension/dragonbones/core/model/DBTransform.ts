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


module dragonBones {

	/**
	 * @class dragonBones.DBTransform
	 * @classdesc
	 * Dragonbones中使用的transform
	 * 可以表示位移，旋转，缩放三种属性
	 */
	export class DBTransform{
		/**
		 * x坐标值
		 * @member {number} dragonBones.DBTransform#x
		 */
		public x:number;
		/**
		 * y坐标值
		 * @member {number} dragonBones.DBTransform#y
		 */
		public y:number;
		/**
		 * x方向的斜切，一般和skewY一起变化，可以表示旋转
		 * @member {number} dragonBones.DBTransform#skewX
		 */
		public skewX:number;
		/**
		 * y方向的斜切，一般和skewX一起变化，可以表示旋转
		 * @member {number} dragonBones.DBTransform#skewY
		 */
		public skewY:number;
		/**
		 * x方向的缩放
		 * @member {number} dragonBones.DBTransform#scaleX
		 */
		public scaleX:number;
		/**
		 * y方向的缩放
		 * @member {number} dragonBones.DBTransform#scaleY
		 */
		public scaleY:number;
		/**
		 * 旋转，用弧度表示
		 * @member {number} dragonBones.DBTransform#rotation
		 */
		public get rotation():number{
			return this.skewX;
		}
		public set rotation(value:number){
			this.skewX = this.skewY = value;
		}
		/**
		 * 创建一个 DBTransform 实例.
		 */
		public constructor(){
			this.x = 0;
			this.y = 0;
			this.skewX = 0;
			this.skewY = 0;
			this.scaleX = 1
			this.scaleY = 1;
		}
		/**
		 * 拷贝传入的transfrom实例的所有属性
		 * @param node
		 */
		public copy(transform:DBTransform):void{
			this.x = transform.x;
			this.y = transform.y;
			this.skewX = transform.skewX;
			this.skewY = transform.skewY;
			this.scaleX = transform.scaleX;
			this.scaleY = transform.scaleY;
		}
		/**
		 * 把DBTransform的所有属性转成用String类型表示
		 * @return 一个字符串包含有DBTransform的所有属性
		 */
		public toString():string{
			var string:string = "x:" + this.x + " y:" + this.y + " skewX:" + this.skewX + " skewY:" + this.skewY + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
			return string;
		}
	}
}