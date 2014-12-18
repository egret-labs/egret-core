module dragonBones {
	export class Frame{
		public position:number = 0;
		public duration:number = 0;
		
		public action:string;
		public event:string;
		public sound:string;
		
		public constructor(){
			this.position = 0;
			this.duration = 0;
		}
		
		public dispose():void{
		}
	}
}