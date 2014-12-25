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

	export class AnimationData extends Timeline{
		public name:string;
		public frameRate:number = 0;
		public fadeTime:number;
		public playTimes:number = 0;
		//use frame tweenEase, NaN
		//overwrite frame tweenEase, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
		public tweenEasing:number;
		public autoTween:boolean;
		public lastFrameDuration:number = 0;
		
		public hideTimelineNameMap:Array<string>;
		
		private _timelineList:Array<TransformTimeline>;
		public get timelineList():Array<TransformTimeline>{
			return this._timelineList;
		}
		
		public constructor(){
			super();
			this.fadeTime = 0;
			this.playTimes = 0;
			this.autoTween = true;
			this.tweenEasing = NaN;
			this.hideTimelineNameMap = [];
			
			this._timelineList = [];
		}
		
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
		
		public getTimeline(timelineName:string):TransformTimeline{
			var i:number = this._timelineList.length;
			while(i --){
				if(this._timelineList[i].name == timelineName){
					return this._timelineList[i];
				}
			}
			return null;
		}
		
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