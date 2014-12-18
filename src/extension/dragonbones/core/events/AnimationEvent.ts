module dragonBones {

	export class AnimationEvent extends Event{
		/**
		 * 不推荐使用.
		 */
		public static get MOVEMENT_CHANGE():string{
			return AnimationEvent.FADE_IN;
		}
		
		/**
		 * Dispatched when the playback of an animation fade in.
		 */
		public static FADE_IN:string = "fadeIn";
		
		/**
		 * Dispatched when the playback of an animation fade out.
		 */
		public static FADE_OUT:string = "fadeOut";
		
		/**
		 * Dispatched when the playback of an animation starts.
		 */
		public static START:string = "start";
		
		/**
		 * Dispatched when the playback of a animation stops.
		 */
		public static COMPLETE:string = "complete";
		
		/**
		 * Dispatched when the playback of a animation completes a loop.
		 */
		public static LOOP_COMPLETE:string = "loopComplete";
		
		/**
		 * Dispatched when the playback of an animation fade in complete.
		 */
		public static FADE_IN_COMPLETE:string = "fadeInComplete";
		
		/**
		 * Dispatched when the playback of an animation fade out complete.
		 */
		public static FADE_OUT_COMPLETE:string = "fadeOutComplete";
		
		/**
		 * 不推荐的API.
		 */
		public get movementID():string{
			return this.animationName;
		}
		
		/**
		 * The animationState instance.
		 */
		public animationState:AnimationState;
		
		/**
		 * The armature that is the taget of this event.
		 */
		public get armature():Armature{
			return <Armature><any> (this.target);
		}
		
		public get animationName():string{
			return this.animationState.name;
		}
		
		/**
		 * Creates a new AnimationEvent instance.
		 * @param type
		 * @param cancelable
		 */
		public constructor(type:string, cancelable:boolean = false){
			super(type);
		}
	}
}