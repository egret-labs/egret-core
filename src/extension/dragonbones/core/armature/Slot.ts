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

	export class Slot extends DBObject{
		/** @private Need to keep the reference of DisplayData. When slot switch displayObject, it need to restore the display obect's origional pivot. */
		public _displayDataList:Array<DisplayData>;
		/** @private */
		public _originZOrder:number;
		/** @private */
		public _tweenZOrder:number;
		/** @private */
		public _offsetZOrder:number;
		
		public _displayList:Array<any>;
		public _currentDisplayIndex:number = 0;
		public _colorTransform:ColorTransform;

		//TO DO: 以后把这两个属性变成getter
		//另外还要处理 isShowDisplay 和 visible的矛盾
		public _currentDisplay:any;
		public _isShowDisplay:boolean;
		
		//protected var _childArmature:Armature;
		public _blendMode:string;

		public constructor(self:Slot){
			super();
			
			if(self != this){
				throw new Error("Abstract class can not be instantiated!");
			}
			
			this._displayList = [];
			this._currentDisplayIndex = -1;
			
			this._originZOrder = 0;
			this._tweenZOrder = 0;
			this._offsetZOrder = 0;
			this._isShowDisplay = false;
            this._colorTransform = new ColorTransform();
			this._displayDataList = null;
			//_childArmature = null;
			this._currentDisplay = null;
			
			this.inheritRotation = true;
			this.inheritScale = true;
		}
		
		public initWithSlotData(slotData:SlotData):void{
			this.name = slotData.name;
			this.blendMode = slotData.blendMode;
			this._originZOrder = slotData.zOrder;
			this._displayDataList = slotData.displayDataList;
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose():void{
			if(!this._displayList){
				return;
			}
			
			super.dispose();
			
			this._displayList.length = 0;
			
			this._displayDataList = null;
			this._displayList = null;
			this._currentDisplay = null;
			//_childArmature = null;
		}
		
//骨架装配
		/** @private */
		public setArmature(value:Armature):void{
			if(this._armature == value){
				return;
			}
			if(this._armature){
				this._armature._removeSlotFromSlotList(this);
			}
			this._armature = value;
			if(this._armature){
				this._armature._addSlotToSlotList(this);
				this._armature._slotsZOrderChanged = true;
				this._addDisplayToContainer(this._armature.display);
			}
			else{
				this._removeDisplayFromContainer();
			}
		}
		
//动画
		/** @private */
		public _update():void{
			if(this._parent._needUpdate <= 0){
				return;
			}
			
			var x:number = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
			var y:number = this._origin.y + this._offset.y + this._parent._tweenPivot.y;
			
			var parentMatrix:Matrix = this._parent._globalTransformMatrix;
			
			this._globalTransformMatrix.tx = this._global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
			this._globalTransformMatrix.ty = this._global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
			
			if(this.inheritRotation){
				this._global.skewX = this._origin.skewX + this._offset.skewX + this._parent._global.skewX;
				this._global.skewY = this._origin.skewY + this._offset.skewY + this._parent._global.skewY;
			}
			else{
				this._global.skewX = this._origin.skewX + this._offset.skewX;
				this._global.skewY = this._origin.skewY + this._offset.skewY;
			}
			
			if(this.inheritScale){
				this._global.scaleX = this._origin.scaleX * this._offset.scaleX * this._parent._global.scaleX;
				this._global.scaleY = this._origin.scaleY * this._offset.scaleY * this._parent._global.scaleY;
			}
			else{
				this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
				this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
			}
			
			this._globalTransformMatrix.a = this._global.scaleX * Math.cos(this._global.skewY);
			this._globalTransformMatrix.b = this._global.scaleX * Math.sin(this._global.skewY);
			this._globalTransformMatrix.c = -this._global.scaleY * Math.sin(this._global.skewX);
			this._globalTransformMatrix.d = this._global.scaleY * Math.cos(this._global.skewX);
			
			this._updateTransform();
		}
		
		private updateChildArmatureAnimation():void{
			if(this.childArmature){
				if(this._isShowDisplay){
					if(
						this._armature &&
						this._armature.animation.lastAnimationState &&
						this.childArmature.animation.hasAnimation(this._armature.animation.lastAnimationState.name)
					){
						this.childArmature.animation.gotoAndPlay(this._armature.animation.lastAnimationState.name);
					}
					else{
						this.childArmature.animation.play();
					}
				}
				else{
					this.childArmature.animation.stop();
					this.childArmature.animation._lastAnimationState = null;
				}
			}
		}
		
		/** @private */
		public _changeDisplay(displayIndex:number = 0):void{
			if (displayIndex < 0){
				if(this._isShowDisplay){
					this._isShowDisplay = false;
					this._removeDisplayFromContainer();
					this.updateChildArmatureAnimation();
				}
			}
			else if (this._displayList.length > 0){
				var length:number = this._displayList.length;
				if(displayIndex >= length){
					displayIndex = length - 1;
				}
				
				if(this._currentDisplayIndex != displayIndex){
					this._isShowDisplay = true;
					this._currentDisplayIndex = displayIndex;
					this._updateSlotDisplay();
					this.updateChildArmatureAnimation();
					if(
						this._displayDataList && 
						this._displayDataList.length > 0 && 
						this._currentDisplayIndex < this._displayDataList.length
					){
						this._origin.copy(this._displayDataList[this._currentDisplayIndex].transform);
					}
				}
				else if(!this._isShowDisplay){
					this._isShowDisplay = true;
					if(this._armature){
						this._armature._slotsZOrderChanged = true;
						this._addDisplayToContainer(this._armature.display);
					}
					this.updateChildArmatureAnimation();
				}

			}
		}
		
		/** @private 
		 * Updates the display of the slot.
		 */
		public _updateSlotDisplay():void{
			var currentDisplayIndex:number = -1;
			if(this._currentDisplay){
				currentDisplayIndex = this._getDisplayIndex();
				this._removeDisplayFromContainer();
			}
			var displayObj:any = this._displayList[this._currentDisplayIndex];
			if (displayObj){
				if(displayObj instanceof Armature){
					//_childArmature = display as Armature;
					this._currentDisplay = (<Armature><any> displayObj).display;
				}
				else{
					//_childArmature = null;
					this._currentDisplay = displayObj;
				}
			}
			else{
				this._currentDisplay = null;
				//_childArmature = null;
			}
			this._updateDisplay(this._currentDisplay);
			if(this._currentDisplay){
				if(this._armature && this._isShowDisplay){
					if(currentDisplayIndex < 0){
						this._armature._slotsZOrderChanged = true;
						this._addDisplayToContainer(this._armature.display);
					}
					else{
						this._addDisplayToContainer(this._armature.display, currentDisplayIndex);
					}
				}
				this._updateDisplayBlendMode(this._blendMode);
				this._updateDisplayColor(
                    this._colorTransform.alphaOffset, this._colorTransform.redOffset, this._colorTransform.greenOffset, this._colorTransform.blueOffset,
                    this._colorTransform.alphaMultiplier, this._colorTransform.redMultiplier, this._colorTransform.greenMultiplier, this._colorTransform.blueMultiplier)
				this._updateDisplayVisible(this._visible);
			}
		}
		
		/** @private */
		public set visible(value:boolean){
			if(this._visible != value){
				this._visible = value;
				this._updateDisplayVisible(this._visible);
			}
		}
		
		/**
		 * The DisplayObject list belonging to this Slot instance (display or armature). Replace it to implement switch texture.
		 */
		public get displayList():Array<any>{
			return this._displayList;
		}
		public set displayList(value:Array<any>){
			if(!value){
				throw new Error();
			}
			
			//为什么要修改_currentDisplayIndex?
			if (this._currentDisplayIndex < 0){
				this._currentDisplayIndex = 0;
			}
			var i:number = this._displayList.length = value.length;
			while(i --){
				this._displayList[i] = value[i];
			}
			
			//在index不改变的情况下强制刷新 TO DO需要修改
			var displayIndexBackup:number = this._currentDisplayIndex;
			this._currentDisplayIndex = -1;
			this._changeDisplay(displayIndexBackup);
		}
		
		/**
		 * The DisplayObject belonging to this Slot instance. Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 */
		public get display():any{
			return this._currentDisplay;
		}
		public set display(value:any){
			if (this._currentDisplayIndex < 0){
				this._currentDisplayIndex = 0;
			}
			if(this._displayList[this._currentDisplayIndex] == value){
				return;
			}
			this._displayList[this._currentDisplayIndex] = value;
			this._updateSlotDisplay();
			this.updateChildArmatureAnimation();
			this._updateTransform();//是否可以延迟更新？
		}

        /**
         * Unrecommended API. Please use .display instead.
         * @returns {any}
         */
        public getDisplay():any
        {
            return this.display;
        }

        /**
         * Unrecommended API. Please use .display = instead.
         * @returns {any}
         */
        public setDisplay(value:any):void
        {
            this.display = value;
        }

		/**
		 * The sub-armature of this Slot instance.
		 */
		public get childArmature():Armature{
            if(this._displayList[this._currentDisplayIndex] instanceof Armature)
            {
                return <Armature><any> (this._displayList[this._currentDisplayIndex]);
            }
			return null;
		}
		public set childArmature(value:Armature){
			//设计的不好，要修改
			this.display = value;
		}
		
		/**
		 * zOrder. Support decimal for ensure dynamically added slot work toghther with animation controled slot.  
		 * @return zOrder.
		 */
		public get zOrder():number{
			return this._originZOrder + this._tweenZOrder + this._offsetZOrder;
		}
		public set zOrder(value:number){
			if(this.zOrder != value){
				this._offsetZOrder = value - this._originZOrder - this._tweenZOrder;
				if(this._armature){
					this._armature._slotsZOrderChanged = true;
				}
			}
		}
		
		/**
		 * blendMode
		 * @return blendMode.
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
			bMultiplier:number
		):void{
            this._colorTransform.alphaOffset = aOffset;
            this._colorTransform.redOffset = rOffset;
            this._colorTransform.greenOffset = gOffset;
            this._colorTransform.blueOffset = bOffset;
            this._colorTransform.alphaMultiplier = aMultiplier;
            this._colorTransform.redMultiplier = rMultiplier;
            this._colorTransform.greenMultiplier = gMultiplier;
            this._colorTransform.blueMultiplier = bMultiplier;
		}
		
		/**
		 * @private
		 * Update the blend mode of the display object.
		 * @param value The blend mode to use. 
		 */
		public _updateDisplayBlendMode(value:string):void{
			throw new Error("Abstract method needs to be implemented in subclass!");
		}
	}
}