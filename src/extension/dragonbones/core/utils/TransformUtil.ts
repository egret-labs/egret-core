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
        
        //optimized by freem-trg
		private static tmpSkewXArray:Array<number> = [];
 		private static tmpSkewYArray:Array<number> = [];
 		private static ACCURACY : Number = 0.0001;
        
        private static isEqual(n1:number, n2:number):boolean
 		{
 			if (n1 >= n2)
 			{
 				return (n1 - n2) <= TransformUtil.ACCURACY;
 			}
 			else
 			{
 				return (n2 - n1) <= TransformUtil.ACCURACY;
 			}
 		}
         
        /**
         * 全局坐标系转成成局部坐标系
         * @param transform 全局坐标系下的变换
         * @param parent 父亲的坐标变换
         */
        public static globalToLocal(transform:DBTransform, parent:DBTransform):void
        {
            TransformUtil.transformToMatrix(transform, TransformUtil._helpTransformMatrix);
            TransformUtil.transformToMatrix(parent, TransformUtil._helpParentTransformMatrix);

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
		public static transformToMatrix(transform:DBTransform, matrix:Matrix):void{
				matrix.a = transform.scaleX * MathUtil.cos(transform.skewY);
				matrix.b = transform.scaleX * MathUtil.sin(transform.skewY);
				matrix.c = -transform.scaleY * MathUtil.sin(transform.skewX);
				matrix.d = transform.scaleY * MathUtil.cos(transform.skewX);
				matrix.tx = transform.x;
				matrix.ty = transform.y;
		}

        /**
         *把 矩阵数据转成成transform数据
         * @param matrix 需要转换的矩阵数据
         * @param transform 转换后的transform数据
         * @param scaleXF x方向的缩放
         * @param scaleYF y方向的缩放
         */
        public static matrixToTransform(matrix:Matrix, transform:DBTransform, scaleXF:boolean, scaleYF:boolean):void
        {
            transform.x = matrix.tx;
            transform.y = matrix.ty;
            transform.scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) * (scaleXF ? 1 : -1);
            transform.scaleY = Math.sqrt(matrix.d * matrix.d + matrix.c * matrix.c) * (scaleYF ? 1 : -1);

            TransformUtil.tmpSkewXArray[0] = Math.acos(matrix.d / transform.scaleY);
            TransformUtil.tmpSkewXArray[1] = -TransformUtil.tmpSkewXArray[0];
            TransformUtil.tmpSkewXArray[2] = Math.asin(-matrix.c / transform.scaleY);
            TransformUtil.tmpSkewXArray[3] = TransformUtil.tmpSkewXArray[2] >= 0 ? Math.PI - TransformUtil.tmpSkewXArray[2] : TransformUtil.tmpSkewXArray[2] - Math.PI;
            if(TransformUtil.isEqual(TransformUtil.tmpSkewXArray[0],TransformUtil.tmpSkewXArray[2]) || TransformUtil.isEqual(TransformUtil.tmpSkewXArray[0],TransformUtil.tmpSkewXArray[3]))
            {
                transform.skewX = TransformUtil.tmpSkewXArray[0];
            }
            else
            {
                transform.skewX = TransformUtil.tmpSkewXArray[1];
            }

            TransformUtil.tmpSkewYArray[0] = Math.acos(matrix.a / transform.scaleX);
            TransformUtil.tmpSkewYArray[1] = -TransformUtil.tmpSkewYArray[0];
            TransformUtil.tmpSkewYArray[2] = Math.asin(matrix.b / transform.scaleX);
            TransformUtil.tmpSkewYArray[3] = TransformUtil.tmpSkewYArray[2] >= 0 ? Math.PI - TransformUtil.tmpSkewYArray[2] : TransformUtil.tmpSkewYArray[2] - Math.PI;

            if(TransformUtil.isEqual(TransformUtil.tmpSkewYArray[0],TransformUtil.tmpSkewYArray[2]) || TransformUtil.isEqual(TransformUtil.tmpSkewYArray[0],TransformUtil.tmpSkewYArray[3]))
            {
                transform.skewY = TransformUtil.tmpSkewYArray[0];
            }
            else
            {
                transform.skewY = TransformUtil.tmpSkewYArray[1];
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
        
		public static matrixToTransformPosition(matrix:Matrix, transform:DBTransform):void
		{
			transform.x = matrix.tx;
			transform.y = matrix.ty;
		}
		
		public static matrixToTransformScale(matrix:Matrix, transform:DBTransform, scaleXF:boolean, scaleYF:boolean):void
		{
			transform.scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) * (scaleXF ? 1 : -1);
			transform.scaleY = Math.sqrt(matrix.d * matrix.d + matrix.c * matrix.c) * (scaleYF ? 1 : -1);
		}
		
		public static matrixToTransformRotation(matrix:Matrix, transform:DBTransform, scaleX:number, scaleY:number):void
		{
			TransformUtil.tmpSkewXArray[0] = Math.acos(matrix.d / scaleY);
			TransformUtil.tmpSkewXArray[1] = -TransformUtil.tmpSkewXArray[0];
			TransformUtil.tmpSkewXArray[2] = Math.asin(-matrix.c / scaleY);
			TransformUtil.tmpSkewXArray[3] = TransformUtil.tmpSkewXArray[2] >= 0 ? Math.PI - TransformUtil.tmpSkewXArray[2] : TransformUtil.tmpSkewXArray[2] - Math.PI;
			
			if(TransformUtil.isEqual(TransformUtil.tmpSkewXArray[0], TransformUtil.tmpSkewXArray[2]) || TransformUtil.isEqual(TransformUtil.tmpSkewXArray[0], TransformUtil.tmpSkewXArray[3]))
			{
				transform.skewX = TransformUtil.tmpSkewXArray[0];
			}
			else 
			{
				transform.skewX = TransformUtil.tmpSkewXArray[1];
			}
			
			TransformUtil.tmpSkewYArray[0] = Math.acos(matrix.a / scaleX);
			TransformUtil.tmpSkewYArray[1] = -TransformUtil.tmpSkewYArray[0];
			TransformUtil.tmpSkewYArray[2] = Math.asin(matrix.b / scaleX);
			TransformUtil.tmpSkewYArray[3] = TransformUtil.tmpSkewYArray[2] >= 0 ? Math.PI - TransformUtil.tmpSkewYArray[2] : TransformUtil.tmpSkewYArray[2] - Math.PI;
			
			if(TransformUtil.isEqual(TransformUtil.tmpSkewYArray[0],TransformUtil.tmpSkewYArray[2]) || TransformUtil.isEqual(TransformUtil.tmpSkewYArray[0], TransformUtil.tmpSkewYArray[3]))
			{
				transform.skewY = TransformUtil.tmpSkewYArray[0];
			}
			else 
			{
				transform.skewY = TransformUtil.tmpSkewYArray[1];
			}
		}
	}
}