
module dragonBones {

	export class TransformTimeline extends Timeline{
		public name:string;
		public transformed:boolean;
		
		//第一帧的Transform
		public originTransform:DBTransform;
		
		//第一帧的骨头的轴点
		public originPivot:Point;
		
		public offset:number;
		
		public constructor(){
			super();
			
			this.originTransform = new DBTransform();
			this.originPivot = new Point();
			this.offset = 0;
		}
		
		public dispose():void{
			super.dispose();
			
			this.originTransform = null;
			this.originPivot = null;
		}
	}
}