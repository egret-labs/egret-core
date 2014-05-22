///<reference path="dragonBones.ts" />
///<reference path="../../egret/display/DisplayObject.ts" />
///<reference path="../../egret/display/DisplayObjectContainer.ts" />
///<reference path="../../egret/display/Bitmap.ts" />
///<reference path="../../egret/resource/ResourceLoader.ts" />
/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
module dragonBones {
    export module display {
        export class DragonBonesEgretBridge implements IDisplayBridge {
            private static RADIAN_TO_ANGLE:number = 180 / Math.PI;

            private _display:ns_egret.DisplayObject;

            public getVisible():boolean {
                return this._display ? this._display.visible : false;
            }

            public setVisible(value:boolean):void {
                if (this._display) {
                    this._display.visible = value;
                }
            }

            public getDisplay():any {
                return this._display;
            }

            public setDisplay(value:any):void {
                if (this._display == value) {
                    return;
                }
                if (this._display) {
                    var parent:ns_egret.DisplayObjectContainer = this._display.parent;
                    if (parent) {
                        var index:number = -1;//todo this._display.parent.getChildIndex(this._display);
                    }
                    this.removeDisplay();
                }
                this._display = <ns_egret.DisplayObject> value;
                this.addDisplay(parent, index);
            }

            constructor() {
            }

            public dispose():void {
                this._display = null;
            }

            public updateTransform(matrix:geom.Matrix, transform:objects.DBTransform):void {

//                this._display.rotation = transform.getRotation() * 180 / Math.PI
                this._display.x = matrix.tx;
                this._display.y = matrix.ty;
                this._display.skewX = transform.skewX * DragonBonesEgretBridge.RADIAN_TO_ANGLE;
                this._display.skewY = transform.skewY * DragonBonesEgretBridge.RADIAN_TO_ANGLE;
                this._display.scaleX = transform.scaleX;
                this._display.scaleY = transform.scaleY;
            }

            public updateColor(aOffset:number, rOffset:number, gOffset:number, bOffset:number, aMultiplier:number, rMultiplier:number, gMultiplier:number, bMultiplier:number):void {
                if (this._display) {
                    this._display.alpha = aMultiplier;
                    //todo
                }
            }

            public updateBlendMode(blendMode:string) {
//                console.log (blendMode);
                if (this._display) {
                    this._display.blendMode = ns_egret.BlendMode.getBlendMode(blendMode);
                }
            }

            public addDisplay(container:any, index:number):void {
                var parent:ns_egret.DisplayObjectContainer = <ns_egret.DisplayObjectContainer> container;
                if (parent && this._display) {
                    if (this._display.parent) {
                        this._display.parent.removeChild(this._display);
                    }

                    if (index < 0) {
                        parent.addChild(this._display);
                    }
                    else {
                        parent.addChildAt(this._display, Math.min(index, parent.numChildren));
                    }
                }
            }

            public removeDisplay():void {
                if (this._display && this._display.parent) {
                    this._display.parent.removeChild(this._display);
                }
            }
        }
    }

    export module textures {
        export class EgretTextureAtlas implements ITextureAtlas {
            public name:string;
            public scale:number;
            public spriteSheet:ns_egret.SpriteSheet;

            constructor(public texture:any, textureAtlasRawData:any, scale:number = 1) {
                this.scale = scale;

                this.parseData(textureAtlasRawData);
            }

            public dispose():void {
                this.texture = null;
            }

            public getRegion(subTextureName:string):geom.Rectangle {
                throw new Error("error");
                return new geom.Rectangle();
            }

            private parseData(textureAtlasRawData:any):void {
                this.name = textureAtlasRawData[utils.ConstValues.A_NAME];
                this.spriteSheet = ns_egret.SpriteSheet.parseFromDragonBones(textureAtlasRawData);
            }
        }
    }


    export module factorys {
        export class EgretFactory extends BaseFactory {

            constructor() {
                super();
            }

            /** @private */
            public _generateArmature():Armature {
                var armature:Armature = new Armature(new ns_egret.DisplayObjectContainer());
                return armature;
            }

            /** @private */
            public _generateSlot():Slot {
                var slot:Slot = new Slot(new display.DragonBonesEgretBridge());
                return slot;
            }

            /** @private */
            public _generateDisplay(textureAtlas:textures.EgretTextureAtlas, fullName:string, pivotX:number, pivotY:number):any {

                var bitmap1:ns_egret.Bitmap = new ns_egret.Bitmap();
                bitmap1.texture = textureAtlas.texture;
                var frame = textureAtlas.spriteSheet.getFrame(fullName);
                bitmap1.spriteFrame = frame;
                bitmap1.anchorOffsetX = pivotX;
                bitmap1.anchorOffsetY = pivotY;
                return bitmap1;
            }
        }
    }
}