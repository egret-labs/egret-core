module dragonBones {
	export class FrameEvent extends Event{
		public static get MOVEMENT_FRAME_EVENT():string{
			return  FrameEvent.ANIMATION_FRAME_EVENT;
		}
		
		/**
		 * Dispatched when the animation of the armatrue enter a frame.
		 */
		public static ANIMATION_FRAME_EVENT:string = "animationFrameEvent";
		
		/**
		 * 
		 */
		public static BONE_FRAME_EVENT:string ="boneFrameEvent";
		
		/**
		 * The entered frame label.
		 */
		public frameLabel:string;
		
		public bone:Bone;
		
		/**
		 * The armature that is the target of this event.
		 */
		public get armature():Armature{
			return <Armature><any> (this.target);
		}
		
		/**
		 * The animationState instance.
		 */
		public animationState:AnimationState;
		
		/**
		 * Creates a new FrameEvent instance.
		 * @param type
		 * @param cancelable
		 */
		public constructor(type:string, cancelable:boolean = false){
			super(type);
		}
	}
}