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
	 * @class egret.gui.TextBase
	 * @classdesc
	 * 文本基类,实现对文本的自动布局，样式属性设置。
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IDisplayText
	 */	
	export class TextBase extends UIComponent implements IDisplayText{
		/**
		 * @method egret.gui.TextBase#constructor
		 */
		public constructor(){
			super();
		}
		
		/**
		 * 默认的文本测量宽度 
		 * @constant egret.gui.TextBase.DEFAULT_MEASURED_WIDTH
		 */		
		public static DEFAULT_MEASURED_WIDTH:number = 160;
		/**
		 * 默认的文本测量高度
		 * @constant egret.gui.TextBase.DEFAULT_MEASURED_HEIGHT
		 */		
		public static DEFAULT_MEASURED_HEIGHT:number = 22;
		
		/**
		 * 呈示此文本的内部 TextField 
		 */		
		public _textField:TextField;

        private fontFamilyChanged:boolean;
		private _fontFamily:string = "SimSun";
		/**
		 * 字体名称 。默认值：SimSun
		 * @member egret.gui.TextBase#fontFamily
		 */
		public get fontFamily():string{

			return this._fontFamily;
		}
		
		public set fontFamily(value:string){
			if(this._fontFamily==value)
				return;
			this._fontFamily = value;
			this.fontFamilyChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private sizeChanged:boolean;
		private _size:number = 30;
		/**
		 * 字号大小,默认值30 。
		 * @member egret.gui.TextBase#size
		 */
		public get size():number{
			return this._size;
		}
		
		public set size(value:number){
			if(this._size==value)
				return;
			this._size = value;
			this.sizeChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private boldChanged:boolean;
		private _bold:boolean;
		/**
		 * 是否显示为粗体，默认false。
		 * @member egret.gui.TextBase#bold
		 */
		public get bold():boolean{
			return this._bold;
		}

		public set bold(value:boolean){
			if(this._bold==value)
				return;
			this._bold = value;
			this.boldChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private italicChanged:boolean;
		private _italic:boolean;
		/**
		 * 是否显示为粗体，默认false。
		 * @member egret.gui.TextBase#italic
		 */
		public get italic():boolean{
			return this._italic;
		}

		public set italic(value:boolean){
			if(this._italic==value)
				return;
			this._italic = value;
			this.italicChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private textAlignChanged:boolean;
		private _textAlign:string = HorizontalAlign.LEFT;
		/**
		 * 文字的水平对齐方式 ,请使用HorizontalAlign中定义的常量。
		 * 默认值：HorizontalAlign.LEFT。
		 * @member egret.gui.TextBase#textAlign
		 */
		public get textAlign():string{
			return this._textAlign;
		}
		
		public set textAlign(value:string){
			if(this._textAlign==value)
				return;
			this._textAlign = value;
			this.textAlignChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private verticalAlignChanged:boolean;
		private _verticalAlign:string = VerticalAlign.TOP;
		/**
		 * 文字的垂直对齐方式 ,请使用VerticalAlign中定义的常量。
		 * 默认值：VerticalAlign.TOP。
		 * @member egret.gui.TextBase#verticalAlign
		 */
		public get verticalAlign():string{
			return this._verticalAlign;
		}

		public set verticalAlign(value:string){
			if(this._verticalAlign==value)
				return;
			this._verticalAlign = value;
			this.verticalAlignChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

        private lineSpacingChanged:boolean;
        private _lineSpacing:number = 0;
        /**
         * 行间距
		 * @member egret.gui.TextBase#lineSpacing
         */
        public get lineSpacing():number{
            return this._lineSpacing;
        }

        public set lineSpacing(value:number){
            if(this._lineSpacing==value)
                return;
            this._lineSpacing = value;
            this.lineSpacingChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private textColorChanged:boolean;

		private _textColor:number = 0xFFFFFF;
		/**
		 * @member egret.gui.TextBase#textColor
		 */
		public get textColor():number{
			return this._textColor;
		}
		
		public set textColor(value:number){
			if(this._textColor==value)
				return;
            this._textColor = value;
            this.textColorChanged = true;
            this.invalidateProperties();
		}

		/**
		 * @member egret.gui.TextBase#_textChanged
		 */
        public _textChanged:boolean;
		public _text:string = "";
		/**
		 * @member egret.gui.TextBase#text
		 */
        public get text():string{
			return this._text;
		}
		
		public set text(value:string){
			if (value == this._text)
				return;
			this._text = value;
			this._textChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * @method egret.gui.TextBase#createChildren
		 */
		public createChildren():void{
			super.createChildren();
			
			if (!this._textField){
				this.checkTextField();
			}
		}
		
		/**
		 * @method egret.gui.TextBase#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if(!this._textField){
				this.checkTextField();
			}

			if (this.fontFamilyChanged){
				this._textField.fontFamily = this._fontFamily;
				this.fontFamilyChanged = false;
			}
			if (this.sizeChanged){
				this._textField.size = this._size;
				this.sizeChanged = false;
			}
			if (this.boldChanged){
				this._textField.bold = this._bold;
				this.boldChanged = false;
			}
			if (this.italic){
				this._textField.italic = this._italic;
				this.italicChanged = false;
			}
			if (this.textAlignChanged){
				this._textField.textAlign = this._textAlign;
				this.textAlignChanged = false;
			}
			if (this.verticalAlignChanged){
				this._textField.verticalAlign = this._verticalAlign;
				this.verticalAlignChanged = false;
			}
			if (this.lineSpacingChanged){
				this._textField.lineSpacing = this._lineSpacing;
				this.lineSpacingChanged = false;
			}
			if (this.textColorChanged){
				this._textField.textColor = this._textColor;
				this.textColorChanged = false;
			}
			if (this._textChanged){
				this._textField.text = this._text;
				this._textChanged = false;
			}

		}
		
		/**
		 * 检查是否创建了textField对象，没有就创建一个。
		 */		
		private checkTextField():void{
			if(!this._textField){
                this.createTextField();
				this._textField.text = this._text;
				this._textChanged = true;
				this.invalidateProperties();
			}
		}

        private createTextField():void
        {
            this._textField = new TextField;
            this._textField.fontFamily = this._fontFamily;
            this._textField.size = this._size;
            this._textField.textAlign = this._textAlign;
            this._textField.verticalAlign = this._verticalAlign;
            this._textField.lineSpacing = this._lineSpacing;
            this._textField.textColor = this._textColor;
            this._addToDisplayList(this._textField);
        }
		
		/**
		 * @method egret.gui.TextBase#measure
		 */
		public measure():void{
			super.measure();
			
			this.measuredWidth = TextBase.DEFAULT_MEASURED_WIDTH;
			this.measuredHeight = TextBase.DEFAULT_MEASURED_HEIGHT;
		}
		
		/**
		 * 更新显示列表
		 * @method egret.gui.TextBase#$updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */		
		public $updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
		}
		
		/**
		 * @method egret.gui.TextBase#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			this._textField.width = unscaledWidth;
			this._textField.height = unscaledHeight;
		}
	}
}