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
	 * TextInput 是一个文本输入控件，供用户输入和编辑单行统一格式文本
	 * @classic
	 */
	export class TextInput extends SkinnableTextBase{
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
            return super._getWidthInChars();
		}
		
		public set widthInChars(value:number){
            super._setWidthInChars(value);
		}
		

        public _setText(value: string) {
            super._setText(value);
            this.dispatchEvent(new Event(Event.CHANGE));
        }
		
		/**
		 * 添加外观部件时调用
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.textDisplay){
				this.textDisplay.multiline = false;
				//if(this.textDisplay is IViewport)
				//	(<IViewport><any> (this.textDisplay)).clipAndEnableScrolling = false;
			}
		}
		
		/**
		 *  创建外观部件的引用
		 * @inheritDoc
		 */
		public createSkinParts():void{
            this.textDisplay = new EditableText();
            this.textDisplay.widthInChars = 10;
            this.textDisplay.multiline = false;
			this.textDisplay.left = 1;
			this.textDisplay.right = 1;
			this.textDisplay.top = 1;
			this.textDisplay.bottom = 1;
			this._addToDisplayList(<DisplayObject><any> (this.textDisplay));
			this.partAdded("textDisplay",this.textDisplay);
		}
	}
}