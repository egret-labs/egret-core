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
     * @class dragonBones.TransformUtils
     * @classdesc
     * 提供了一些常用的转换的静态方法
     */
    export class TransformUtil{
		private static HALF_PI:number = Math.PI * 0.5;
		private static DOUBLE_PI:number = Math.PI * 2;

        private static _helpTransformMatrix:Matrix = new Matrix();
        private static _helpParentTransformMatrix:Matrix = new Matrix();

        /**
         * 全局坐标系转成成局部坐标系
         * @param transform 全局坐标系下的变换
         * @param parent 父亲的坐标变换
         */
        public static globalToLocal(transform:DBTransform, parent:DBTransform):void
        {
            TransformUtil.transformToMatrix(transform, TransformUtil._helpTransformMatrix, true);
            TransformUtil.transformToMatrix(parent, TransformUtil._helpParentTransformMatrix, true);

            TransformUtil._helpParentTransformMatrix.invert();
            TransformUtil._helpTransformMatrix.concat(TransformUtil._helpParentTransformMatrix);

            TransformUtil.matrixToTransform(TransformUtil._helpTransformMatrix, transform, transform.scaleX * parent.scaleX >= 0, transform.scaleY * parent.scaleY >= 0);
        }

        /**
         *把transform数据转成成矩阵数据
         * @param transform 需要转换的transform数据
         * @param matrix 转换后的矩阵数据
         * @param keepScale 是否保持缩放
         */
		public static transformToMatrix(transform:DBTransform, matrix:Matrix, keepScale:boolean = false):void{
			if(keepScale){
				matrix.a = transform.scaleX * MathUtil.cos(transform.skewY);
				matrix.b = transform.scaleX * MathUtil.sin(transform.skewY);
				matrix.c = -transform.scaleY * MathUtil.sin(transform.skewX);
				matrix.d = transform.scaleY * MathUtil.cos(transform.skewX);
//                matrix.a = transform.scaleX * Math.cos(transform.skewY);
//                matrix.b = transform.scaleX * Math.sin(transform.skewY);
//                matrix.c = -transform.scaleY * Math.sin(transform.skewX);
//                matrix.d = transform.scaleY * Math.cos(transform.skewX);
				matrix.tx = transform.x;
				matrix.ty = transform.y;
			}
			else{
				matrix.a = MathUtil.cos(transform.skewY);
				matrix.b = MathUtil.sin(transform.skewY);
				matrix.c = -MathUtil.sin(transform.skewX);
				matrix.d = MathUtil.cos(transform.skewX);
//                matrix.a = Math.cos(transform.skewY);
//                matrix.b = Math.sin(transform.skewY);
//                matrix.c = -Math.sin(transform.skewX);
//                matrix.d = Math.cos(transform.skewX);
				matrix.tx = transform.x;
				matrix.ty = transform.y;
			}
		}

        /**
         *把 矩阵数据转成成transform数据
         * @param matrix 需要转换的矩阵数据
         * @param transform 转换后的transform数据
         * @param scaleXF x方向的缩放
         * @param scaleYF y方向的缩放
         */
        public static matrixToTransform(matrix:Matrix, transform:DBTransform, scaleXF:Boolean, scaleYF:Boolean):void
        {
            transform.x = matrix.tx;
            transform.y = matrix.ty;
            transform.scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) * (scaleXF ? 1 : -1);
            transform.scaleY = Math.sqrt(matrix.d * matrix.d + matrix.c * matrix.c) * (scaleYF ? 1 : -1);

            var skewXArray:Array<number> = [];
            skewXArray[0] = Math.acos(matrix.d / transform.scaleY);
            skewXArray[1] = -skewXArray[0];
            skewXArray[2] = Math.asin(-matrix.c / transform.scaleY);
            skewXArray[3] = skewXArray[2] >= 0 ? Math.PI - skewXArray[2] : skewXArray[2] - Math.PI;

            if(Number(skewXArray[0]).toFixed(4) == Number(skewXArray[2]).toFixed(4) || Number(skewXArray[0]).toFixed(4) == Number(skewXArray[3]).toFixed(4))
            {
                transform.skewX = skewXArray[0];
            }
            else
            {
                transform.skewX = skewXArray[1];
            }

            var skewYArray:Array<number> = [];
            skewYArray[0] = Math.acos(matrix.a / transform.scaleX);
            skewYArray[1] = -skewYArray[0];
            skewYArray[2] = Math.asin(matrix.b / transform.scaleX);
            skewYArray[3] = skewYArray[2] >= 0 ? Math.PI - skewYArray[2] : skewYArray[2] - Math.PI;

            if(Number(skewYArray[0]).toFixed(4) == Number(skewYArray[2]).toFixed(4) || Number(skewYArray[0]).toFixed(4) == Number(skewYArray[3]).toFixed(4))
            {
                transform.skewY = skewYArray[0];
            }
            else
            {
                transform.skewY = skewYArray[1];
            }

        }

        /**
         * 标准化弧度值，把弧度制换算到[-PI，PI]之间
         * @param radian 输入一个弧度值
         * @returns {number} 输出标准化后的弧度制
         */
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
        /**
         *  确保角度在-180到180之间
         */
        public static normalizeRotation(rotation:number):number
        {
            rotation = (rotation + Math.PI)%(2*Math.PI);
            rotation = rotation > 0 ? rotation : 2*Math.PI + rotation;
            return rotation - Math.PI;
        }
	}
}