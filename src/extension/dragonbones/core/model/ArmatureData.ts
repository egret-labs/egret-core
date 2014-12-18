
module dragonBones {

	export class ArmatureData{
		public name:string;
		
		private _boneDataList:Array<BoneData>;
		private _skinDataList:Array<SkinData>;
		private _animationDataList:Array<AnimationData>;

        public static sortBoneDataHelpArray(object1:any, object2:any):number {
            return object1[0] > object2[0] ? 1 : -1;
        }
        public static sortBoneDataHelpArrayDescending(object1:any, object2:any):number {
            return object1[0] > object2[0] ? -1 : 1;
        }

		public constructor(){
			this._boneDataList = [];
			this._skinDataList = [];
			this._animationDataList = [];
			
			//_areaDataList = new Vector.<IAreaData>(0, true);
		}
		
		public dispose():void{
			var i:number = this._boneDataList.length;
			while(i --){
				this._boneDataList[i].dispose();
			}
			i = this._skinDataList.length;
			while(i --){
				this._skinDataList[i].dispose();
			}
			i = this._animationDataList.length;
			while(i --){
				this._animationDataList[i].dispose();
			}

			this._boneDataList = null;
			this._skinDataList = null;
			this._animationDataList = null;
		}
		
		public getBoneData(boneName:string):BoneData{
			var i:number = this._boneDataList.length;
			while(i --){
				if(this._boneDataList[i].name == boneName){
					return this._boneDataList[i];
				}
			}
			return null;
		}
		
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
		
		public getAnimationData(animationName:string):AnimationData{
			var i:number = this._animationDataList.length;
			while(i --){
				if(this._animationDataList[i].name == animationName){
					return this._animationDataList[i];
				}
			}
			return null;
		}
		
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
		
		public addAnimationData(animationData:AnimationData):void{
			if(!animationData){
				throw new Error();
			}
			
			if(this._animationDataList.indexOf(animationData) < 0){
				this._animationDataList[this._animationDataList.length] = animationData;
			}
		}
		
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



		public get boneDataList():Array<BoneData>{
			return this._boneDataList;
		}
		public get skinDataList():Array<SkinData>{
			return this._skinDataList;
		}
		public get animationDataList():Array<AnimationData>{
			return this._animationDataList;
		}
	}
}