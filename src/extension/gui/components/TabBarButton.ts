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

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="IItemRenderer.ts"/>
/// <reference path="supportClasses/ToggleButtonBase.ts"/>

module ns_egret {

	export class TabBarButton extends ToggleButtonBase implements IItemRenderer{
		
		public constructor(){
			super();
		}
		
		private _allowDeselection:boolean = true;
		/**
		 * 如果为 true，用户单击当前选定的按钮时即会将其取消选择。
		 * 如果为 false，用户必须选择不同的按钮才可取消选择当前选定的按钮。
		 */		
		public get allowDeselection():boolean{
			return this._allowDeselection;
		}
		
		public set allowDeselection(value:boolean){
			this._allowDeselection = value;
		}
		
		private _data:any;
		/**
		 * @inheritDoc
		 */
		public get data():any{
			return this._data;
		}
		
		public set data(value:any){
			this._data = value;
			this.dispatchEvent(new Event("dataChange"));
		}
		
		private _itemIndex:number;
		/**
		 * @inheritDoc
		 */
		public get itemIndex():number{
			return this._itemIndex;
		}
		
		public set itemIndex(value:number){
			this._itemIndex = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public set label(value:string){
			if (value != this.label){
				super.label = value;
				
				if (this.labelDisplay)
					this.labelDisplay.text = this.label;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public buttonReleased():void{
			if (this.selected && !this.allowDeselection)
				return;
			
			super.buttonReleased();
		}
	}
	
}