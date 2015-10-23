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
	 * @class dragonBones.FastSlot
	 * @classdesc
	 * FastSlot 实例是骨头上的一个插槽，是显示图片的容器。
	 * 一个 FastBone 上可以有多个FastSlot，每个FastSlot中同一时间都会有一张图片用于显示，不同的FastSlot中的图片可以同时显示。
	 * 每个 FastSlot 中可以包含多张图片，同一个 FastSlot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
	 * @extends dragonBones.DBObject
	 * @see dragonBones.FastArmature
	 * @see dragonBones.FastBone
	 * @see dragonBones.SlotData
	 */
	export class FastSlot extends FastDBObject implements ISlotCacheGenerator{
		/** @private Need to keep the reference of DisplayData. When slot switch displayObject, it need to restore the display obect's origional pivot. */
		public _displayDataList:Array<DisplayData>;
		/** @private */
		public _originZOrder:number;
		/** @private */
		public _tweenZOrder:number;
		/** @private */
		public _offsetZOrder:number;
		/** @private */
		public _originDisplayIndex:number;

		public _displayList:Array<any>;
		public _currentDisplayIndex:number = 0;
		public _colorTransform:ColorTransform;
		public _isColorChanged:boolean;
		public _currentDisplay:any;
		
		public _blendMode:string;
		
		public hasChildArmature:boolean;
		public constructor(self:FastSlot){
			super();
			
			if(self != this){
				throw new Error("Abstract class can not be instantiated!");
			}
			this.hasChildArmature = false;
			this._currentDisplayIndex = -1;
			
			this._originZOrder = 0;
			this._tweenZOrder = 0;
			this._offsetZOrder = 0;
			this._colorTransform = new ColorTransform();
			this._isColorChanged = false;
			this._displayDataList = null;
			this._currentDisplay = null;
			
			this.inheritRotation = true;
			this.inheritScale = true;
		}

		/**
		 * 通过传入 SlotData 初始化FastSlot
		 * @param slotData
		 */
		public initWithSlotData(slotData:SlotData):void{
			this.name = slotData.name;
			this.blendMode = slotData.blendMode;
			this._originZOrder = slotData.zOrder;
			this._displayDataList = slotData.displayDataList;
			this._originDisplayIndex = slotData.displayIndex;
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose():void{
			if(!this._displayList){
				return;
			}
			
			super.dispose();
			
			this._displayDataList = null;
			this._displayList = null;
			this._currentDisplay = null;
		}
		
		//动画
		/** @private */
		public updateByCache():void{
			super.updateByCache();
			this._updateTransform();
		//颜色
			var cacheColor:ColorTransform = (<SlotFrameCache><any> (this._frameCache)).colorTransform;
			var cacheColorChanged:boolean = cacheColor != null;
			if(	this.colorChanged != cacheColorChanged ||
				(this.colorChanged && cacheColorChanged && !ColorTransformUtil.isEqual(this._colorTransform, cacheColor))){
				cacheColor = cacheColor || ColorTransformUtil.originalColor;
				this._updateDisplayColor(	cacheColor.alphaOffset, 
									cacheColor.redOffset, 
									cacheColor.greenOffset, 
									cacheColor.blueOffset,
									cacheColor.alphaMultiplier, 
									cacheColor.redMultiplier, 
									cacheColor.greenMultiplier, 
									cacheColor.blueMultiplier,
									cacheColorChanged);
			}
			
		//displayIndex
			this._changeDisplayIndex((<SlotFrameCache><any> (this._frameCache)).displayIndex);
		}
		
		/** @private */
		public _update():void{
			if(this._parent._needUpdate <= 0){
				return;
			}
			
			this._updateGlobal();
			this._updateTransform();
		}
		
		public _calculateRelativeParentTransform():void{
			this._global.copy(this._origin);
			this._global.x += this._parent._tweenPivot.x;
			this._global.y += this._parent._tweenPivot.y;
		}
		
		public initDisplayList(newDisplayList:Array<any>):void{
			this._displayList = newDisplayList;
		}
		
		private clearCurrentDisplay():number{
			if(this.hasChildArmature){
				var targetArmature:FastArmature = this.childArmature;
				if(targetArmature){
					targetArmature.resetAnimation()
				}
			}
			
			var slotIndex:number = this._getDisplayIndex();
			this._removeDisplayFromContainer();
			return slotIndex;
		}
		
		/** @private */
		public _changeDisplayIndex(displayIndex:number = 0):void{
			if(this._currentDisplayIndex == displayIndex){
				return;
			}
			
			var slotIndex:number = -1;

			if(this._currentDisplayIndex >=0){
				slotIndex = this.clearCurrentDisplay();
			}
			
			this._currentDisplayIndex = displayIndex;
			
			if(this._currentDisplayIndex >=0){
				this._origin.copy(this._displayDataList[this._currentDisplayIndex].transform);
				this.initCurrentDisplay(slotIndex);
			}
		}
		
		//currentDisplayIndex不变，改变内容，必须currentDisplayIndex >=0
		private changeSlotDisplay(value:any):void{
			var slotIndex:number = this.clearCurrentDisplay();
			this._displayList[this._currentDisplayIndex] = value;
			this.initCurrentDisplay(slotIndex);
		}
		
		private initCurrentDisplay(slotIndex:number = 0):void{
			var display:any = this._displayList[this._currentDisplayIndex];
			if (display){
				if(display instanceof FastArmature){
					this._currentDisplay = (<FastArmature><any> display).display;
				}
				else{
					this._currentDisplay = display;
				}
			}
			else{
				this._currentDisplay = null;
			}
			
			this._updateDisplay(this._currentDisplay);
			if(this._currentDisplay){
				if(slotIndex != -1){
					this._addDisplayToContainer(this.armature.display, slotIndex);
				}
				else{
					this.armature._slotsZOrderChanged = true;
					this._addDisplayToContainer(this.armature.display);
				}
				
				if(this._blendMode){
					this._updateDisplayBlendMode(this._blendMode);
				}
				if(this._isColorChanged){
					this._updateDisplayColor(	this._colorTransform.alphaOffset, 
						this._colorTransform.redOffset, 
						this._colorTransform.greenOffset, 
						this._colorTransform.blueOffset,
						this._colorTransform.alphaMultiplier, 
						this._colorTransform.redMultiplier, 
						this._colorTransform.greenMultiplier, 
						this._colorTransform.blueMultiplier,
						true);
				}
				this._updateTransform();
				
				if(display instanceof FastArmature){
					var targetArmature:FastArmature = <FastArmature><any> (display);
					
					if(	this.armature &&
						this.armature.animation.animationState &&
						targetArmature.animation.hasAnimation(this.armature.animation.animationState.name)){
						targetArmature.animation.gotoAndPlay(this.armature.animation.animationState.name);
					}
					else{
						targetArmature.animation.play();
					}
				}
			}
		}
		

		/** @private */
		public set visible(value:boolean)
		{
			if(this._visible != value)
			{
				this._visible = value;
				this._updateDisplayVisible(this._visible);
			}
		}

		/**
		 * 显示对象列表(包含 display 或者 子骨架)
		 * @member {any[]} dragonBones.FastSlot#displayList
		 */
		public get displayList():Array<any>{
			return this._displayList;
		}
		public set displayList(value:Array<any>){
			//todo: 考虑子骨架变化的各种情况
			if(!value){
				throw new Error();
			}
			
			var newDisplay:any = value[this._currentDisplayIndex];
			var displayChanged:boolean = this._currentDisplayIndex >= 0 && this._displayList[this._currentDisplayIndex] != newDisplay;
			
			this._displayList = value;
			
			if(displayChanged){
				this.changeSlotDisplay(newDisplay);
			}
		}

		/**
		 * 当前的显示对象(可能是 display 或者 子骨架)
		 * @member {any} dragonBones.FastSlot#display
		 */
		public get display():any{
			return this._currentDisplay;
		}
		public set display(value:any){
			//todo: 考虑子骨架变化的各种情况
			if (this._currentDisplayIndex < 0){
				return;
			}
			if(this._displayList[this._currentDisplayIndex] == value){
				return;
			}
			
			this.changeSlotDisplay(value);
		}

		/**
		 * 当前的子骨架
		 * @member {FastArmature} dragonBones.Slot#childArmature
		 */
		public get childArmature():any{
			return (this._displayList[this._currentDisplayIndex] instanceof Armature 
				    || this._displayList[this._currentDisplayIndex] instanceof FastArmature) ? this._displayList[this._currentDisplayIndex] : null;
		}
		
		public set childArmature(value:any)
		{
			this.display = value;
		}
		/**
		 * 显示顺序。(支持小数用于实现动态插入slot)
		 * @member {number} dragonBones.FastSlot#zOrder
		 */
		public get zOrder():number{
			return this._originZOrder + this._tweenZOrder + this._offsetZOrder;
		}
		public set zOrder(value:number){
			if(this.zOrder != value){
				this._offsetZOrder = value - this._originZOrder - this._tweenZOrder;
				if(this.armature){
					this.armature._slotsZOrderChanged = true;
				}
			}
		}

		/**
		 * 混合模式
		 * @member {string} dragonBones.FastSlot#blendMode
		 */
		public get blendMode():string{
			return this._blendMode;
		}
		public set blendMode(value:string){
			if(this._blendMode != value){
				this._blendMode = value;
				this._updateDisplayBlendMode(this._blendMode);
			}
		}
		
		public get colorTransform():ColorTransform{
			return this._colorTransform;
		}
		
		public get displayIndex():number{
			return this._currentDisplayIndex;
		}
		
		public get colorChanged():boolean{
			return this._isColorChanged;
		}
		
	//Abstract method
		/**
		 * @private
		 */
		public _updateDisplay(value:any):void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 */
		public _getDisplayIndex():number{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 * Adds the original display object to another display object.
		 * @param container
		 * @param index
		 */
		public _addDisplayToContainer(container:any, index:number = -1):void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 * remove the original display object from its parent.
		 */
		public _removeDisplayFromContainer():void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 * Updates the transform of the slot.
		 */
		public _updateTransform():void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 */
		public _updateDisplayVisible(value:boolean):void{
			/**
			 * bone.visible && slot.visible && updateVisible
			 * this._parent.visible && this._visible && value;
			 */
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/**
		 * @private
		 * Updates the color of the display object.
		 * @param a
		 * @param r
		 * @param g
		 * @param b
		 * @param aM
		 * @param rM
		 * @param gM
		 * @param bM
		 */
		public _updateDisplayColor(
			aOffset:number, 
			rOffset:number, 
			gOffset:number, 
			bOffset:number, 
			aMultiplier:number, 
			rMultiplier:number, 
			gMultiplier:number, 
			bMultiplier:number,
			colorChanged:boolean = false
		):void{
			this._colorTransform.alphaOffset = aOffset;
			this._colorTransform.redOffset = rOffset;
			this._colorTransform.greenOffset = gOffset;
			this._colorTransform.blueOffset = bOffset;
			this._colorTransform.alphaMultiplier = aMultiplier;
			this._colorTransform.redMultiplier = rMultiplier;
			this._colorTransform.greenMultiplier = gMultiplier;
			this._colorTransform.blueMultiplier = bMultiplier;
			this._isColorChanged = colorChanged;
		}
		
		/**
		 * @private
		 * Update the blend mode of the display object.
		 * @param value The blend mode to use. 
		 */
		public _updateDisplayBlendMode(value:string):void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
		
		/** @private When slot timeline enter a key frame, call this func*/
		public _arriveAtFrame(frame:Frame, animationState:FastAnimationState):void{
			var slotFrame:SlotFrame = <SlotFrame><any> frame;
			var displayIndex:number = slotFrame.displayIndex;
			this._changeDisplayIndex(displayIndex);
			this._updateDisplayVisible(slotFrame.visible);
			if(displayIndex >= 0){
				if(!isNaN(slotFrame.zOrder) && slotFrame.zOrder != this._tweenZOrder){
					this._tweenZOrder = slotFrame.zOrder;
					this.armature._slotsZOrderChanged = true;
				}
			}
			//[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
			//后续会扩展更多的action，目前只有gotoAndPlay的含义
			if(frame.action) {
				var targetArmature:FastArmature = this.childArmature;
				if (targetArmature){
					targetArmature.getAnimation().gotoAndPlay(frame.action);
				}
			}
		}
		
				/** @private */
		public hideSlots():void{
			this._changeDisplayIndex( -1);
			this._removeDisplayFromContainer();
			if (this._frameCache){
				this._frameCache.clear();
			}
		}

		public _updateGlobal():any {
            this._calculateRelativeParentTransform();
            TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);

            var output:any = this._calculateParentTransform();
            if (output) {
                this._globalTransformMatrix.concat(output.parentGlobalTransformMatrix);
                TransformUtil.matrixToTransform(this._globalTransformMatrix, this._global, this._global.scaleX * output.parentGlobalTransform.scaleX >= 0, this._global.scaleY * output.parentGlobalTransform.scaleY >= 0);
            }
            return output;
        }

        public _resetToOrigin():void
		{
			this._changeDisplayIndex(this._originDisplayIndex);
			this._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, true);
		}
	}
}