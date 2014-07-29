/**
 * Created by lenovo on 2014/6/20.
 */

/// <reference path="../context/MainContext.ts"/>
/// <reference path="../context/Ticker.ts"/>
/// <reference path="Bitmap.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../utils/Logger.ts"/>

module egret {
	/**
	 * Clip用来简单分别序列帧图片
	 */
	export class Clip extends DisplayObjectContainer {
		private _spriteSheet:SpriteSheet;
		private _countH:number;
		private _countV:number;
		private _cellWidth:number;
		private _cellHeight:number;
		private _currentFrameIndex:number;
		private _resPool = {};

		constructor(texture:Texture, countH:number = 1, countV:number = 1){
			super();

			this._currentFrameIndex = -1;
			this._countH = countH;
			this._countV = countV;
			this._cellWidth = texture.textureWidth / this._countH;
			this._cellHeight = texture.textureHeight / this._countV;
			this._spriteSheet = new SpriteSheet(texture._bitmapData);

			this.gotoFrame(0);
		}

		gotoFrame(value:number):void{
			if(value != this._currentFrameIndex){
				this._currentFrameIndex = value;
				var bitmap = this.getBitmap();
				this.removeChildren();
				this.addChild(bitmap);
			}
		}

		private getBitmap():Bitmap {
			var result:Bitmap;
			result = new Bitmap();
			var texture = this._spriteSheet.getTexture("frame_" + this._currentFrameIndex);
			if (!texture) {
				var x = (this._currentFrameIndex % this._countH) * this._cellWidth;
				var y = Math.floor(this._currentFrameIndex / this._countH) * this._cellHeight;
				texture = this._spriteSheet.createTexture("frame_" + this._currentFrameIndex, x, y, this._cellWidth, this._cellHeight);
			}
			result.texture = texture;
			return result;
		}
	}
}