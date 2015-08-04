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
	 * @class dragonBones.AnimationEvent
	 * @extends dragonBones.Event
	 * @classdesc
	 * 动画事件
	 * 
	 * @example
       <pre>
	    private exampleEvent():void
	    {
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
	        armatureDisplay.x = 200;
	        armatureDisplay.y = 400;
	        //把它添加到舞台上
	        this.addChild(armatureDisplay);

	        //监听事件时间轴上的事件
	        armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
	        //监听骨骼时间轴上的事件
	        armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
	        //监听动画完成事件
	        armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
	        //监听动画开始事件
	        armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
	        //监听循环动画，播放完一遍的事件
	        armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
	        //监听声音事件
	        var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
	        soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

	        //取得这个Armature动画列表中的第一个动画的名字
	        var curAnimationName = armature.animation.animationList[0];
	        //播放一遍动画
	        armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

	        //把Armature添加到心跳时钟里
	        dragonBones.WorldClock.clock.add(armature);
	        //心跳时钟开启
	        egret.Ticker.getInstance().register(function (advancedTime) {
	            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
	        }, this);
	    }
	    private onFrameEvent(evt: dragonBones.FrameEvent):void
	    {
	        //打印出事件的类型，和事件的帧标签
	        console.log(evt.type, evt.frameLabel);
	    }

	    private onAnimationEvent(evt: dragonBones.AnimationEvent):void
	    {
	        switch(evt.type)
	        {
	            case dragonBones.AnimationEvent.START:
	                 break;
	            case dragonBones.AnimationEvent.LOOP_COMPLETE:
	                 break;
	            case dragonBones.AnimationEvent.COMPLETE:
	                 //动画完成后销毁这个armature
	                 this.removeChild(evt.armature.display);
	                 dragonBones.WorldClock.clock.remove(evt.armature);
	                 evt.armature.dispose();
	                 break;
	        }
	    }

	    private onSoundEvent(evt: dragonBones.SoundEvent):void
	    {
	        //播放声音
	        var flySound:egret.Sound = RES.getRes(evt.sound);
	        console.log("soundEvent",evt.sound);
	    }

	   </pre>
	 */
	export class AnimationEvent extends Event{
		/**
		 * 不推荐使用.
		 */
		public static get MOVEMENT_CHANGE():string{
			return AnimationEvent.FADE_IN;
		}
		
		/**
		 * 当动画缓入的时候派发
		 */
		public static FADE_IN:string = "fadeIn";
		
		/**
		 * 当动画缓出的时候派发
		 */
		public static FADE_OUT:string = "fadeOut";
		
		/**
		 * 当动画开始播放时派发
		 */
		public static START:string = "start";
		
		/**
		 * 当动画停止时派发
		 */
		public static COMPLETE:string = "complete";
		
		/**
		 * 当动画播放完一轮后派发
		 */
		public static LOOP_COMPLETE:string = "loopComplete";
		
		/**
		 * 当动画缓入完成时派发
		 */
		public static FADE_IN_COMPLETE:string = "fadeInComplete";
		
		/**
		 * 当动画缓出结束后派发
		 */
		public static FADE_OUT_COMPLETE:string = "fadeOutComplete";
		
		/**
		 * 不推荐的API.
		 * @member {string} dragonBones.AnimationEvent#movementID
		 */
		public get movementID():string{
			return this.animationName;
		}
		
		/**
		 * animationState 的实例.
		 * @member {dragonBones.AnimationState} dragonBones.AnimationEvent#animationState
		 */
		public animationState:any;
		
		/**
		 * 配发出事件的骨架
		 * @member {dragonBones.Armature} dragonBones.AnimationEvent#armature
		 */
		public get armature():Armature{
			return <Armature><any> (this.target);
		}

		/**
		 * 获取动画的名字
		 * @returns {string}
		 * @member {string} dragonBones.AnimationEvent#animationName
		 */
		public get animationName():string{
			return this.animationState.name;
		}
		
		/**
		 * 创建一个新的 AnimationEvent 的实例
		 * @param type 事件的类型
		 * @param cancelable
		 */
		public constructor(type:string, cancelable:boolean = false){
			super(type);
		}
	}
}