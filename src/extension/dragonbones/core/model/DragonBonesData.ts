module dragonBones {
	export class DragonBonesData{
		public name:string;
		private _armatureDataList:Array<ArmatureData> = [];
		private _displayDataDictionary:any = {};
		
		public constructor(){
		}
		
		public dispose():void{
            for(var key in this._armatureDataList)
            {
                var armatureData:ArmatureData = this._armatureDataList[key];
                armatureData.dispose();
            }

			this._armatureDataList = null;
			
			this.removeAllDisplayData();
			this._displayDataDictionary = null;
		}
		
		public get armatureDataList():Array<ArmatureData>{
			return this._armatureDataList;
		}
		
		public getArmatureDataByName(armatureName:string):ArmatureData{
			var i:number = this._armatureDataList.length;
			while(i --){
				if(this._armatureDataList[i].name == armatureName){
					return this._armatureDataList[i];
				}
			}
			
			return null;
		}
		
		public addArmatureData(armatureData:ArmatureData):void{
			if(!armatureData){
				throw new Error();
			}
			
			if(this._armatureDataList.indexOf(armatureData) < 0){
				this._armatureDataList[this._armatureDataList.length] = armatureData;
			}
			else{
				throw new Error();
			}
		}
		
		public removeArmatureData(armatureData:ArmatureData):void{
			var index:number = this._armatureDataList.indexOf(armatureData);
			if(index >= 0){
				this._armatureDataList.splice(index, 1);
			}
		}
		
		public removeArmatureDataByName(armatureName:string):void{
			var i:number = this._armatureDataList.length;
			while(i --){
				if(this._armatureDataList[i].name == armatureName){
					this._armatureDataList.splice(i, 1);
				}
			}
		}
		
		public getDisplayDataByName(name:string):DisplayData{
			return this._displayDataDictionary[name];
		}
		
		public addDisplayData(displayData:DisplayData):void{
			this._displayDataDictionary[displayData.name] = displayData;
		}
		
		public removeDisplayDataByName(name:string):void{
			delete this._displayDataDictionary[name]
		}
		
		public removeAllDisplayData():void{
			for(var name in this._displayDataDictionary){
				delete this._displayDataDictionary[name];
			}
		}
	}
}