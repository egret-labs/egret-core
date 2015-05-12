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


module egret.gui {

	/**
	 * @class egret.gui.TreeItemRenderer
	 * @classdesc
	 * Tree组件的项呈示器基类
	 * @extends egret.gui.ItemRenderer
	 * @implements egret.gui.ITreeItemRenderer
	 */
	export class TreeItemRenderer extends ItemRenderer implements ITreeItemRenderer{
		/**
		 * 构造函数
		 * @method egret.gui.TreeItemRenderer#constructor
		 */		
		public constructor(){
			super();
            
			this.addEventListener(TouchEvent.TOUCH_BEGIN,this.onItemMouseDown,this,false,1000);
		}
		
		private onItemMouseDown(event:TouchEvent):void{
			if(event.target==this.disclosureButton){
				event.stopImmediatePropagation();
			}
		}

		/**
		 * [SkinPart]图标显示对象
		 * @member egret.gui.TreeItemRenderer#iconDisplay
		 */
        public iconDisplay: UIAsset = null;
		/**
		 * [SkinPart]子节点开启按钮
		 * @member egret.gui.TreeItemRenderer#disclosureButton
		 */
        public disclosureButton: ToggleButtonBase = null;
		/**
		 * [SkinPart]用于调整缩进值的容器对象。
		 * @member egret.gui.TreeItemRenderer#contentGroup
		 */
        public contentGroup: DisplayObject = null;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		private _indentation:number = 17;
		/**
		 * 子节点相对父节点的缩进值，以像素为单位。默认17。
		 * @member egret.gui.TreeItemRenderer#indentation
		 */
		public get indentation():number{
			return this._indentation;
		}
		public set indentation(value:number){
			this._indentation = value;
		}

		/**
		 *
		 * @type {null}
		 * @private
		 */
        private _iconSkinName: any = null;
		/**
		 * @member egret.gui.TreeItemRenderer#iconSkinName
		 */
		public get iconSkinName():any{
			return this._iconSkinName;
		}
		public set iconSkinName(value:any){
			if(this._iconSkinName==value)
				return;
			this._iconSkinName = value;
			if(this.iconDisplay){
				this.iconDisplay.source = this._iconSkinName;
			}
		}

		/**
		 *
		 * @type {number}
		 * @private
		 */
		private _depth:number = 0;
		/**
		 * @member egret.gui.TreeItemRenderer#depth
		 */
		public get depth():number{
			return this._depth;
		}
		public set depth(value:number){
			if(value==this._depth)
				return;
			this._depth = value;
			if(this.contentGroup){
				this.contentGroup.x = this._depth*this._indentation;
			}
		}

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		private _hasChildren:boolean = false;
		/**
		 * @member egret.gui.TreeItemRenderer#hasChildren
		 */
		public get hasChildren():boolean{
			return this._hasChildren;
		}
		public set hasChildren(value:boolean){
			if(this._hasChildren==value)
				return;
			this._hasChildren = value;
			if(this.disclosureButton){
				this.disclosureButton.visible = this._hasChildren;
			}
		}

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		private _isOpen:boolean = false;
		/**
		 * @member egret.gui.TreeItemRenderer#opened
		 */
		public get opened():boolean{
			return this._isOpen;
		}
		public set opened(value:boolean){
			if(this._isOpen==value)
				return;
			this._isOpen = value;
			if(this.disclosureButton){
				this.disclosureButton.selected = this._isOpen;
			}
		}

		/**
		 * 添加外观部件时调用
		 * @method egret.gui.TreeItemRenderer#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance==this.iconDisplay){
				this.iconDisplay.source = this._iconSkinName;
			}
			else if(instance==this.disclosureButton){
				this.disclosureButton.visible = this._hasChildren;
				this.disclosureButton.selected = this._isOpen;
				this.disclosureButton._autoSelected = false;
				this.disclosureButton.addEventListener(TouchEvent.TOUCH_BEGIN,
					this.disclosureButton_mouseDownHandler,
					this);
			}
			else if(instance==this.contentGroup){
				this.contentGroup.x = this._depth*this._indentation;
			}
		}
		
		/**
		 * 删除外观部件的实例时调用
		 * @method egret.gui.TreeItemRenderer#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName,instance);
			if(instance==this.iconDisplay){
				this.iconDisplay.source = null;
			}
			else if(instance==this.disclosureButton){
				this.disclosureButton.removeEventListener(TouchEvent.TOUCH_BEGIN,
					this.disclosureButton_mouseDownHandler,
					this);
				this.disclosureButton._autoSelected = true;
				this.disclosureButton.visible = true;
			}
		}
		/**
		 * 鼠标在disclosureButton上按下
		 * @method egret.gui.TreeItemRenderer#disclosureButton_mouseDownHandler
		 * @param event {TouchEvent} 
		 */		
		public disclosureButton_mouseDownHandler(event:TouchEvent):void{
            TreeEvent.dispatchTreeEvent(this,
                TreeEvent.ITEM_OPENING,this.itemIndex,this.data,this,!this._isOpen,false,true);
		}
	}
}