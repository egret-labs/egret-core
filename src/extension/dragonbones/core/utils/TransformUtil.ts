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
	export class TransformUtil{
		private static HALF_PI:number = Math.PI * 0.5;
		private static DOUBLE_PI:number = Math.PI * 2;
		
		private static _helpMatrix:Matrix = new Matrix();
		
		public static transformPointWithParent(transform:DBTransform, parent:DBTransform):void{
			TransformUtil.transformToMatrix(parent, TransformUtil._helpMatrix, true);
			TransformUtil._helpMatrix.invert();
			
			var x:number = transform.x;
			var y:number = transform.y;
			
			transform.x = TransformUtil._helpMatrix.a * x + TransformUtil._helpMatrix.c * y + TransformUtil._helpMatrix.tx;
			transform.y = TransformUtil._helpMatrix.d * y + TransformUtil._helpMatrix.b * x + TransformUtil._helpMatrix.ty;
			
			transform.skewX = TransformUtil.formatRadian(transform.skewX - parent.skewX);
			transform.skewY = TransformUtil.formatRadian(transform.skewY - parent.skewY);
		}
		
		public static transformToMatrix(transform:DBTransform, matrix:Matrix, keepScale:boolean = false):void{
			if(keepScale){
				matrix.a = transform.scaleX * Math.cos(transform.skewY)
				matrix.b = transform.scaleX * Math.sin(transform.skewY)
				matrix.c = -transform.scaleY * Math.sin(transform.skewX);
				matrix.d = transform.scaleY * Math.cos(transform.skewX);
				matrix.tx = transform.x;
				matrix.ty = transform.y;
			}
			else{
				matrix.a = Math.cos(transform.skewY)
				matrix.b = Math.sin(transform.skewY)
				matrix.c = -Math.sin(transform.skewX);
				matrix.d = Math.cos(transform.skewX);
				matrix.tx = transform.x;
				matrix.ty = transform.y;
			}
		}
		
		public static formatRadian(radian:number):number{
			//radian %= DOUBLE_PI;
			if (radian > Math.PI){
				radian -= TransformUtil.DOUBLE_PI;
			}
			if (radian < -Math.PI){
				radian += TransformUtil.DOUBLE_PI;
			}
			return radian;
		}
	}
}