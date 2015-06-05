//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module dragonBones {
	/**
	 * @class dragonBones.DragonBonesData
	 * @classdesc
	 * DragonBones的数据，包含了骨架数据和显示对象数据
	 */
	export class DragonBonesData{
		/**
		 * DrabonBones数据的名字
		 * @member {string} dragonBones.DragonBonesData#name
		 */
		public name:string;
		/**
		 * 数据的类型，是否是全局数据
		 * @member {boolean} dragonBones.DragonBonesData#isGlobal
		 */
		public isGlobal:boolean;
		private _armatureDataList:Array<ArmatureData> = [];
		private _displayDataDictionary:any = {};

		/**
		 * 构造函数，实例化一个DragonBonesData类
		 */
		public constructor(){
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
            for(var i:number = 0, len:number = this._armatureDataList.length; i < len; i++)
            {
                var armatureData:ArmatureData = this._armatureDataList[i];
                armatureData.dispose();
            }

			this._armatureDataList = null;
			
			this.removeAllDisplayData();
			this._displayDataDictionary = null;
		}

		/**
		 * 获取所有的骨架数据
		 * @returns {Array<ArmatureData>}
		 */
		public get armatureDataList():Array<ArmatureData>{
			return this._armatureDataList;
		}

		/**
		 * 通过骨架的名字获取骨架的数据
		 * @param armatureName 想要获取的骨架的名字
		 * @returns {*} 骨架数据 ArmatureData
		 */
		public getArmatureDataByName(armatureName:string):ArmatureData{
			var i:number = this._armatureDataList.length;
			while(i --){
				if(this._armatureDataList[i].name == armatureName){
					return this._armatureDataList[i];
				}
			}
			
			return null;
		}

		/**
		 * 添加一个骨架数据
		 * @param armatureData
		 */
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

		/**
		 * 移除一个骨架数据
		 * @param armatureData
		 */
		public removeArmatureData(armatureData:ArmatureData):void{
			var index:number = this._armatureDataList.indexOf(armatureData);
			if(index >= 0){
				this._armatureDataList.splice(index, 1);
			}
		}

		/**
		 * 根据骨架的名字，移除该骨架的数据
		 * @param armatureName 想要移除的骨架的名字
		 */
		public removeArmatureDataByName(armatureName:string):void{
			var i:number = this._armatureDataList.length;
			while(i --){
				if(this._armatureDataList[i].name == armatureName){
					this._armatureDataList.splice(i, 1);
				}
			}
		}

		/**
		 * 根据名字获取显示对象数据
		 * @param name 想要获取的显示对象数据的名字
		 * @returns {any} 显示对象数据 DisplayData
		 */
		public getDisplayDataByName(name:string):DisplayData{
			return this._displayDataDictionary[name];
		}

		/**
		 *添加一个显示对象数据
		 * @param displayData 需要被添加的显示对象数据
		 */
		public addDisplayData(displayData:DisplayData):void{
			this._displayDataDictionary[displayData.name] = displayData;
		}

		/**
		 *根据显示对象的名字移除该显示对象数据
		 * @param name 显示对象的名字
		 */
		public removeDisplayDataByName(name:string):void{
			delete this._displayDataDictionary[name]
		}

		/**
		 *移除所有的显示对象数据
		 */
		public removeAllDisplayData():void{
			for(var name in this._displayDataDictionary){
				delete this._displayDataDictionary[name];
			}
		}
	}
}