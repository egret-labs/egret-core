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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="supportClasses/DropDownListBase.ts"/>
/// <reference path="supportClasses/ListBase.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	export class ComboBox extends DropDownListBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			
			this.allowCustomSelectedItem = true;
		}

		/**
		 * @inheritDoc
		 */
		public get hostComponentKey():any{
			return ComboBox;
		}
		
		/**
		 * [SkinPart]文本输入控件
		 */		
		public textInput:TextInput;
		/**
		 * 当用户在文本输入框中输入值且该值被提交时，用来表示当前选中项索引的静态常量。
		 */		
		private static CUSTOM_SELECTED_ITEM:number = ListBase.CUSTOM_SELECTED_ITEM;
		
		private actualProposedSelectedIndex:number = ListBase.NO_SELECTION;
		
		private userTypedIntoText:boolean;
		/**
		 * 文本改变前上一次的文本内容。
		 */		
		private previousTextInputText:string = "";
		/**
		 * 当用户在提示区域中输入字符时,用于根据输入文字返回匹配的数据项索引列表的回调函数。
		 * 示例：function myMatchingFunction(comboBox:ComboBox, inputText:String):Vector.<int>
		 */		
		public itemMatchingFunction:Function = null; 
		
		private _labelToItemFunction:Function;
		/**
		 * labelToItemFunction属性改标志
		 */		
		private labelToItemFunctionChanged:boolean = false;
		/**
		 * 指定用于将在提示区域中输入的新值转换为与数据提供程序中的数据项具有相同数据类型的回调函数。
		 * 当提示区域中的文本提交且在数据提供程序中未找到时，将调用该属性引用的函数。
		 * 示例： function myLabelToItem(value:String):Object
		 */		
		public set labelToItemFunction(value:Function){
			if (value == this._labelToItemFunction)
				return;
			
			this._labelToItemFunction = value;
			this.labelToItemFunctionChanged = true;
			this.invalidateProperties();
		}
		
		public get labelToItemFunction():Function{
			return this._labelToItemFunction;
		}
		
		private _prompt:string;
		
		private promptChanged:boolean = false;
		/**
		 * 输入文本为 null 时要显示的文本。 <p/>
		 * 先创建控件时将显示提示文本。控件获得焦点、输入文本为非 null 或选择了列表中的项目时提示文本将消失。
		 * 控件失去焦点时提示文本将重新显示，但仅当未输入文本时（如果文本字段的值为 null 或空字符串）。
		 */
		public get prompt():string{
			return this._prompt;
		}
		public set prompt(value:string){
			if(this._prompt==value)
				return;
			this._prompt = value;
			this.promptChanged = true;
			this.invalidateProperties();       
		}
		
		private _maxChars:number = 0;
		
		private maxCharsChanged:boolean = false;
		/**
		 * 文本输入框中最多可包含的字符数（即用户输入的字符数）。0 值相当于无限制。默认值为0.
		 */		
		public get maxChars():number{
			return this._maxChars;
		}
		public set maxChars(value:number){
			if (value == this._maxChars)
				return;
			
			this._maxChars = value;
			this.maxCharsChanged = true;
			this.invalidateProperties();
		}
		/**
		 * 如果为 true，则用户在文本输入框编辑时会打开下拉列表。
		 */		
		public openOnInput:boolean = true;
		
		private _restrict:string;
		/**
		 * restrict属性改变标志
		 */		
		private restrictChanged:boolean;
		/**
		 * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。 
		 * 如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，
		 *  则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。
		 *  只限制用户交互；脚本可将任何文本放入文本字段中。此属性不与属性检查器中的“嵌入字体”选项同步。 <p/>
		 * 如果字符串以尖号 (ˆ) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ˆ 之后的字符。
		 *  如果字符串不以尖号 (ˆ) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。
		 */
		public get restrict():string{
			return this._restrict;
		}
		public set restrict(value:string){
			if (value == this._restrict)
				return;
			
			this._restrict = value;
			this.restrictChanged = true;
			this.invalidateProperties();
		}
		
		/**
		 * @inheritDoc
		 */
		public set selectedIndex(value:number){
			super.selectedIndex = value;
			this.actualProposedSelectedIndex = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public set userProposedSelectedIndex(value:number){
			super.userProposedSelectedIndex = value;
			this.actualProposedSelectedIndex = value;
		}
		
		/**
		 * 处理正在输入文本的操作，搜索并匹配数据项。
		 */		
		private processInputField():void{
			var matchingItems:Vector.<number>;
			this.actualProposedSelectedIndex = ComboBox.CUSTOM_SELECTED_ITEM; 
			if (!this.dataProvider || this.dataProvider.length <= 0)
				return;
			
			if (this.textInput.text != ""){
				if (this.itemMatchingFunction != null)
					matchingItems = this.itemMatchingFunction(this, this.textInput.text);
				else
					matchingItems = this.findMatchingItems(this.textInput.text);
				
				if (matchingItems.length > 0){
					super.changeHighlightedSelection(matchingItems[0], true);
					
					var typedLength:number = this.textInput.text.length;
					var item:any = this.dataProvider ? this.dataProvider.getItemAt(matchingItems[0]) : undefined;
					if (item){
						var itemString:string = this.itemToLabel(item);
						this.previousTextInputText = this.textInput.text = itemString;
						this.textInput.setSelection(typedLength,itemString.length);
					}
				}
				else{
					super.changeHighlightedSelection(ComboBox.CUSTOM_SELECTED_ITEM);
				}
			}
			else{
				super.changeHighlightedSelection(this.NO_SELECTION);  
			}
		}
		/**
		 * 根据指定字符串找到匹配的数据项索引列表。
		 */		
		private findMatchingItems(input:string):Vector.<number>{
			
			var startIndex:number;
			var stopIndex:number;
			var retVal:number;  
			var retVector:Vector.<number> = new Vector.<number>;
			
			retVal = this.findStringLoop(input, 0, this.dataProvider.length); 
			
			if (retVal != -1)
				retVector.push(retVal);
			return retVector;
		}
		
		/**
		 * 在数据源中查询指定索引区间的数据项，返回数据字符串与str开头匹配的数据项索引。
		 */		
		private findStringLoop(str:string, startIndex:number, stopIndex:number):number{
			for (startIndex; startIndex != stopIndex; startIndex++){
				var itmStr:string = this.itemToLabel(this.dataProvider.getItemAt(startIndex));
				
				itmStr = itmStr.substring(0, str.length);
				if (str == itmStr || str.toUpperCase() == itmStr.toUpperCase()){
					return startIndex;
				}
			}
			return -1;
		}
		
		private getCustomSelectedItem():any{
			
			var input:string = this.textInput.text;
			if (input == "")
				return undefined;
			else if (this.labelToItemFunction != null)
				return this._labelToItemFunction(input);
			else
				return input;
		}
		
		public applySelection():void{
			if (this.actualProposedSelectedIndex == ComboBox.CUSTOM_SELECTED_ITEM){
				var itemFromInput:any = this.getCustomSelectedItem();
				if (itemFromInput != undefined)
					this.setSelectedItem(itemFromInput, true);
				else
					this.setSelectedIndex(this.NO_SELECTION, true);
			}
			else{
				this.setSelectedIndex(this.actualProposedSelectedIndex, true);
			}
			
			if (this.textInput)
				this.textInput.setSelection(-1, -1);
			
			this.userTypedIntoText = false;
		}
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{        
			
			var selectedIndexChanged:boolean = this._proposedSelectedIndex != this.NO_PROPOSED_SELECTION;
			if (this._proposedSelectedIndex == ComboBox.CUSTOM_SELECTED_ITEM && 
				this._pendingSelectedItem == undefined){
				this._proposedSelectedIndex = this.NO_PROPOSED_SELECTION;
			}
			
			super.commitProperties();
			
			if (this.textInput){
				if(this.promptChanged){
					this.textInput.prompt = this._prompt;
					this.promptChanged = false;
				}
				if (this.maxCharsChanged){
					this.textInput.maxChars = this._maxChars;
					this.maxCharsChanged = false;
				}
				
				if (this.restrictChanged){
					this.textInput.restrict = this._restrict;
					this.restrictChanged = false;
				}
			}
			if (selectedIndexChanged && this.selectedIndex == this.NO_SELECTION)
				this.previousTextInputText = this.textInput.text = "";
		}    
		
		/**
		 * @inheritDoc
		 */
		public updateLabelDisplay(displayItem:any = undefined):void{
			super.updateLabelDisplay();
			
			if (this.textInput){
				if (displayItem == undefined)
					displayItem = this.selectedItem;
				if (displayItem != null && displayItem != undefined){
					this.previousTextInputText = this.textInput.text = this.itemToLabel(displayItem);
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.textInput){
				this.updateLabelDisplay();
				this.textInput.addEventListener(Event.CHANGE,this.textInput_changeHandler,this);
				this.textInput.maxChars = this.maxChars;
				this.textInput.restrict = this.restrict;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.textInput){
				this.textInput.removeEventListener(Event.CHANGE,this.textInput_changeHandler,this);
			}
		}
		/**
		 * @inheritDoc
		 */
		public changeHighlightedSelection(newIndex:number, scrollToTop:boolean = false):void{
			super.changeHighlightedSelection(newIndex, scrollToTop);
			
			if (newIndex >= 0){
				var item:any = this.dataProvider ? this.dataProvider.getItemAt(newIndex) : undefined;
				if (item && this.textInput){
					var itemString:string = this.itemToLabel(item); 
					this.previousTextInputText = this.textInput.text = itemString;
					this.textInput.selectAll();
					
					this.userTypedIntoText = false;
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public setFocus():void{
			if (this.stage && this.textInput){            
				this.stage.focus = <DisplayObject> (this.textInput.textDisplay);            
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public dropDownController_openHandler(event:UIEvent):void{
			super.dropDownController_openHandler(event);
			this.userProposedSelectedIndex = this.userTypedIntoText ? this.NO_SELECTION : this.selectedIndex;  
		}
		
		/**
		 * @inheritDoc
		 */
		public dropDownController_closeHandler(event:UIEvent):void{        
			super.dropDownController_closeHandler(event);      
			if (!event.isDefaultPrevented()){
				this.applySelection();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public itemRemoved(index:number):void{
			if (index == this.selectedIndex)
				this.updateLabelDisplay("");
			
			super.itemRemoved(index);       
		}
		/**
		 * 文本输入改变事件处理函数
		 */		
		public textInput_changeHandler(event:Event):void{  
			this.userTypedIntoText = true;
			if(this.previousTextInputText.length>this.textInput.text.length){
				super.changeHighlightedSelection(ComboBox.CUSTOM_SELECTED_ITEM);
			}
			else if (this.previousTextInputText != this.textInput.text){
				if (this.openOnInput){
					if (!this.isDropDownOpen){
						this.openDropDown();
						this.addEventListener(UIEvent.OPEN, this.editingOpenHandler, this);
						return;
					}   
				}
				this.processInputField();
			}
			this.previousTextInputText = this.textInput.text;
		}
		/**
		 * 第一次输入等待下拉列表打开后在处理数据匹配
		 */		
		private editingOpenHandler(event:UIEvent):void{
			this.removeEventListener(UIEvent.OPEN, this.editingOpenHandler, this);
			this.processInputField();
		}
		
	}
}