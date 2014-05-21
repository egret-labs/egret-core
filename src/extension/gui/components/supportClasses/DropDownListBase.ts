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
/// <reference path="../../collections/ICollection.ts"/>
/// <reference path="../IItemRenderer.ts"/>
/// <reference path="../List.ts"/>
/// <reference path="ButtonBase.ts"/>
/// <reference path="DropDownController.ts"/>
/// <reference path="ListBase.ts"/>
/// <reference path="../../events/CollectionEvent.ts"/>
/// <reference path="../../events/ListEvent.ts"/>
/// <reference path="../../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.DropDownListBase
	 * @classdesc
	 * 下拉列表控件基类
	 * @extends ns_egret.List
	 */	
	export class DropDownListBase extends List{
		/**
		 * 构造函数
		 * @method ns_egret.DropDownListBase#constructor
		 */		
		public constructor(){
			super();
			this._captureItemRenderer = false;
			this.dropDownController = new DropDownController();
		}
		
		/**
		 * [SkinPart]下拉区域显示对象
		 * @member ns_egret.DropDownListBase#dropDown
		 */		
		public dropDown:DisplayObject;
		/**
		 * [SkinPart]下拉触发按钮
		 * @member ns_egret.DropDownListBase#openButton
		 */		
		public openButton:ButtonBase;
		
		
		/**
		 * @constant ns_egret.DropDownListBase.PAGE_SIZE
		 */
		public static PAGE_SIZE:number = 5;
		
		/**
		 * 文本改变标志
		 */		
		public _labelChanged:boolean = false;
		
		/**
		 * @inheritDoc
		 */
		public _setDataProvider(value:ICollection){
			if (this.dataProvider === value)
				return;
			
			super._setDataProvider(value);
			this._labelChanged = true;
			this.invalidateProperties();
		}
		/**
		 * @inheritDoc
		 */
		public _setLabelField(value:string){
			if (this.labelField == value)
				return;
			
			super._setLabelField(value);
			this._labelChanged = true;
			this.invalidateProperties();
		}
		/**
		 * @inheritDoc
		 */
		public _setLabelFunction(value:Function){
			if (this.labelFunction == value)
				return;
			
			super._setLabelFunction(value);
			this._labelChanged = true;
			this.invalidateProperties();
		}
		
		private _dropDownController:DropDownController; 
		/**
		 * 下拉控制器
		 * @member ns_egret.DropDownListBase#dropDownController
		 */		
		public get dropDownController():DropDownController{
			return this._dropDownController;
		}
		
		public set dropDownController(value:DropDownController){
			if (this._dropDownController == value)
				return;
			
			this._dropDownController = value;
			
			this._dropDownController.addEventListener(UIEvent.OPEN, this._dropDownController_openHandler, this);
			this._dropDownController.addEventListener(UIEvent.CLOSE, this.dropDownController_closeHandler, this);
			
			if (this.openButton)
				this._dropDownController.openButton = this.openButton;
			if (this.dropDown)
				this._dropDownController.dropDown = this.dropDown;    
		}
		/**
		 * 下拉列表是否已经已打开
		 * @member ns_egret.DropDownListBase#isDropDownOpen
		 */		
		public get isDropDownOpen():boolean{
			if (this.dropDownController)
				return this.dropDownController.isOpen;
			else
				return false;
		}
		
		private _userProposedSelectedIndex:number = ListBase.NO_SELECTION;
				
		/**
		 * @method ns_egret.DropDownListBase#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this._labelChanged){
				this._labelChanged = false;
				this.updateLabelDisplay();
			}
		}
		
		/**
		 * @method ns_egret.DropDownListBase#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.openButton){
				if (this.dropDownController)
					this.dropDownController.openButton = this.openButton;
			}
			else if (instance == this.dropDown && this.dropDownController){
				this.dropDownController.dropDown = this.dropDown;
			}
		}
		
		/**
		 * @method ns_egret.DropDownListBase#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{
			if (this.dropDownController){
				if (instance == this.openButton)
					this.dropDownController.openButton = null;
				
				if (instance == this.dropDown)
					this.dropDownController.dropDown = null;
			}
			
			super.partRemoved(partName, instance);
		}
		
		/**
		 * @method ns_egret.DropDownListBase#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			return !this.enabled ? "disabled" : this.isDropDownOpen ? "open" : "normal";
		}   
		
		/**
		 * @method ns_egret.DropDownListBase#commitSelection
		 * @param dispatchChangedEvents {boolean} 
		 * @returns {boolean}
		 */
		public commitSelection(dispatchChangedEvents:boolean = true):boolean{
			var retVal:boolean = super.commitSelection(dispatchChangedEvents);
			this.updateLabelDisplay();
			return retVal; 
		}
		
		/**
		 * @method ns_egret.DropDownListBase#_isItemIndexSelected
		 * @param index {number} 
		 * @returns {boolean}
		 */
		public _isItemIndexSelected(index:number):boolean{
			return this._userProposedSelectedIndex == index;
		}
		/**
		 * 打开下拉列表并抛出UIEvent.OPEN事件。
		 * @method ns_egret.DropDownListBase#openDropDown
		 */		
		public openDropDown():void{
			this.dropDownController.openDropDown();
		}
		/**
		 * 关闭下拉列表并抛出UIEvent.CLOSE事件。
		 * @method ns_egret.DropDownListBase#closeDropDown
		 * @param commit {boolean} 
		 */		
		public closeDropDown(commit:boolean):void{
			this.dropDownController.closeDropDown(commit);
		}
		/**
		 * 更新选中项的提示文本
		 * @method ns_egret.DropDownListBase#updateLabelDisplay
		 * @param displayItem {any} 
		 */		
		public updateLabelDisplay(displayItem:any = undefined):void{
			
		}
		/**
		 * 改变高亮的选中项
		 * @method ns_egret.DropDownListBase#_changeHighlightedSelection
		 * @param newIndex {number} 
		 * @param scrollToTop {boolean} 
		 */		
		public _changeHighlightedSelection(newIndex:number, scrollToTop:boolean = false):void{
			this.itemSelected(this._userProposedSelectedIndex, false);
			this._userProposedSelectedIndex = newIndex;
			this.itemSelected(this._userProposedSelectedIndex, true);
		}
		
		/**
		 * @method ns_egret.DropDownListBase#dataProvider_collectionChangeHandler
		 * @param event {CollectionEvent} 
		 */
		public dataProvider_collectionChangeHandler(event:CollectionEvent):void{       
			super.dataProvider_collectionChangeHandler(event);
			
			this._labelChanged = true;
			this.invalidateProperties();
		}
		
		/**
		 * @method ns_egret.DropDownListBase#item_mouseDownHandler
		 * @param event {TouchEvent} 
		 */
		public item_mouseDownHandler(event:TouchEvent):void{
			super.item_mouseDownHandler(event);
			
			var itemRenderer:IItemRenderer = <IItemRenderer><any> (event.currentTarget);
			this._dispatchListEvent(event,ListEvent.ITEM_CLICK,itemRenderer);
			
			this._userProposedSelectedIndex = this.selectedIndex;
			this.closeDropDown(true);
		}
		/**
		 * 控制器抛出打开列表事件
		 * @method ns_egret.DropDownListBase#_dropDownController_openHandler
		 * @param event {UIEvent} 
		 */		
		public _dropDownController_openHandler(event:UIEvent):void{
			this.addEventListener(UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
			this._userProposedSelectedIndex = this.selectedIndex;
			this.invalidateSkinState();  
		}
		/**
		 * 打开列表后组件一次失效验证全部完成
		 * @method ns_egret.DropDownListBase#_open_updateCompleteHandler
		 * @param event {UIEvent} 
		 */		
		public _open_updateCompleteHandler(event:UIEvent):void{   
			this.removeEventListener(UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
			UIEvent.dispatchUIEvent(this,UIEvent.OPEN);
		}
		/**
		 * 控制器抛出关闭列表事件
		 * @method ns_egret.DropDownListBase#dropDownController_closeHandler
		 * @param event {UIEvent} 
		 */		
		public dropDownController_closeHandler(event:UIEvent):void{
			this.addEventListener(UIEvent.UPDATE_COMPLETE, this.close_updateCompleteHandler, this);
			this.invalidateSkinState();
			
			if (!event.isDefaultPrevented()){
				this._setSelectedIndex(this._userProposedSelectedIndex, true);
			}
			else{
				this._changeHighlightedSelection(this.selectedIndex);
			}
		}
		/**
		 * 关闭列表后组件一次失效验证全部完成
		 */		
		private close_updateCompleteHandler(event:UIEvent):void{   
			this.removeEventListener(UIEvent.UPDATE_COMPLETE, this.close_updateCompleteHandler, this);
			UIEvent.dispatchUIEvent(this,UIEvent.CLOSE);
		}
	}
	
}