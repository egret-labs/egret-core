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
	 * @class dragonBones.BaseFactory
	 * @classdesc
	 * 工厂的基类
	 * @extends dragonBones.EventDispatcher
	 *
	 * @example
       <pre>
         //获取动画数据
         var skeletonData = RES.getRes("skeleton");
         //获取纹理集数据
         var textureData = RES.getRes("textureConfig");
         //获取纹理集图片
         var texture = RES.getRes("texture");
	  
         //创建一个工厂，用来创建Armature
         var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
         //把动画数据添加到工厂里
         factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
         //把纹理集数据和图片添加到工厂里
         factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
         //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
         var armatureName:string = skeletonData.armature[0].name;
         //从工厂里创建出Armature
         var armature:dragonBones.Armature = factory.buildArmature(armatureName);
         //获取装载Armature的容器
         var armatureDisplay = armature.display;
         //把它添加到舞台上
         this.addChild(armatureDisplay);
         //取得这个Armature动画列表中的第一个动画的名字
         var curAnimationName = armature.animation.animationList[0];
         //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
         //第一个参数 animationName {string} 指定播放动画的名称.
         //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
	  
         //把Armature添加到心跳时钟里
         dragonBones.WorldClock.clock.add(armature);
         //心跳时钟开启
         egret.Ticker.getInstance().register(function (advancedTime) {
             dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
         }, this);
       </pre>
	 */
	export class BaseFactory  extends EventDispatcher{
		public static _helpMatrix:Matrix = new Matrix();
		
		/** @private */
		public dragonBonesDataDic:any = {};
		
		/** @private */
		public textureAtlasDic:any = {};
		public constructor(self:BaseFactory){
			super();
			
			if(self != this){ 
				throw new Error(egret.getString(4001));
			}
		}
		
		/**
		 * 释放资源
		 * @param  disposeData {boolean} (optional) 是否释放所有内部的引用
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
         * 根据名字获取一个DragonBonesData
         * @param name {string} 想要获取的DragonBonesData的名字
         * @returns {dragonBones.DragonBonesData} 返回指定名字的DragonBonesData（如果存在的话）
         */
        public getDragonBonesData(name:string):DragonBonesData{
            return this.dragonBonesDataDic[name];
        }

		/**
		 * 根据名字获取一个DragonBonesData（不推荐使用）
		 * 建议使用方法getDragonBonesData来代替这个方法
		 */
		public getSkeletonData(name:string):DragonBonesData{
			return this.getDragonBonesData(name);
		}
		
		/**
		 * 添加一个DragonBonesData实例
		 * @param data {dragonBones.DragonBonesData} 一个DragonBonesData实例
		 * @param name {string} (optional) DragonBonesData的名字
		 */
		public addDragonBonesData(data:DragonBonesData, name:string = null):void{
			if(!data){
				throw new Error();
			}
			name = name || data.name;
			if(!name){
				throw new Error(egret.getString(4002));
			}
            /*
			if(this.dragonBonesDataDic[name]){
				throw new Error();
			}*/
			this.dragonBonesDataDic[name] = data;
		}

        /**
         * 添加一个DragonBonesData实例（不推荐使用）
		 * 建议使用方法addDragonBonesData来代替
         */
        public addSkeletonData(data:DragonBonesData, name:string = null):void{
            this.addDragonBonesData(data, name);
        }

		/**
		 * 根据名字移除一个DragonBonesData实例.
		 * @param name {string} 想要移除的DragonBonesData的名字
		 */
		public removeDragonBonesData(name:string):void{
			delete this.dragonBonesDataDic[name];
		}

        /**
		 * 根据名字移除一个DragonBonesData实例.（不推荐使用）
		 * 建议使用方法removeDragonBonesData代替
         */
        public removeSkeletonData(name:string):void{
            delete this.dragonBonesDataDic[name];
        }

		/**
		 * 根据名字获取纹理集TextureAtlas
		 * @param name {string} 需要获取的纹理集TextureAtlas的名字
		 * @returns {any} 纹理集TextureAtlas
		 */
		public getTextureAtlas(name:string):any{
			return this.textureAtlasDic[name];
		}
		
		/**
		 * 添加一个纹理集
		 * @param textureAtlas {any} 需要被添加的纹理集
		 * @param name {string} (optional) 需要被添加的纹理集的名字
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
				throw new Error(egret.getString(4002));
			}
            /*
			if(this.textureAtlasDic[name]){
				throw new Error();
			}*/
			this.textureAtlasDic[name] = textureAtlas;
		}
		
		/**
		 * 移除指定名字的纹理集
		 * @param name {string} 需要移除的纹理集的名字
		 */
		public removeTextureAtlas(name:string):void{
			delete this.textureAtlasDic[name];
		}
		
		/**
		 * 获取TextureDisplay
		 * @param textureName {string} 纹理的名字
		 * @param textureAtlasName {string} 纹理集的名字
		 * @param pivotX {number} 轴点的x坐标
		 * @param pivotY {number} 轴点的y坐标
		 * @returns {any} 返回的TextureDisplay
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

		/**
		 * 构建骨架
		 * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
		 * TO DO 以后会支持一对多的情况
		 * @param armatureName 骨架的名字
		 * @param fromDragonBonesDataName 骨架数据的名字 可选参数
		 * @param fromTextureAtlasName 纹理集的名字 可选参数
		 * @param skinName 皮肤的名字 可选参数
		 * @returns {*}
		 */
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


		/**
		 * 构建fast骨架
		 * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
		 * TO DO 以后会支持一对多的情况
		 * @param armatureName 骨架的名字
		 * @param fromDragonBonesDataName 骨架数据的名字 可选参数
		 * @param fromTextureAtlasName 纹理集的名字 可选参数
		 * @param skinName 皮肤的名字 可选参数
		 * @returns {*}
		 */
		public buildFastArmature(armatureName:string, fromDragonBonesDataName:string = null, fromTextureAtlasName:string = null, skinName:string = null):FastArmature{
			var buildArmatureDataPackage:BuildArmatureDataPackage = new BuildArmatureDataPackage();
			if(this.fillBuildArmatureDataPackageArmatureInfo(armatureName, fromDragonBonesDataName, buildArmatureDataPackage)){
				this.fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName, buildArmatureDataPackage);
			}
			
			var dragonBonesData:DragonBonesData = buildArmatureDataPackage.dragonBonesData;
			var armatureData:ArmatureData = buildArmatureDataPackage.armatureData;
			var textureAtlas:any = buildArmatureDataPackage.textureAtlas;
			
			if(!armatureData || !textureAtlas){
				return null;
			}
			
			return this.buildFastArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData, armatureData, textureAtlas, skinName);
		}

		/**
		 * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
		 * @param dragonBonesData dragonBones数据
		 * @param armatureData 骨架数据
		 * @param textureAtlas 纹理集
		 * @param skinName 皮肤名称 可选参数
		 * @returns {Armature}
		 */
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

		/**
		 * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
		 * @param dragonBonesData dragonBones数据
		 * @param armatureData 骨架数据
		 * @param textureAtlas 纹理集
		 * @param skinName 皮肤名称 可选参数
		 * @returns {Armature}
		 */
		public buildFastArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData:DragonBonesData, armatureData:ArmatureData, textureAtlas:any, skinName:string = null):FastArmature{
			var outputArmature:FastArmature = this._generateFastArmature();
			outputArmature.name = armatureData.name;
			outputArmature.__dragonBonesData = dragonBonesData;
			outputArmature._armatureData = armatureData;
			outputArmature.animation.animationDataList = armatureData.animationDataList;
			
			this._buildFastBones(outputArmature);
			//TO DO: Support multi textureAtlas case in future
			this._buildFastSlots(outputArmature, skinName, textureAtlas);
			
			outputArmature.advanceTime(0);
			
			return outputArmature;
		}

		/**
		 * 拷贝动画到骨架中
		 * 暂时不支持ifRemoveOriginalAnimationList为false的情况
		 * @param toArmature  拷贝到的那个骨架
		 * @param fromArmatreName 从哪个骨架里拷贝，骨架的名字
		 * @param fromDragonBonesDataName 从哪个DragonBones数据中拷贝，Dragonbones数据的名字
		 * @param ifRemoveOriginalAnimationList 是否移除原骨架里的动画，暂时不支持为false的情况
		 * @returns {boolean}
		 */
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
                return true;
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
			armature.armatureData.setSkinData(skinName);
			var displayList:Array<any> = [];
			var slotDataList:Array<SlotData> = armature.armatureData.slotDataList;
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
				displayList.length = 0;
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

                for(var j:number = 0,jLen:number = displayList.length; j < jLen; j++)
                {
                    var displayObject:any = displayList[j];
					if(!displayObject)
					{
						continue;
					}
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
				slot._changeDisplay(slotData.displayIndex);
			}
		}

		public _buildFastBones(armature:FastArmature):void{
			//按照从属关系的顺序建立
			var boneDataList:Array<BoneData> = armature.armatureData.boneDataList;
			
			var boneData:BoneData;
			var bone:FastBone;
			for(var i:number = 0;i < boneDataList.length;i ++){
				boneData = boneDataList[i];
				bone = FastBone.initWithBoneData(boneData);
				armature.addBone(bone, boneData.parent);
			}
		}
		
		public _buildFastSlots(armature:FastArmature, skinName:string, textureAtlas:any):void{
		//根据皮肤初始化SlotData的DisplayDataList
			var skinData:SkinData = armature.armatureData.getSkinData(skinName);
			if(!skinData){
				return;
			}
			armature.armatureData.setSkinData(skinName);
			
			var displayList:Array<any> = [];
			var slotDataList:Array<SlotData> = armature.armatureData.slotDataList;
			var slotData:SlotData;
			var slot:FastSlot;
			for(var i:number = 0; i < slotDataList.length; i++){
				displayList.length = 0;
				slotData = slotDataList[i];
				slot = this._generateFastSlot();
				slot.initWithSlotData(slotData);
				
				
				var l:number = slotData.displayDataList.length;
				while(l--){
					var displayData:DisplayData = slotData.displayDataList[l];
					
					switch(displayData.type){
						case DisplayData.ARMATURE:
							var childArmature:FastArmature = this.buildFastArmatureUsingArmatureDataFromTextureAtlas(armature.__dragonBonesData, armature.__dragonBonesData.getArmatureDataByName(displayData.name), textureAtlas, skinName);
							displayList[l] = childArmature;
							slot.hasChildArmature = true;
							break;
						
						case DisplayData.IMAGE:
						default:
							displayList[l] = this._generateDisplay(textureAtlas, displayData.name, displayData.pivot.x, displayData.pivot.y);
							break;
						
					}
				}
				//==================================================
				//如果显示对象有name属性并且name属性可以设置的话，将name设置为与slot同名，dragonBones并不依赖这些属性，只是方便开发者
				var length1:number = displayList.length;
				for(var i1:number = 0;i1 < length1;i1++)
				{
					var displayObject:any = displayList[i1];
					if(!displayObject)
					{
						continue;
					}
					if(displayObject instanceof FastArmature){
						displayObject = (<FastArmature><any> displayObject).display;
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
				slot.initDisplayList(displayList.concat());
				armature.addSlot(slot, slotData.parent);
				slot._changeDisplayIndex(slotData.displayIndex);
			}
		}
		/**
		 * @private
		 * Generates an Armature instance.
		 * @returns {dragonBones.Armature} Armature An Armature instance.
		 */
		public _generateArmature():Armature{
			return null;
		}
		
		/**
		 * @private
		 * Generates an Slot instance.
		 * @returns {dragonBones.Slot} Slot An Slot instance.
		 */
		public _generateSlot():Slot{
			return null;
		}
		
		/**
		 * @private
		 * Generates an Armature instance.
		 * @returns {dragonBones.Armature} Armature An Armature instance.
		 */
		public _generateFastArmature():FastArmature{
			return null;
		}
		
		/**
		 * @private
		 * Generates an Slot instance.
		 * @returns {dragonBones.Slot} Slot An Slot instance.
		 */
		public _generateFastSlot():FastSlot{
			return null;
		}

		/**
		 * @private
		 * Generates a DisplayObject
		 * @param textureAtlas {any} The TextureAtlas.
		 * @param fullName {string} A qualified name.
		 * @param pivotX {number} A pivot x based value.
		 * @param pivotY {number} A pivot y based value.
		 * @returns {any}
		 */
		public _generateDisplay(textureAtlas:any, fullName:string, pivotX:number, pivotY:number):any{
			return null;
		}
		
	}

	export class BuildArmatureDataPackage{
		public dragonBonesDataName:string;
		public dragonBonesData:DragonBonesData;
		public armatureData:ArmatureData;
		public textureAtlas:any;
	}
}