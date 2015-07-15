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
	 * @class egret.gui.DropDownList
	 * @classdesc
	 * 不可输入的下拉列表控件。带输入功能的下拉列表控件，请使用ComboBox。
	 * @extends egret.gui.DropDownListBase
	 */	
	export class DropDownList extends DropDownListBase{
		/**
		 * 构造函数
		 * @method egret.gui.DropDownList#constructor
		 */		
		public constructor(){
			super();
            
		}
		
		/**
		 * [SkinPart]选中项文本
		 * @member egret.gui.DropDownList#labelDisplay
		 */		
		public labelDisplay:IDisplayText = null;
		
		private _prompt:string = "";
		/**
		 * 当没有选中项时在DropDownList上要显示的字符串。<p/>
		 * 它通常是一个类似于“请选择一项...”的文本。当下拉列表中的某个项目被选中后，会被替换为该选定项目中的文本。
		 * @member egret.gui.DropDownList#prompt
		 */		
		public get prompt():string{
			return this._prompt;
		}
		public set prompt(value:string){
			if (this._prompt == value)
				return;
			
			this._prompt = value;
			this._labelChanged = true;
			this.invalidateProperties();
		}
		
		/**
		 * 添加外观部件时调用
		 * @method egret.gui.DropDownList#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.labelDisplay){
				this._labelChanged = true;
				this.invalidateProperties();
			}
		}

		/**
		 * 绘制对象和/或设置其子项的大小和位置
		 * @param displayItem
		 */
		public updateLabelDisplay(displayItem:any = undefined):void{
			if (this.labelDisplay){
				if (displayItem == undefined)
					displayItem = this.selectedItem;
				if (displayItem != null && displayItem != undefined)
					this.labelDisplay.text = this.itemToLabel(displayItem);
				else
					this.labelDisplay.text = this._prompt;
			}   
		}
		
	}
	
}