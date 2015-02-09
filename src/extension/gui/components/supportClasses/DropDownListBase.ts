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


module egret.gui {

	/**
	 * @class egret.gui.DropDownListBase
	 * @classdesc
	 * 下拉列表控件基类
	 * @extends egret.gui.List
	 */	
	export class DropDownListBase extends List{
		/**
		 * 构造函数
		 * @method egret.gui.DropDownListBase#constructor
		 */		
		public constructor(){
			super();
			this._captureItemRenderer = false;
			this.dropDownController = new DropDownController();
		}
		
		/**
		 * [SkinPart]下拉区域显示对象
		 * @member egret.gui.DropDownListBase#dropDown
		 */		
        public dropDown: DisplayObject = null;
		/**
		 * [SkinPart]下拉触发按钮
		 * @member egret.gui.DropDownListBase#openButton
		 */		
        public openButton: ButtonBase = null;
		
		
		/**
		 * @constant egret.gui.DropDownListBase.PAGE_SIZE
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
		
        private _dropDownController: DropDownController = null; 
		/**
		 * 下拉控制器
		 * @member egret.gui.DropDownListBase#dropDownController
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
		 * @member egret.gui.DropDownListBase#isDropDownOpen
		 */		
		public get isDropDownOpen():boolean{
			if (this.dropDownController)
				return this.dropDownController.isOpen;
			else
				return false;
		}
		
		private _userProposedSelectedIndex:number = ListBase.NO_SELECTION;
				
		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.DropDownListBase#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this._labelChanged){
				this._labelChanged = false;
				this.updateLabelDisplay();
			}
		}
		
		/**
		 * 添加外观部件时调用
		 * @method egret.gui.DropDownListBase#partAdded
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
		 * 正删除外观部件的实例时调用
		 * @method egret.gui.DropDownListBase#partRemoved
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
		 * 返回要应用到外观的状态的名称
		 * @method egret.gui.DropDownListBase#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			return !this.enabled ? "disabled" : this.isDropDownOpen ? "open" : "normal";
		}   
		
		/**
		 * @method egret.gui.DropDownListBase#commitSelection
		 * @param dispatchChangedEvents {boolean} 
		 * @returns {boolean}
		 */
		public commitSelection(dispatchChangedEvents:boolean = true):boolean{
			var retVal:boolean = super.commitSelection(dispatchChangedEvents);
			this.updateLabelDisplay();
			return retVal; 
		}
		
		/**
		 * @method egret.gui.DropDownListBase#_isItemIndexSelected
		 * @param index {number} 
		 * @returns {boolean}
		 */
		public _isItemIndexSelected(index:number):boolean{
			return this._userProposedSelectedIndex == index;
		}
		/**
		 * 打开下拉列表并抛出UIEvent.OPEN事件。
		 * @method egret.gui.DropDownListBase#openDropDown
		 */		
		public openDropDown():void{
			this.dropDownController.openDropDown();
		}
		/**
		 * 关闭下拉列表并抛出UIEvent.CLOSE事件。
		 * @method egret.gui.DropDownListBase#closeDropDown
		 * @param commit {boolean} 
		 */		
		public closeDropDown(commit:boolean):void{
			this.dropDownController.closeDropDown(commit);
		}
		/**
		 * 更新选中项的提示文本
		 * @method egret.gui.DropDownListBase#updateLabelDisplay
		 * @param displayItem {any} 
		 */		
		public updateLabelDisplay(displayItem:any = undefined):void{
			
		}
		/**
		 * 改变高亮的选中项
		 * @param newIndex {number}
		 * @param scrollToTop {boolean} 
		 */		
		public _changeHighlightedSelection(newIndex:number, scrollToTop:boolean = false):void{
			this.itemSelected(this._userProposedSelectedIndex, false);
			this._userProposedSelectedIndex = newIndex;
			this.itemSelected(this._userProposedSelectedIndex, true);
		}

		public dataProvider_collectionChangeHandler(event:CollectionEvent):void{
			super.dataProvider_collectionChangeHandler(event);
			
			this._labelChanged = true;
			this.invalidateProperties();
		}
		
		/**
		 * @method egret.gui.DropDownListBase#item_mouseDownHandler
		 * @param event {TouchEvent} 
		 */
        public _item_touchEndHandler(event: TouchEvent): void {
            super._item_touchEndHandler(event);

            var itemRenderer: IItemRenderer = <IItemRenderer> (event.currentTarget);
            if (itemRenderer != this._mouseDownItemRenderer)
                return;
            this._dispatchListEvent(event, ListEvent.ITEM_CLICK, itemRenderer);
            this._userProposedSelectedIndex = this.selectedIndex;
            this.closeDropDown(true);
        }
		/**
		 * 控制器抛出打开列表事件
		 */
		public _dropDownController_openHandler(event:UIEvent):void{
			this.addEventListener(UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
			this._userProposedSelectedIndex = this.selectedIndex;
			this.invalidateSkinState();  
		}
		/**
		 * 打开列表后组件一次失效验证全部完成
		 */
		public _open_updateCompleteHandler(event:UIEvent):void{
			this.removeEventListener(UIEvent.UPDATE_COMPLETE, this._open_updateCompleteHandler, this);
			UIEvent.dispatchUIEvent(this,UIEvent.OPEN);
		}
		/**
		 * 控制器抛出关闭列表事件
		 * @method egret.gui.DropDownListBase#dropDownController_closeHandler
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