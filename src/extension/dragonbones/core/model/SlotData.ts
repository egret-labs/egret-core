
module dragonBones {

	export class SlotData{
		public name:string;
		public parent:string;
		public zOrder:number;
        public blendMode:string;
		
		private _displayDataList:Array<DisplayData>;
		
		public constructor(){
			this._displayDataList = [];
			this.zOrder = 0;
		}
		
		public dispose():void{
			var i:number = this._displayDataList.length;
			while(i --){
				this._displayDataList[i].dispose();
			}
			this._displayDataList = null;
		}
		
		public addDisplayData(displayData:DisplayData):void{
			if(!displayData){
				throw new Error();
			}
			if (this._displayDataList.indexOf(displayData) < 0){
				this._displayDataList[this._displayDataList.length] = displayData;
			}
			else{
				throw new Error();
			}
		}
		
		public getDisplayData(displayName:string):DisplayData{
			var i:number = this._displayDataList.length;
			while(i --){
				if(this._displayDataList[i].name == displayName){
					return this._displayDataList[i];
				}
			}
			
			return null;
		}
		
		public get displayDataList():Array<DisplayData>{
			return this._displayDataList;
		}
	}
}