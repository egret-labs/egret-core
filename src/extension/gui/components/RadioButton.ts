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
	 * @class egret.gui.RadioButton
	 * @classdesc
	 * RadioButton 组件使用户可在一组互相排斥的选择中做出一种选择
	 * @extends egret.gui.ToggleButtonBase
	 */
	export class RadioButton extends ToggleButtonBase{
		/**
		 * 构造函数
		 * @method egret.gui.RadioButton#constructor
		 */
		public constructor(){
			super();
            
			this.groupName = "radioGroup";
		}
		
		/**
		 * 在RadioButtonGroup中的索引
		 */
		public _indexNumber:number = 0;
		/**
		 * 所属的RadioButtonGroup
		 */
		public _radioButtonGroup:RadioButtonGroup = null;
		
		/**
		 * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮
		 * @member egret.gui.RadioButton#enabled
		 */
		public get enabled():boolean{
			if (!this._UIC_Props_._enabled)
				return false;
			return !this._radioButtonGroup || 
				this._radioButtonGroup.enabled;
		}
        /**
         * @inheritDoc
         */
        public set enabled(value:boolean){
            this.$setEnabled(value);
        }

        /**
         * 存储根据groupName自动创建的RadioButtonGroup列表
         */
        private static automaticRadioButtonGroups: Object = null;
		
		private _group:RadioButtonGroup = null;
		/**
		 * 此单选按钮所属的组。同一个组的多个单选按钮之间互斥。
		 * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
		 * @member egret.gui.RadioButton#group
		 */		
		public get group():RadioButtonGroup{
			if (!this._group&&this._groupName){
				if(!RadioButton.automaticRadioButtonGroups)
					RadioButton.automaticRadioButtonGroups = {};
				var g:RadioButtonGroup = RadioButton.automaticRadioButtonGroups[this._groupName];
				if (!g){
					g = new RadioButtonGroup();
					g._name = this._groupName;
					RadioButton.automaticRadioButtonGroups[this._groupName] = g;
				}
				this._group = g;
			}
			return this._group;
		}
		public set group(value:RadioButtonGroup){
			if (this._group == value)
				return;
			if(this._radioButtonGroup)
				this._radioButtonGroup._removeInstance(this);
			this._group = value;  
			this._groupName = value ? this.group._name : "radioGroup";    
			this.groupChanged = true;
			
			this.invalidateProperties();
			this.invalidateDisplayList();
		}
		
		private groupChanged:boolean = false;
		
		private _groupName:string = "radioGroup";
		/**
		 * 所属组的名称,具有相同组名的多个单选按钮之间互斥。默认值:"radioGroup"。
		 * 可以把此属性当做设置组的一个简便方式，作用与设置group属性相同,。
		 * @member egret.gui.RadioButton#groupName
		 */		
		public get groupName():string{
			return this._groupName;
		}
		public set groupName(value:string){
			if (!value || value == "")
				return;
			this._groupName = value;
			if(this._radioButtonGroup)
				this._radioButtonGroup._removeInstance(this);
			this._group = null;
			this.groupChanged = true;
			
			this.invalidateProperties();
			this.invalidateDisplayList();
		}

		/**
		 *
		 * @param value
		 * @private
		 */
		public _setSelected(value:boolean){
			super._setSelected(value);
			this.invalidateDisplayList();
		}
		
        private _value: any = null;
		/**
		 * 与此单选按钮关联的自定义数据。
		 * 当被点击时，所属的RadioButtonGroup对象会把此属性赋值给ItemClickEvent.item属性并抛出事件。
		 * @member egret.gui.RadioButton#value
		 */		
		public get value():any{
			return this._value;
		}
		public set value(value:any){
			if (this._value == value)
				return;
			
			this._value = value;
			
			if (this.selected && this.group)
                UIEvent.dispatchUIEvent(this.group,UIEvent.VALUE_COMMIT);
		}
		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.RadioButton#commitProperties
		 */
		public commitProperties():void{
			if (this.groupChanged){
				this.addToGroup();
				this.groupChanged = false;
			}
			super.commitProperties();
		}
		/**
		 * 绘制对象和/或设置其子项的大小和位置
		 * @method egret.gui.RadioButton#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
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
		 * 当在用户单击按钮之后处理 MouseEvent.MOUSE_UP 事件时，将调用此方法
		 * @method egret.gui.RadioButton#buttonReleased
		 */
		public buttonReleased():void{
			if(!this.enabled || this.selected)
				return; 
			if (!this._radioButtonGroup)
				this.addToGroup();
			super.buttonReleased();
			this.group._setSelection(this);
		}
		/**
		 * 添此单选按钮加到组
		 */		
		private addToGroup():RadioButtonGroup{        
			var g:RadioButtonGroup = this.group; 
			if (g)
				g._addInstance(this);
			return g;
		}
	}
	
}