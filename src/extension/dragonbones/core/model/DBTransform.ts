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

	export class DBTransform{
		/**
		 * Position on the x axis.
		 */
		public x:number;
		/**
		 * Position on the y axis.
		 */
		public y:number;
		/**
		 * Skew on the x axis.
		 */
		public skewX:number;
		/**
		 * skew on the y axis.
		 */
		public skewY:number;
		/**
		 * Scale on the x axis.
		 */
		public scaleX:number;
		/**
		 * Scale on the y axis.
		 */
		public scaleY:number;
		/**
		 * The rotation of that DBTransform instance.
		 */
		public get rotation():number{
			return this.skewX;
		}
		public set rotation(value:number){
			this.skewX = this.skewY = value;
		}
		/**
		 * Creat a new DBTransform instance.
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
		 * Copy all properties from this DBTransform instance to the passed DBTransform instance.
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
		 * Get a string representing all DBTransform property values.
		 * @return String All property values in a formatted string.
		 */
		public toString():string{
			var string:string = "x:" + this.x + " y:" + this.y + " skewX:" + this.skewX + " skewY:" + this.skewY + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
			return string;
		}
	}
}