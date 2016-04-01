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
    export class FastSlot extends FastDBObject implements ISlotCacheGenerator {
        /** @private Need to keep the reference of DisplayData. When slot switch displayObject, it need to restore the display obect's origional pivot. */
        //public _displayDataList:Array<DisplayData>;
        /** @private */
        public _originZOrder: number;
        /** @private */
        public _tweenZOrder: number;
        /** @private */
        public _offsetZOrder: number;
        /** @private */
        public _originDisplayIndex: number;

        /** @private */
        public _gotoAndPlay: string;
        public _defaultGotoAndPlay: string;
        public hasChildArmature: boolean = false;

        public _isColorChanged: boolean;
        public _colorTransform: ColorTransform;
        public _blendMode: string;

        // modify display index change 
        public _displayIndex: number = -1;
        public _rawDisplay: any = null;
        public _display: any = null;
        public _childArmature: FastArmature = null;
        public _displayList: Array<any> = [];
        public _displayDataList: Array<[DisplayData, TextureData]> = [];

        public timelineCache: TimelineCache;

        public constructor(rawDisplay: any) {
            super();
            this.hasChildArmature = false;
            this.inheritRotation = true;
            this.inheritScale = true;

            this._originZOrder = 0;
            this._tweenZOrder = 0;
            this._offsetZOrder = 0;
            this._colorTransform = new ColorTransform();
            this._isColorChanged = false;

            this._rawDisplay = rawDisplay;
        }

		/**
		 * 通过传入 SlotData 初始化FastSlot
		 * @param slotData
		 */
        public initWithSlotData(slotData: SlotData): void {
            this.name = slotData.name;
            this.blendMode = slotData.blendMode;
            this._defaultGotoAndPlay = slotData.gotoAndPlay;
            this._originZOrder = slotData.zOrder;
            this._originDisplayIndex = slotData.displayIndex;
        }
		
		/**
		 * @inheritDoc
		 */
        public dispose(): void {
            if (!this._displayList) {
                return;
            }

            super.dispose();

            this._rawDisplay = null;
            this._display = null;
            this._childArmature = null;
            this._displayDataList = null;
            this._displayList = null;
        }
		
        //动画
        /** @private */
        public updateByCache(frameIndex: number = 0): void {
            
            this._frameCache = this.timelineCache.frameCacheList[frameIndex];

            super.updateByCache();
            this._updateTransform();

            
            //颜色
            var cacheColor: ColorTransform = (<SlotFrameCache><any>(this._frameCache)).colorTransform;
            var cacheColorChanged: boolean = cacheColor != null;
            if (
                this.colorChanged != cacheColorChanged ||
                (this.colorChanged && cacheColorChanged && !ColorTransformUtil.isEqual(this._colorTransform, cacheColor))
            ){
                cacheColor = cacheColor || ColorTransformUtil.originalColor;
                this._updateDisplayColor(
                    cacheColor.alphaOffset,
                    cacheColor.redOffset,
                    cacheColor.greenOffset,
                    cacheColor.blueOffset,
                    cacheColor.alphaMultiplier,
                    cacheColor.redMultiplier,
                    cacheColor.greenMultiplier,
                    cacheColor.blueMultiplier,
                    cacheColorChanged
                );
            }
            var cacheDisplayIndex = (<SlotFrameCache><any>(this._frameCache)).displayIndex;
            if (cacheDisplayIndex != this._displayIndex) {
                this.displayIndex = cacheDisplayIndex;
            }
            
            this.gotoAndPlay = (<SlotFrameCache><any>(this._frameCache)).gotoAndPlay;
        }
		
        /** @private */
        public _update(needUpdate: boolean = false): void {
            if (this._parent && (this._parent._needUpdate > 0 || needUpdate)) {
                var result: ParentTransformObject = this._updateGlobal();
                if (result) {
                    result.release();
                }
                this._updateTransform();
            }
        }

        public _calculateRelativeParentTransform(): void {
            this._global.copy(this._origin);
            this._global.x += this._parent._tweenPivot.x;
            this._global.y += this._parent._tweenPivot.y;
        }

        public updateChildArmatureAnimation(): void {
            if (this.childArmature) {
                if (this._displayIndex >= 0) {
                    var curAnimation: string = this._gotoAndPlay;
                    if (curAnimation == null) {
                        curAnimation = this._defaultGotoAndPlay;
                        if (curAnimation == null) {
                            this.childArmature.armatureData.defaultAnimation;
                        }
                    }
                    if (curAnimation == null) {
                        if (this.armature && this.armature.animation.lastAnimationState) {
                            curAnimation = this.armature.animation.lastAnimationState.name;
                        }
                    }
                    if (curAnimation && this.childArmature.animation.hasAnimation(curAnimation)) {
                        this.childArmature.animation.gotoAndPlay(curAnimation);
                    }
                    else {
                        this.childArmature.animation.play();
                    }
                }
                else {
                    this.childArmature.animation.stop();
                    this.childArmature.animation._lastAnimationState = null;
                }
            }
        }
        
        // modify changeDisplay
        /** @private */
        public changeDisplay(): void {
            const prevDisplay: Object = this._display;
            const prevChildArmature: FastArmature = this._childArmature;
            if (this._displayIndex < 0 || this._displayIndex >= this._displayList.length) {
                this._display = this._rawDisplay;
            }
            else {
                this._display = this._displayList[this._displayIndex];
            }

            if (this._display instanceof FastArmature) {
                this._childArmature = this._display as FastArmature;
                this._display = (this._display as FastArmature).display;
            }
            else {
                this._childArmature = null;
                if (!this._display) {
                    this._display = this._rawDisplay;
                }
            }

            if (this._childArmature != prevChildArmature) {
                if (this._childArmature) {
                    this._childArmature.animation.play();
                }
                else {
                    //prevChildArmature.animation.reset();
                }
            }

            if (this._display != prevDisplay) {
                this._updateDisplay(this._display);
                if (this.armature) {
                    if (prevDisplay) {
                        this._replaceDisplay(prevDisplay);
                    }
                    else {
                        this._addDisplay();
                    }
                }

                this._updateDisplayBlendMode(this._blendMode);
                //this._updateVisible();
                this._updateDisplayColor(
                    this._colorTransform.alphaOffset,
                    this._colorTransform.redOffset,
                    this._colorTransform.greenOffset,
                    this._colorTransform.blueOffset,
                    this._colorTransform.alphaMultiplier,
                    this._colorTransform.redMultiplier,
                    this._colorTransform.greenMultiplier,
                    this._colorTransform.blueMultiplier
                );
            }

            if (this._display == this._rawDisplay) {
                this._updateFrame();
            }

            if (this._displayIndex >= 0) {
                this._origin.copy(this._displayDataList[this._displayIndex][0].transform);
            }
            if (this.armature && !this.armature._useCache)
            {
                this._update(true);
            }
        }
		
        /** @private */
        public set visible(value: boolean) {
            if (this._visible != value) {
                this._visible = value;
                this._updateDisplayVisible(this._visible);
            }
        }

        public get displayIndex(): number {
            return this._displayIndex;
        }
        public set displayIndex(value: number) {
            if (this._displayIndex == value) {
                return;
            }
            
            this._displayIndex = value;
            this.changeDisplay();
        }

		/**
		 * 当前的显示对象(可能是 display 或者 子骨架)
		 * @member {any} dragonBones.FastSlot#display
		 */
        public get display(): any {
            return this._display;
        }
        public set display(value: any) {
            const displayListLength = this._displayList.length;
            if (this._displayIndex >= displayListLength) {
                if (displayListLength == 0) {
                    this._displayList[0] = value;
                }
                else {
                    this._displayList[displayListLength - 1] = value;
                }
            }
            else {
                this._displayList[this._displayIndex] = value;
            }
            
            if (this._displayIndex >= 0) {
                this.changeDisplay();
            }
        }

		/**
		 * 当前的子骨架
		 * @member {FastArmature} dragonBones.Slot#childArmature
		 */
        public get childArmature(): any {
            return this._childArmature;
        }

        public set childArmature(value: any) {
            if (this._childArmature == value) {
                return;
            }

            this.display = value;
        }

        public get displayDataList(): Array<[DisplayData, TextureData]> {
            return this._displayDataList;
        }
        public set displayDataList(value: Array<[DisplayData, TextureData]>) {
            if (this._displayDataList != value) {
                if (value && value.length) {
                    this._displayDataList.length = value.length;
                    for (var i = 0, l = this._displayDataList.length; i < l; ++i) {
                        this._displayDataList[i] = value[i];
                    }
                }
                else {
                    this._displayDataList.length = 0;
                }
            }
        }

		/**
		 * 显示对象列表(包含 display 或者 子骨架)
		 * @member {any[]} dragonBones.FastSlot#displayList
		 */
        public get displayList(): Array<any> {
            return this._displayList;
        }
        public set displayList(value: Array<any>) {
            if (this._displayList != value) {
                if (value && value.length) {
                    this._displayList.length = value.length;
                    for (var i = 0, l = this._displayList.length; i < l; ++i) {
                        this._displayList[i] = value[i];
                    }
                }
                else {
                    this._displayList.length = 0;
                }
            }

            this.changeDisplay();
        }

		/**
		 * 显示顺序。(支持小数用于实现动态插入slot)
		 * @member {number} dragonBones.FastSlot#zOrder
		 */
        public get zOrder(): number {
            return this._originZOrder + this._tweenZOrder + this._offsetZOrder;
        }
        public set zOrder(value: number) {
            if (this.zOrder != value) {
                this._offsetZOrder = value - this._originZOrder - this._tweenZOrder;
                if (this.armature) {
                    this.armature._slotsZOrderChanged = true;
                }
            }
        }

		/**
		 * 混合模式
		 * @member {string} dragonBones.FastSlot#blendMode
		 */
        public get blendMode(): string {
            return this._blendMode;
        }
        public set blendMode(value: string) {
            if (this._blendMode != value) {
                this._blendMode = value;
                this._updateDisplayBlendMode(this._blendMode);
            }
        }
		
        /**
         * 播放子骨架动画
		 * @member {string} dragonBones.FastSlot#gotoAndPlay
         */
        public set gotoAndPlay(value: string) {
            if (this._gotoAndPlay != value) {
                this._gotoAndPlay = value;
                this.updateChildArmatureAnimation();
            }
        }

        public get colorTransform(): ColorTransform {
            return this._colorTransform;
        }

        public get colorChanged(): boolean {
            return this._isColorChanged;
        }

        public get gotoAndPlay(): string {
            return this._gotoAndPlay;
        }
        //Abstract method
        /** @private */
        public _updateDisplay(value: any): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
        
        /** @private */
        public _addDisplay(): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
        /** @private */
        public _replaceDisplay(prevDisplay: any): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
        /** @private */
        public _removeDisplay(): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
        /** @private */
        public _getDisplayIndex(): number {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
		/**
		 * @private
		 * Adds the original display object to another display object.
		 * @param container
		 * @param index
		 */
        public _addDisplayToContainer(container: any, index: number = -1): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
		/**
		 * @private
		 * remove the original display object from its parent.
		 */
        public _removeDisplayFromContainer(): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
		/**
		 * @private
		 * Updates the transform of the slot.
		 */
        public _updateTransform(): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
        
		/**
		 * @private
		 * Updates the frame of the slot.
		 */
        public _updateFrame(): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
		/**
		 * @private
		 */
        public _updateDisplayVisible(value: boolean): void {
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
            aOffset: number,
            rOffset: number,
            gOffset: number,
            bOffset: number,
            aMultiplier: number,
            rMultiplier: number,
            gMultiplier: number,
            bMultiplier: number,
            colorChanged: boolean = false
        ): void {
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
        public _updateDisplayBlendMode(value: string): void {
            throw new Error("Abstract method needs to be implemented in subclass!");
        }
		
        /** @private When slot timeline enter a key frame, call this func*/
        public _arriveAtFrame(frame: Frame, animationState: FastAnimationState): void {
            var slotFrame: SlotFrame = <SlotFrame><any>frame;
            this.displayIndex = slotFrame.displayIndex;
            this._updateDisplayVisible(slotFrame.visible);
            if (this._displayIndex >= 0) {
                if (!isNaN(slotFrame.zOrder) && slotFrame.zOrder != this._tweenZOrder) {
                    this._tweenZOrder = slotFrame.zOrder;
                    this.armature._slotsZOrderChanged = true;
                }
            }
            //[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
            //后续会扩展更多的action，目前只有gotoAndPlay的含义
            if (frame.action) {
                var targetArmature: FastArmature = this.childArmature;
                if (targetArmature) {
                    targetArmature.getAnimation().gotoAndPlay(frame.action);
                }
            }
            else if (slotFrame.gotoAndPlay) {
                this.gotoAndPlay = slotFrame.gotoAndPlay;
            }
        }
		
        /** @private */
        public hideSlots(): void {
            this.displayIndex = -1;
            if (this._frameCache) {
                this._frameCache.clear();
            }
        }

        public _updateGlobal(): any {
            this._calculateRelativeParentTransform();
            TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix);

            var output: any = this._calculateParentTransform();
            if (output) {
                this._globalTransformMatrix.concat(output.parentGlobalTransformMatrix);
                TransformUtil.matrixToTransform(this._globalTransformMatrix, this._global, this._global.scaleX * output.parentGlobalTransform.scaleX >= 0, this._global.scaleY * output.parentGlobalTransform.scaleY >= 0);
            }
            return output;
        }

        public _resetToOrigin(): void {
            this.displayIndex = this._originDisplayIndex;
            this._updateDisplayColor(0, 0, 0, 0, 1, 1, 1, 1, true);
        }
    }
}