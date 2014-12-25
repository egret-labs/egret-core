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

	export class DBDataUtil{
		public static transformArmatureData(armatureData:ArmatureData):void{
			var boneDataList:Array<BoneData> = armatureData.boneDataList;
			var i:number = boneDataList.length;
			
			while(i --){
				var boneData:BoneData = boneDataList[i];
				if(boneData.parent){
					var parentBoneData:BoneData = armatureData.getBoneData(boneData.parent);
					if(parentBoneData){
						boneData.transform.copy(boneData.global);
						TransformUtil.transformPointWithParent(boneData.transform, parentBoneData.global);
					}
				}
			}
		}
		
		public static transformArmatureDataAnimations(armatureData:ArmatureData):void{
			var animationDataList:Array<AnimationData> = armatureData.animationDataList;
			var i:number = animationDataList.length;
			while(i --){
				DBDataUtil.transformAnimationData(animationDataList[i], armatureData);
			}
		}
		
		public static transformAnimationData(animationData:AnimationData, armatureData:ArmatureData):void{
			var skinData:SkinData = armatureData.getSkinData(null);
			var boneDataList:Array<BoneData> = armatureData.boneDataList;
			var slotDataList:Array<SlotData>;
			if(skinData){
				slotDataList = skinData.slotDataList;
			}
			
			for(var i:number = 0;i < boneDataList.length;i ++){
				var boneData:BoneData = boneDataList[i];
				var timeline:TransformTimeline = animationData.getTimeline(boneData.name);
				if(!timeline){
					continue;
				}
				
				var slotData:SlotData = null;
				if(slotDataList){
                    for(var key in slotDataList)
                    {
                        slotData = slotDataList[key];
                        //找到属于当前Bone的slot(FLash Pro制作的动画一个Bone只包含一个slot)
                        if(slotData.parent == boneData.name){
                            break;
                        }
                    }
				}
				
				var frameList:Array<Frame> = timeline.frameList;
				
				var originTransform:DBTransform = null;
				var originPivot:Point = null;
				var prevFrame:TransformFrame = null;
				var frameListLength:number = frameList.length;
				for(var j:number = 0;j < frameListLength;j ++){
					var frame:TransformFrame = <TransformFrame><any> (frameList[j]);
					//计算frame的transoform信息
					DBDataUtil.setFrameTransform(animationData, armatureData, boneData, frame);
					
					frame.transform.x -= boneData.transform.x;
					frame.transform.y -= boneData.transform.y;
					frame.transform.skewX -= boneData.transform.skewX;
					frame.transform.skewY -= boneData.transform.skewY;
					frame.transform.scaleX -= boneData.transform.scaleX;
					frame.transform.scaleY -= boneData.transform.scaleY;
					
					if(!timeline.transformed){
						if(slotData){
							frame.zOrder -= slotData.zOrder;
						}
					}
					
					//如果originTransform不存在说明当前帧是第一帧，将当前帧的transform保存至timeline的originTransform
					if(!originTransform){
						originTransform = timeline.originTransform;
						originTransform.copy(frame.transform);
						originTransform.skewX = TransformUtil.formatRadian(originTransform.skewX);
						originTransform.skewY = TransformUtil.formatRadian(originTransform.skewY);
						originPivot = timeline.originPivot;
						originPivot.x = frame.pivot.x;
						originPivot.y = frame.pivot.y;
					}
					
					frame.transform.x -= originTransform.x;
					frame.transform.y -= originTransform.y;
					frame.transform.skewX = TransformUtil.formatRadian(frame.transform.skewX - originTransform.skewX);
					frame.transform.skewY = TransformUtil.formatRadian(frame.transform.skewY - originTransform.skewY);
					frame.transform.scaleX -= originTransform.scaleX;
					frame.transform.scaleY -= originTransform.scaleY;
					
		//以下还不理解 回头问问春雷
					if(!timeline.transformed){
						frame.pivot.x -= originPivot.x;
						frame.pivot.y -= originPivot.y;
					}
					
					if(prevFrame){
						var dLX:number = frame.transform.skewX - prevFrame.transform.skewX;
						
						if(prevFrame.tweenRotate){
							
							if(prevFrame.tweenRotate > 0){
								if(dLX < 0){
									frame.transform.skewX += Math.PI * 2;
									frame.transform.skewY += Math.PI * 2;
								}
								
								if(prevFrame.tweenRotate > 1){
									frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate - 1);
									frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate - 1);
								}
							}
							else{
								if(dLX > 0){
									frame.transform.skewX -= Math.PI * 2;
									frame.transform.skewY -= Math.PI * 2;
								}
								
								if(prevFrame.tweenRotate < 1){
									frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate + 1);
									frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate + 1);
								}
							}
						}
						else{
							frame.transform.skewX = prevFrame.transform.skewX + TransformUtil.formatRadian(frame.transform.skewX - prevFrame.transform.skewX);
							frame.transform.skewY = prevFrame.transform.skewY + TransformUtil.formatRadian(frame.transform.skewY - prevFrame.transform.skewY);
						}
					}
					prevFrame = frame;
				}
				timeline.transformed = true;
			}
		}
		
		//计算frame的transoform信息
		private static setFrameTransform(animationData:AnimationData, armatureData:ArmatureData, boneData:BoneData, frame:TransformFrame):void{
			frame.transform.copy(frame.global);
			//找到当前bone的父亲列表 并将timeline信息存入parentTimelineList 将boneData信息存入parentDataList
			var parentData:BoneData = armatureData.getBoneData(boneData.parent);
			if(parentData){
				var parentTimeline:TransformTimeline = animationData.getTimeline(parentData.name);
				if(parentTimeline){
					/*
					var currentTransform:DBTransform = new DBTransform();
					getTimelineTransform(parentTimeline, frame.position, currentTransform, true);
					TransformUtil.transformPointWithParent(frame.transform, currentTransform);
					*/
					
					var parentTimelineList:Array<TransformTimeline> = [];
					var parentDataList:Array<BoneData> = [];
					while(parentTimeline){
						parentTimelineList.push(parentTimeline);
						parentDataList.push(parentData);
						parentData = armatureData.getBoneData(parentData.parent);
						if(parentData){
							parentTimeline = animationData.getTimeline(parentData.name);
						}
						else{
							parentTimeline = null;
						}
					}
					
					var i:number = parentTimelineList.length;
					
					var helpMatrix:Matrix = new Matrix();
					var globalTransform:DBTransform;
					var currentTransform:DBTransform = new DBTransform();
					//从根开始遍历
					while(i --){
						parentTimeline = parentTimelineList[i];
						parentData = parentDataList[i];
						//一级一级找到当前帧对应的每个父节点的transform(相对transform)
						DBDataUtil.getTimelineTransform(parentTimeline, frame.position, currentTransform, !globalTransform);
						
						if(globalTransform){
							//if(inheritRotation)
							//{
								globalTransform.skewX += currentTransform.skewX + parentTimeline.originTransform.skewX + parentData.transform.skewX;
								globalTransform.skewY += currentTransform.skewY + parentTimeline.originTransform.skewY + parentData.transform.skewY;
							//}
							
							//if(inheritScale)
							//{
							//	globalTransform.scaleX *= currentTransform.scaleX + parentTimeline.originTransform.scaleX;
							//	globalTransform.scaleY *= currentTransform.scaleY + parentTimeline.originTransform.scaleY;
							//}
							//else
							//{
								globalTransform.scaleX = currentTransform.scaleX + parentTimeline.originTransform.scaleX + parentData.transform.scaleX;
								globalTransform.scaleY = currentTransform.scaleY + parentTimeline.originTransform.scaleY + parentData.transform.scaleY;
							//}
								
							var x:number = currentTransform.x + parentTimeline.originTransform.x + parentData.transform.x;
							var y:number = currentTransform.y + parentTimeline.originTransform.y + parentData.transform.y;
							
							globalTransform.x = helpMatrix.a * x + helpMatrix.c * y + helpMatrix.tx;
							globalTransform.y = helpMatrix.d * y + helpMatrix.b * x + helpMatrix.ty;
						}
						else{
							globalTransform = new DBTransform();
							globalTransform.copy(currentTransform);
						}
						
						TransformUtil.transformToMatrix(globalTransform, helpMatrix, true);
					}
					TransformUtil.transformPointWithParent(frame.transform, globalTransform);
					
				}
			}
		}
		
		private static getTimelineTransform(timeline:TransformTimeline, position:number, retult:DBTransform, isGlobal:boolean):void{
			var frameList:Array<Frame> = timeline.frameList;
			var i:number = frameList.length;
			
			while(i --){
				var currentFrame:TransformFrame = <TransformFrame><any> (frameList[i]);
				//找到穿越当前帧的关键帧
				if(currentFrame.position <= position && currentFrame.position + currentFrame.duration > position){
					//是最后一帧或者就是当前帧
					if(i == frameList.length - 1 || position == currentFrame.position){
						retult.copy(isGlobal?currentFrame.global:currentFrame.transform);
					}
					else{
						var tweenEasing:number = currentFrame.tweenEasing;
						var progress:number = (position - currentFrame.position) / currentFrame.duration;
						if(tweenEasing && tweenEasing != 10){
							progress = MathUtil.getEaseValue(progress, tweenEasing);
						}
						var nextFrame:TransformFrame = <TransformFrame><any>frameList[i + 1];
						
						var currentTransform:DBTransform = isGlobal?currentFrame.global:currentFrame.transform;
						var nextTransform:DBTransform = isGlobal?nextFrame.global:nextFrame.transform;
						
						retult.x = currentTransform.x + (nextTransform.x - currentTransform.x) * progress;
						retult.y = currentTransform.y + (nextTransform.y - currentTransform.y) * progress;
						retult.skewX = TransformUtil.formatRadian(currentTransform.skewX + (nextTransform.skewX - currentTransform.skewX) * progress);
						retult.skewY = TransformUtil.formatRadian(currentTransform.skewY + (nextTransform.skewY - currentTransform.skewY) * progress);
						retult.scaleX = currentTransform.scaleX + (nextTransform.scaleX - currentTransform.scaleX) * progress;
						retult.scaleY = currentTransform.scaleY + (nextTransform.scaleY - currentTransform.scaleY) * progress;
					}
					break;
				}
			}
		}
		
		public static addHideTimeline(animationData:AnimationData, armatureData:ArmatureData):void{
			var boneDataList:Array<BoneData> =armatureData.boneDataList;
			var i:number = boneDataList.length;
			
			while(i --){
				var boneData:BoneData = boneDataList[i];
				var boneName:string = boneData.name;
				if(!animationData.getTimeline(boneName)){
					if(animationData.hideTimelineNameMap.indexOf(boneName) < 0){
						animationData.hideTimelineNameMap.push(boneName);
					}
				}
			}
		}
	}
}