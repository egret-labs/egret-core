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

            private _display:egret.DisplayObject;

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
                    var parent:egret.DisplayObjectContainer = this._display.parent;
                    if (parent) {
                        var index:number = parent.getChildIndex(this._display);
                    }
                    this.removeDisplay();
                }
                this._display = <egret.DisplayObject> value;
                this.addDisplay(parent, index);
            }

            constructor() {
            }

            public dispose():void {
                this._display = null;
            }

            public updateTransform(matrix:geom.Matrix, transform:objects.DBTransform):void {

//                this._display.rotation = transform.getRotation() * 180 / Math.PI
                this._display._x = matrix.tx;
                this._display._y = matrix.ty;
                this._display._skewX = transform.skewX * DragonBonesEgretBridge.RADIAN_TO_ANGLE;
                this._display._skewY = transform.skewY * DragonBonesEgretBridge.RADIAN_TO_ANGLE;
                this._display._scaleX = transform.scaleX;
                this._display._scaleY = transform.scaleY;
                this._display._setSizeDirty();
            }

            public updateColor(aOffset:number, rOffset:number, gOffset:number, bOffset:number, aMultiplier:number, rMultiplier:number, gMultiplier:number, bMultiplier:number):void {
                if (this._display) {
                    this._display._alpha = aMultiplier;
                    //todo
                }
            }

            public updateBlendMode(blendMode:string) {
                if (this._display && blendMode) {
                    this._display.blendMode = blendMode;
                }
            }

            public addDisplay(container:any, index:number):void {
                var parent:egret.DisplayObjectContainer = <egret.DisplayObjectContainer> container;
                if (parent && this._display) {
                    if (this._display._parent) {
                        this._display._parent.removeChild(this._display);
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
                if (this._display && this._display._parent) {
                    this._display._parent.removeChild(this._display);
                }
            }
        }
    }

    export module textures {
        export class EgretTextureAtlas implements ITextureAtlas {
            public name:string;
            public scale:number;
            public spriteSheet:egret.SpriteSheet;
            private _textureData:any = {};

            constructor(public texture:egret.Texture, private textureAtlasRawData:any, scale:number = 1) {
                this.scale = scale;
                this.name = textureAtlasRawData[utils.ConstValues.A_NAME];
                this.parseData(textureAtlasRawData);
                this.spriteSheet = new egret.SpriteSheet(texture);
            }

            public getTexture(fullName:string):egret.Texture {
                var result = this.spriteSheet.getTexture(fullName);
                if (!result) {
                    var data = this._textureData[fullName];
                    result = this.spriteSheet.createTexture(fullName, data.x, data.y, data.width, data.height);
                }
                return result;
            }

            public dispose():void {
                this.texture = null;
            }

            public getRegion(subTextureName:string):geom.Rectangle {
                throw new Error("error");
                //return new geom.Rectangle();
            }

            private parseData(textureAtlasRawData:any):void {
                var l:number = textureAtlasRawData.SubTexture.length;
                for (var i:number = 0; i < l; i++) {
                    var data = textureAtlasRawData.SubTexture[i];
                    this._textureData[data.name] = data;
                }
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
                var armature:Armature = new Armature(new egret.DisplayObjectContainer());
                return armature;
            }

            /** @private */
            public _generateSlot():Slot {
                var slot:Slot = new Slot(new display.DragonBonesEgretBridge());
                return slot;
            }

            /** @private */
            public _generateDisplay(textureAtlas:textures.EgretTextureAtlas, fullName:string, pivotX:number, pivotY:number):any {

                var bitmap1:egret.Bitmap = new egret.Bitmap();
                bitmap1.texture = textureAtlas.getTexture(fullName);
                bitmap1.anchorOffsetX = pivotX;
                bitmap1.anchorOffsetY = pivotY;
                return bitmap1;
            }
        }
    }
}