
module egret.gui {

	export class Timeline{
		private static startTime:number = -1;
		private static _currentTime:number = -1;
		
		public constructor(){
		}
		
		public static pulse():number{
			if (Timeline.startTime < 0){
				Timeline.startTime = egret.getTimer();
				Timeline._currentTime = 0;
				return Timeline._currentTime;
			}
			Timeline._currentTime = egret.getTimer() - Timeline.startTime;
			return Timeline._currentTime;
		}
		
		public static get currentTime():number{
			if (Timeline._currentTime < 0){
				var retVal:number = Timeline.pulse();
				return Timeline.pulse();
			}
			return Timeline._currentTime;
		}
		
	}
}