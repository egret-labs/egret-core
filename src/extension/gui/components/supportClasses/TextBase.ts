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

/// <reference path="../../../../egret/core/VerticalAlign.ts"/>
/// <reference path="../../../../egret/core/HorizontalAlign.ts"/>
/// <reference path="../../../../egret/text/TextField.ts"/>
/// <reference path="../../core/IDisplayText.ts"/>
/// <reference path="../../core/UIComponent.ts"/>

module ns_egret {

	export class TextBase extends UIComponent implements IDisplayText{
		public constructor(){
			super();
		}
		
		/**
		 * 默认的文本测量宽度 
		 */		
		public static DEFAULT_MEASURED_WIDTH:number = 160;
		/**
		 * 默认的文本测量高度
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
		private _size:number = 12;
		/**
		 * 字号大小,默认值12 。
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

        private textAlignChanged:boolean;
		private _textAlign:string = HorizontalAlign.LEFT;
		/**
		 * 文字的水平对齐方式 ,请使用TextAlign中定义的常量。
		 * 默认值：TextFormatAlign.LEFT。
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

        private letterSpacingChanged:boolean;
        private _letterSpacing:number = 0;
        /**
         * 字符间距
         */
        public get letterSpacing():number{
            return this._letterSpacing;
        }

        public set letterSpacing(value:number){
            if(this._letterSpacing==value)
                return;
            this._letterSpacing = value;
            this.letterSpacingChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private textColorChanged:boolean;

		private _textColor:number = 0x000000;
		/**
		 * @inheritDoc
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

        public textChanged:boolean;
		public _text:string = "";
        public get text():string{
			return this._text;
		}
		
		public set text(value:string){
			if (value == this._text)
				return;
			this._text = value;
			this.textChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * @inheritDoc
		 */
		public createChildren():void{
			super.createChildren();
			
			if (!this._textField){
				this.checkTextField();
			}
		}
		
		/**
		 * @inheritDoc
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
			if (this.letterSpacingChanged){
				this._textField.letterSpacing = this._letterSpacing;
				this.letterSpacingChanged = false;
			}
			if (this.textColorChanged){
				this._textField.textColor = this._textColor;
				this.textColorChanged = false;
			}
			if (this.textChanged){
				this._textField.text = this._text;
				this.textChanged = false;
			}

		}
		
		/**
		 * 检查是否创建了textField对象，没有就创建一个。
		 */		
		private checkTextField():void{
			if(!this._textField){
                this.createTextField();
				this._textField.text = this._text;
				this.textChanged = true;
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
            this._textField.letterSpacing = this.letterSpacing;
            this._textField.textColor = this._textColor;
            this.addChild(this._textField);
        }
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
			super.measure();
			
			this.measuredWidth = TextBase.DEFAULT_MEASURED_WIDTH;
			this.measuredHeight = TextBase.DEFAULT_MEASURED_HEIGHT;
		}
		
		/**
		 * 更新显示列表
		 */		
		public $updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
		}
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			this._textField.width = unscaledWidth;
			this._textField.height = unscaledHeight;
		}
	}
}