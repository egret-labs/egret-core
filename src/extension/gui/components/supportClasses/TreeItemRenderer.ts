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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../ITreeItemRenderer.ts"/>
/// <reference path="ItemRenderer.ts"/>
/// <reference path="ToggleButtonBase.ts"/>
/// <reference path="../../core/ISkinnableClient.ts"/>
/// <reference path="../../events/TreeEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.TreeItemRenderer
	 * @classdesc
	 * Tree组件的项呈示器基类
	 * @extends ns_egret.ItemRenderer
	 * @implements ns_egret.ITreeItemRenderer
	 */
	export class TreeItemRenderer extends ItemRenderer implements ITreeItemRenderer{
		/**
		 * 构造函数
		 * @method ns_egret.TreeItemRenderer#constructor
		 */		
		public constructor(){
			super();
			this.addEventListener(TouchEvent.TOUCH_BEGAN,this.onItemMouseDown,this,false,1000);
		}
		
		private onItemMouseDown(event:TouchEvent):void{
			if(event.target==this.disclosureButton){
				event.stopImmediatePropagation();
			}
		}

		/**
		 * [SkinPart]图标显示对象
		 * @member ns_egret.TreeItemRenderer#iconDisplay
		 */
		public iconDisplay:ISkinnableClient;
		/**
		 * [SkinPart]子节点开启按钮
		 * @member ns_egret.TreeItemRenderer#disclosureButton
		 */
		public disclosureButton:ToggleButtonBase;
		/**
		 * [SkinPart]用于调整缩进值的容器对象。
		 * @member ns_egret.TreeItemRenderer#contentGroup
		 */
		public contentGroup:DisplayObject;
		
		private _indentation:number = 17;
		/**
		 * 子节点相对父节点的缩进值，以像素为单位。默认17。
		 * @member ns_egret.TreeItemRenderer#indentation
		 */
		public get indentation():number{
			return this._indentation;
		}
		public set indentation(value:number){
			this._indentation = value;
		}
		
		private _iconSkinName:any;
		/**
		 * @member ns_egret.TreeItemRenderer#iconSkinName
		 */
		public get iconSkinName():any{
			return this._iconSkinName;
		}
		public set iconSkinName(value:any){
			if(this._iconSkinName==value)
				return;
			this._iconSkinName = value;
			if(this.iconDisplay){
				this.iconDisplay.skinName = this._iconSkinName;
			}
		}

		private _depth:number = 0;
		/**
		 * @member ns_egret.TreeItemRenderer#depth
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
		
		private _hasChildren:boolean = false;
		/**
		 * @member ns_egret.TreeItemRenderer#hasChildren
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
		
		private _isOpen:boolean = false;
		/**
		 * @member ns_egret.TreeItemRenderer#opened
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
		 * @method ns_egret.TreeItemRenderer#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance==this.iconDisplay){
				this.iconDisplay.skinName = this._iconSkinName;
			}
			else if(instance==this.disclosureButton){
				this.disclosureButton.visible = this._hasChildren;
				this.disclosureButton.selected = this._isOpen;
				this.disclosureButton._autoSelected = false;
				this.disclosureButton.addEventListener(TouchEvent.TOUCH_BEGAN,
					this.disclosureButton_mouseDownHandler,
					this);
			}
			else if(instance==this.contentGroup){
				this.contentGroup.x = this._depth*this._indentation;
			}
		}
		
		/**
		 * @method ns_egret.TreeItemRenderer#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName,instance);
			if(instance==this.iconDisplay){
				this.iconDisplay.skinName = null;
			}
			else if(instance==this.disclosureButton){
				this.disclosureButton.removeEventListener(TouchEvent.TOUCH_BEGAN,
					this.disclosureButton_mouseDownHandler,
					this);
				this.disclosureButton._autoSelected = true;
				this.disclosureButton.visible = true;
			}
		}
		/**
		 * 鼠标在disclosureButton上按下
		 * @method ns_egret.TreeItemRenderer#disclosureButton_mouseDownHandler
		 * @param event {TouchEvent} 
		 */		
		public disclosureButton_mouseDownHandler(event:TouchEvent):void{
			var evt:TreeEvent = new TreeEvent(TreeEvent.ITEM_OPENING,
				false,true,this.itemIndex,this.data,this);
			evt.opening = !this._isOpen;
			this.dispatchEvent(evt);
		}
	}
}