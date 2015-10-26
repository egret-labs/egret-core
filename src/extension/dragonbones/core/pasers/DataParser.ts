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
	 *@class dragonBones.DataParser
	 * @classdesc
	 * 数据解析
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
	export class DataParser{
		private static tempDragonBonesData:DragonBonesData;

		/**
		 *解析纹理集数据
		 * @param rawData纹理集数据xml或者json
		 * @param scale纹理资源的缩放，默认为1，不缩放
		 * @returns {any}返回纹理集数据，存放TexutrueData的字典类型
		 */
		public static parseTextureAtlasData(rawData:any, scale:number = 1):any{
			var textureAtlasData:any = {};
			var subTextureFrame:Rectangle;

            var subTextureList:any = rawData[ConstValues.SUB_TEXTURE];
            for(var i:number = 0, len:number = subTextureList.length; i < len; i++) {
                var subTextureObject:any = subTextureList[i];
                var subTextureName:string = subTextureObject[ConstValues.A_NAME];
                var subTextureRegion:Rectangle = new Rectangle();
                subTextureRegion.x = DataParser.getNumber(subTextureObject, ConstValues.A_X, 0) / scale;
                subTextureRegion.y = DataParser.getNumber(subTextureObject, ConstValues.A_Y, 0) / scale;
                subTextureRegion.width = DataParser.getNumber(subTextureObject, ConstValues.A_WIDTH, 0) / scale;
                subTextureRegion.height = DataParser.getNumber(subTextureObject, ConstValues.A_HEIGHT, 0) / scale;

                var rotated:boolean = subTextureObject[ConstValues.A_ROTATED] == "true";

                var frameWidth:number = DataParser.getNumber(subTextureObject, ConstValues.A_FRAME_WIDTH, 0) / scale;
                var frameHeight:number = DataParser.getNumber(subTextureObject, ConstValues.A_FRAME_HEIGHT, 0) / scale;

                if (frameWidth > 0 && frameHeight > 0) {
                    subTextureFrame = new Rectangle();
                    subTextureFrame.x = DataParser.getNumber(subTextureObject, ConstValues.A_FRAME_X, 0) / scale;
                    subTextureFrame.y = DataParser.getNumber(subTextureObject, ConstValues.A_FRAME_Y, 0) / scale;
                    subTextureFrame.width = frameWidth;
                    subTextureFrame.height = frameHeight;
                }
                else {
                    subTextureFrame = null;
                }

                textureAtlasData[subTextureName] = new TextureData(subTextureRegion, subTextureFrame, rotated);
            }
			
			return textureAtlasData;
		}

		/**
		 * 解析DragonBones的数据，xml或者json，该数据包含了骨骼，皮肤，动画的数据
		 * @param rawDataToParse DragonBones的数据，xml或者json格式
		 * @returns {DragonBonesData} 返回DragonBones引擎使用的数据格式
		 */
		public static parseDragonBonesData(rawDataToParse:any):DragonBonesData{
			if(!rawDataToParse){
				throw new Error();
			}
			
			var version:string = rawDataToParse[ConstValues.A_VERSION];
            version = version.toString();
            if( version.toString() != DragonBones.DATA_VERSION &&
                version.toString() != DragonBones.PARENT_COORDINATE_DATA_VERSION &&
				version.toString() != "2.3")
            {
                throw new Error(egret.getString(4003));
            }
			else if(version.toString() == DragonBones.PARENT_COORDINATE_DATA_VERSION||
					 version.toString() == "2.3")
			{
				return Data3Parser.parseDragonBonesData(rawDataToParse);
			}
			
			var frameRate:number = DataParser.getNumber(rawDataToParse, ConstValues.A_FRAME_RATE, 0) || 0;
			
			var outputDragonBonesData:DragonBonesData =  new DragonBonesData();
			outputDragonBonesData.name = rawDataToParse[ConstValues.A_NAME];
            outputDragonBonesData.isGlobal = rawDataToParse[ConstValues.A_IS_GLOBAL] == "0" ? false : true;
            DataParser.tempDragonBonesData = outputDragonBonesData;

            var armatureList:any = rawDataToParse[ConstValues.ARMATURE];
            for(var i:number = 0, len:number = armatureList.length; i < len; i++) 
            {
                var armatureObject:any = armatureList[i];
                outputDragonBonesData.addArmatureData(DataParser.parseArmatureData(armatureObject, frameRate));
            }

            DataParser.tempDragonBonesData = null;
			
			return outputDragonBonesData;
		}
		
		private static parseArmatureData(armatureDataToParse:any, frameRate:number):ArmatureData{
			var outputArmatureData:ArmatureData = new ArmatureData();
			outputArmatureData.name = armatureDataToParse[ConstValues.A_NAME];

            var boneList:any = armatureDataToParse[ConstValues.BONE];
            var i:number;
            var len:number;

            for(i = 0, len = boneList.length; i < len; i++) 
            {
                var boneObject:any = boneList[i];
                outputArmatureData.addBoneData(DataParser.parseBoneData(boneObject));
            }

			var slotList:any = armatureDataToParse[ConstValues.SLOT];
			for(i = 0, len = slotList.length; i < len; i++) 
			{
				var slotObject:any = slotList[i];
				outputArmatureData.addSlotData(DataParser.parseSlotData(slotObject));
			}
            var skinList:any = armatureDataToParse[ConstValues.SKIN];
            for(i = 0, len = skinList.length; i < len; i++) 
            {
                var skinObject:any = skinList[i];
                outputArmatureData.addSkinData(DataParser.parseSkinData(skinObject));
            }
			if(DataParser.tempDragonBonesData.isGlobal)
            {
                DBDataUtil.transformArmatureData(outputArmatureData);
            }
			outputArmatureData.sortBoneDataList();

            var animationList:any = armatureDataToParse[ConstValues.ANIMATION];
            for(i = 0, len = animationList.length; i < len; i++) 
            {
                var animationObject:any = animationList[i];
                var animationData:AnimationData = DataParser.parseAnimationData(animationObject, frameRate);
                DBDataUtil.addHideTimeline(animationData, outputArmatureData, true);
                DBDataUtil.transformAnimationData(animationData, outputArmatureData, DataParser.tempDragonBonesData.isGlobal);
                outputArmatureData.addAnimationData(animationData);
            }
			
			return outputArmatureData;
		}
		
		//把bone的初始transform解析并返回
		private static parseBoneData(boneObject:any):BoneData{
			var boneData:BoneData = new BoneData();
			boneData.name = boneObject[ConstValues.A_NAME];
			boneData.parent = boneObject[ConstValues.A_PARENT];
			boneData.length = Number(boneObject[ConstValues.A_LENGTH]) || 0;
			boneData.inheritRotation = DataParser.getBoolean(boneObject, ConstValues.A_INHERIT_ROTATION, true);
			boneData.inheritScale = DataParser.getBoolean(boneObject, ConstValues.A_INHERIT_SCALE, true);
			
			DataParser.parseTransform(boneObject[ConstValues.TRANSFORM], boneData.transform);
            if(DataParser.tempDragonBonesData.isGlobal)//绝对数据
            {
                boneData.global.copy(boneData.transform);
            }
			
			return boneData;
		}
		
		private static parseSkinData(skinObject:any):SkinData{
			var skinData:SkinData = new SkinData();
			skinData.name = skinObject[ConstValues.A_NAME];

            var slotList:any = skinObject[ConstValues.SLOT];
            for(var i:number = 0, len:number = slotList.length; i < len; i++) 
            {
                var slotObject:any = slotList[i];
                skinData.addSlotData(DataParser.parseSlotDisplayData(slotObject));
            }
			
			return skinData;
		}
		
		private static parseSlotData(slotObject:any):SlotData{
			var slotData:SlotData = new SlotData();
			slotData.name = slotObject[ConstValues.A_NAME];
			slotData.parent = slotObject[ConstValues.A_PARENT];
			slotData.zOrder = DataParser.getNumber(slotObject,ConstValues.A_Z_ORDER,0)||0;
			slotData.displayIndex = DataParser.getNumber(slotObject,ConstValues.A_DISPLAY_INDEX,0);
			slotData.blendMode = slotObject[ConstValues.A_BLENDMODE];
			return slotData;
		}

		private static parseSlotDisplayData(slotObject:any):SlotData{
			var slotData:SlotData = new SlotData();
			slotData.name = slotObject[ConstValues.A_NAME];
			slotData.parent = slotObject[ConstValues.A_PARENT];
			slotData.zOrder = DataParser.getNumber(slotObject,ConstValues.A_Z_ORDER,0)||0;
            var displayList:any = slotObject[ConstValues.DISPLAY];

            for(var i:number = 0, len:number = displayList.length; i < len; i++) 
            {
                var displayObject:any = displayList[i];
                slotData.addDisplayData(DataParser.parseDisplayData(displayObject));
            }
			
			return slotData;
		}
		
		private static parseDisplayData(displayObject:any):DisplayData{
			var displayData:DisplayData = new DisplayData();
			displayData.name = displayObject[ConstValues.A_NAME];
			displayData.type = displayObject[ConstValues.A_TYPE];
			DataParser.parseTransform(displayObject[ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
			displayData.pivot.x = NaN;
			displayData.pivot.y = NaN;
			if(DataParser.tempDragonBonesData!=null){
				DataParser.tempDragonBonesData.addDisplayData(displayData);
			}
			
			return displayData;
		}
		
		/** @private */
		private static parseAnimationData(animationObject:any, frameRate:number):AnimationData{
			var animationData:AnimationData = new AnimationData();
			animationData.name = animationObject[ConstValues.A_NAME];
			animationData.frameRate = frameRate;
			animationData.duration = Math.round((DataParser.getNumber(animationObject, ConstValues.A_DURATION, 1) || 1) * 1000 / frameRate);
			animationData.playTimes = DataParser.getNumber(animationObject, ConstValues.A_PLAY_TIMES, 1);
            animationData.playTimes = animationData.playTimes != NaN ? animationData.playTimes : 1;
			animationData.fadeTime = DataParser.getNumber(animationObject, ConstValues.A_FADE_IN_TIME, 0) || 0;
			animationData.scale = DataParser.getNumber(animationObject, ConstValues.A_SCALE, 1) || 0;
			//use frame tweenEase, NaN
			//overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			animationData.tweenEasing = DataParser.getNumber(animationObject, ConstValues.A_TWEEN_EASING, NaN);
			animationData.autoTween = DataParser.getBoolean(animationObject, ConstValues.A_AUTO_TWEEN, true);

            var frameObjectList:Array<any> = animationObject[ConstValues.FRAME];
			var i:number = 0;
			var len:number = 0;
			if(frameObjectList)
			{
				for (i = 0, len = frameObjectList.length; i < len; i++)
				{
					var frameObject:any = frameObjectList[i];
					var frame:Frame = DataParser.parseTransformFrame(frameObject, frameRate);
					animationData.addFrame(frame);
				}
			}

            DataParser.parseTimeline(animationObject, animationData);
			
			var lastFrameDuration:number = animationData.duration;

            var timelineObjectList:Array<any> = animationObject[ConstValues.BONE];
			if(timelineObjectList)
			{
				for(i = 0,len = timelineObjectList.length; i < len; i++) {
					var timelineObject:any = timelineObjectList[i];
					if(timelineObject)
					{
						var timeline:TransformTimeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
						if(timeline.frameList.length > 0)
						{
							lastFrameDuration = Math.min(lastFrameDuration, timeline.frameList[timeline.frameList.length - 1].duration);
						}
						animationData.addTimeline(timeline);
					}
				}
			}

			var slotTimelineObjectList:Array<any> = animationObject[ConstValues.SLOT];
			if(slotTimelineObjectList)
			{
				for(i = 0, len = slotTimelineObjectList.length; i < len; i++) {
					var slotTimelineObject:any = slotTimelineObjectList[i];
					if(slotTimelineObject){
						var slotTimeline:SlotTimeline = DataParser.parseSlotTimeline(slotTimelineObject, animationData.duration, frameRate);
						if(slotTimeline.frameList.length > 0)
						{
							lastFrameDuration = Math.min(lastFrameDuration, slotTimeline.frameList[slotTimeline.frameList.length - 1].duration);
							animationData.addSlotTimeline(slotTimeline);
						}
					}
				}
			}

			if(animationData.frameList.length > 0){
				lastFrameDuration = Math.min(lastFrameDuration, animationData.frameList[animationData.frameList.length - 1].duration);
			}
			//取得timeline中最小的lastFrameDuration并保存
			animationData.lastFrameDuration = lastFrameDuration;
			
			return animationData;
		}
		
		private static parseTransformTimeline(timelineObject:any, duration:number, frameRate:number):TransformTimeline{
			var outputTimeline:TransformTimeline = new TransformTimeline();
			outputTimeline.name = timelineObject[ConstValues.A_NAME];
			outputTimeline.scale = DataParser.getNumber(timelineObject, ConstValues.A_SCALE, 1) || 0;
			outputTimeline.offset = DataParser.getNumber(timelineObject, ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.originPivot.x = DataParser.getNumber(timelineObject, ConstValues.A_PIVOT_X, 0) || 0;
            outputTimeline.originPivot.y = DataParser.getNumber(timelineObject, ConstValues.A_PIVOT_Y, 0) || 0;
			outputTimeline.duration = duration;

            var frameList:any = timelineObject[ConstValues.FRAME];
            for(var i:number = 0, len:number = frameList.length; i < len; i++) 
            {
                var frameObject:any = frameList[i];
                var frame:TransformFrame = DataParser.parseTransformFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }

            DataParser.parseTimeline(timelineObject, outputTimeline);
			
			return outputTimeline;
		}

		private static parseSlotTimeline(timelineObject:any, duration:number, frameRate:number):SlotTimeline{
			var outputTimeline:SlotTimeline = new SlotTimeline();
			outputTimeline.name = timelineObject[ConstValues.A_NAME];
			outputTimeline.scale = DataParser.getNumber(timelineObject, ConstValues.A_SCALE, 1) || 0;
			outputTimeline.offset = DataParser.getNumber(timelineObject, ConstValues.A_OFFSET, 0) || 0;
			outputTimeline.duration = duration;

			var frameList:any = timelineObject[ConstValues.FRAME];
			for(var i:number = 0, len:number = frameList.length; i < len; i++) 
			{
				var frameObject:any = frameList[i];
				var frame:SlotFrame = DataParser.parseSlotFrame(frameObject, frameRate);
				outputTimeline.addFrame(frame);
			}

			DataParser.parseTimeline(timelineObject, outputTimeline);

			return outputTimeline;
		}

		private static parseTransformFrame(frameObject:any, frameRate:number):TransformFrame{
			var outputFrame:TransformFrame = new TransformFrame();
            DataParser.parseFrame(frameObject, outputFrame, frameRate);
			
			outputFrame.visible = !DataParser.getBoolean(frameObject, ConstValues.A_HIDE, false);
			
			//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			outputFrame.tweenEasing = DataParser.getNumber(frameObject, ConstValues.A_TWEEN_EASING, 10);
			outputFrame.tweenRotate = Math.floor(DataParser.getNumber(frameObject, ConstValues.A_TWEEN_ROTATE, 0) || 0);
			outputFrame.tweenScale = DataParser.getBoolean(frameObject, ConstValues.A_TWEEN_SCALE, true);
			outputFrame.displayIndex = Math.floor(DataParser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0);
			
			DataParser.parseTransform(frameObject[ConstValues.TRANSFORM], outputFrame.transform, outputFrame.pivot);
            if(DataParser.tempDragonBonesData.isGlobal)//绝对数据
            {
                outputFrame.global.copy(outputFrame.transform);
            }
			
			outputFrame.scaleOffset.x = DataParser.getNumber(frameObject, ConstValues.A_SCALE_X_OFFSET, 0)||0;
			outputFrame.scaleOffset.y = DataParser.getNumber(frameObject, ConstValues.A_SCALE_Y_OFFSET, 0)||0;

			
			return outputFrame;
		}

		private static parseSlotFrame(frameObject:any, frameRate:number):SlotFrame{
			var outputFrame:SlotFrame = new SlotFrame();
			DataParser.parseFrame(frameObject, outputFrame, frameRate);

			outputFrame.visible = !DataParser.getBoolean(frameObject, ConstValues.A_HIDE, false);

			//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			outputFrame.tweenEasing = DataParser.getNumber(frameObject, ConstValues.A_TWEEN_EASING, 10);
			outputFrame.displayIndex = Math.floor(DataParser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0);

			//如果为NaN，则说明没有改变过zOrder
			outputFrame.zOrder = DataParser.getNumber(frameObject, ConstValues.A_Z_ORDER, DataParser.tempDragonBonesData.isGlobal ? NaN : 0);

			var colorTransformObject:any = frameObject[ConstValues.COLOR];
			if(colorTransformObject){
				outputFrame.color = new ColorTransform();
				DataParser.parseColorTransform(colorTransformObject, outputFrame.color);
			}

			return outputFrame;
		}

		private static parseTimeline(timelineObject:any, outputTimeline:Timeline):void{
			var position:number = 0;
			var frame:Frame;

            var frameList:any = outputTimeline.frameList;
            for(var i:number = 0, len:number = frameList.length; i < len; i++) 
            {
                frame = frameList[i];
                frame.position = position;
                position += frame.duration;
            }

			//防止duration计算有误差
			if(frame){
				frame.duration = outputTimeline.duration - frame.position;
			}
		}
		
		private static parseFrame(frameObject:any, outputFrame:Frame, frameRate:number = 0):void{
			outputFrame.duration = Math.round((<number><any> (frameObject[ConstValues.A_DURATION]) || 1) * 1000 / frameRate);
			outputFrame.action = frameObject[ConstValues.A_ACTION];
			outputFrame.event = frameObject[ConstValues.A_EVENT];
			outputFrame.sound = frameObject[ConstValues.A_SOUND];
			var curve:any = frameObject[ConstValues.A_CURVE];
			if(curve != null && curve.length == 4)
			{
				outputFrame.curve = new CurveData();
				outputFrame.curve.pointList = [new Point(curve[0],
														 curve[1]),
											   new Point(curve[2],
														 curve[3])];
			}
		}
		
		private static parseTransform(transformObject:any, transform:DBTransform, pivot:Point = null):void{
			if(transformObject){
				if(transform){
					transform.x = DataParser.getNumber(transformObject, ConstValues.A_X, 0) || 0;
					transform.y = DataParser.getNumber(transformObject, ConstValues.A_Y, 0) || 0;
					transform.skewX = DataParser.getNumber (transformObject, ConstValues.A_SKEW_X, 0) * ConstValues.ANGLE_TO_RADIAN || 0;
					transform.skewY =DataParser.getNumber(transformObject, ConstValues.A_SKEW_Y, 0) * ConstValues.ANGLE_TO_RADIAN || 0;
					transform.scaleX = DataParser.getNumber(transformObject, ConstValues.A_SCALE_X, 1) || 0;
					transform.scaleY = DataParser.getNumber(transformObject, ConstValues.A_SCALE_Y, 1) || 0;
				}
				if(pivot){
					pivot.x = DataParser.getNumber(transformObject, ConstValues.A_PIVOT_X, 0) || 0;
					pivot.y = DataParser.getNumber(transformObject, ConstValues.A_PIVOT_Y, 0) || 0;
				}
			}
		}
		
		private static parseColorTransform(colorTransformObject:any, colorTransform:ColorTransform):void{
            if(colorTransform){
				colorTransform.alphaOffset =DataParser.getNumber(colorTransformObject, ConstValues.A_ALPHA_OFFSET, 0);
				colorTransform.redOffset = DataParser.getNumber(colorTransformObject, ConstValues.A_RED_OFFSET, 0);
				colorTransform.greenOffset = DataParser.getNumber(colorTransformObject, ConstValues.A_GREEN_OFFSET, 0);
				colorTransform.blueOffset = DataParser.getNumber(colorTransformObject, ConstValues.A_BLUE_OFFSET, 0);
				
				colorTransform.alphaMultiplier = DataParser.getNumber(colorTransformObject, ConstValues.A_ALPHA_MULTIPLIER, 100) * 0.01;
				colorTransform.redMultiplier = DataParser.getNumber(colorTransformObject, ConstValues.A_RED_MULTIPLIER, 100) * 0.01;
				colorTransform.greenMultiplier =DataParser.getNumber(colorTransformObject, ConstValues.A_GREEN_MULTIPLIER, 100) * 0.01;
				colorTransform.blueMultiplier = DataParser.getNumber(colorTransformObject, ConstValues.A_BLUE_MULTIPLIER, 100) * 0.01;
			}
		}
		
		private static getBoolean(data:any, key:string, defaultValue:boolean):boolean{
			if(data && key in data){
				switch(String(data[key])){
					case "0":
					case "NaN":
					case "":
					case "false":
					case "null":
					case "undefined":
						return false;
						
					case "1":
					case "true":
					default:
						return true;
				}
			}
			return defaultValue;
		}
		
		private static getNumber(data:any, key:string, defaultValue:number):number{
			if(data && key in data){
				switch(String(data[key])){
					case "NaN":
					case "":
					case "false":
					case "null":
					case "undefined":
						return NaN;
						
					default:
						return Number(data[key]);
				}
			}
			return defaultValue;
		}
	}
}