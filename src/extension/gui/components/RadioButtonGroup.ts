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
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/EventDispatcher.ts"/>
/// <reference path="RadioButton.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	export class RadioButtonGroup extends EventDispatcher{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.name = "radioButtonGroup"+RadioButtonGroup.groupCount;
			RadioButtonGroup.groupCount++;
		}
		
		private static groupCount:number = 0;
		/**
		 * 组名
		 */		
		public name:string;
		/**
		 * 单选按钮列表
		 */		
		private radioButtons:Array  = [];
		
		private _enabled:boolean = true;
		/**
		 * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮。
		 */	
		public get enabled():boolean{
			return this._enabled;
		}
		public set enabled(value:boolean){
			if (this._enabled == value)
				return;
			
			this._enabled = value;
			for (var i:number = 0; i < this.numRadioButtons; i++)
				this.getRadioButtonAt(i).invalidateSkinState();
		}
		/**
		 * 组内单选按钮数量
		 */		
		public get numRadioButtons():number{
			return this.radioButtons.length;
		}
		
		private _selectedValue:any;
		/**
		 * 当前被选中的单选按钮的value属性值。注意，此属性仅当目标RadioButton在显示列表时有效。
		 */		
		public get selectedValue():any{
			if (this.selection){
				return this.selection.value!=null?
					this.selection.value :
					this.selection.label;
			}
			return null;
		}
		public set selectedValue(value:any){
			this._selectedValue = value;
			if (value==null){
				this.setSelection(null, false);
				return;
			}
			var n:number = this.numRadioButtons;
			for (var i:number = 0; i < n; i++){
				var radioButton:RadioButton = this.getRadioButtonAt(i);
				if (radioButton.value == value ||
					radioButton.label == value){
					this.changeSelection(i, false);
					this._selectedValue = null;
					
					this.dispatchEvent(new UIEvent(UIEvent.VALUE_COMMIT));
					
					break;
				}
			}
		}
		
		private _selection:RadioButton;
		/**
		 * 当前被选中的单选按钮引用,注意，此属性仅当目标RadioButton在显示列表时有效。
		 */		
		public get selection():RadioButton{
			return this._selection;
		}
		public set selection(value:RadioButton){
			if ( this._selection == value)
				return;
			this.setSelection(value, false);
		}
		/**
		 * 获取指定索引的单选按钮
		 * @param index 单选按钮的索引
		 */		
		public getRadioButtonAt(index:number):RadioButton{
			if (index >= 0 && index < this.numRadioButtons)
				return this.radioButtons[index];
			
			return null;
		}
		/**
		 * 添加单选按钮到组内
		 */
		public addInstance(instance:RadioButton):void{
			instance.addEventListener(Event.REMOVED, this.radioButton_removedHandler, this);
			
			this.radioButtons.push(instance);
			this.radioButtons.sort(this.breadthOrderCompare);
			for (var i:number = 0; i < this.radioButtons.length; i++)
				this.radioButtons[i].indexNumber = i;
			if (this._selectedValue)
				this.selectedValue = this._selectedValue;
			if (instance.selected == true)
				this.selection = instance;
			
			instance.radioButtonGroup = this;
			instance.invalidateSkinState();
			
			this.dispatchEvent(new Event("numRadioButtonsChanged"));
		}
		/**
		 * 从组里移除单选按钮
		 */		
		public removeInstance(instance:RadioButton):void{
			this.doRemoveInstance(instance,false);
		}
		/**
		 * 执行从组里移除单选按钮
		 */		
		private doRemoveInstance(instance:RadioButton,addListener:boolean=true):void{
			if (instance){
				var foundInstance:boolean = false;
				for (var i:number = 0; i < this.numRadioButtons; i++){
					var rb:RadioButton = this.getRadioButtonAt(i);
					
					if (foundInstance){
						
						rb.indexNumber = rb.indexNumber - 1;
					}
					else if (rb == instance){
						if(addListener)
							instance.addEventListener(Event.ADDED, this.radioButton_addedHandler, this);
						if (instance == this._selection)
							this._selection = null;
						
						instance.radioButtonGroup = null;
						instance.invalidateSkinState();
						this.radioButtons.splice(i,1);
						foundInstance = true;
						i--;
					}
				}
				
				if (foundInstance)
					this.dispatchEvent(new Event("numRadioButtonsChanged"));
			}
		}
		/**
		 * 设置选中的单选按钮
		 */		
		public setSelection(value:RadioButton, fireChange:boolean = true):void{
			if (this._selection == value)
				return;
			
			if (!value){
				if (this.selection){
					this._selection.selected = false;
					this._selection = null;
					if (fireChange)
						this.dispatchEvent(new Event(Event.CHANGE));
				}
			}
			else{
				var n:number = this.numRadioButtons;
				for (var i:number = 0; i < n; i++){
					if (value == this.getRadioButtonAt(i)){
						this.changeSelection(i, fireChange);
						break;
					}
				}
			}
			this.dispatchEvent(new UIEvent(UIEvent.VALUE_COMMIT));
		}
		/**
		 * 改变选中项
		 */		
		private changeSelection(index:number, fireChange:boolean = true):void{
			var rb:RadioButton = this.getRadioButtonAt(index);
			if (rb && rb != this._selection){
				
				if (this._selection)
					this._selection.selected = false;
				this._selection = rb;
				this._selection.selected = true;
				if (fireChange)
					this.dispatchEvent(new Event(Event.CHANGE));
			}
		}
		
		/**
		 * 显示对象深度排序
		 */		
		private breadthOrderCompare(a:DisplayObject, b:DisplayObject):number{
			var aParent:DisplayObjectContainer = a.parent;
			var bParent:DisplayObjectContainer = b.parent;
			
			if (!aParent || !bParent)
				return 0;
			
			var aNestLevel:number = (a instanceof UIComponent) ? (<UIComponent> a).nestLevel : -1;
			var bNestLevel:number = (b instanceof UIComponent) ? (<UIComponent> b).nestLevel : -1;
			
			var aIndex:number = 0;
			var bIndex:number = 0;
			
			if (aParent == bParent){
				if (aParent is IVisualElementContainer && a is IVisualElement)
					aIndex = (<IVisualElementContainer> aParent).getElementIndex(<IVisualElement> a);
				else
					aIndex = (<DisplayObjectContainer> aParent).getChildIndex(a);
				
				if (bParent is IVisualElementContainer && b is IVisualElement)
					bIndex = (<IVisualElementContainer> bParent).getElementIndex(<IVisualElement> b);
				else
					bIndex = (<DisplayObjectContainer> bParent).getChildIndex(b);
			}
			
			if (aNestLevel > bNestLevel || aIndex > bIndex)
				return 1;
			else if (aNestLevel < bNestLevel ||  bIndex > aIndex)
				return -1;
			else if (a == b)
				return 0;
			else 
				return this.breadthOrderCompare(aParent, bParent);
		}
		/**
		 * 单选按钮添加到显示列表
		 */		
		private radioButton_addedHandler(event:Event):void{
			var rb:RadioButton = <RadioButton> (event.target);
			if (rb){
				rb.removeEventListener(Event.ADDED, this.radioButton_addedHandler, this);
				this.addInstance(rb);
			}
		}
		/**
		 * 单选按钮从显示列表移除
		 */		
		private radioButton_removedHandler(event:Event):void{
			var rb:RadioButton = <RadioButton> (event.target);
			if (rb){
				rb.removeEventListener(Event.REMOVED, this.radioButton_removedHandler, this);
				this.doRemoveInstance(rb);
			}
		}
	}
	
}