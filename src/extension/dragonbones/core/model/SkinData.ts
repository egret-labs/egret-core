
module dragonBones {

	export class SkinData{
		public name:string;
		
		private _slotDataList:Array<SlotData>;
		
		public constructor(){
			this._slotDataList = [];
		}
		
		public dispose():void{
			var i:number = this._slotDataList.length;
			while(i --){
				this._slotDataList[i].dispose();
			}
			this._slotDataList = null;
		}
		
		public getSlotData(slotName:string):SlotData{
			var i:number = this._slotDataList.length;
			while(i --){
				if(this._slotDataList[i].name == slotName){
					return this._slotDataList[i];
				}
			}
			return null;
		}
		
		public addSlotData(slotData:SlotData):void{
			if(!slotData){
				throw new Error();
			}
			
			if (this._slotDataList.indexOf(slotData) < 0){
				this._slotDataList[this._slotDataList.length] = slotData;
			}
			else{
				throw new Error();
			}
		}
		
		public get slotDataList():Array<SlotData>{
			return this._slotDataList;
		}
	}
}