
module egret.gui {

	export class TransformUtil{
		/**
		 * 将显示对象按照给定的转换中心调整位置
		 * @param obj 要转换的显示对象
		 * @param transformCenter 转换中心点，以显示对象为坐标系
		 * @param translation 新的转换中心的位置，以显示对象的父容器为坐标系
		 * @param scaleX 新的缩放值scaleX，如果为NaN则不设置
		 * @param scaleY 新的缩放值scaleY，如果为NaN则不设置
		 * @param rotation 新的旋转角度，如果为NaN则不设置
		 */
		public static transformAround(obj:egret.DisplayObject,
											   transformCenter:egret.Point,
											   translation:egret.Point = null,
											   scaleX:number = NaN,
											   scaleY:number = NaN,
											   rotation:number = NaN):void{
			if (translation == null && transformCenter != null){
				Point.identity.x = transformCenter.x;
                Point.identity.y = transformCenter.y;
				var xformedPt:egret.Point = TransformUtil.transformPointToParent(obj , Point.identity);
			}
			if (!isNaN(rotation))
				obj.rotation = rotation;
			if (!isNaN(scaleX))
				obj.scaleX = scaleX;
			if (!isNaN(scaleY))
				obj.scaleY = scaleY;
			
			if (transformCenter == null){
				if (translation != null){
					obj.x = translation.x;
					obj.y = translation.y;
				}
			}
			else{
                Point.identity.x = transformCenter.x;
                Point.identity.y = transformCenter.y;
				var postXFormPoint:egret.Point = TransformUtil.transformPointToParent(obj , Point.identity);
				if (translation != null){
					obj.x += translation.x - postXFormPoint.x;
					obj.y += translation.y - postXFormPoint.y;
				}
				else{
					obj.x += xformedPt.x - postXFormPoint.x;
					obj.y += xformedPt.y - postXFormPoint.y;
				}
			}
		}
		
		public static transformPointToParent(obj:egret.DisplayObject,localPosition:egret.Point = null):egret.Point{
            var resultPoint:Point = new Point();
			if (localPosition){
                resultPoint.x = localPosition.x;
                resultPoint.y = localPosition.y;
			}
			if(obj.parent)
            {
                obj.localToGlobal(resultPoint.x,resultPoint.y,resultPoint);
                obj.parent.globalToLocal(resultPoint.x,resultPoint.y,resultPoint);
            }
            return resultPoint;
		}
	}
}