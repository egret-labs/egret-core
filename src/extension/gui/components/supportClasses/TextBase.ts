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
	 * @class egret.gui.TextBase
	 * @classdesc
	 * 文本基类,实现对文本的自动布局，样式属性设置。
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.IDisplayText
	 */
	export class TextBase extends UIComponent implements IDisplayText{
		/**
		 * 构造函数
		 * @method egret.gui.TextBase#constructor
		 */
		public constructor(){
			super();
			this._UIC_Props_._hasNoStyleChild = true;
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
        public _textField: TextField = null;

		private allStyleChanged:boolean = false;

		/**
		 * 检测对样式属性的更改
		 * @param styleProp
		 */
		public styleChanged(styleProp:string):void{
			if(this.allStyleChanged){
				return;
			}
			if(styleProp){
				switch(styleProp){
					case "textColor":
						this.textColorChanged = true;
						break;
					case "fontFamily":
						this.fontFamilyChanged = true;
						break;
					case "size":
						this._sizeChanged = true;
						break;
					case "bold":
						this.boldChanged = true;
						break;
					case "italic":
						this.italicChanged = true;
						break;
					case "textAlign":
						this.textAlignChanged = true;
						break;
					case "verticalAlign":
						this.verticalAlignChanged = true;
						break;
				}
			}
			else{
				this.allStyleChanged = true;
			}
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

		private fontFamilyChanged:boolean = false;
		private _fontFamily:string = "SimSun";
		/**
		 * 字体名称 。默认值：SimSun
		 * @member egret.gui.TextBase#fontFamily
		 */
		public get fontFamily():string{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["fontFamily"]!==undefined){
				return chain["fontFamily"];
			}
			return this._fontFamily;
		}

		public set fontFamily(value:string){
			this.setStyle("fontFamily",value);
		}

		public _sizeChanged:boolean = false;
		private _size:number = 30;
		/**
		 * 字号大小,默认值30 。
		 * @member egret.gui.TextBase#size
		 */
		public get size(): number{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["size"]!==undefined){
				return chain["size"];
			}
			return this._size;
		}

		public set size(value:number){
			if (value === undefined)
				value = 0;
			this.setStyle("size",value);
		}

		public _focusEnabled = true;

		public set focusEnabled(value: boolean) {
			this._focusEnabled = value;
		}

		public get focusEnabled() {
			return this._focusEnabled;
		}
		/**
		 * 设置此组件的焦点
		 * @inheritDoc
		 */
		public setFocus(): void {
			if (this._focusEnabled == false)
				return;
			if (this._textField)
				this._textField.setFocus();
			//else
			//	super.setFocus();
		}

		private boldChanged:boolean = false;
		private _bold:boolean = false;
		/**
		 * 是否显示为粗体，默认false。
		 * @member egret.gui.TextBase#bold
		 */
		public get bold():boolean{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["bold"]!==undefined){
				return chain["bold"];
			}
			return this._bold;
		}

		public set bold(value:boolean){
			this.setStyle("bold",value);
		}

		private italicChanged:boolean = false;
		private _italic:boolean = false;
		/**
		 * 是否显示为斜体，默认false。
		 * @member egret.gui.TextBase#italic
		 */
		public get italic():boolean{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["italic"]!==undefined){
				return chain["italic"];
			}
			return this._italic;
		}

		public set italic(value:boolean){
			this.setStyle("italic",value);
		}

		private textAlignChanged:boolean = false;
		private _textAlign:string = HorizontalAlign.LEFT;
		/**
		 * 文字的水平对齐方式 ,请使用HorizontalAlign中定义的常量。
		 * 默认值：HorizontalAlign.LEFT。
		 * @member egret.gui.TextBase#textAlign
		 */
		public get textAlign():string{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["textAlign"]!==undefined){
				return chain["textAlign"];
			}
			return this._textAlign;
		}

		public set textAlign(value:string){
			this.setStyle("textAlign",value);
		}

		private verticalAlignChanged:boolean = false;
		private _verticalAlign:string = VerticalAlign.TOP;
		/**
		 * 文字的垂直对齐方式 ,请使用VerticalAlign中定义的常量。
		 * 默认值：VerticalAlign.TOP。
		 * @member egret.gui.TextBase#verticalAlign
		 */
		public get verticalAlign():string{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["verticalAlign"]!==undefined){
				return chain["verticalAlign"];
			}
			return this._verticalAlign;
		}

		public set verticalAlign(value:string){
			this.setStyle("verticalAlign",value);
		}

		private lineSpacingChanged:boolean = false;
		public _lineSpacing:number = 0;
		/**
		 * 行间距
		 * @member egret.gui.TextBase#lineSpacing
		 */
		public get lineSpacing():number{
			return this._getLineSpacing();
		}

		public _getLineSpacing() {
			return this._lineSpacing;
		}

		public set lineSpacing(value: number) {
			this._setLineSpacing(value);
		}

		public _setLineSpacing(value: number) {
			if (this._lineSpacing == value)
				return;
			this._lineSpacing = value;
			this.lineSpacingChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}

		private textColorChanged:boolean = false;
		private _textColor:number = 0xFFFFFF;
		/**
		 * 文本颜色
		 * @member egret.gui.TextBase#textColor
		 */
		public get textColor():number{
			var chain:any = this._UIC_Props_._styleProtoChain;
			if(chain&&chain["textColor"]!==undefined){
				return chain["textColor"];
			}
			return this._textColor;
		}

		public set textColor(value:number){
			this.setStyle("textColor",value);
		}

		/**
		 * @member egret.gui.TextBase#_textChanged
		 */
		public _textChanged:boolean = false;
		public _text:string = "";

		/**
		 * 获得文体内容
		 * @member egret.gui.TextBase#text
		 */
		public get text(): string{
			return this._text;
		}

		public set text(value:string){
			if (value == this._text)
				return;
            this._text = value || "";
			this._textChanged = true;
            this._textFlowChanged = false;
            this._textFlow = [];
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
        public _textFlow: Array<egret.ITextElement> = null;
        public _textFlowChanged:boolean = false;
        public set textFlow(value: Array<egret.ITextElement>) {
            this._textFlow = value || [];
            this._textFlowChanged = true;
            this._textChanged = false;
            this._text = "";
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        public get textFlow(): Array<egret.ITextElement> { 
            return this._textFlow;
        }
        
        /**
         * 文本全部显示时的高度（无行间距）
         */
        public get textHeight():number {
            return this._textField == null ? 0 : this._textField.textHeight;
        }

        /**
         * 文本全部显示时宽
         */
        public get textWidth(): number {
            return this._textField == null ? 0 : this._textField.textWidth;
        }

		/**
		 * 创建组件的子对象
		 */
		public createChildren():void{
			super.createChildren();
			if (!this._textField){
				this.checkTextField();
			}
		}

		/**
		 * 处理对组件设置的属性
		 */
		public commitProperties():void{
			super.commitProperties();

			if(!this._textField){
				this.checkTextField();
			}

			if(this.allStyleChanged){
				this.allStyleChanged = false;
				this.textColorChanged = true;
				this.fontFamilyChanged = true;
				this._sizeChanged = true;
				this.boldChanged = true;
				this.italicChanged = true;
				this.textAlignChanged = true;
				this.verticalAlignChanged = true;
			}
			if (this.fontFamilyChanged){
				this._textField.fontFamily = this.fontFamily;
				this.fontFamilyChanged = false;
			}
			if (this._sizeChanged){
				this._textField.size = this.size;
				this._sizeChanged = false;
			}
			if (this.boldChanged){
				this._textField.bold = this.bold;
				this.boldChanged = false;
			}
			if (this.italic){
				this._textField.italic = this.italic;
				this.italicChanged = false;
			}
			if (this.textAlignChanged){
				this._textField.textAlign = this.textAlign;
				this.textAlignChanged = false;
			}
			if (this.verticalAlignChanged){
				this._textField.verticalAlign = this.verticalAlign;
				this.verticalAlignChanged = false;
			}
			if (this.lineSpacingChanged){
				this._textField.lineSpacing = this._lineSpacing;
				this.lineSpacingChanged = false;
			}
			if (this.textColorChanged){
				this._textField.textColor = this.textColor;
				this.textColorChanged = false;
			}
			if (this._textChanged){
				this._textField.text = this._text;
			}
            if (this._textFlowChanged) { 
                this._textField.textFlow = this._textFlow;
            }
            if (this._textChanged || this._textFlowChanged) {
                this._text = this._textField.text;
                this._textFlow = this._textField.textFlow;
                this._textChanged = false;
                this._textFlowChanged = false;
            }

		}

		/**
		 * 检查是否创建了textField对象，没有就创建一个。
		 */
		private checkTextField():void{
			if(!this._textField){
				this._createTextField();
                if (this._textChanged) {
                    this._textField.text = this._text;
                }
                if (this._textFlowChanged) {
                    this._textField.textFlow = this._textFlow;
                }
				this.invalidateProperties();
			}
		}

		public _createTextField():void
		{
			this._textField = new TextField;
			this._textField.fontFamily = this.fontFamily;
			this._textField.size = this.size;
			this._textField.textAlign = this.textAlign;
			this._textField.verticalAlign = this.verticalAlign;
			this._textField.lineSpacing = this._lineSpacing;
			this._textField.textColor = this.textColor;
			this._textField.multiline = true;
			this._addToDisplayList(this._textField);
		}

        public _textFieldChanged(): void {
            this._text = this._textField.text;
            this._textFlow = this._textField.textFlow;
        }

		/**
		 * 计算组件的默认大小和（可选）默认最小大小
		 */
		public measure():void{
			super.measure();

			this.measuredWidth = TextBase.DEFAULT_MEASURED_WIDTH;
			this.measuredHeight = TextBase.DEFAULT_MEASURED_HEIGHT;
		}

		/**
		 * 更新显示列表
		 * @param unscaledWidth {number}
		 * @param unscaledHeight {number}
		 */
		public $updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
		}

		/**
		 * @param unscaledWidth {number}
		 * @param unscaledHeight {number}
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			this._textField.width = unscaledWidth;
			this._textField.height = unscaledHeight;
		}

		/**
		 * 更新属性时调度 PropertyChangeEvent 的 Helper 方法
		 * @param propertyName
		 * @param oldValue
		 * @param value
		 */
		public dispatchPropertyChangeEvent(propertyName: string, oldValue: any, value: any) {
			if (this.hasEventListener("propertyChange"))
				PropertyChangeEvent.dispatchPropertyChangeEvent(this,
					PropertyChangeEventKind.UPDATE, propertyName, oldValue, value, this);
		}
	}
}