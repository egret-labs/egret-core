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
     * @class dragonBones.Slot
     * @classdesc
     * Slot 实例是骨头上的一个插槽，是显示图片的容器。
     * 一个 Bone 上可以有多个Slot，每个Slot中同一时间都会有一张图片用于显示，不同的Slot中的图片可以同时显示。
     * 每个 Slot 中可以包含多张图片，同一个 Slot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
     * @extends dragonBones.DBObject
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     *
     * @example
       <pre>
        //获取动画数据 本例使用Knight例子.
        //资源下载地址http://dragonbones.github.io/download_forwarding.html?download_url=downloads/dragonbonesdemos_v2.4.zip
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
        //这个资源需要自己准备
        var horseHat = RES.getRes("horseHat");
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[1].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        armatureDisplay.x = 200;
        armatureDisplay.y = 300;
        this.addChild(armatureDisplay);

        //以下四句代码，实现给骨骼添加slot的功能
        //1.获取马头的骨骼
        var horseHead:dragonBones.Bone = armature.getBone("horseHead");
        //2.创建一个slot
        var horseHatSlot:dragonBones.EgretSlot = new dragonBones.EgretSlot();
        //3.给这个slot赋一个图片
        horseHatSlot.display = new egret.Bitmap(horseHat);
        //4.把这个slot添加到骨骼上
        horseHead.addSlot(horseHatSlot);

        //以下3句代码，实现了子骨骼的获取和播放子骨架的动画
        //1.获取包含子骨架的骨骼
        var weaponBone:dragonBones.Bone = armature.getBone("armOutside");
        //2.获取骨骼上的子骨架
        var childArmature:dragonBones.Armature = weaponBone.childArmature;
        //3.播放子骨架的动画
        childArmature.animation.gotoAndPlay("attack_sword_1",0,-1,0);


        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
	export class Slot extends DBObject{
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

		//TO DO: 以后把这两个属性变成getter
		//另外还要处理 isShowDisplay 和 visible的矛盾
		public _currentDisplay:any;
		public _isShowDisplay:boolean;
		
		//protected var _childArmature:Armature;
		public _blendMode:string;
		public _isColorChanged:boolean;
		public _needUpdate:boolean;
		public _timelineStateList:Array<SlotTimelineState>

		public constructor(self:Slot){
			super();
			
			if(self != this){
				throw new Error(egret.getString(4001));
			}
			
			this._displayList = [];
			this._timelineStateList = [];
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

        /**
         * 通过传入 SlotData 初始化Slot
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
			
			this._displayList.length = 0;
			
			this._displayDataList = null;
			this._displayList = null;
			this._currentDisplay = null;
			//_childArmature = null;
		}

		private sortState(state1:SlotTimelineState, state2:SlotTimelineState):number{
			return state1._animationState.layer < state2._animationState.layer?-1:1;
		}

		/** @private */
		public _addState(timelineState:SlotTimelineState):void{
			if(this._timelineStateList.indexOf(timelineState) < 0){
				this._timelineStateList.push(timelineState);
				this._timelineStateList.sort(this.sortState);
			}
		}

		/** @private */
		public _removeState(timelineState:SlotTimelineState):void{
			var index:number = this._timelineStateList.indexOf(timelineState);
			if(index >= 0){
				this._timelineStateList.splice(index, 1);
			}
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
			if(this._parent._needUpdate <= 0 && !this._needUpdate){
				return;
			}

            this._updateGlobal();
            this._updateTransform();
			this._needUpdate = false;
		}

        public _calculateRelativeParentTransform():void
        {
            this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
            this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;
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
					this._needUpdate = true;
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
                    this._colorTransform.alphaMultiplier, this._colorTransform.redMultiplier, this._colorTransform.greenMultiplier, this._colorTransform.blueMultiplier, true)
				this._updateDisplayVisible(this._visible);
				this._updateTransform();
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
         * 显示对象列表(包含 display 或者 子骨架)
         * @member {any[]} dragonBones.Slot#displayList
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
         * 当前的显示对象(可能是 display 或者 子骨架)
         * @member {any} dragonBones.Slot#display
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
         * 不推荐的 API. 使用 display 属性代替
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
         * 当前的子骨架
         * @member {Armature} dragonBones.Slot#childArmature
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
		 * 显示顺序。(支持小数用于实现动态插入slot)
         * @member {number} dragonBones.Slot#zOrder
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
		 * 混合模式
         * @member {string} dragonBones.Slot#blendMode
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
			throw new Error("");
		}
		
		/**
		 * @private
		 */
		public _getDisplayIndex():number{
			throw new Error(egret.getString(4001));
		}
		
		/**
		 * @private
		 * Adds the original display object to another display object.
		 * @param container
		 * @param index
		 */
		public _addDisplayToContainer(container:any, index:number = -1):void{
			throw new Error(egret.getString(4001));
		}
		
		/**
		 * @private
		 * remove the original display object from its parent.
		 */
		public _removeDisplayFromContainer():void{
			throw new Error(egret.getString(4001));
		}
		
		/**
		 * @private
		 * Updates the transform of the slot.
		 */
		public _updateTransform():void{
			throw new Error(egret.getString(4001));
		}
		
		/**
		 * @private
		 */
		public _updateDisplayVisible(value:boolean):void{
			/**
			 * bone.visible && slot.visible && updateVisible
			 * this._parent.visible && this._visible && value;
			 */
			throw new Error(egret.getString(4001));
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

		/** @private When bone timeline enter a key frame, call this func*/
		public _arriveAtFrame(frame:Frame, timelineState:SlotTimelineState, animationState:AnimationState, isCross:boolean):void{
			var displayControl:boolean = animationState.displayControl && 
										 animationState.containsBoneMask(this.parent.name);

			if(displayControl){
				var slotFrame:SlotFrame = <SlotFrame><any> frame;
				var displayIndex:number = slotFrame.displayIndex;
				var childSlot:Slot;
				this._changeDisplay(displayIndex);
				this._updateDisplayVisible(slotFrame.visible);
				if(displayIndex >= 0)
				{
					if(!isNaN(slotFrame.zOrder) && slotFrame.zOrder != this._tweenZOrder)
					{
						this._tweenZOrder = slotFrame.zOrder;
						this._armature._slotsZOrderChanged = true;
					}
				}
				//[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.
				//后续会扩展更多的action，目前只有gotoAndPlay的含义
				if(frame.action) {
					if(this.childArmature){
						this.childArmature.animation.gotoAndPlay(frame.action);
					}
				}
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
			this._changeDisplay(this._originDisplayIndex);
			this._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, true);
		}
	}
}