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
	 *
	 */
	export class EditableText extends TextBase 
		implements IEditableText,IDisplayText,IViewport{
		public constructor(){
			super();
			this.selectable = true;
		}
        private _selectable: boolean = true;
        public get selectable() {
            return this._selectable;
        }
        public set selectable(value: boolean) {
            this._selectable = value;
        }
		private _displayAsPassword:boolean = false;
		
		private displayAsPasswordChanged:boolean = true;
		/**
		 * @inheritDoc
		 */
		public get displayAsPassword():boolean{
			return this._displayAsPassword;
		}
		
		public set displayAsPassword(value:boolean){
			if(value == this._displayAsPassword)
				return;
			this._displayAsPassword = value;
			this.displayAsPasswordChanged = true;
			
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private pendingEditable:boolean = true;
		
		private _editable:boolean = true;
		
		private editableChanged:boolean = false;
		/**
		 * @inheritDoc
		 */
		public get editable():boolean{
			if(this._enabled)
				return this._editable;
			return this.pendingEditable;
		}
		
		public set editable(value:boolean){
			if(this._editable==value)
				return;
			if(this._enabled){
				this._editable = value;
				this.editableChanged = true;
				this.invalidateProperties();
			}
			else{
				this.pendingEditable = value;
			}
		}
		
		/**
		 * @inheritDoc
		 */		
		public set enabled(value:boolean){
			if (value == this._enabled)
				return;
			
            this._enabled = value;
			if(this._enabled){
				if(this._editable!=this.pendingEditable)
					this.editableChanged = true;
				this._editable = this.pendingEditable;
			}
			else{
				if(this.editable)
					this.editableChanged = true;
				this.pendingEditable = this._editable;
				this._editable = false;
			}
			this.invalidateProperties();
        }
        public get enabled() {
            return this._editable;
        }
		
		private _maxChars:number = 0;
		
		private maxCharsChanged:boolean = false;
		/**
		 * @inheritDoc
		 */
		public get maxChars():number{
			return this._maxChars;
		}
		
        public set maxChars(value: number) {
            if (value === undefined)
                value = 0
			if(value==this._maxChars)
				return;
			this._maxChars = value;
			this.maxCharsChanged = true;
			this.invalidateProperties();
		}
		
		private _multiline:boolean = true;
		
		private multilineChanged:boolean = false;
		/**
		 * @inheritDoc
		 */
		public get multiline():boolean{
			return this._multiline;
		}
		
		public set multiline(value:boolean){
			if(value==this.multiline)
				return;
			this._multiline = value;
			this.multilineChanged = true;
			this.invalidateProperties();
		}
		
		
		private _restrict:string = null;
		
		private restrictChanged:boolean = false;
		/**
		 * @deprecated
		 * TextFiled里还没实现这个接口，等实现之后再去掉废弃标志。目前暂时不要使用它。
		 */
		public get restrict():string{
			return this._restrict;
		}
		
		public set restrict(value:string){
			if (value == this._restrict)
				return;
			
			this._restrict = value;
			this.restrictChanged = true;
			
			this.invalidateProperties();
		}

		public styleChanged(styleProp:string):void{
			super.styleChanged(styleProp);
			if(!styleProp||styleProp=="size"){
				this.heightInLinesChanged = true;
				this.widthInCharsChanged = true;
			}
		}

        public _setLineSpacing(value: number) {
            if (this._lineSpacing == value)
                return;
            super._setLineSpacing(value);
            this.heightInLinesChanged = true;
        }
		
		private _heightInLines:number = NaN;
		
		private heightInLinesChanged:boolean = false;

		/**
		 * 控件的默认高度（以行为单位测量）。 若设置了multiline属性为false，则忽略此属性。
		 */		
		public get heightInLines():number{
			return this._heightInLines;
			
		}

		public set heightInLines(value:number){
			if(this._heightInLines == value)
				return;
			this._heightInLines = value;
			this.heightInLinesChanged = true;
			
			this.invalidateProperties();
		}

		
		private _widthInChars:number = NaN;
		
		private widthInCharsChanged:boolean = false;

		/**
		 * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
		 */		
		public get widthInChars():number{
			return this._widthInChars;
		}

		public set widthInChars(value:number){
			if(this._widthInChars==value)
				return;
			this._widthInChars = value;
			this.widthInCharsChanged = true;
			
			this.invalidateProperties();
		}

		
		private _contentWidth:number = 0;
		
		public get contentWidth():number{
			return this._contentWidth;
		}
		
		private setContentWidth(value:number):void{
			if (value == this._contentWidth)
				return;
			var oldValue:number = this._contentWidth;
			this._contentWidth = value;
            this.dispatchPropertyChangeEvent("contentWidth", oldValue, value); 
            
		}
		
		private _contentHeight:number = 0;
		
		public get contentHeight():number{
			return this._contentHeight;
		}
		
		private setContentHeight(value:number):void{
			if (value == this._contentHeight)
				return;
			var oldValue:number = this._contentHeight;
			this._contentHeight = value;
			this.dispatchPropertyChangeEvent("contentHeight", oldValue, value); 
		}
		
		
		private _horizontalScrollPosition:number = 0;
		/**
		 * @inheritDoc
		 */
		public get horizontalScrollPosition():number{
			return this._horizontalScrollPosition;
		}
		
		public set horizontalScrollPosition(value:number){
			if(this._horizontalScrollPosition == value)
				return;
			this._horizontalScrollPosition = value;
		}
		
		private _verticalScrollPosition:number = 0
		/**
		 * @inheritDoc
		 */
		public get verticalScrollPosition():number{
			return this._verticalScrollPosition;
		}
		
		public set verticalScrollPosition(value:number){
			if(this._verticalScrollPosition == value)
				return;
			value = Math.round(value);
			this._verticalScrollPosition = value;
		}
		
		/**
		 * 根据垂直像素位置获取对应的垂直滚动位置
		 */		
		private getScrollVByVertitcalPos(value:number):number{
			if(this._textField.numLines==0)
				return 1;
            var lineHeight: number = this._textField._getLineHeight();
			var offsetHeight:number = (this.height-4)%lineHeight;
			if(this._textField.height + offsetHeight-this.height==value){
                return this._textField.maxScrollV;
			}
            return parseInt(<any>((value - 2) / lineHeight)) + 1;
		}
		/**
		 * 根据垂直滚动位置获取对应的垂直像位置
		 */		
		private getVerticalPosByScrollV(scrollV:number = 0):number{
			if(scrollV == 1||this._textField.numLines == 0)
				return 0;
            var lineHeight: number = this._textField._getLineHeight();
            if (scrollV == this._textField.maxScrollV) {
				var offsetHeight:number = (this.height-4)%lineHeight;
				return this._textField.height + offsetHeight-this.height;
			}
			return lineHeight*(scrollV-1)+2;
		}
		/**
		 * @inheritDoc
		 */
		public getHorizontalScrollPositionDelta(navigationUnit:number = 0):number{
			var delta:number = 0;
			
			var maxDelta:number = this._contentWidth - this._horizontalScrollPosition - this.width;
			var minDelta:number = -this._horizontalScrollPosition;
			
			switch(navigationUnit){
				case NavigationUnit.LEFT:
					delta = this._horizontalScrollPosition<=0?0:Math.max(minDelta,-this.size);
					break;
				case NavigationUnit.RIGHT:
					delta = (this._horizontalScrollPosition+this.width >= this.contentWidth) ? 0 : Math.min(maxDelta, this.size);
					break;
				case NavigationUnit.PAGE_LEFT:
					delta = Math.max(minDelta, -this.width);
					break;
				case NavigationUnit.PAGE_RIGHT:
					delta = Math.min(maxDelta, this.width);
					break;
				case NavigationUnit.HOME:
					delta = minDelta;
					break;
				case NavigationUnit.END:
					delta = maxDelta;
					break;
			}
			return delta;
		}
		/**
		 * @inheritDoc
		 */
		public getVerticalScrollPositionDelta(navigationUnit:number = 0):number{
			var delta:number = 0;
			
			var maxDelta:number = this._contentHeight - this._verticalScrollPosition - this.height;
			var minDelta:number = -this._verticalScrollPosition;
			
			switch(navigationUnit){
				case NavigationUnit.UP:
					delta = this.getVScrollDelta(-1);
					break;
				case NavigationUnit.DOWN:
					delta = this.getVScrollDelta(1);
					break;
				case NavigationUnit.PAGE_UP:
					delta = Math.max(minDelta, -this.width);
					break;
				case NavigationUnit.PAGE_DOWN:
					delta = Math.min(maxDelta, this.width);
					break;
				case NavigationUnit.HOME:
					delta = minDelta;
					break;
				case NavigationUnit.END:
					delta = maxDelta;
					break;
			}
			return delta;
		}
		
		/**
		 * 返回指定偏移行数的滚动条偏移量
		 */		
		private getVScrollDelta(offsetLine:number = 0):number{
			if(!this._textField)
				return 0;
			var currentScrollV:number = this.getScrollVByVertitcalPos(this._verticalScrollPosition);
			var scrollV:number = currentScrollV + offsetLine;
            scrollV = Math.max(1, Math.min(this._textField.maxScrollV, scrollV));
			var startPos:number = this.getVerticalPosByScrollV(scrollV);
			var delta:number = startPos-this._verticalScrollPosition;
			return delta;
		}
		
		private _clipAndEnableScrolling:boolean = false;
		/**
		 * @inheritDoc
		 */
		public get clipAndEnableScrolling():boolean{
			return this._clipAndEnableScrolling;
		}
		
		public set clipAndEnableScrolling(value:boolean){
			if(this._clipAndEnableScrolling == value)
				return;
			this._clipAndEnableScrolling = value;
		}
		
		
		/**
		 * 处理对组件设置的属性
		 * @inheritDoc
		 */
		public commitProperties():void{
			if(!this._textField){
				this.editableChanged = true;
				this.displayAsPasswordChanged = true;
				this.maxCharsChanged = true;
				this.multilineChanged = true;
				this.restrictChanged = true;
			}
			
			super.commitProperties();
			
			if(this.editableChanged){
				this._textField.type = this._editable?TextFieldType.INPUT:TextFieldType.DYNAMIC;
				this.editableChanged = false;
			}
			
			if (this.displayAsPasswordChanged){
				this._textField.displayAsPassword = this._displayAsPassword;
				this.displayAsPasswordChanged = false;
			}
			
			if(this.maxCharsChanged){
				this._textField.maxChars = this._maxChars;
				this.maxCharsChanged = false;
			}
			
			if(this.multilineChanged){
				this._textField.multiline = this._multiline;
				//this._textField.wordWrap = this._multiline;
				this.multilineChanged = false;
			}
			
			if (this.restrictChanged){
				//this._textField.restrict = this._restrict;

				this.restrictChanged = false;
			}

			if(this.heightInLinesChanged){
				this.heightInLinesChanged = false;
				if(isNaN(this._heightInLines)){
					this.defaultHeight = NaN;
				}
                else {
                    //todo:没有文字时的测量
					var hInLine:number = parseInt(<any>this.heightInLines);
					var lineHeight:number = 22;
					var properties:egret.TextFieldProperties = this._textField._properties;
					if(properties._text.length>0){
                        lineHeight = this._textField._getLineHeight();
					}
					else{
						properties._text = "M";
                        lineHeight = this._textField._getLineHeight();
						properties._text = "";
					}
					this.defaultHeight = hInLine*lineHeight+4;
				}
			}
			
			if(this.widthInCharsChanged){
				this.widthInCharsChanged = false;
				if(isNaN(this._widthInChars)){
					this.defaultWidth = NaN;
				}
				else{
					var wInChars:number = parseInt(<any>this._widthInChars);
					this.defaultWidth = this.size*wInChars+5;
				}
			}
		}
		
		
		/**
		 * 通过设置此容器子项的位置和大小来响应大小更改
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			this.isValidating = true;
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			this.updateContentSize();
			this.isValidating = false;
		}
		
		/**
		 * 更新内容尺寸大小
		 */		
		private updateContentSize():void{
			if(!this.clipAndEnableScrolling)
				return;
			this.setContentWidth(this._textField.width);
			var contentHeight:number = 0;
			var numLines:number = this._textField.numLines;
			if(numLines==0){
				contentHeight = 4;
			}
			else{
                var lineHeight: number = this._textField._getLineHeight();
				var offsetHeight:number = (this.height-4)%lineHeight;
				contentHeight = this._textField.height + offsetHeight;
			}
			this.setContentHeight(contentHeight);
		}
		
		/**
		 * @inheritDoc
		 */
		public get selectionBeginIndex():number{
			this.validateProperties();
			if(this._textField)
				return this._textField.selectionBeginIndex;
			return 0;
		}
		/**
		 * @inheritDoc
		 */
		public get selectionEndIndex():number{
			this.validateProperties();
			if(this._textField)
				return this._textField.selectionEndIndex;
			return 0;
		}
		/**
		 * @inheritDoc
		 */
		public get caretIndex():number{
			this.validateProperties();
			if(this._textField)
				return this._textField.caretIndex;
			return 0;
		}
		/**
		 * @inheritDoc
		 */
		public setSelection(beginIndex:number,endIndex:number = 0):void{
			this.validateProperties();
			if(this._textField){
				this._textField._setSelection(beginIndex,endIndex);
			}
		}
		/**
		 * @inheritDoc
		 */
		public selectAll():void{
			this.validateProperties();
			if(this._textField){
				this._textField._setSelection(0,this._textField.text.length);
			}
		}
		
		/**
		 * heightInLines计算出来的默认高度。 
		 */		
		private defaultHeight:number = NaN;
		/**
		 * widthInChars计算出来的默认宽度。
		 */		
		private defaultWidth:number = NaN;
		
		/**
		 * 计算  容器默认大小的最小值和最大值
		 * @inheritDoc
		 */
		public measure():void{
            this.measuredWidth = isNaN(this.defaultWidth) ? TextBase.DEFAULT_MEASURED_WIDTH:this.defaultWidth;
			
			if(this._maxChars!=0){
				this.measuredWidth = Math.min(this.measuredWidth,this._textField.width);
			}
			if(this._multiline){
                this.measuredHeight = isNaN(this.defaultHeight) ?TextBase.DEFAULT_MEASURED_HEIGHT*2:this.defaultHeight;
			}
			else{
				this.measuredHeight = this._textField.height;
			}
		}
		/**
		 * 创建文本显示对象
		 */		
		public _createTextField():void{   
			super._createTextField();
			this._textField.type = this._editable?TextFieldType.INPUT:TextFieldType.DYNAMIC;
			this._textField.multiline = this._multiline;
			//this._textField.wordWrap = this._multiline;
			
			this._textField.addEventListener(Event.CHANGE, this.textField_changeHandler, this);
			this._textField.addEventListener("scroll", this.textField_scrollHandler, this);//todo:Scroll event
            this._textField.addEventListener("input",
				this.textField_textInputHandler,
				this);
		}
		
		private textField_changeHandler(event:Event):void{
			this._textFieldChanged();
			event.stopImmediatePropagation();
			this.dispatchEvent(new Event(Event.CHANGE));
			this.invalidateSize();
			this.invalidateDisplayList();
			this.updateContentSize();
		}
		
		
		private isValidating:boolean = false;
		
		/**
		 *  @private
		 */
        private textField_scrollHandler(event: Event): void{

		}
		
		/**
		 * 即将输入文字
		 */
		private textField_textInputHandler(event:Event):void{
			event.stopImmediatePropagation();
			
			var newEvent:Event =
				new Event(event.type, false, true);
			newEvent.data = event.data;
			this.dispatchEvent(newEvent);
			
			if (newEvent.isDefaultPrevented())
				event.preventDefault();
		}
	}
}