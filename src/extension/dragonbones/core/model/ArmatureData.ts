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
	 * @class dragonBones.ArmatureData
	 * @classdesc
	 * armature数据 一个armature数据包含一个角色的骨骼，皮肤，动画的数据
	 * @see  dragonBones.BoneData
	 * @see  dragonBones.SkinData
	 * @see  dragonBones.AnimationData
	 */
	export class ArmatureData{
		/**
		 * armature数据的名字
		 * @member {string} dragonBones.ArmatureData#name
		 */
		public name:string;
		
		private _boneDataList:Array<BoneData>;
		private _skinDataList:Array<SkinData>;
		private _slotDataList:Array<SlotData>;
		private _animationDataList:Array<AnimationData>;

        public static sortBoneDataHelpArray(object1:any, object2:any):number {
            return object1[0] > object2[0] ? 1 : -1;
        }
        public static sortBoneDataHelpArrayDescending(object1:any, object2:any):number {
            return object1[0] > object2[0] ? -1 : 1;
        }

		/**
		 * 创建一个ArmatureData实例
		 */
		public constructor(){
			this._boneDataList = [];
			this._skinDataList = [];
			this._slotDataList = [];
			this._animationDataList = [];
			
			//_areaDataList = new Vector.<IAreaData>(0, true);
		}

		public setSkinData(skinName:String):void
		{
			var i:number = 0;
			var len:number = this._slotDataList.length;
			for (i = 0; i < len; i++)
			{
				this._slotDataList[i].dispose();
			}
			var skinData:SkinData;
			if(!skinName && this._skinDataList.length > 0)
			{
				skinData = this._skinDataList[0];
			}
			else
			{
				i = 0,
				len = this._skinDataList.length;
				for (; i < len; i++)
				{
					if (this._skinDataList[i].name == skinName)
					{
						skinData = this._skinDataList[i];
						break;
					}
				}
			}

			if (skinData)
			{
				var slotData:SlotData;
				i = 0, len = skinData.slotDataList.length;
				for (i = 0; i < len; i++)
				{
					slotData = this.getSlotData(skinData.slotDataList[i].name);
					if (slotData)
					{
						var j:number = 0;
						var jLen:number = skinData.slotDataList[i].displayDataList.length;
						for (j = 0; j < jLen; j++)
						{
							slotData.addDisplayData(skinData.slotDataList[i].displayDataList[j]);
						}
					}
				}
			}
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
			var i:number = this._boneDataList.length;
			while(i --){
				this._boneDataList[i].dispose();
			}
			i = this._skinDataList.length;
			while(i --){
				this._skinDataList[i].dispose();
			}
			i = this._slotDataList.length;
			while(i --){
				this._slotDataList[i].dispose();
			}
			i = this._animationDataList.length;
			while(i --){
				this._animationDataList[i].dispose();
			}

			this._boneDataList = null;
			this._slotDataList = null;
			this._skinDataList = null;
			this._animationDataList = null;
		}

		/**
		 * 根据骨骼的名字获取到骨骼数据
		 * @param boneName 骨骼的名字
		 * @returns {*} 骨骼数据
		 */
		public getBoneData(boneName:string):BoneData{
			var i:number = this._boneDataList.length;
			while(i --){
				if(this._boneDataList[i].name == boneName){
					return this._boneDataList[i];
				}
			}
			return null;
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

		/**
		 * 根据皮肤的名字获取到皮肤数据
		 * @param skinName  皮肤的名字
		 * @returns {*}  皮肤数据
		 */
		public getSkinData(skinName:string):SkinData{
			if(!skinName && this._skinDataList.length > 0){
				return this._skinDataList[0];
			}
			var i:number = this._skinDataList.length;
			while(i --){
				if(this._skinDataList[i].name == skinName){
					return this._skinDataList[i];
				}
			}
			
			return null;
		}

		/**
		 * 根据动画的名字获取动画数据
		 * @param animationName 动画的名字
		 * @returns {*} 动画数据
		 */
		public getAnimationData(animationName:string):AnimationData{
			var i:number = this._animationDataList.length;
			while(i --){
				if(this._animationDataList[i].name == animationName){
					return this._animationDataList[i];
				}
			}
			return null;
		}

		/**
		 *添加一个骨骼数据
		 * @param boneData
		 */
		public addBoneData(boneData:BoneData):void{
			if(!boneData){
				throw new Error();
			}
			
			if (this._boneDataList.indexOf(boneData) < 0){
				this._boneDataList[this._boneDataList.length] = boneData;
			}
			else{
				throw new Error();
			}
		}

		public addSlotData(slotData:SlotData):void{
			if(!slotData){
				throw new Error();
			}

			if(this._slotDataList.indexOf(slotData) < 0){
				this._slotDataList[this._slotDataList.length] = slotData;
			}
			else{
				throw new Error();
			}
		}
		/**
		 * 添加一个皮肤数据
		 * @param skinData
		 */
		public addSkinData(skinData:SkinData):void{
			if(!skinData){
				throw new Error();
			}
			
			if(this._skinDataList.indexOf(skinData) < 0){
				this._skinDataList[this._skinDataList.length] = skinData;
			}
			else{
				throw new Error();
			}
		}

		/**
		 * 添加一个动画数据
		 * @param animationData
		 */
		public addAnimationData(animationData:AnimationData):void{
			if(!animationData){
				throw new Error();
			}
			
			if(this._animationDataList.indexOf(animationData) < 0){
				this._animationDataList[this._animationDataList.length] = animationData;
			}
		}

		/**
		 * 对骨骼按照骨骼数的层级关系排序
		 */
		public sortBoneDataList():void{
			var i:number = this._boneDataList.length;
			if(i == 0){
				return;
			}
			
			var helpArray:Array<any> = [];
			while(i --){
				var boneData:BoneData = this._boneDataList[i];
				var level:number = 0;
				var parentData:BoneData = boneData;
				while(parentData){
					level ++;
					parentData = this.getBoneData(parentData.parent);
				}
				helpArray[i] = [level, boneData];
			}

            helpArray.sort(ArmatureData.sortBoneDataHelpArray);
			
			i = helpArray.length;
			while(i --){
				this._boneDataList[i] = helpArray[i][1];
			}
		}


		/**
		 * 获取骨骼数据列表
		 * @returns {Array<BoneData>}
		 */
		public get boneDataList():Array<BoneData>{
			return this._boneDataList;
		}
		public get slotDataList():Array<SlotData>{
			return this._slotDataList;
		}

		/**
		 * 获取皮肤数据列表
		 * @returns {Array<SkinData>}
		 */
		public get skinDataList():Array<SkinData>{
			return this._skinDataList;
		}

		/**
		 * 获得动画数据列表
		 * @returns {Array<AnimationData>}
		 */
		public get animationDataList():Array<AnimationData>{
			return this._animationDataList;
		}
	}
}