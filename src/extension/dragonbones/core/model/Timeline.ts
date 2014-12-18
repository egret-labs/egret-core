
module dragonBones {

	export class Timeline{
		public duration:number = 0;
		public scale:number;
		
		private _frameList:Array<Frame>;
		
		public constructor(){
			this._frameList = [];
			this.duration = 0;
			this.scale = 1;
		}
		
		public dispose():void{
			var i:number = this._frameList.length;
			while(i --){
				this._frameList[i].dispose();
			}
			this._frameList = null;
		}
		
		public addFrame(frame:Frame):void{
			if(!frame){
				throw new Error();
			}
			
			if(this._frameList.indexOf(frame) < 0){
				this._frameList[this._frameList.length] = frame;
			}
			else{
				throw new Error();
			}
		}
		
		public get frameList():Array<Frame>{
			return this._frameList;
		}
	}
}