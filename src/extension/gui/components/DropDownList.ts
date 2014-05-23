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

/// <reference path="supportClasses/DropDownListBase.ts"/>
/// <reference path="../core/IDisplayText.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.DropDownList
	 * @classdesc
	 * 不可输入的下拉列表控件。带输入功能的下拉列表控件，请使用ComboBox。
	 * @see org.flexlite.domUI.components.ComboBox
	 * @extends ns_egret.DropDownListBase
	 */	
	export class DropDownList extends DropDownListBase{
		/**
		 * 构造函数
		 * @method ns_egret.DropDownList#constructor
		 */		
		public constructor(){
			super();
            this.hostComponentKey = "ns_egret.DropDownList";
		}
		
		/**
		 * [SkinPart]选中项文本
		 * @member ns_egret.DropDownList#labelDisplay
		 */		
		public labelDisplay:IDisplayText;
		
		private _prompt:string = "";
		/**
		 * 当没有选中项时在DropDownList上要显示的字符串。<p/>
		 * 它通常是一个类似于“请选择一项...”的文本。当下拉列表中的某个项目被选中后，会被替换为该选定项目中的文本。
		 * @member ns_egret.DropDownList#prompt
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
		 * @method ns_egret.DropDownList#partAdded
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
		 * @method ns_egret.DropDownList#updateLabelDisplay
		 * @param displayItem {any} 
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