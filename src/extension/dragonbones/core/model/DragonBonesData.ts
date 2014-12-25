/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


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