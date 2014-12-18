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