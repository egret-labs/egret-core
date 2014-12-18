/**
 * Created by Chenguang on 2014/12/1.
 */
module dragonBones {
    export class EgretFactory extends BaseFactory {
        constructor() {
            super(this);
        }

        /** @private */
        public _generateArmature():Armature {
            var armature:Armature = new Armature(new egret.DisplayObjectContainer());
            return armature;
        }

        /** @private */
        public _generateSlot():Slot {
            var slot:Slot = new EgretSlot();
            return slot;
        }

        /** @private */
        public _generateDisplay(textureAtlas:EgretTextureAtlas, fullName:string, pivotX:number, pivotY:number):any {
            var bitmap:egret.Bitmap = new egret.Bitmap();
            bitmap.texture = textureAtlas.getTexture(fullName);
            bitmap.anchorOffsetX = pivotX;
            bitmap.anchorOffsetY = pivotY;
            return bitmap;
        }
    }
}