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
/// <reference path="supportClasses/ToggleButtonBase.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="../../../../org/flexlite/domUtils/SharedMap.ts"/>

module ns_egret {

	export class RadioButton extends ToggleButtonBase{
		/**
		 * 构造函数
		 */
		public constructor(){
			super();
			this.groupName = "radioGroup";
		}
		
		public get hostComponentKey():any{
			return RadioButton;
		}
		/**
		 * 在RadioButtonGroup中的索引
		 */		
		public indexNumber:number = 0;
		/**
		 * 所属的RadioButtonGroup
		 */		
		public radioButtonGroup:RadioButtonGroup = null;
		
		public get enabled():boolean{
			if (!super.enabled)
				return false;
			return !this.radioButtonGroup || 
				this.radioButtonGroup.enabled;
		}

		/**
		 * 存储根据groupName自动创建的RadioButtonGroup列表
		 */		
		private static automaticRadioButtonGroups:SharedMap;
		
		private _group:RadioButtonGroup;
		/**
		 * 此单选按钮所属的组。同一个组的多个单选按钮之间互斥。
		 * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
		 */		
		public get group():RadioButtonGroup{
			if (!this._group&&this._groupName){
				if(!RadioButton.automaticRadioButtonGroups)
					RadioButton.automaticRadioButtonGroups = new SharedMap;
				var g:RadioButtonGroup = RadioButton.automaticRadioButtonGroups.get(this._groupName);
				if (!g){
					g = new RadioButtonGroup();
					g.name = this._groupName;
					RadioButton.automaticRadioButtonGroups.set(this._groupName,g);     
				}
				this._group = g;
			}
			return this._group;
		}
		public set group(value:RadioButtonGroup){
			if (this._group == value)
				return;
			if(this.radioButtonGroup)
				this.radioButtonGroup.removeInstance(this);
			this._group = value;  
			this._groupName = value ? this.group.name : "radioGroup";    
			this.groupChanged = true;
			
			this.invalidateProperties();
			this.invalidateDisplayList();
		}
		
		private groupChanged:boolean = false;
		
		private _groupName:string = "radioGroup";
		/**
		 * 所属组的名称,具有相同组名的多个单选按钮之间互斥。默认值:"radioGroup"。
		 * 可以把此属性当做设置组的一个简便方式，作用与设置group属性相同,。
		 */		
		public get groupName():string{
			return this._groupName;
		}
		public set groupName(value:string){
			if (!value || value == "")
				return;
			this._groupName = value;
			if(this.radioButtonGroup)
				this.radioButtonGroup.removeInstance(this);
			this._group = null;
			this.groupChanged = true;
			
			this.invalidateProperties();
			this.invalidateDisplayList();
		}
		/**
		 * @inheritDoc
		 */
		public set selected(value:boolean){
			super.selected = value;
			this.invalidateDisplayList();
		}
		
		private _value:any;
		/**
		 * 与此单选按钮关联的自定义数据。
		 * 当被点击时，所属的RadioButtonGroup对象会把此属性赋值给ItemClickEvent.item属性并抛出事件。
		 */		
		public get value():any{
			return this._value;
		}
		public set value(value:any){
			if (this._value == value)
				return;
			
			this._value = value;
			
			if (this.selected && this.group)
				this.group.dispatchEvent(new UIEvent(UIEvent.VALUE_COMMIT));
		}
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			if (this.groupChanged){
				this.addToGroup();
				this.groupChanged = false;
			}
			super.commitProperties();
		}
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number,
													  unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth, unscaledHeight);
			if (this.group){
				if (this.selected)
					this._group.selection = this;
				else if (this.group.selection == this)
					this._group.selection = null;   
			}
		}
		/**
		 * @inheritDoc
		 */
		public buttonReleased():void{
			if(!this.enabled || this.selected)
				return; 
			if (!this.radioButtonGroup)
				this.addToGroup();
			super.buttonReleased();
			this.group.setSelection(this);
		}
		/**
		 * 添此单选按钮加到组
		 */		
		private addToGroup():RadioButtonGroup{        
			var g:RadioButtonGroup = this.group; 
			if (g)
				g.addInstance(this);
			return g;
		}
	}
	
}
