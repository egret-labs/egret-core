
module dragonBones {

	export class TransformFrame extends Frame{
		//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
		public tweenEasing:number;
		//旋转几圈
        public tweenRotate:number = 0;
		//补间是否对Scale起作用
        public tweenScale:boolean;
		public displayIndex:number = 0;
		public visible:boolean;
		public zOrder:number;
		
		public global:DBTransform;
		public transform:DBTransform;
		public pivot:Point;
		public color:ColorTransform;
		public scaleOffset:Point;
		
		
		public constructor(){
			super();
			
			this.tweenEasing = 10;
			this.tweenRotate = 0;
			this.tweenScale = true;
			this.displayIndex = 0;
			this.visible = true;
			this.zOrder = NaN;
			
			this.global = new DBTransform();
			this.transform = new DBTransform();
			this.pivot = new Point();
			this.scaleOffset = new Point();
		}
		
		public dispose():void{
			super.dispose();
			this.global = null;
			this.transform = null;
			this.pivot = null;
			this.scaleOffset = null;
			this.color = null;
		}
	}
}