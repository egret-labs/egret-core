/**
 * Created by Chenguang on 2014/12/1.
 */
module dragonBones {
    export class EgretTextureAtlas implements ITextureAtlas {
        public name:string;
        public scale:number;
        public spriteSheet:egret.SpriteSheet;
        private _textureDatas:any = {};

        constructor(public texture:egret.Texture, private textureAtlasRawData:any, scale:number = 1) {
            this.scale = scale;
            this.name = textureAtlasRawData[ConstValues.A_NAME];
            this.parseData(textureAtlasRawData);
            this.spriteSheet = new egret.SpriteSheet(texture);
        }

        public getTexture(fullName:string):egret.Texture {
            var result = this.spriteSheet.getTexture(fullName);
            if (!result) {
                var data:TextureData = this._textureDatas[fullName];
                if(data) {
                    result = this.spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
                }
            }
            return result;
        }

        public dispose():void {
            this.texture = null;
        }

        public getRegion(subTextureName:string):Rectangle {
            var textureData:TextureData = this._textureDatas[subTextureName];
            if(textureData && textureData instanceof TextureData)
            {
                return textureData.region;
            }
            return null;
        }

        private parseData(textureAtlasRawData:any):void {
            this._textureDatas = DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
            name = this._textureDatas.__name;
            delete this._textureDatas.__name;
        }
    }
}