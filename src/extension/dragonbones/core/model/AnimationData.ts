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

	/**
	 * @class dragonbones.AnimationData
	 * @extends dragonbones.Timeline
	 * @classdesc
	 * 保存动画数据
	 */
	export class AnimationData extends Timeline{
		/**
		 * 动画的名字
		 * @member {string} dragonBones.AnimationData#name
		 */
		public name:string;
		/**
		 * 动画的帧率，表示每一秒钟播放多少帧
		 * @member {number} dragonBones.AnimationData#frameRate
		 */
		public frameRate:number = 0;
		/**
		 * 动画过渡时间，表示从其他动画过渡到这个动画需要的时间
		 * @member {number} dragonBones.AnimationData#fadeTime
		 */
		public fadeTime:number;
		/**
		 * 	播放次数 0为一直播放，默认为0
		 * @member {number} dragonBones.AnimationData#playTimes
		 */
		public playTimes:number = 0;
		/**
		 * 动画的缓动参数，取值范围是[-1,2],其中[-1, 0)表示缓进，(0, 1]表示缓出(1, 2]表示缓进缓出，0表示不缓动，线性渐变
		 * 这个参数会被帧数据中的tweenEasing覆盖
		 * @member {number} dragonBones.AnimationData#tweenEasing
		 */
		public tweenEasing:number;
		/**
		 * 是否开启缓动，默认是true，就是开启缓动
		 * @member {boolean} dragonBones.AnimationData#autoTween
		 */
		public autoTween:boolean;
		/**
		 * 最后一帧持续的帧数
		 * @member {number} dragonBones.AnimationData#lastFrameDuration
		 */
		public lastFrameDuration:number = 0;
		
		public hideTimelineNameMap:Array<string>;
		
		private _timelineList:Array<TransformTimeline>;
		/**
		 * 时间轴列表
		 * @returns {Array<TransformTimeline>}
		 */
		public get timelineList():Array<TransformTimeline>{
			return this._timelineList;
		}

		/**
		 * 创建一个AnimationData实例
		 */
		public constructor(){
			super();
			this.fadeTime = 0;
			this.playTimes = 0;
			this.autoTween = true;
			this.tweenEasing = NaN;
			this.hideTimelineNameMap = [];
			
			this._timelineList = [];
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
			super.dispose();
			this.hideTimelineNameMap = null;

            for(var key in this._timelineList)
            {
                var timeline:TransformTimeline = this._timelineList[key];
                timeline.dispose();
            }

			this._timelineList = null;
		}

		/**
		 * 根据时间轴的名字获取时间轴数据
		 * @param timelineName 时间轴的名字
		 * @returns {*} 时间轴数据
		 */
		public getTimeline(timelineName:string):TransformTimeline{
			var i:number = this._timelineList.length;
			while(i --){
				if(this._timelineList[i].name == timelineName){
					return this._timelineList[i];
				}
			}
			return null;
		}

		/**
		 * 添加一个时间轴数据
		 * @param timeline 需要被添加的时间轴数据
		 */
		public addTimeline(timeline:TransformTimeline):void{
			if(!timeline){
				throw new Error();
			}
			
			if(this._timelineList.indexOf(timeline) < 0){
				this._timelineList[this._timelineList.length] = timeline;
			}
		}
	}
}