module dragonBones {

	export class BoneData{
		public name:string;
		public parent:string;
		public length:number;
		
		public global:DBTransform;
		public transform:DBTransform;
		
		public inheritScale:boolean;
		public inheritRotation:boolean;
		
		public constructor(){
			this.length = 0;
			this.global = new DBTransform();
			this.transform = new DBTransform();
			this.inheritRotation = true;
			this.inheritScale = false;
		}
		
		public dispose():void{
			this.global = null;
			this.transform = null;
		}
	}
}