///<reference path="dragonBones.ts" />
///<reference path="../../egret/display/DisplayObject.ts" />
///<reference path="../../egret/display/DisplayObjectContainer.ts" />
///<reference path="../../egret/display/Bitmap.ts" />
/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
                this.spriteSheet = this.parseFromDragonBones(textureAtlasRawData);
            }

            /**
             * 这个API已经被完全废弃，会尽快删除
             * @param data
             * @returns {SpriteSheet}
             * @stable D
             */
            private parseFromDragonBones(data):ns_egret.SpriteSheet {

                var spriteSheet:ns_egret.SpriteSheet = new ns_egret.SpriteSheet(data);
                spriteSheet["textureMap"] = {};
                var list = data.SubTexture

                for (var key in list) {
                    var frameData = list[key];
                    var rect = new ns_egret.SpriteSheetFrame();
                    rect.w = frameData.width;
                    rect.h = frameData.height;
                    rect.x = frameData.x;
                    rect.y = frameData.y;
                    spriteSheet["textureMap"][frameData.name] = rect;
//            console.log (rect);
                }
                return spriteSheet;
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