module dragonBones {

	export class ArmatureEvent extends Event{
	
		/**
		 * Dispatched after a successful z order update.
		 */
		public static Z_ORDER_UPDATED:string = "zOrderUpdated";
		
		public constructor(type:string){
			super(type);
		}
	}
}