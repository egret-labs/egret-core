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

	export class SkinnableTextBase extends SkinnableComponent{
		/**
		 * 构造函数
		 */
		public constructor(){
			super();
			this.focusEnabled = true;
        }
        public _focusEnabled: boolean = true;
        /**
         * 是否能够自动获得焦点的标志
         */
        public get focusEnabled() {
            return this._focusEnabled;
        }

        public set focusEnabled(value: boolean) {
            this._focusEnabled = value;
        }

        private isFocus:boolean = false;
		/**
		 * 焦点移入
		 */		
		private focusInHandler(event:Event):void{
            this.isFocus = true;
			if (event.target == this){
				this.setFocus();
				return;
			}
			this.invalidateSkinState();
		}
		/**
		 * 焦点移出
		 */		
		private focusOutHandler(event:Event):void{
            this.isFocus = false;
            if (event.target == this)
				return;
			this.invalidateSkinState();
		}
		
		/**
		 * [SkinPart]实体文本输入组件
		 */		
        public textDisplay: IEditableText = null;
		/**
		 * textDisplay改变时传递的参数
		 */		
		private textDisplayProperties:any = {};
		/**
		 * [SkinPart]当text属性为空字符串时要显示的文本。
		 */		
        public promptDisplay: IDisplayText = null;
		
        private _prompt: string = null;
		/**
		 * 当text属性为空字符串时要显示的文本内容。 <p/>
		 * 先创建文本控件时将显示提示文本。控件获得焦点时或控件的 text 属性为非空字符串时，提示文本将消失。
		 * 控件失去焦点时提示文本将重新显示，但仅当未输入文本时（如果文本字段的值为空字符串）。<p/>
		 * 对于文本控件，如果用户输入文本，但随后又将其删除，则控件失去焦点后，提示文本将重新显示。
		 * 您还可以通过编程方式将文本控件的 text 属性设置为空字符串使提示文本重新显示。
		 */
		public get prompt():string{
			return this._prompt;
		}
		public set prompt(value:string){
			if(this._prompt==value)
				return;
			this._prompt = value;
			if(this.promptDisplay){
				this.promptDisplay.text = value;
			}
			this.invalidateProperties();       
			this.invalidateSkinState();
		}
		
		/**
		 * @inheritDoc
		 */
		public get maxWidth():number{
			if(this.textDisplay)
				return this.textDisplay.maxWidth;
			var v:any = this.textDisplayProperties.maxWidth;
			return (v === undefined) ? super._getMaxWidth() : v;        
		}
			
		/**
		 * @inheritDoc
		 */
		public set maxWidth(value:number){
			if(this.textDisplay){
				this.textDisplay.maxWidth = value;
				this.textDisplayProperties.maxWidth = true;
			}
			else{
				this.textDisplayProperties.maxWidth = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 文本颜色。
		 */		
		public get textColor():number{
			if(this.textDisplay)
				return this.textDisplay.textColor;
			var v:any = this.textDisplayProperties.textColor;
			return (v === undefined) ? 0 : v;
		}
		public set textColor(value:number){
			if(this.textDisplay){
				this.textDisplay.textColor = value;
				this.textDisplayProperties.textColor = true;
			}
			else{
				this.textDisplayProperties.textColor = value;
			}
			//触发一次UPDATE_COMPLETE事件.
			this.invalidateProperties();                    
		}
		
		/**
		 * 指定文本字段是否是密码文本字段。如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。
		 * 如果为 false，则不会将文本字段视为密码文本字段。启用密码模式时，“剪切”和“复制”命令及其对应的键盘快捷键将不起作用。
		 * 此安全机制可防止不良用户使用快捷键在无人看管的计算机上破译密码。
		 */	
		public get displayAsPassword():boolean{
			if(this.textDisplay)
				return this.textDisplay.displayAsPassword;
			var v:any = this.textDisplayProperties.displayAsPassword
			return (v === undefined) ? false : v;
		}
		
		public set displayAsPassword(value:boolean){
			if(this.textDisplay){
				this.textDisplay.displayAsPassword = value;
				this.textDisplayProperties.displayAsPassword = true;
			}
			else{
				this.textDisplayProperties.displayAsPassword = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 文本是否可编辑的标志。
		 */		
		public get editable():boolean{
			if(this.textDisplay)
				return this.textDisplay.editable;
			var v:any = this.textDisplayProperties.editable;
			return (v === undefined) ? true : v;
		}
		
		public set editable(value:boolean){
			if(this.textDisplay){
				this.textDisplay.editable = value;
				this.textDisplayProperties.editable = true;
			}
			else{
				this.textDisplayProperties.editable = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 文本字段中最多可包含的字符数（即用户输入的字符数）。脚本可以插入比 maxChars 允许的字符数更多的文本；
		 * maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
		 */	
		public get maxChars():number {
			if(this.textDisplay)
				return this.textDisplay.maxChars;
			var v:any = this.textDisplayProperties.maxChars;
			return (v === undefined) ? 0 : v;
		}
		
		public set maxChars(value:number){
			if(this.textDisplay){
				this.textDisplay.maxChars = value;
				this.textDisplayProperties.maxChars = true;
			}
			else{
				this.textDisplayProperties.maxChars = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。
		 * 如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，
		 * 则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。
		 * 只限制用户交互；脚本可将任何文本放入文本字段中。此属性不与属性检查器中的“嵌入字体”选项同步。<p/>
		 * 如果字符串以尖号 (ˆ) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ˆ 之后的字符。
		 * 如果字符串不以尖号 (ˆ) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。
		 */
		public get restrict():string {
			if(this.textDisplay)
				return this.textDisplay.restrict;
			var v:any = this.textDisplayProperties.restrict;
			return (v === undefined) ? null : v;
		}
		
		public set restrict(value:string){
			if(this.textDisplay){
				this.textDisplay.restrict = value;
				this.textDisplayProperties.restrict = true;
			}
			else{
				this.textDisplayProperties.restrict = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 一个布尔值，表示文本字段是否可选。值 true 表示文本可选。selectable 属性控制文本字段是否可选，
		 * 而不控制文本字段是否可编辑。动态文本字段即使不可编辑，它也可能是可选的。如果动态文本字段是不可选的，
		 * 则用户不能选择其中的文本。 <p/>
		 * 如果 selectable 设置为 false，则文本字段中的文本不响应来自鼠标或键盘的选择命令，
		 * 并且不能使用“复制”命令复制文本。如果 selectable 设置为 true，则可以使用鼠标或键盘选择文本字段中的文本，
		 * 并且可以使用“复制”命令复制文本。即使文本字段是动态文本字段而不是输入文本字段，您也可以用这种方式选择文本。 
		 */
		public get selectable():boolean{
			if(this.textDisplay)
				return this.textDisplay.selectable;
			var v:any = this.textDisplayProperties.selectable;
			return (v === undefined) ? true : v;
		}
		
		public set selectable(value:boolean){
			if(this.textDisplay){
				this.textDisplay.selectable = value;
				this.textDisplayProperties.selectable = true;
			}
			else{
				this.textDisplayProperties.selectable = value;
			}
			this.invalidateProperties();                    
		}
		
		/**
		 * 当前所选内容中第一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，
		 * 第二个字符的索引值是 1，依此类推。如果未选定任何文本，此属性为 caretIndex 的值
		 */
		public get selectionBeginIndex():number{
			if(this.textDisplay)
				return this.textDisplay.selectionBeginIndex;
			if(this.textDisplayProperties.selectionBeginIndex===undefined)
				return -1;
			return this.textDisplayProperties.selectionBeginIndex;
		}
		
		/**
		 * 当前所选内容中最后一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
		 * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
		 */
		public get selectionEndIndex():number{
			if(this.textDisplay)
				return this.textDisplay.selectionEndIndex;
			if(this.textDisplayProperties.selectionEndIndex===undefined)
				return -1;
			return this.textDisplayProperties.selectionEndIndex;
		}
		
		/**
		 * 插入点（尖号）位置的索引。如果没有显示任何插入点，则在将焦点恢复到字段时，
		 * 值将为插入点所在的位置（通常为插入点上次所在的位置，如果字段不曾具有焦点，则为 0）。 
		 */
		public get caretIndex():number{
			return this.textDisplay?this.textDisplay.caretIndex:0;
		}
		
		/**
		 * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
		 * 如果两个参数值相同，则此方法会设置插入点，就如同设置 caretIndex 属性一样。
		 */
		public setSelection(beginIndex:number,endIndex:number = 0):void{
			if(this.textDisplay){
				this.textDisplay.setSelection(beginIndex,endIndex);
			}
			else{
				this.textDisplayProperties.selectionBeginIndex = beginIndex;
				this.textDisplayProperties.selectionEndIndex = endIndex;
			}
		}
		
		/**
		 * 选中所有文本。
		 */
		public selectAll():void{
			if(this.textDisplay){
				this.textDisplay.selectAll();
			}
			else if(this.textDisplayProperties.text!==undefined){
				this.setSelection(0,this.textDisplayProperties.text.length-1);
			}
		}
		
		/**
		 * 此文本组件所显示的文本。
		 */		
        public get text(): string{
            return this._getText();
        }

        public _getText() {
            if (this.textDisplay)
                return this.textDisplay.text;
            var v: any = this.textDisplayProperties.text;
            return (v === undefined) ? "" : v;
        }
		
        public set text(value: string) {
            this._setText(value);
        }

        public _setText(value: string) {
            if (this.textDisplay) {
                this.textDisplay.text = value;
                this.textDisplayProperties.text = true;
            }
            else {
                this.textDisplayProperties.text = value;
                this.textDisplayProperties.selectionBeginIndex = 0;
                this.textDisplayProperties.selectionEndIndex = 0;
            }
            this.invalidateProperties();
            this.invalidateSkinState();
        }
		
		public _getWidthInChars():number{
			var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
			
			if (richEditableText)
				return richEditableText.widthInChars;
			
			var v:any = this.textDisplay ? undefined : this.textDisplayProperties.widthInChars;
			return (v === undefined) ? NaN : v;
		}
		
		public _setWidthInChars(value:number):void{
			if (this.textDisplay){
				var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
				
				if (richEditableText)
					richEditableText.widthInChars = value;
				this.textDisplayProperties.widthInChars = true;
			}
			else{
				this.textDisplayProperties.widthInChars = value;
			}
			
			this.invalidateProperties();                    
		}
		
		public _getHeightInLines():number{
			var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
			
			if (richEditableText)
				return richEditableText.heightInLines;
			
			var v:any = this.textDisplay ? undefined : this.textDisplayProperties.heightInLines;        
			return (v === undefined) ? NaN : v;
		}
		
		public _setHeightInLines(value:number):void{
			if (this.textDisplay){
				var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
				
				if (richEditableText)
					richEditableText.heightInLines = value;
				this.textDisplayProperties.heightInLines = true;
			}
			else{
				this.textDisplayProperties.heightInLines = value;
			}
			
			this.invalidateProperties();                    
		}
		
		/**
		 * 返回要应用到外观的状态的名称
		 * @inheritDoc
		 */
		public getCurrentSkinState():string{
			var skin:any = this.skin;
			if(this._prompt&&!this.isFocus&&this.text==""){
				if (this.enabled&&(<IStateClient><any> skin).hasState("normalWithPrompt"))
					return "normalWithPrompt";
				if (!this.enabled&&(<IStateClient><any> skin).hasState("disabledWithPrompt"))
					return "disabledWithPrompt";
			}
			return super.getCurrentSkinState();
		}
		
		/**
		 * 添加外观部件时调用
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if(instance == this.textDisplay){
				this.textDisplayAdded();
                if(this.textDisplay instanceof EditableText)
                {
                    (<EditableText>this.textDisplay)._textField.addEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    (<EditableText>this.textDisplay)._textField.addEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }
				this.textDisplay.addEventListener("input",
					this.textDisplay_changingHandler,
					this);
				
				this.textDisplay.addEventListener(Event.CHANGE,
					this.textDisplay_changeHandler,
					this);
			}
			else if(instance==this.promptDisplay){
				this.promptDisplay.text = this._prompt;
			}
		}
		
		/**
		 * 正删除外观部件的实例时调用
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if(instance == this.textDisplay){
				this.textDisplayRemoved();
                if(this.textDisplay instanceof EditableText)
                {
                    (<EditableText>this.textDisplay)._textField.removeEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    (<EditableText>this.textDisplay)._textField.removeEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }

				this.textDisplay.removeEventListener("input",
					this.textDisplay_changingHandler,
					this);
				
				this.textDisplay.removeEventListener(Event.CHANGE,
					this.textDisplay_changeHandler,
					this);
			}
		}
		
		/**
		 * 设置此组件的焦点
		 * @inheritDoc
		 */
        public setFocus(): void{
            if (this._focusEnabled == false)
                return;
			if(this.textDisplay)
				this.textDisplay.setFocus();
			//else
			//	super.setFocus();
		}
		
		/**
		 * 当皮肤不为ISkinPartHost时，创建TextDisplay显示对象
		 */		
		public _createTextDisplay():void{
		}
		
		/**
		 * @inheritDoc
		 */
		public _removeSkinParts():void{
			if(!this.textDisplay)
				return;
			this.partRemoved("textDisplay",this.textDisplay);
			this._removeFromDisplayList(<DisplayObject><any> (this.textDisplay));
			this.textDisplay = null;
		}
		
		/**
		 * textDisplay附加
		 */		
		private textDisplayAdded():void{        
			var newTextDisplayProperties:any = {};
			var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
			
			if(this.textDisplayProperties.displayAsPassword !== undefined){
				this.textDisplay.displayAsPassword = this.textDisplayProperties.displayAsPassword;
				newTextDisplayProperties.displayAsPassword = true;
			}
			
			if(this.textDisplayProperties.textColor !== undefined){
				this.textDisplay.textColor = this.textDisplayProperties.textColor;
				newTextDisplayProperties.textColor = true;
			}
			
			if(this.textDisplayProperties.editable !== undefined){
				this.textDisplay.editable = this.textDisplayProperties.editable;
				newTextDisplayProperties.editable = true;
			}
			
			if(this.textDisplayProperties.maxChars !== undefined){
				this.textDisplay.maxChars = this.textDisplayProperties.maxChars;
				newTextDisplayProperties.maxChars = true;
			}
			
			if(this.textDisplayProperties.maxHeight !== undefined){
				this.textDisplay.maxHeight = this.textDisplayProperties.maxHeight;
				newTextDisplayProperties.maxHeight = true;
			}
			
			if(this.textDisplayProperties.maxWidth !== undefined){
				this.textDisplay.maxWidth = this.textDisplayProperties.maxWidth;
				newTextDisplayProperties.maxWidth = true;
			}
			
			if(this.textDisplayProperties.restrict !== undefined){
				this.textDisplay.restrict = this.textDisplayProperties.restrict;
				newTextDisplayProperties.restrict = true;
			}
			
			if(this.textDisplayProperties.selectable !== undefined){
				this.textDisplay.selectable = this.textDisplayProperties.selectable;
				newTextDisplayProperties.selectable = true;
			}
			
			if(this.textDisplayProperties.text !== undefined){
				this.textDisplay.text = this.textDisplayProperties.text;
				newTextDisplayProperties.text = true;
			}
			
			if(this.textDisplayProperties.selectionBeginIndex !== undefined){
				this.textDisplay.setSelection(this.textDisplayProperties.selectionBeginIndex,
					this.textDisplayProperties.selectionEndIndex);
			}
			if (this.textDisplayProperties.widthInChars !== undefined && richEditableText){
				richEditableText.widthInChars = this.textDisplayProperties.widthInChars;
				newTextDisplayProperties.widthInChars = true;
			}
			if (this.textDisplayProperties.heightInLines !== undefined && richEditableText){
				richEditableText.heightInLines = this.textDisplayProperties.heightInLines;
				newTextDisplayProperties.heightInLines = true;
			}
			
			this.textDisplayProperties = newTextDisplayProperties;    
		}
		/**
		 * textDisplay移除
		 */		
		private textDisplayRemoved():void{        
			var newTextDisplayProperties:any = {};
			var richEditableText:EditableText = <EditableText><any> (this.textDisplay);
			
			if(this.textDisplayProperties.displayAsPassword){
				newTextDisplayProperties.displayAsPassword = this.textDisplay.displayAsPassword;
			}
			
			if(this.textDisplayProperties.textColor){
				newTextDisplayProperties.textColor = this.textDisplay.textColor;
			}
			
			if(this.textDisplayProperties.editable){
				newTextDisplayProperties.editable = this.textDisplay.editable;
			}
			
			if(this.textDisplayProperties.maxChars){
				newTextDisplayProperties.maxChars = this.textDisplay.maxChars;
			}
			
			if(this.textDisplayProperties.maxHeight){
				newTextDisplayProperties.maxHeight = this.textDisplay.maxHeight;
			}
			
			if(this.textDisplayProperties.maxWidth){
				newTextDisplayProperties.maxWidth = this.textDisplay.maxWidth;
			}
			
			if(this.textDisplayProperties.restrict){
				newTextDisplayProperties.restrict = this.textDisplay.restrict;
			}
			
			if(this.textDisplayProperties.selectable){
				newTextDisplayProperties.selectable = this.textDisplay.selectable;
			}
			
			if(this.textDisplayProperties.text){
				newTextDisplayProperties.text = this.textDisplay.text;
			}
			
			if (this.textDisplayProperties.heightInLines&& richEditableText){
				newTextDisplayProperties.heightInLines = richEditableText.heightInLines;
			}
			
			if (this.textDisplayProperties.widthInChars && richEditableText){
				newTextDisplayProperties.widthInChars = richEditableText.widthInChars;
			}
			
			this.textDisplayProperties = newTextDisplayProperties;
		}
		/**
		 * textDisplay文字改变事件
		 */
		private textDisplay_changeHandler(event:Event):void{        
			this.invalidateDisplayList();
			this.dispatchEvent(event);
		}
		/**
		 * textDisplay文字即将改变事件
		 */		
		private textDisplay_changingHandler(event:Event):void{
            var newEvent: Event =
                new Event(event.type, false, true);
            newEvent.data = event.data;
            this.dispatchEvent(newEvent);

            if (newEvent.isDefaultPrevented())
                event.preventDefault();
        }
	}
}