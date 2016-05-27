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
    export class EgretSlot extends Slot {
        private _egretDisplay:egret.DisplayObject;

        /**
         * 创建一个新的 EgretSlot 实例
         */
        public constructor(){
            super();

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
                    if(content instanceof Armature){
                        (<Armature><any> content).dispose();
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
        public _updateTransform():void{
            if (this._egretDisplay && (!this._meshData || !this._meshData.skinned || !this.isMeshEnabled)) {
                this._egretDisplay.$setMatrix(<egret.Matrix><any>this._globalTransformMatrix, false);
            }
        }

        /** @private */
        public _updateDisplayVisible(value:boolean):void{
            if(this._egretDisplay && this._parent){
                this._egretDisplay.visible = this._parent._visible && this._visible && value;
            }
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
            colorChange:boolean = false):void{
            super._updateDisplayColor(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange);
            if(this._egretDisplay)
            {
                this._egretDisplay.alpha = aMultiplier;
                //todo apply colorTransform after engine support it.
            }
        }

        /** @private */
        public _updateDisplayBlendMode(value:string):void{
            if(this._egretDisplay && value)
            {
                this._egretDisplay.blendMode = value;
            }
        }

        /** @private */
        public _calculateRelativeParentTransform():void{
            this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
            this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;

            if(this._displayDataList && 
               this._currentDisplayIndex >= 0 && 
               this._displayDataList[this._currentDisplayIndex] &&
               EgretTextureAtlas.rotatedDic[this._displayDataList[this._currentDisplayIndex].name] == 1)
            {
                this._global.skewX -= 1.57;
                this._global.skewY -= 1.57;
            }
        }
        
        /** @private */
        public _updateMesh():void{
			if (!this._meshData || !this.isMeshEnabled)
			{
				return;
            }
            
            const mesh = this._egretDisplay as egret.Mesh;
            const meshNode = mesh.$renderNode as egret.sys.MeshNode;
            
			var i = 0, iD = 0, l = 0;
            var xG = 0, yG = 0;
			if (this._meshData.skinned)
			{
				const bones = this._armature.getBones(false);
				var iF = 0;
				for (i = 0, l = this._meshData.numVertex; i < l; i++)
				{
					const vertexBoneData:VertexBoneData = this._meshData.vertexBones[i];
					var j = 0;
					var xL = 0;
					var yL = 0;
                    iD = i * 2;

                    xG = 0;
                    yG = 0;
					
                    for (var iB = 0, lB = vertexBoneData.indices.length; iB < lB; ++iB)
                    {
                        var boneIndex = vertexBoneData.indices[iB];
						const bone:Bone = this._meshBones[boneIndex];
						const matrix:Matrix = bone._globalTransformMatrix;
						const point:Point = vertexBoneData.vertices[j];
						const weight:number = Number(vertexBoneData.weights[j]);
						
						if (!this._ffdVertices || iF < this._ffdOffset || iF >= this._ffdVertices.length)
						{
							xL = point.x;
							yL = point.y;
						}
						else
						{
							xL = point.x + this._ffdVertices[iF];
							yL = point.y + this._ffdVertices[iF + 1];
						}
						
						xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
						yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
						
						j++;
						iF += 2;
                    }
                    
                    meshNode.vertices[iD] = xG;
                    meshNode.vertices[iD + 1] = yG;
                }
                
                mesh.$updateVertices();
                mesh.$invalidateTransform();
			}
			else if (this._ffdChanged)
			{
				this._ffdChanged = false;
				for (i = 0, l = this._meshData.numVertex; i < l; ++i)
				{
					const vertexData:VertexData = this._meshData.vertices[i];
					iD = i * 2;
					if (!this._ffdVertices || iD < this._ffdOffset || iD >= this._ffdVertices.length)
					{
						xG = vertexData.x;
						yG = vertexData.y;
					}
					else
					{
						xG = Number(vertexData.x) + this._ffdVertices[iD - this._ffdOffset];
						yG = Number(vertexData.y) + this._ffdVertices[iD - this._ffdOffset + 1];
					}

                    meshNode.vertices[iD] = xG;
                    meshNode.vertices[iD + 1] = yG;
                }
                
                mesh.$updateVertices();
                mesh.$invalidateTransform();
			}
			
        }
    }
}