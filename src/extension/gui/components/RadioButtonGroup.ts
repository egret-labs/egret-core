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
	 * @class egret.gui.RadioButtonGroup
	 * @classdesc
	 * RadioButtonGroup 组件定义一组 RadioButton 组件，这些组件相互排斥；因此，用户每次只能选择一个 RadioButton 组件
	 * @extends egret.EventDispatcher
	 */
	export class RadioButtonGroup extends EventDispatcher{
		/**
		 * 构造函数
		 * @method egret.gui.RadioButtonGroup#constructor
		 */		
		public constructor(){
			super();
			this._name = "_radioButtonGroup"+RadioButtonGroup.groupCount;
			RadioButtonGroup.groupCount++;
		}
		
		private static groupCount:number = 0;
		/**
		 * 组名
		 */
        public _name: string = null;
		/**
		 * 单选按钮列表
		 */		
		private radioButtons:Array<any>  = [];
		
		private _enabled:boolean = true;
		/**
		 * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮。
		 * @member egret.gui.RadioButtonGroup#enabled
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
		 * @member egret.gui.RadioButtonGroup#numRadioButtons
		 */		
		public get numRadioButtons():number{
			return this.radioButtons.length;
		}
		
        private _selectedValue: any = null;
		/**
		 * 当前被选中的单选按钮的value属性值。注意，此属性仅当目标RadioButton在显示列表时有效。
		 * @member egret.gui.RadioButtonGroup#selectedValue
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
				this._setSelection(null, false);
				return;
			}
			var n:number = this.numRadioButtons;
			for (var i:number = 0; i < n; i++){
				var radioButton:RadioButton = this.getRadioButtonAt(i);
				if (radioButton.value == value ||
					radioButton.label == value){
					this.changeSelection(i, false);
					this._selectedValue = null;
                    UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);

					break;
				}
			}
		}
		
        private _selection: RadioButton = null;
		/**
		 * 当前被选中的单选按钮引用,注意，此属性仅当目标RadioButton在显示列表时有效。
		 * @member egret.gui.RadioButtonGroup#selection
		 */		
		public get selection():RadioButton{
			return this._selection;
		}
		public set selection(value:RadioButton){
			if ( this._selection == value)
				return;
			this._setSelection(value, false);
		}
		/**
		 * 获取指定索引的单选按钮
		 * @method egret.gui.RadioButtonGroup#getRadioButtonAt
		 * @param index {number} 单选按钮的索引
		 * @returns {RadioButton}
		 */		
		public getRadioButtonAt(index:number):RadioButton{
			if (index >= 0 && index < this.numRadioButtons)
				return this.radioButtons[index];
			
			return null;
		}
		/**
		 * 添加单选按钮到组内
		 * @param instance {RadioButton}
		 */
		public _addInstance(instance:RadioButton):void{
			instance.addEventListener(Event.REMOVED, this.radioButton_removedHandler, this);
			
			this.radioButtons.push(instance);
			this.radioButtons.sort(breadthOrderCompare);
			for (var i:number = 0; i < this.radioButtons.length; i++)
				this.radioButtons[i]._indexNumber = i;
			if (this._selectedValue)
				this.selectedValue = this._selectedValue;
			if (instance.selected == true)
				this.selection = instance;
			
			instance._radioButtonGroup = this;
			instance.invalidateSkinState();
			
			this.dispatchEventWith("numRadioButtonsChanged");

            function breadthOrderCompare(a:DisplayObject, b:DisplayObject):number{
                var aParent:DisplayObjectContainer = a.parent;
                var bParent:DisplayObjectContainer = b.parent;

                if (!aParent || !bParent)
                    return 0;

                var aNestLevel:number = (a instanceof UIComponent) ? (<UIComponent><any> a).nestLevel : -1;
                var bNestLevel:number = (b instanceof UIComponent) ? (<UIComponent><any> b).nestLevel : -1;

                var aIndex:number = 0;
                var bIndex:number = 0;

                if (aParent == bParent){
                    if ("getElementIndex" in aParent && "ownerChanged" in a)
                        aIndex = (<IVisualElementContainer><any> aParent).getElementIndex(<IVisualElement><any> a);
                    else
                        aIndex = (<DisplayObjectContainer><any> aParent).getChildIndex(a);

                    if ("getElementIndex" in bParent &&"ownerChanged" in b)
                        bIndex = (<IVisualElementContainer><any> bParent).getElementIndex(<IVisualElement><any> b);
                    else
                        bIndex = (<DisplayObjectContainer><any> bParent).getChildIndex(b);
                }

                if (aNestLevel > bNestLevel || aIndex > bIndex)
                    return 1;
                else if (aNestLevel < bNestLevel ||  bIndex > aIndex)
                    return -1;
                else if (a == b)
                    return 0;
                else
                    return breadthOrderCompare(aParent, bParent);
            }
		}
		/**
		 * 从组里移除单选按钮
		 * @param instance {RadioButton}
		 */		
		public _removeInstance(instance:RadioButton):void{
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
						
						rb._indexNumber = rb._indexNumber - 1;
					}
					else if (rb == instance){
						if(addListener)
							instance.addEventListener(Event.ADDED, this.radioButton_addedHandler, this);
						if (instance == this._selection)
							this._selection = null;
						
						instance._radioButtonGroup = null;
						instance.invalidateSkinState();
						this.radioButtons.splice(i,1);
						foundInstance = true;
						i--;
					}
				}
				
				if (foundInstance)
					this.dispatchEventWith("numRadioButtonsChanged");
			}
		}
		/**
		 * 设置选中的单选按钮
		 * @param value {RadioButton}
		 * @param fireChange {boolean} 
		 */		
		public _setSelection(value:RadioButton, fireChange:boolean = true):void{
			if (this._selection == value)
				return;
			
			if (!value){
				if (this.selection){
					this._selection.selected = false;
					this._selection = null;
					if (fireChange)
						this.dispatchEventWith(Event.CHANGE);
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
            UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);
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
					this.dispatchEventWith(Event.CHANGE);
			}
		}
		

		/**
		 * 单选按钮添加到显示列表
		 */		
		private radioButton_addedHandler(event:Event):void{
			var rb:RadioButton = <RadioButton><any> (event.target);
			if (rb){
				rb.removeEventListener(Event.ADDED, this.radioButton_addedHandler, this);
				this._addInstance(rb);
			}
		}
		/**
		 * 单选按钮从显示列表移除
		 */		
		private radioButton_removedHandler(event:Event):void{
			var rb:RadioButton = <RadioButton><any> (event.target);
			if (rb){
				rb.removeEventListener(Event.REMOVED, this.radioButton_removedHandler, this);
				this.doRemoveInstance(rb);
			}
		}
	}
	
}