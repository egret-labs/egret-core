module dragonBones {

	export class BaseFactory  extends EventDispatcher{
		public static _helpMatrix:Matrix = new Matrix();
		
		/** @private */
		public dragonBonesDataDic:any = {};
		
		/** @private */
		public textureAtlasDic:any = {};
		public constructor(self:BaseFactory){
			super();
			
			if(self != this){ 
				throw new Error("Abstract class can not be instantiated!");
			}
		}
		
		/**
		 * Cleans up resources used by this BaseFactory instance.
		 * @param (optional) Destroy all internal references.
		 */
		public dispose(disposeData:boolean = true):void{
			if(disposeData){
				for(var skeletonName in this.dragonBonesDataDic){
					(<DragonBonesData><any> (this.dragonBonesDataDic[skeletonName])).dispose();
					delete this.dragonBonesDataDic[skeletonName];
				}
				
				for(var textureAtlasName in this.textureAtlasDic){
					(<ITextureAtlas><any> (this.textureAtlasDic[textureAtlasName])).dispose();
					delete this.textureAtlasDic[textureAtlasName];
				}
			}
			
			this.dragonBonesDataDic = null;
			this.textureAtlasDic = null;
			//_currentDataName = null;
			//_currentTextureAtlasName = null;
		}
		
		/**
		 * Returns a SkeletonData instance.
		 * @param The name of an existing SkeletonData instance.
		 * @return A SkeletonData instance with given name (if exist).
		 */
		public getSkeletonData(name:string):DragonBonesData{
			return this.dragonBonesDataDic[name];
		}
		
		/**
		 * Add a SkeletonData instance to this BaseFactory instance.
		 * @param A SkeletonData instance.
		 * @param (optional) A name for this SkeletonData instance.
		 */
		public addSkeletonData(data:DragonBonesData, name:string = null):void{
			if(!data){
				throw new Error();
			}
			name = name || data.name;
			if(!name){
				throw new Error("Unnamed data!");
			}
			if(this.dragonBonesDataDic[name]){
				throw new Error();
			}
			this.dragonBonesDataDic[name] = data;
		}
		
		/**
		 * Remove a SkeletonData instance from this BaseFactory instance.
		 * @param The name for the SkeletonData instance to remove.
		 */
		public removeSkeletonData(name:string):void{
			delete this.dragonBonesDataDic[name];
		}
		
		/**
		 * Return the TextureAtlas by name.
		 * @param The name of the TextureAtlas to return.
		 * @return A textureAtlas.
		 */
		public getTextureAtlas(name:string):any{
			return this.textureAtlasDic[name];
		}
		
		/**
		 * Add a textureAtlas to this BaseFactory instance.
		 * @param A textureAtlas to add to this BaseFactory instance.
		 * @param (optional) A name for this TextureAtlas.
		 */
		public addTextureAtlas(textureAtlas:any, name:string = null):void{
			if(!textureAtlas){
				throw new Error();
			}
            /*
			if(!name && textureAtlas instanceof ITextureAtlas){
				name = textureAtlas.name;
			}
			*/
            if(!name && textureAtlas.hasOwnProperty("name")){
                name = textureAtlas.name;
            }

			if(!name){
				throw new Error("Unnamed data!");
			}
			if(this.textureAtlasDic[name]){
				throw new Error();
			}
			this.textureAtlasDic[name] = textureAtlas;
		}
		
		/**
		 * Remove a textureAtlas from this baseFactory instance.
		 * @param The name of the TextureAtlas to remove.
		 */
		public removeTextureAtlas(name:string):void{
			delete this.textureAtlasDic[name];
		}
		
		/**
		 * Return the TextureDisplay.
		 * @param The name of this Texture.
		 * @param The name of the TextureAtlas.
		 * @param The registration pivotX position.
		 * @param The registration pivotY position.
		 * @return An Object.
		 */
		public getTextureDisplay(textureName:string, textureAtlasName:string = null, pivotX:number = NaN, pivotY:number = NaN):any{
			var targetTextureAtlas:any;
			if(textureAtlasName){
				targetTextureAtlas = this.textureAtlasDic[textureAtlasName];
			}
			else{
				for (textureAtlasName in this.textureAtlasDic){
					targetTextureAtlas = this.textureAtlasDic[textureAtlasName];
					if(targetTextureAtlas.getRegion(textureName)){
						break;
					}
					targetTextureAtlas = null;
				}
			}
			
			if(!targetTextureAtlas){
				return null;
			}
			
			if(isNaN(pivotX) || isNaN(pivotY)){
				//默认dragonBonesData的名字和和纹理集的名字是一致的
				var data:DragonBonesData = this.dragonBonesDataDic[textureAtlasName];
				data = data ? data : this.findFirstDragonBonesData();
				if(data){
					var displayData:DisplayData = data.getDisplayDataByName(textureName);
					if(displayData){
						pivotX = displayData.pivot.x;
						pivotY = displayData.pivot.y;
					}
				}
			}
			
			return this._generateDisplay(targetTextureAtlas, textureName, pivotX, pivotY);
		}
		
		//一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
		//TO DO 以后会支持一对多的情况
		public buildArmature(armatureName:string, fromDragonBonesDataName:string = null, fromTextureAtlasName:string = null, skinName:string = null):Armature{
			var buildArmatureDataPackage:any = {};
			if(this.fillBuildArmatureDataPackageArmatureInfo(armatureName, fromDragonBonesDataName, buildArmatureDataPackage)){
				this.fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName, buildArmatureDataPackage);
			}
			
			var dragonBonesData:DragonBonesData = buildArmatureDataPackage.dragonBonesData;
			var armatureData:ArmatureData = buildArmatureDataPackage.armatureData;
			var textureAtlas:any = buildArmatureDataPackage.textureAtlas;
			
			if(!armatureData || !textureAtlas){
				return null;
			}
			
			return this.buildArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData, armatureData, textureAtlas, skinName);
		}
		
		public buildArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData:DragonBonesData, armatureData:ArmatureData, textureAtlas:any, skinName:string = null):Armature{
			var outputArmature:Armature = this._generateArmature();
			outputArmature.name = armatureData.name;
			outputArmature.__dragonBonesData = dragonBonesData;
			outputArmature._armatureData = armatureData;
			outputArmature.animation.animationDataList = armatureData.animationDataList;
			
			this._buildBones(outputArmature);
			//TO DO: Support multi textureAtlas case in future
			this._buildSlots(outputArmature, skinName, textureAtlas);
			
			outputArmature.advanceTime(0);
			return outputArmature;
		}

//暂时不支持ifRemoveOriginalAnimationList为false的情况
		public copyAnimationsToArmature(toArmature:Armature, fromArmatreName:string, fromDragonBonesDataName:string = null, ifRemoveOriginalAnimationList:boolean = true):boolean{
			var buildArmatureDataPackage:any = {};
			if(!this.fillBuildArmatureDataPackageArmatureInfo(fromArmatreName, fromDragonBonesDataName, buildArmatureDataPackage)){
				return false;
			}
			
			var fromArmatureData:ArmatureData = buildArmatureDataPackage.armatureData;
			toArmature.animation.animationDataList = fromArmatureData.animationDataList;
			
		//处理子骨架的复制
			var fromSkinData:SkinData = fromArmatureData.getSkinData("");
			var fromSlotData:SlotData;
			var fromDisplayData:DisplayData;
			
			var toSlotList:Array<Slot> = toArmature.getSlots(false); 
			var toSlot:Slot;
			var toSlotDisplayList:Array<any>;
			var toSlotDisplayListLength:number = 0;
			var toDisplayObject:any;
			var toChildArmature:Armature;
			
			var length1:number = toSlotList.length;
			for(var i1:number = 0;i1 < length1;i1++){
				toSlot = toSlotList[i1];
				toSlotDisplayList = toSlot.displayList;
				toSlotDisplayListLength = toSlotDisplayList.length
				for(var i:number = 0; i < toSlotDisplayListLength; i++){
					toDisplayObject = toSlotDisplayList[i];
					
					if(toDisplayObject instanceof Armature){
						toChildArmature = <Armature><any> toDisplayObject;
						
						fromSlotData = fromSkinData.getSlotData(toSlot.name);
						fromDisplayData = fromSlotData.displayDataList[i];
						if(fromDisplayData.type == DisplayData.ARMATURE){
							this.copyAnimationsToArmature(toChildArmature, fromDisplayData.name, buildArmatureDataPackage.dragonBonesDataName, ifRemoveOriginalAnimationList);
						}
					}
				}
			}
			
			return true;
		}
		private fillBuildArmatureDataPackageArmatureInfo(armatureName:string, dragonBonesDataName:string, outputBuildArmatureDataPackage:any):boolean{
			if(dragonBonesDataName){
				outputBuildArmatureDataPackage.dragonBonesDataName = dragonBonesDataName;
				outputBuildArmatureDataPackage.dragonBonesData = this.dragonBonesDataDic[dragonBonesDataName];
				outputBuildArmatureDataPackage.armatureData = outputBuildArmatureDataPackage.dragonBonesData.getArmatureDataByName(armatureName);
			}
			else{
				for(dragonBonesDataName in this.dragonBonesDataDic){
					outputBuildArmatureDataPackage.dragonBonesData = this.dragonBonesDataDic[dragonBonesDataName];
					outputBuildArmatureDataPackage.armatureData = outputBuildArmatureDataPackage.dragonBonesData.getArmatureDataByName(armatureName);
					if(outputBuildArmatureDataPackage.armatureData){
						outputBuildArmatureDataPackage.dragonBonesDataName = dragonBonesDataName;
						return true;
					}
				}
			}
			return false;
		}
		private fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName:string, outputBuildArmatureDataPackage:any):void {
            outputBuildArmatureDataPackage.textureAtlas = this.textureAtlasDic[fromTextureAtlasName ? fromTextureAtlasName : outputBuildArmatureDataPackage.dragonBonesDataName];
        }
		
		private findFirstDragonBonesData():DragonBonesData{
            for(var key in this.dragonBonesDataDic)
            {
                var outputDragonBonesData:DragonBonesData = this.dragonBonesDataDic[key];
                if(outputDragonBonesData){
                    return outputDragonBonesData;
                }
            }
			return null;
		}

        private findFirstTextureAtlas():any{
            for(var key in this.textureAtlasDic)
            {
                var outputTextureAtlas:any = this.textureAtlasDic[key];
                if(outputTextureAtlas){
                    return outputTextureAtlas;
                }
            }
			return null;
		}
		
		public _buildBones(armature:Armature):void{
			//按照从属关系的顺序建立
			var boneDataList:Array<BoneData> = armature.armatureData.boneDataList;
			
			var boneData:BoneData;
			var bone:Bone;
			var parent:string;
			for(var i:number = 0;i < boneDataList.length;i ++){
				boneData = boneDataList[i];
				bone = Bone.initWithBoneData(boneData);
				parent = boneData.parent;
				if(	parent && armature.armatureData.getBoneData(parent) == null){
					parent = null;
				}
                //Todo use a internal addBone method to avoid sortBones every time.
				armature.addBone(bone, parent, true);
			}
            armature._updateAnimationAfterBoneListChanged();
		}
		
		public _buildSlots(armature:Armature, skinName:string, textureAtlas:any):void{
			var skinData:SkinData = armature.armatureData.getSkinData(skinName);
			if(!skinData){
				return;
			}
			var displayList:Array<any> = [];
			var slotDataList:Array<SlotData> = skinData.slotDataList;
			var slotData:SlotData;
			var slot:Slot;
			var bone:Bone;
			for(var i:number = 0; i < slotDataList.length; i++){
				slotData = slotDataList[i];
				bone = armature.getBone(slotData.parent);
				if(!bone){
					continue;
				}
				
				slot = this._generateSlot();
				slot.initWithSlotData(slotData);
				bone.addSlot(slot);
				
				var l:number = slotData.displayDataList.length;
				while(l--){
					var displayData:DisplayData = slotData.displayDataList[l];
					
					switch(displayData.type){
						case DisplayData.ARMATURE:
                            var childArmature:Armature = this.buildArmatureUsingArmatureDataFromTextureAtlas(armature.__dragonBonesData, armature.__dragonBonesData.getArmatureDataByName(displayData.name), textureAtlas, skinName);
                            displayList[l] = childArmature;
							break;
						
						case DisplayData.IMAGE:
						default:
							displayList[l] = this._generateDisplay(textureAtlas, displayData.name, displayData.pivot.x, displayData.pivot.y);
							break;
						
					}
				}
				//==================================================
				//如果显示对象有name属性并且name属性可以设置的话，将name设置为与slot同名，dragonBones并不依赖这些属性，只是方便开发者

                for(var key in displayList)
                {
                    var displayObject:any = displayList[key];
                    if(displayObject instanceof Armature){
                        displayObject = (<Armature><any> displayObject).display;
                    }

                    if(displayObject.hasOwnProperty("name")){
                        try{
                            displayObject["name"] = slot.name;
                        }
                        catch(err){
                        }
                    }
                }
				//==================================================
				
				slot.displayList = displayList;
				slot._changeDisplay(0);
			}
		}
		
		/**
		 * @private
		 * Generates an Armature instance.
		 * @return Armature An Armature instance.
		 */
		public _generateArmature():Armature{
			return null;
		}
		
		/**
		 * @private
		 * Generates an Slot instance.
		 * @return Slot An Slot instance.
		 */
		public _generateSlot():Slot{
			return null;
		}
		
		/**
		 * @private
		 * Generates a DisplayObject
		 * @param textureAtlas The TextureAtlas.
		 * @param fullName A qualified name.
		 * @param pivotX A pivot x based value.
		 * @param pivotY A pivot y based value.
		 * @return
		 */
		public _generateDisplay(textureAtlas:any, fullName:string, pivotX:number, pivotY:number):any{
			return null;
		}
		
	}
}