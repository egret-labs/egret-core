
module dragonBones {

	export class DBTransform{
		/**
		 * Position on the x axis.
		 */
		public x:number;
		/**
		 * Position on the y axis.
		 */
		public y:number;
		/**
		 * Skew on the x axis.
		 */
		public skewX:number;
		/**
		 * skew on the y axis.
		 */
		public skewY:number;
		/**
		 * Scale on the x axis.
		 */
		public scaleX:number;
		/**
		 * Scale on the y axis.
		 */
		public scaleY:number;
		/**
		 * The rotation of that DBTransform instance.
		 */
		public get rotation():number{
			return this.skewX;
		}
		public set rotation(value:number){
			this.skewX = this.skewY = value;
		}
		/**
		 * Creat a new DBTransform instance.
		 */
		public constructor(){
			this.x = 0;
			this.y = 0;
			this.skewX = 0;
			this.skewY = 0;
			this.scaleX = 1
			this.scaleY = 1;
		}
		/**
		 * Copy all properties from this DBTransform instance to the passed DBTransform instance.
		 * @param node
		 */
		public copy(transform:DBTransform):void{
			this.x = transform.x;
			this.y = transform.y;
			this.skewX = transform.skewX;
			this.skewY = transform.skewY;
			this.scaleX = transform.scaleX;
			this.scaleY = transform.scaleY;
		}
		/**
		 * Get a string representing all DBTransform property values.
		 * @return String All property values in a formatted string.
		 */
		public toString():string{
			var string:string = "x:" + this.x + " y:" + this.y + " skewX:" + this.skewX + " skewY:" + this.skewY + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
			return string;
		}
	}
}