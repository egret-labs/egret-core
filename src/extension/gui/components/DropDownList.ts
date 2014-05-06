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

	export class DropDownList extends DropDownListBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		

		/**
		 * [SkinPart]选中项文本
		 */		
		public labelDisplay:IDisplayText;
		/**
		 * label发生改变标志
		 */		
		private labelChanged:boolean = false;
		
		private _prompt:string = "";
		/**
		 * 当没有选中项时在DropDownList上要显示的字符串。<p/>
		 * 它通常是一个类似于“请选择一项...”的文本。当下拉列表中的某个项目被选中后，会被替换为该选定项目中的文本。
		 */		
		public get prompt():string{
			return this._prompt;
		}
		public set prompt(value:string){
			if (this._prompt == value)
				return;
			
			this._prompt = value;
			this.labelChanged = true;
			this.invalidateProperties();
		}
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this.labelChanged){
				this.labelChanged = false;
				this.updateLabelDisplay();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.labelDisplay){
				this.labelChanged = true;
				this.invalidateProperties();
			}
		}
		
		/**
		 * @inheritDoc
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
