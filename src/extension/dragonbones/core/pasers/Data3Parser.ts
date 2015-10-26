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
	 * 老版本数据解析
	 */
	export class Data3Parser{
		private static tempDragonBonesData:DragonBonesData;

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
                throw new Error("Nonsupport version!");
            }
			
			var frameRate:number = Data3Parser.getNumber(rawDataToParse, ConstValues.A_FRAME_RATE, 0) || 0;
			
			var outputDragonBonesData:DragonBonesData =  new DragonBonesData();
			outputDragonBonesData.name = rawDataToParse[ConstValues.A_NAME];
            outputDragonBonesData.isGlobal = rawDataToParse[ConstValues.A_IS_GLOBAL] == "0" ? false : true;
            Data3Parser.tempDragonBonesData = outputDragonBonesData;

            var armatureList:any = rawDataToParse[ConstValues.ARMATURE];
            for(var i:number = 0, len:number = armatureList.length; i < len; i++) 
            {
                var armatureObject:any = armatureList[i];
                outputDragonBonesData.addArmatureData(Data3Parser.parseArmatureData(armatureObject, frameRate));
            }

            Data3Parser.tempDragonBonesData = null;
			
			return outputDragonBonesData;
		}
		
		private static parseArmatureData(armatureDataToParse:any, frameRate:number):ArmatureData{
			var outputArmatureData:ArmatureData = new ArmatureData();
			outputArmatureData.name = armatureDataToParse[ConstValues.A_NAME];

			var i:number;
			var len:number;
            var boneList:any = armatureDataToParse[ConstValues.BONE];
            for(i = 0, len = boneList.length; i < len; i++) 
            {
                var boneObject:any = boneList[i];
                outputArmatureData.addBoneData(Data3Parser.parseBoneData(boneObject));
            }

            var skinList:any = armatureDataToParse[ConstValues.SKIN];
			for(i = 0, len = skinList.length; i < len; i++) 
			{
				var skinSlotList:any = skinList[i];
				var skinSlotObject:any = skinSlotList[ConstValues.SLOT];
				for(var j:number = 0, jLen:number = skinSlotObject.length; j < jLen; j++)
				{
					var slotObject:any = skinSlotObject[j];
					outputArmatureData.addSlotData(Data3Parser.parseSlotData(slotObject))
				}
			}
            for(i = 0, len = skinList.length; i < len; i++) 
            {
                var skinObject:any = skinList[i];
                outputArmatureData.addSkinData(Data3Parser.parseSkinData(skinObject));
            }
			if(Data3Parser.tempDragonBonesData.isGlobal)
            {
                DBDataUtil.transformArmatureData(outputArmatureData);
            }
			outputArmatureData.sortBoneDataList();

            var animationList:any = armatureDataToParse[ConstValues.ANIMATION];
            for(i = 0, len = animationList.length; i < len; i++) 
            {
                var animationObject:any = animationList[i];
                var animationData:AnimationData = Data3Parser.parseAnimationData(animationObject, frameRate);
                DBDataUtil.addHideTimeline(animationData, outputArmatureData);
                DBDataUtil.transformAnimationData(animationData, outputArmatureData, Data3Parser.tempDragonBonesData.isGlobal);
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
			boneData.inheritRotation = Data3Parser.getBoolean(boneObject, ConstValues.A_INHERIT_ROTATION, true);
			boneData.inheritScale = Data3Parser.getBoolean(boneObject, ConstValues.A_INHERIT_SCALE, true);
			
			Data3Parser.parseTransform(boneObject[ConstValues.TRANSFORM], boneData.transform);
            if(Data3Parser.tempDragonBonesData.isGlobal)//绝对数据
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
                skinData.addSlotData(Data3Parser.parseSkinSlotData(slotObject));
            }
			
			return skinData;
		}

		private static parseSkinSlotData(slotObject:any):SlotData{
			var slotData:SlotData = new SlotData();
			slotData.name = slotObject[ConstValues.A_NAME];
			slotData.parent = slotObject[ConstValues.A_PARENT];
			slotData.zOrder = <number><any> (slotObject[ConstValues.A_Z_ORDER]);
			slotData.zOrder = Data3Parser.getNumber(slotObject,ConstValues.A_Z_ORDER,0)||0;
			slotData.blendMode = slotObject[ConstValues.A_BLENDMODE];

			var displayList:any = slotObject[ConstValues.DISPLAY];

			for(var i:number = 0, len:number = displayList.length; i < len; i++) 
			{
				var displayObject:any = displayList[i];
				slotData.addDisplayData(Data3Parser.parseDisplayData(displayObject));
			}

			return slotData;
		}

		private static parseSlotData(slotObject:any):SlotData{
			var slotData:SlotData = new SlotData();
			slotData.name = slotObject[ConstValues.A_NAME];
			slotData.parent = slotObject[ConstValues.A_PARENT];
			slotData.zOrder = <number><any> (slotObject[ConstValues.A_Z_ORDER]);
            slotData.zOrder = Data3Parser.getNumber(slotObject,ConstValues.A_Z_ORDER,0)||0;
			slotData.blendMode = slotObject[ConstValues.A_BLENDMODE];
			slotData.displayIndex = 0;
			return slotData;
		}
		
		private static parseDisplayData(displayObject:any):DisplayData{
			var displayData:DisplayData = new DisplayData();
			displayData.name = displayObject[ConstValues.A_NAME];
			displayData.type = displayObject[ConstValues.A_TYPE];
			Data3Parser.parseTransform(displayObject[ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
			
			if(Data3Parser.tempDragonBonesData!=null){
				Data3Parser.tempDragonBonesData.addDisplayData(displayData);
			}
			
			return displayData;
		}
		
		/** @private */
		private static parseAnimationData(animationObject:any, frameRate:number):AnimationData{
			var animationData:AnimationData = new AnimationData();
			animationData.name = animationObject[ConstValues.A_NAME];
			animationData.frameRate = frameRate;
			animationData.duration = Math.round((Data3Parser.getNumber(animationObject, ConstValues.A_DURATION, 1) || 1) * 1000 / frameRate);
			animationData.playTimes = Data3Parser.getNumber(animationObject, ConstValues.A_LOOP, 1);
            animationData.playTimes = animationData.playTimes != NaN ? animationData.playTimes : 1;
			animationData.fadeTime = Data3Parser.getNumber(animationObject, ConstValues.A_FADE_IN_TIME, 0) || 0;
			animationData.scale = Data3Parser.getNumber(animationObject, ConstValues.A_SCALE, 1) || 0;
			//use frame tweenEase, NaN
			//overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			animationData.tweenEasing = Data3Parser.getNumber(animationObject, ConstValues.A_TWEEN_EASING, NaN);
			animationData.autoTween = Data3Parser.getBoolean(animationObject, ConstValues.A_AUTO_TWEEN, true);

            var frameObjectList:Array<any> = animationObject[ConstValues.FRAME];
			var i:number = 0;
			var len:number = 0;
			if(frameObjectList)
			{
				for(i = 0,len = frameObjectList.length; i< len; i++)
				{
					var frameObject:any = frameObjectList[i];
					var frame:Frame = Data3Parser.parseTransformFrame(frameObject, frameRate);
					animationData.addFrame(frame);
				}
			}
            

            Data3Parser.parseTimeline(animationObject, animationData);
			
			var lastFrameDuration:number = animationData.duration;

			var displayIndexChangeSlotTimelines:Array<SlotTimeline> = [];
			var displayIndexChangeTimelines:Array<TransformTimeline> = [];
            var timelineObjectList:Array<any> = animationObject[ConstValues.TIMELINE];
            var displayIndexChange:boolean;
			if(timelineObjectList)
			{
				for(i = 0,len = timelineObjectList.length; i < len; i++) {
					var timelineObject:any = timelineObjectList[i];
					var timeline:TransformTimeline = Data3Parser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
					timeline = Data3Parser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
					lastFrameDuration = Math.min(lastFrameDuration, timeline.frameList[timeline.frameList.length - 1].duration);
					animationData.addTimeline(timeline);
					var slotTimeline:SlotTimeline = Data3Parser.parseSlotTimeline(timelineObject, animationData.duration, frameRate);
					animationData.addSlotTimeline(slotTimeline);

					if(animationData.autoTween && !displayIndexChange)
					{
						
						var slotFrame:SlotFrame;
						for(var j:number = 0, jlen:number = slotTimeline.frameList.length; j < jlen; j++)
						{
							slotFrame = <SlotFrame>slotTimeline.frameList[j];
							if(slotFrame && slotFrame.displayIndex < 0)
							{
								displayIndexChange = true;
								break;
							}
						}
					}
				}
				
				/**
			 	 * 如果有slot的displayIndex为空的情况，那么当autoTween为ture时，它对应的bone的补间应该去掉
			 	 * 以下就是处理这种情况，把autoTween的全局的tween应用到每一帧上，然后把autoTween变为false
			 	 * 此时autoTween就不起任何作用了
			 	 */
				var animationTween:number = animationData.tweenEasing;
				if(displayIndexChange)
				{
					len = animationData.slotTimelineList.length;
					for ( i = 0; i < len; i++)
					{
						slotTimeline = animationData.slotTimelineList[i];
						timeline = animationData.timelineList[i];
						var curFrame:TransformFrame;
						var curSlotFrame:SlotFrame;
						var nextSlotFrame:SlotFrame;
						for (j = 0, jlen = slotTimeline.frameList.length; j < jlen; j++)
						{
							curSlotFrame = <SlotFrame>slotTimeline.frameList[j];
							curFrame = <TransformFrame>timeline.frameList[j];
							nextSlotFrame = (j == jlen - 1) ? <SlotFrame>slotTimeline.frameList[0] : <SlotFrame>slotTimeline.frameList[j + 1];
							if (curSlotFrame.displayIndex < 0 || nextSlotFrame.displayIndex < 0)
							{
								curFrame.tweenEasing = curSlotFrame.tweenEasing = NaN;
							}
							else if (animationTween == 10)
							{
								curFrame.tweenEasing = curSlotFrame.tweenEasing = 0;
							}
							else if (!isNaN(animationTween))
							{
								curFrame.tweenEasing = curSlotFrame.tweenEasing = animationTween;
							}
							else if(curFrame.tweenEasing == 10)
							{
								curFrame.tweenEasing = 0;
							}
						}
					}
					animationData.autoTween = false;
				}
			}

			
			if(animationData.frameList.length > 0){
				lastFrameDuration = Math.min(lastFrameDuration, animationData.frameList[animationData.frameList.length - 1].duration);
			}
			//取得timeline中最小的lastFrameDuration并保存
			animationData.lastFrameDuration = lastFrameDuration;
			return animationData;
		}

		private static parseSlotTimeline(timelineObject:any, duration:number, frameRate:number):SlotTimeline{
			var outputTimeline:SlotTimeline = new SlotTimeline();
			outputTimeline.name = timelineObject[ConstValues.A_NAME];
			outputTimeline.scale = Data3Parser.getNumber(timelineObject, ConstValues.A_SCALE, 1) || 0;
			outputTimeline.offset = Data3Parser.getNumber(timelineObject, ConstValues.A_OFFSET, 0) || 0;
			outputTimeline.duration = duration;

			var frameList:any = timelineObject[ConstValues.FRAME];
			for(var i:number = 0, len:number = frameList.length; i < len; i++) 
			{
				var frameObject:any = frameList[i];
				var frame:SlotFrame = Data3Parser.parseSlotFrame(frameObject, frameRate);
				outputTimeline.addFrame(frame);
			}

			Data3Parser.parseTimeline(timelineObject, outputTimeline);

			return outputTimeline;
		}

		private static parseSlotFrame(frameObject:any, frameRate:number):SlotFrame{
			var outputFrame:SlotFrame = new SlotFrame();
			Data3Parser.parseFrame(frameObject, outputFrame, frameRate);

			outputFrame.visible = !Data3Parser.getBoolean(frameObject, ConstValues.A_HIDE, false);

			//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			outputFrame.tweenEasing = Data3Parser.getNumber(frameObject, ConstValues.A_TWEEN_EASING, 10);
			outputFrame.displayIndex = Math.floor(Data3Parser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0);

			//如果为NaN，则说明没有改变过zOrder
			outputFrame.zOrder = Data3Parser.getNumber(frameObject, ConstValues.A_Z_ORDER, Data3Parser.tempDragonBonesData.isGlobal ? NaN : 0);

			var colorTransformObject:any = frameObject[ConstValues.COLOR_TRANSFORM];
			if(colorTransformObject){
				outputFrame.color = new ColorTransform();
				Data3Parser.parseColorTransform(colorTransformObject, outputFrame.color);
			}

			return outputFrame;
		}

		private static parseTransformTimeline(timelineObject:any, duration:number, frameRate:number):TransformTimeline{
			var outputTimeline:TransformTimeline = new TransformTimeline();
			outputTimeline.name = timelineObject[ConstValues.A_NAME];
			outputTimeline.scale = Data3Parser.getNumber(timelineObject, ConstValues.A_SCALE, 1) || 0;
			outputTimeline.offset = Data3Parser.getNumber(timelineObject, ConstValues.A_OFFSET, 0) || 0;
            outputTimeline.originPivot.x = Data3Parser.getNumber(timelineObject, ConstValues.A_PIVOT_X, 0) || 0;
            outputTimeline.originPivot.y = Data3Parser.getNumber(timelineObject, ConstValues.A_PIVOT_Y, 0) || 0;
			outputTimeline.duration = duration;

            var frameList:any = timelineObject[ConstValues.FRAME];
            for(var i:number = 0, len:number = frameList.length; i < len; i++) 
            {
                var frameObject:any = frameList[i];
                var frame:TransformFrame = Data3Parser.parseTransformFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }

            Data3Parser.parseTimeline(timelineObject, outputTimeline);
			
			return outputTimeline;
		}
		
		private static parseTransformFrame(frameObject:any, frameRate:number):TransformFrame{
			var outputFrame:TransformFrame = new TransformFrame();
            Data3Parser.parseFrame(frameObject, outputFrame, frameRate);
			
			outputFrame.visible = !Data3Parser.getBoolean(frameObject, ConstValues.A_HIDE, false);
			
			//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			outputFrame.tweenEasing = Data3Parser.getNumber(frameObject, ConstValues.A_TWEEN_EASING, 10);
			outputFrame.tweenRotate = Math.floor(Data3Parser.getNumber(frameObject, ConstValues.A_TWEEN_ROTATE, 0) || 0);
			outputFrame.tweenScale = Data3Parser.getBoolean(frameObject, ConstValues.A_TWEEN_SCALE, true);
			//outputFrame.displayIndex = Math.floor(Data3Parser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0);

			Data3Parser.parseTransform(frameObject[ConstValues.TRANSFORM], outputFrame.transform, outputFrame.pivot);
            if(Data3Parser.tempDragonBonesData.isGlobal)//绝对数据
            {
                outputFrame.global.copy(outputFrame.transform);
            }
			
			outputFrame.scaleOffset.x = Data3Parser.getNumber(frameObject, ConstValues.A_SCALE_X_OFFSET, 0)||0;
			outputFrame.scaleOffset.y = Data3Parser.getNumber(frameObject, ConstValues.A_SCALE_Y_OFFSET, 0)||0;
			
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
		}
		
		private static parseTransform(transformObject:any, transform:DBTransform, pivot:Point = null):void{
			if(transformObject){
				if(transform){
					transform.x = Data3Parser.getNumber(transformObject, ConstValues.A_X, 0) || 0;
					transform.y = Data3Parser.getNumber(transformObject, ConstValues.A_Y, 0) || 0;
					transform.skewX = Data3Parser.getNumber (transformObject, ConstValues.A_SKEW_X, 0) * ConstValues.ANGLE_TO_RADIAN || 0;
					transform.skewY =Data3Parser.getNumber(transformObject, ConstValues.A_SKEW_Y, 0) * ConstValues.ANGLE_TO_RADIAN || 0;
					transform.scaleX = Data3Parser.getNumber(transformObject, ConstValues.A_SCALE_X, 1) || 0;
					transform.scaleY = Data3Parser.getNumber(transformObject, ConstValues.A_SCALE_Y, 1) || 0;
				}
				if(pivot){
					pivot.x = Data3Parser.getNumber(transformObject, ConstValues.A_PIVOT_X, 0) || 0;
					pivot.y = Data3Parser.getNumber(transformObject, ConstValues.A_PIVOT_Y, 0) || 0;
				}
			}
		}
		
		private static parseColorTransform(colorTransformObject:any, colorTransform:ColorTransform):void{
			if(colorTransformObject){
				if(colorTransform){
					colorTransform.alphaOffset =Data3Parser.getNumber(colorTransformObject, ConstValues.A_ALPHA_OFFSET, 0);
					colorTransform.redOffset = Data3Parser.getNumber(colorTransformObject, ConstValues.A_RED_OFFSET, 0);
					colorTransform.greenOffset = Data3Parser.getNumber(colorTransformObject, ConstValues.A_GREEN_OFFSET, 0);
					colorTransform.blueOffset = Data3Parser.getNumber(colorTransformObject, ConstValues.A_BLUE_OFFSET, 0);
					
					colorTransform.alphaMultiplier = Data3Parser.getNumber(colorTransformObject, ConstValues.A_ALPHA_MULTIPLIER, 100) * 0.01;
					colorTransform.redMultiplier = Data3Parser.getNumber(colorTransformObject, ConstValues.A_RED_MULTIPLIER, 100) * 0.01;
					colorTransform.greenMultiplier =Data3Parser.getNumber(colorTransformObject, ConstValues.A_GREEN_MULTIPLIER, 100) * 0.01;
					colorTransform.blueMultiplier = Data3Parser.getNumber(colorTransformObject, ConstValues.A_BLUE_MULTIPLIER, 100) * 0.01;
				}
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