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