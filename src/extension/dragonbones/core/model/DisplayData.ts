
module dragonBones {

	export class DisplayData{
		public static ARMATURE:string = "armature";
		public static IMAGE:string = "image";
		
		public name:string;
		public type:string;
		public transform:DBTransform;
		public pivot:Point;
		
		public constructor(){
			this.transform = new DBTransform();
			this.pivot = new Point();
		}
		
		public dispose():void{
			this.transform = null;
			this.pivot = null;
		}
	}
}