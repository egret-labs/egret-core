module dragonBones {

	export interface IAnimatable{
		/**
		 * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
		 * @param The amount of second to move the playhead ahead.
		 */
		advanceTime(passedTime:number):void;
	}
}