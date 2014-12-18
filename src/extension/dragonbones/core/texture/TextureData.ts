
module dragonBones {

	export class TextureData{
		public region:Rectangle;
		public frame:Rectangle;
		public rotated:boolean;
		
		public constructor(region:Rectangle, frame:Rectangle, rotated:boolean){
			this.region = region;
			this.frame = frame;
			this.rotated = rotated;
		}
	}
}