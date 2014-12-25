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

	export class DataParser{
		private static tempDragonBonesData:DragonBonesData;
		
		public static parseTextureAtlasData(rawData:any, scale:number = 1):any{
			var textureAtlasData:any = {};
			textureAtlasData.__name = rawData[ConstValues.A_NAME];
			var subTextureFrame:Rectangle;

            var subTextureList:any = rawData[ConstValues.SUB_TEXTURE];
            for(var key in subTextureList) {
                var subTextureObject:any = subTextureList[key];
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
		
		public static parseDragonBonesData(rawDataToParse:any):DragonBonesData{
			if(!rawDataToParse){
				throw new Error();
			}
			
			var version:string = rawDataToParse[ConstValues.A_VERSION];
            if(version.toString() != DragonBones.DATA_VERSION)
            {
                throw new Error("Nonsupport version!");
            }
			
			var frameRate:number = DataParser.getNumber(rawDataToParse, ConstValues.A_FRAME_RATE, 0) || 0;
			
			var outputDragonBonesData:DragonBonesData =  new DragonBonesData();
			outputDragonBonesData.name = rawDataToParse[ConstValues.A_NAME];
            DataParser.tempDragonBonesData = outputDragonBonesData;

            var armatureList:any = rawDataToParse[ConstValues.ARMATURE];
            for(var key in armatureList)
            {
                var armatureObject:any = rawDataToParse[ConstValues.ARMATURE][key];
                outputDragonBonesData.addArmatureData(DataParser.parseArmatureData(armatureObject, frameRate));
            }

            DataParser.tempDragonBonesData = null;
			
			return outputDragonBonesData;
		}
		
		private static parseArmatureData(armatureDataToParse:any, frameRate:number = 0):ArmatureData{
			var outputArmatureData:ArmatureData = new ArmatureData();
			outputArmatureData.name = armatureDataToParse[ConstValues.A_NAME];

            var boneList:any = armatureDataToParse[ConstValues.BONE];
            for(var key in boneList) {
                var boneObject:any = boneList[key];
                outputArmatureData.addBoneData(DataParser.parseBoneData(boneObject));
            }

            var skinList:any = armatureDataToParse[ConstValues.SKIN];
            for(var key in skinList)
            {
                var skinObject:any = skinList[key];
                outputArmatureData.addSkinData(DataParser.parseSkinData(skinObject));
            }
			
			DBDataUtil.transformArmatureData(outputArmatureData);
			outputArmatureData.sortBoneDataList();

            var animationList:any = armatureDataToParse[ConstValues.ANIMATION];
            for(var key in animationList)
            {
                var animationObject:any = animationList[key];
                var animationData:AnimationData = DataParser.parseAnimationData(animationObject, frameRate);
                DBDataUtil.addHideTimeline(animationData, outputArmatureData);
                DBDataUtil.transformAnimationData(animationData, outputArmatureData);
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
			boneData.inheritScale = DataParser.getBoolean(boneObject, ConstValues.A_INHERIT_SCALE, false);
			
			DataParser.parseTransform(boneObject[ConstValues.TRANSFORM], boneData.global);
			boneData.transform.copy(boneData.global);
			
			return boneData;
		}
		
		private static parseSkinData(skinObject:any):SkinData{
			var skinData:SkinData = new SkinData();
			skinData.name = skinObject[ConstValues.A_NAME];

            var slotList:any = skinObject[ConstValues.SLOT];
            for(var key in slotList)
            {
                var slotObject:any = slotList[key];
                skinData.addSlotData(DataParser.parseSlotData(slotObject));
            }
			
			return skinData;
		}
		
		private static parseSlotData(slotObject:any):SlotData{
			var slotData:SlotData = new SlotData();
			slotData.name = slotObject[ConstValues.A_NAME];
			slotData.parent = slotObject[ConstValues.A_PARENT];
			slotData.zOrder = <number><any> (slotObject[ConstValues.A_Z_ORDER]);
			slotData.blendMode = slotObject[ConstValues.A_BLENDMODE];

            var displayList:any = slotObject[ConstValues.DISPLAY];

            for(var key in displayList) {
                var displayObject:any = displayList[key];
                slotData.addDisplayData(DataParser.parseDisplayData(displayObject));
            }
			
			return slotData;
		}
		
		private static parseDisplayData(displayObject:any):DisplayData{
			var displayData:DisplayData = new DisplayData();
			displayData.name = displayObject[ConstValues.A_NAME];
			displayData.type = displayObject[ConstValues.A_TYPE];
			DataParser.parseTransform(displayObject[ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
			
			if(DataParser.tempDragonBonesData!=null){
				DataParser.tempDragonBonesData.addDisplayData(displayData);
			}
			
			return displayData;
		}
		
		/** @private */
		private static parseAnimationData(animationObject:any, frameRate:number = 0):AnimationData{
			var animationData:AnimationData = new AnimationData();
			animationData.name = animationObject[ConstValues.A_NAME];
			animationData.frameRate = frameRate;
			animationData.duration = Math.round((DataParser.getNumber(animationObject, ConstValues.A_DURATION, 1) || 1) * 1000 / frameRate);
			animationData.playTimes = DataParser.getNumber(animationObject, ConstValues.A_LOOP, 0) || 0;
			animationData.fadeTime = DataParser.getNumber(animationObject, ConstValues.A_FADE_IN_TIME, 0) || 0;
			animationData.scale = DataParser.getNumber(animationObject, ConstValues.A_SCALE, 1) || 0;
			//use frame tweenEase, NaN
			//overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			animationData.tweenEasing = DataParser.getNumber(animationObject, ConstValues.A_TWEEN_EASING, NaN);
			animationData.autoTween = DataParser.getBoolean(animationObject, ConstValues.A_AUTO_TWEEN, true);

            var frameObjectList:Array<any> = animationObject[ConstValues.FRAME];
            for(var index in frameObjectList)
            {
                var frameObject:any = frameObjectList[index];
                var frame:Frame = DataParser.parseTransformFrame(frameObject, frameRate);
                animationData.addFrame(frame);
            }

            DataParser.parseTimeline(animationObject, animationData);
			
			var lastFrameDuration:number = animationData.duration;

            var timelineObjectList:Array<any> = animationObject[ConstValues.TIMELINE];
            for(var index in timelineObjectList) {
                var timelineObject:any = timelineObjectList[index];
                var timeline:TransformTimeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                timeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                lastFrameDuration = Math.min(lastFrameDuration, timeline.frameList[timeline.frameList.length - 1].duration);
                animationData.addTimeline(timeline);
            }
			
			if(animationData.frameList.length > 0){
				lastFrameDuration = Math.min(lastFrameDuration, animationData.frameList[animationData.frameList.length - 1].duration);
			}
			//取得timeline中最小的lastFrameDuration并保存
			animationData.lastFrameDuration = lastFrameDuration;
			
			return animationData;
		}
		
		private static parseTransformTimeline(timelineObject:any, duration:number, frameRate:number = 0):TransformTimeline{
			var outputTimeline:TransformTimeline = new TransformTimeline();
			outputTimeline.name = timelineObject[ConstValues.A_NAME];
			outputTimeline.scale = DataParser.getNumber(timelineObject, ConstValues.A_SCALE, 1) || 0;
			outputTimeline.offset = DataParser.getNumber(timelineObject, ConstValues.A_OFFSET, 0) || 0;
			outputTimeline.duration = duration;

            var frameList:any = timelineObject[ConstValues.FRAME];
            for(var key in frameList)
            {
                var frameObject:any = frameList[key];
                var frame:TransformFrame = DataParser.parseTransformFrame(frameObject, frameRate);
                outputTimeline.addFrame(frame);
            }

            DataParser.parseTimeline(timelineObject, outputTimeline);
			
			return outputTimeline;
		}
		
		private static parseTransformFrame(frameObject:any, frameRate:number = 0):TransformFrame{
			var outputFrame:TransformFrame = new TransformFrame();
            DataParser.parseFrame(frameObject, outputFrame, frameRate);
			
			outputFrame.visible = !DataParser.getBoolean(frameObject, ConstValues.A_HIDE, false);
			
			//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
			outputFrame.tweenEasing = DataParser.getNumber(frameObject, ConstValues.A_TWEEN_EASING, 10);
			outputFrame.tweenRotate = DataParser.getNumber(frameObject, ConstValues.A_TWEEN_ROTATE, 0);
			outputFrame.tweenScale = DataParser.getBoolean(frameObject, ConstValues.A_TWEEN_SCALE, true);
			outputFrame.displayIndex = DataParser.getNumber(frameObject, ConstValues.A_DISPLAY_INDEX, 0)|| 0;
			
			//如果为NaN，则说明没有改变过zOrder
			outputFrame.zOrder = DataParser.getNumber(frameObject, ConstValues.A_Z_ORDER, NaN);
			
			DataParser.parseTransform(frameObject[ConstValues.TRANSFORM], outputFrame.global, outputFrame.pivot);
			outputFrame.transform.copy(outputFrame.global);
			
			outputFrame.scaleOffset.x = DataParser.getNumber(frameObject, ConstValues.A_SCALE_X_OFFSET, 0);
			outputFrame.scaleOffset.y = DataParser.getNumber(frameObject, ConstValues.A_SCALE_Y_OFFSET, 0);
			
			var colorTransformObject:any = frameObject[ConstValues.COLOR_TRANSFORM];
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
            for(var key in frameList)
            {
                frame = frameList[key];
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
			if(colorTransformObject){
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
		}
		
		private static getBoolean(data:any, key:string, defaultValue:boolean):boolean{
			if(key in data){
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
			if(key in data){
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