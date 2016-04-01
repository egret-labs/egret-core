//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module dragonBones {
    /**
     * @class dragonBones.EgretSlot
     * @extends dragonBones.Slot
     * @classdesc
     * egret引擎使用的插槽
     */
    export class EgretFastSlot extends FastSlot {
        private _egretDisplay:egret.DisplayObject;

        /**
         * 创建一个新的 EgretSlot 实例
         */
        public constructor(rawDisplay:any){
            super(rawDisplay);

            this._egretDisplay = null;
        }

        /**
         * 释放资源
         */
        public dispose():void{
            if(this._displayList){
                var length:number = this._displayList.length;
                for(var i:number = 0;i < length;i++){
                    var content:any = this._displayList[i];
                    if(content instanceof FastArmature){
                        (<FastArmature><any> content).dispose();
                    }
                }
            }

            super.dispose();

            this._egretDisplay = null;
        }

        /** @private */
        public _updateDisplay(value:any):void{
            this._egretDisplay = <egret.DisplayObject><any> value;
        }

        /** @private */
        public _addDisplay(): void {
            const container = this.armature.display as egret.DisplayObjectContainer;
            container.addChild(this._egretDisplay);
        }
		
        /** @private */
        public _replaceDisplay(prevDisplay: any): void {
            const container = this.armature.display as egret.DisplayObjectContainer;
            const displayObject = prevDisplay as egret.DisplayObject;
            container.addChild(this._egretDisplay);
            container.swapChildren(this._egretDisplay, displayObject);
            container.removeChild(displayObject);
        }
		
        /** @private */
        public _removeDisplay(): void {
            this._egretDisplay.parent.removeChild(this._egretDisplay);
        }

        //Abstract method

        /** @private */
        public _getDisplayIndex():number{
            if(this._egretDisplay && this._egretDisplay.parent){
                return this._egretDisplay.parent.getChildIndex(this._egretDisplay);
            }
            return -1;
        }

        /** @private */
        public _addDisplayToContainer(container:any, index:number = -1):void{
            var egretContainer:egret.DisplayObjectContainer = <egret.DisplayObjectContainer><any> container;
            if(this._egretDisplay && egretContainer){
                if (index < 0){
                    egretContainer.addChild(this._egretDisplay);
                }
                else{
                    egretContainer.addChildAt(this._egretDisplay, Math.min(index, egretContainer.numChildren));
                }
            }
        }

        /** @private */
        public _removeDisplayFromContainer():void{
            if(this._egretDisplay && this._egretDisplay.parent){
                this._egretDisplay.parent.removeChild(this._egretDisplay);
            }
        }

        /** @private */
        public _updateTransform(): void{
            if (this._displayIndex >= 0) {
                this._egretDisplay.$setMatrix(<egret.Matrix><any>this._globalTransformMatrix, false);
            }
        }

        /** @private */
        public _updateDisplayVisible(value:boolean):void{
            //if(this._egretDisplay && this._parent){
            //    this._egretDisplay.visible = this._parent._visible && this._visible && value;
            //}
        }

        /** @private */
        public _updateDisplayColor(
            aOffset:number,
            rOffset:number,
            gOffset:number,
            bOffset:number,
            aMultiplier:number,
            rMultiplier:number,
            gMultiplier:number,
            bMultiplier:number,
            colorChanged:boolean = false):void{
            super._updateDisplayColor(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged);
            if(this._egretDisplay)
            {

                this._egretDisplay.alpha = aMultiplier;
                //todo apply colorTransform after engine support it.
            }
        }
        
        /** @private */
        public _updateFrame(): void {
            const dataLength = this._displayDataList.length;
            const textureIndex = this._displayIndex < dataLength ? this._displayIndex : (dataLength - 1);
            const textureData = textureIndex < 0 ? null : this._displayDataList[textureIndex][1];
            const display = this._egretDisplay as egret.Bitmap;
            if (textureData) {
                const textureAtlasTexture: EgretTextureAtlas = textureData.textureAtlas as EgretTextureAtlas;
                const displayData = this.displayDataList[this._displayIndex][0];
                const rect = textureData.frame || textureData.region;
                const width = textureData.rotated ? rect.height : rect.width;
                const height = textureData.rotated ? rect.width : rect.height;
                //const pivotX = width * displayData.pivot.x - (textureData.frame ? textureData.frame.x : 0);
                //const pivotY = height * displayData.pivot.y - (textureData.frame ? textureData.frame.y : 0);
                const pivotX = width * 0.5;
                const pivotY = height * 0.5;
                display.texture = textureAtlasTexture.getTexture(displayData.name);
                // display.readjustSize();
                display.anchorOffsetX = pivotX;
                display.anchorOffsetY = pivotY;
                display.visible = true;
            }
            else {
                display.texture = null;
                //display.readjustSize();
                //display.anchorOffsetX = 0;
                //display.anchorOffsetX = 0;
                display.visible = false;
                console.log(123);
            }
        }

        /** @private */
        public _updateDisplayBlendMode(value:string):void{
            if(this._egretDisplay && value)
            {
                this._egretDisplay.blendMode = value;
            }
        }
    }
}