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

/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../core/IDisplayText.ts"/>
/// <reference path="../../core/UIComponent.ts"/>
/// <reference path="../../../../egret/text/TextField.ts"/>

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
		public textField:TextField;
		
		//===========================字体样式=====================start==========================
		
		public defaultStyleChanged:boolean = true;
		/**
		 * 是否使用嵌入字体
		 */		
		public embedFonts:boolean = false;
		
		private _fontFamily:string = "SimSun";
		
		/**
		 * 字体名称 。默认值：SimSun
		 */
		public get fontFamily():string{
			return this._fontFamily;
		}
		
		public set fontFamily(value:string):void{
			if(this._fontFamily==value)
				return;
			this._fontFamily = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _size:number = 12;
		
		/**
		 * 字号大小,默认值12 。
		 */
		public get size():number{
			return this._size;
		}
		
		public set size(value:number):void{
			if(this._size==value)
				return;
			this._size = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _bold:boolean = false;
		
		/**
		 * 是否为粗体,默认false。
		 */
		public get bold():boolean{
			return this._bold;
		}
		
		public set bold(value:boolean):void{
			if(this._bold==value)
				return;
			this._bold = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _italic:boolean = false;
		
		/**
		 * 是否为斜体,默认false。
		 */
		public get italic():boolean{
			return this._italic;
		}
		
		public set italic(value:boolean):void{
			if(this._italic==value)
				return;
			this._italic = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _underline:boolean = false;
		
		/**
		 * 是否有下划线,默认false。
		 */
		public get underline():boolean{
			return this._underline;
		}
		
		public set underline(value:boolean):void{
			if(this._underline==value)
				return;
			this._underline = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
		}
		
		private _textAlign:string = TextFormatAlign.LEFT;
		
		/**
		 * 文字的水平对齐方式 ,请使用TextFormatAlign中定义的常量。
		 * 默认值：TextFormatAlign.LEFT。
		 */
		public get textAlign():string{
			return this._textAlign;
		}
		
		public set textAlign(value:string):void{
			if(this._textAlign==value)
				return;
			this._textAlign = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		
		private _leading:number = 2;
		
		/**
		 * 行距,默认值为2。
		 */
		public get leading():number{
			return this._leading;
		}
		
		public set leading(value:number):void{
			if(this._leading==value)
				return;
			this._leading = value;
			if(this.textField)
				this.textField.leading = this.realLeading;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		public get realLeading():number{
			return this._leading;
		}
		
		/**
		 * 在enabled属性为false时记录的颜色值 
		 */		
		private pendingColor:number = 0x000000;
		
		private _textColor:number = 0x000000;
		/**
		 * @inheritDoc
		 */
		public get textColor():number{
			if(this.enabled)
				return this._textColor;
			return this.pendingColor;
		}
		
		public set textColor(value:number):void{
			if(this._textColor==value)
				return;
			if(this.enabled){
				this._textColor = value;
				this.defaultStyleChanged = true;
				this.invalidateProperties();
			}
			else{
				this.pendingColor = value;
			}
		}
		
		private _disabledColor:number = 0xaab3b3;
		/**
		 * 被禁用时的文字颜色,默认0xaab3b3。
		 */
		public get disabledColor():number{
			return this._disabledColor;
		}
		
		public set disabledColor(value:number):void{
			if(this._disabledColor==value)
				return;
			this._disabledColor = value;
			if(!this.enabled){
				this._textColor = value;
				this.defaultStyleChanged = true;
				this.invalidateProperties();
			}
		}
		
		
		private _letterSpacing:number = NaN;
		
		/**
		 * 字符间距,默认值为NaN。
		 */
		public get letterSpacing():number{
			return this._letterSpacing;
		}
		
		public set letterSpacing(value:number):void{
			if(this._letterSpacing==value)
				return;
			this._letterSpacing = value;
			this.defaultStyleChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		public _textFormat:TextFormat;
		
		/**
		 * 应用到所有文字的默认文字格式设置信息对象
		 */
		public get defaultTextFormat():TextFormat{
			if(this.defaultStyleChanged){
				this._textFormat = this.getDefaultTextFormat();
				this.defaultStyleChanged = false;
			}
			return this._textFormat;
		}
		/**
		 * 由于设置了默认文本格式后，是延迟一帧才集中应用的，若需要立即应用文本样式，可以手动调用此方法。
		 */		
		public applyTextFormatNow():void{
			if(this.defaultStyleChanged){
				this.textField.$setTextFormat(this.defaultTextFormat);
				this.textField.defaultTextFormat = this.defaultTextFormat;
			}
		}
		
		/**
		 * 从另外一个文本组件复制默认文字格式信息到自身。<br/>
		 * 复制的值包含：<br/>
		 * fontFamily，size，textColor，bold，italic，underline，textAlign，<br/>
		 * leading，letterSpacing，disabledColor
		 */		
		public copyDefaultFormatFrom(textBase:TextBase):void{
			this.fontFamily = textBase.fontFamily;
			this.size = textBase.size;
			this.textColor = textBase.textColor;
			this.bold = textBase.bold;
			this.italic = textBase.italic;
			this.underline = textBase.underline;
			this.textAlign = textBase.textAlign;
			this.leading = textBase.leading;
			this.letterSpacing = textBase.letterSpacing;
			this.disabledColor = textBase.disabledColor;
		}
		
		/**
		 * 获取文字的默认格式设置信息对象。
		 */		
		public getDefaultTextFormat():TextFormat{
			var textFormat:TextFormat = new TextFormat(this._fontFamily,this._size, this._textColor, this._bold, this._italic, this._underline, 
				"", "", this._textAlign, 0, 0, 0, this._leading);
			if(!isNaN(this.letterSpacing)){
				textFormat.kerning = true;
				textFormat.letterSpacing = this.letterSpacing;
			}
			else{
				textFormat.kerning = false;
				textFormat.letterSpacing = null;
			}
			return textFormat;
		}
		
		//===========================字体样式======================end===========================
		
		
		
		
		private _htmlText:string = "";
		
		public htmlTextChanged:boolean = false;
		
		public explicitHTMLText:string = null; 
		
		/**
		 *　HTML文本
		 */		
		public get htmlText():string{
			return this._htmlText;
		}
		
		public set htmlText(value:string):void{
			if (!value)
				value = "";
			
			if (this.isHTML && value == this.explicitHTMLText)
				return;
			
			this._htmlText = value;
			if(this.textField)
				this.textField.$htmlText = this._htmlText;
			this.htmlTextChanged = true;
			this._text = null;
			
			this.explicitHTMLText = value;
			
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * 当前是否为html文本
		 */		
		public get isHTML():boolean{
			return <boolean> (this.explicitHTMLText);
		}
		
		private pendingSelectable:boolean = false;
		
		private _selectable:boolean = false;
		
		private selectableChanged:boolean;
		
		/**
		 * 指定是否可以选择文本。允许选择文本将使您能够从控件中复制文本。 
		 */		
		public get selectable():boolean{
			if(this.enabled)
				return this._selectable;
			return this.pendingSelectable;
		}
		
		public set selectable(value:boolean):void{
			if (value == this.selectable)
				return;
			if(this.enabled){
				this._selectable = value;
				this.selectableChanged = true;
				this.invalidateProperties();
			}
			else{
				this.pendingSelectable = value;
			}
		}
		
		public _text:string = "";
		
		public textChanged:boolean = false;
		
		public get text():string{
			return this._text;
		}
		
		public set text(value:string):void{
			if (value==null)
				value = "";
			
			if (!this.isHTML && value == this._text)
				return;
			
			this._text = value;
			if(this.textField)
				this.textField.$text = this._text;
			this.textChanged = true;
			this._htmlText = null;
			
			this.explicitHTMLText = null;
			
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		public _textHeight:number;
		
		/**
		 * 文本高度
		 */		
		public get textHeight():number{
			this.validateNowIfNeed();
			return this._textHeight;
		}
		
		public _textWidth:number;
		
		/**
		 * 文本宽度
		 */		
		public get textWidth():number{
			this.validateNowIfNeed();
			return this._textWidth;
		}
		
		/**
		 * 由于组件是延迟应用属性的，若需要在改变文本属性后立即获得正确的值，要先调用validateNow()方法。
		 */		
		private validateNowIfNeed():void{
			if(this.invalidatePropertiesFlag||this.invalidateSizeFlag||this.invalidateDisplayListFlag)
				this.validateNow();
		}
		
		
		/**
		 * @inheritDoc
		 */
		public createChildren():void{
			super.createChildren();
			
			if (!this.textField){
				this.checkTextField();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if(!this.textField){
				this.checkTextField();
			}
			
			if (this.condenseWhiteChanged){
				this.textField.condenseWhite = this._condenseWhite;
				
				this.condenseWhiteChanged = false;
			}
			
			
			if (this.selectableChanged){
				this.textField.selectable = this._selectable;
				
				this.selectableChanged = false;
			}
			
			if(this.defaultStyleChanged){
				this.textField.$setTextFormat(this.defaultTextFormat);
				this.textField.defaultTextFormat = this.defaultTextFormat;
				this.textField.embedFonts = this.embedFonts;
				if(this.isHTML)
					this.textField.$htmlText = this.explicitHTMLText;
			}
			
			if (this.textChanged || this.htmlTextChanged){
				this.textFieldChanged(true);
				this.textChanged = false;
				this.htmlTextChanged = false;
			}
			
		}
		
		/**
		 * @inheritDoc
		 */
		public setFocus():void{
			if(this.textField&&UIGlobals.stage){
				UIGlobals.stage.focus = this.textField;
			}
		}
		/**
		 * 检查是否创建了textField对象，没有就创建一个。
		 */		
		private checkTextField():void{
			if(!this.textField){
				this.createTextField();
				if (this.isHTML)
					this.textField.$htmlText = this.explicitHTMLText;
				else
					this.textField.$text = this._text;
				this.textField.leading = this.realLeading;
				this.condenseWhiteChanged = true;
				this.selectableChanged = true;
				this.textChanged = true;
				this.defaultStyleChanged = true;
				this.invalidateProperties();
			}
		}
		
		/**
		 * 创建文本显示对象
		 */		
		public createTextField():void{   
			this.textField = new UITextField;
			this.textField.selectable = this.selectable;
			this.textField.antiAliasType = AntiAliasType.ADVANCED; 
			this.textField.mouseWheelEnabled = false;
			
			this.textField.addEventListener("textChanged",
				this.textField_textModifiedHandler,
				this);
			this.textField.addEventListener("widthChanged",
				this.textField_textFieldSizeChangeHandler,
				this);
			this.textField.addEventListener("heightChanged",
				this.textField_textFieldSizeChangeHandler,
				this);
			this.textField.addEventListener("textFormatChanged",
				this.textField_textFormatChangeHandler,
				this);
			this.addChild(this.textField);
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
			this.textField.x = 0;
			this.textField.y = 0;
			this.textField.$width = unscaledWidth;
			this.textField.$height = unscaledHeight;
			this._textWidth = this.textField.textWidth;
			this._textHeight = this.textField.textHeight;
		}
		
		/**
		 * 返回 TextLineMetrics 对象，其中包含控件中文本位置和文本行度量值的相关信息。
		 * @param lineIndex 要获得其度量值的行的索引（从零开始）。
		 */		
		public getLineMetrics(lineIndex:number):TextLineMetrics{
			this.validateNowIfNeed();
			return this.textField ? this.textField.getLineMetrics(lineIndex) : null;
		}
		
		/**
		 * 文本显示对象属性改变
		 */		
		public textFieldChanged(styleChangeOnly:boolean):void{
			if (!styleChangeOnly){
				this._text = this.textField.text;
			}
			
			this._htmlText = this.textField.htmlText;
			
			this._textWidth = this.textField.textWidth;
			this._textHeight = this.textField.textHeight;
		}
		
		/**
		 * 文字内容发生改变
		 */		
		public textField_textModifiedHandler(event:Event):void{
			this.textFieldChanged(false);
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * 标签尺寸发生改变
		 */		
		private textField_textFieldSizeChangeHandler(event:Event):void{
			this.textFieldChanged(true);
			this.invalidateSize();
			this.invalidateDisplayList();
		}   
		/**
		 * 文字格式发生改变
		 */		
		private textField_textFormatChangeHandler(event:Event):void{
			this.textFieldChanged(true);
			this.invalidateSize();
			this.invalidateDisplayList();
		}
	}
}