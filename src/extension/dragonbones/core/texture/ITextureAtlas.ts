
module dragonBones {

	export interface ITextureAtlas{
		/**
		 * The name of this ITextureAtlas.
		 */
		name:string;
		/**
		 * Clean up resources.
		 */
		dispose():void;
		/**
		 * Get the specific region of the TextureAtlas occupied by assets defined by that name.
		 * @param name The name of the assets represented by that name.
		 * @return Rectangle The rectangle area occupied by those assets.
		 */
		getRegion(name:string):Rectangle
	}
}