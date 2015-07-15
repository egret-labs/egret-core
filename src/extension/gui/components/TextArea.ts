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

	export class TextArea extends SkinnableTextBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
            super();
            
		}
		
		/**
		 * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
		 */		
		public get widthInChars():number{
			return this._getWidthInChars();
		}
		
		public set widthInChars(value:number){
			this._setWidthInChars(value);
		}
		
		/**
		 * 控件的默认高度（以行为单位测量）。 
		 */
		public get heightInLines():number{
			return this._getHeightInLines();
		}

		public set heightInLines(value:number){
			this._setHeightInLines(value);
		}
		
		/**
		 * 水平滚动条策略改变标志
		 */		
		private horizontalScrollPolicyChanged:boolean = false;
		
        private _horizontalScrollPolicy: string = null;

		/**
		 * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
		 */		
		public get horizontalScrollPolicy():string{
			return this._horizontalScrollPolicy;
		}

		public set horizontalScrollPolicy(value:string){
			if(this._horizontalScrollPolicy==value)
				return;
			this._horizontalScrollPolicy = value;
			this.horizontalScrollPolicyChanged = true;
			this.invalidateProperties();
		}

		/**
		 * 垂直滚动条策略改变标志 
		 */		
		private verticalScrollPolicyChanged:boolean = false;
		
        private _verticalScrollPolicy: string = null;
		/**
		 * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
		 */
		public get verticalScrollPolicy():string{
			return this._verticalScrollPolicy;
		}

		public set verticalScrollPolicy(value:string){
			if(this._verticalScrollPolicy==value)
				return;
			this._verticalScrollPolicy = value;
			this.verticalScrollPolicyChanged = true;
			this.invalidateProperties();
		}

		
		/**
		 * [SkinPart]实体滚动条组件
		 */
        public scroller: Scroller = null;

        public _setText(value: string) {
            super._setText(value);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

		/**
		 * 处理对组件设置的属性
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this.horizontalScrollPolicyChanged){
				if (this.scroller)
					this.scroller.horizontalScrollPolicy = this.horizontalScrollPolicy;
				this.horizontalScrollPolicyChanged = false;
			}
			
			if (this.verticalScrollPolicyChanged){
				if (this.scroller)
					this.scroller.verticalScrollPolicy = this.verticalScrollPolicy;
				this.verticalScrollPolicyChanged = false;
			}
		}

		/**
		 * 添加外观部件时调用
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.textDisplay){
				this.textDisplay.multiline = true;
			}
			else if (instance == this.scroller){
				//if (this.scroller.horizontalScrollBar)
				//	this.scroller.horizontalScrollBar.snapInterval = 0;
				//if (this.scroller.verticalScrollBar)
				//	this.scroller.verticalScrollBar.snapInterval = 0;
			}
		}

		/**
		 * 创建外观部件的引用
		 * @inheritDoc
		 */
		public createSkinParts():void{
			this.textDisplay = new EditableText();
			this.textDisplay.widthInChars = 15;
			this.textDisplay.heightInLines = 10;
			this._addToDisplayList(<DisplayObject><any> (this.textDisplay));
			this.partAdded("textDisplay",this.textDisplay);
		}
		
	}
}