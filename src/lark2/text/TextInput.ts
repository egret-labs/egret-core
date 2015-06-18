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

module egret {

    /**
     * @language en_US
     * The TextInput class is used to create display objects for text display and input.The methods of the TextInput class
     * let you set, select, and manipulate the text inputted by a user.
     * @see egret.TextField
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TextInput 类用于创建显示对象以显示和输入文本。TextInput 类的方法允许您设置、选择并操作用户输入的文本。
     * @see egret.TextField
     * @version Lark 1.0
     * @platform Web,Native
     */
    export class TextInput extends TextField {
        /**
         * @language en_US
         * Creates a new TextInput instance.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TextInput 对象。
         * @version Lark 1.0
         * @platform Web,Native
         */
        constructor() {
            super();
            this.$TextField[sys.TextKeys.wordWrap] = false;
            this.$TextField[sys.TextKeys.selectionActivePosition] = egret.NONE;
            this.$TextField[sys.TextKeys.selectionAnchorPosition] = egret.NONE;
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this.handleTouchBegin, this);

        }

        /**
         * @language en_US
         * Specifies whether the text input is a password text input. If the value of this property is true, the text input
         * is treated as a password text input and hides the input characters using asterisks instead of the actual characters.
         * If false, the text input is not treated as a password text input.
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定输入框是否是密码输入框。如果此属性的值为 true，则输入框被视为密码输入框，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，
         * 则不会将输入框视为密码输入框。
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get displayAsPassword():boolean {
            return this.$TextField[sys.TextKeys.displayAsPassword];
        }

        public set displayAsPassword(value:boolean) {
            if (this.$TextField[sys.TextKeys.displayAsPassword] == value)
                return;
            this.$TextField[sys.TextKeys.displayAsPassword] = value;
            if (value)
                this.wordWrap = false;
            this.$invalidateContentBounds();
        }

        /**
         * @language en_US
         * The maximum number of characters that the text field can contain, as entered by a user. A script can insert more
         * text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the value
         * of this property is 0, a user can enter an unlimited amount of text.
         * @default 0
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 输入框中最多可包含的字符数（即用户输入的字符数）。代码方式可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可
         * 以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * @default 0
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get maxChars():number {
            return this.$TextField[sys.TextKeys.maxChars];
        }

        public set maxChars(value:number) {
            var values = this.$TextField;
            if (values[sys.TextKeys.maxChars] == value)
                return;
            values[sys.TextKeys.maxChars] = value;
            this.updateTextAdapter();
        }

        /**
         * @language en_US
         * A character position, relative to the beginning of the text string, specifying the end of the selection that
         * moves when the selection is extended with the arrow keys.The active position may be either the start or the
         * end of the selection.<br/>
         * For example, if you drag-select from position 12 to position 8, then selectionAnchorPosition will be 12 and
         * selectionActivePosition will be 8, and when you press Left-Arrow selectionActivePosition will become 7.<br/>
         * A value of -1 indicates "not set".
         * @default -1
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于 text 字符串开头的字符位置，用于指定用箭头键扩展选区时该选区的终点。活动位置可以是选区的起点或终点。<br/>
         * 例如，如果拖动选择位置 12 到位置 8 之间的区域，则 selectionAnchorPosition 将为 12，selectionActivePosition 将为 8，
         * 按向左箭头后 selectionActivePosition 将变为 7。<br/>
         * 值为 -1 时，表示“未设置”。
         * @default -1
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get selectionActivePosition(): number {
            var begin = this.$TextField[sys.TextKeys.selectionActivePosition];
            if (isNone(begin))
                begin = this.text.length;
            return begin;
        }

        /**
         * @language en_US
         * A character position, relative to the beginning of the text String, specifying the end of the selection that
         * stays fixed when the selection is extended with the arrow keys.The anchor position may be either the start or
         * the end of the selection.<br/>
         * For example, if you drag-select from position 12 to position 8, then selectionAnchorPosition will be 12 and
         * selectionActivePosition will be 8, and when you press Left-Arrow selectionActivePosition will become 7.<br/>
         * A value of -1 indicates "not set".
         * @default -1
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于 text 字符串开头的字符位置，用于指定用箭头键扩展选区时该选区保持固定的终点。锚点位置可以是选区的起点或终点。<br/>
         * 例如，如果拖动选择位置 12 到位置 8 之间的区域，则 selectionAnchorPosition 将为 12，selectionActivePosition 将为 8，
         * 按向左箭头后 selectionActivePosition 将变为 7。<br/>
         * 值为 -1 时，表示“未设置”。
         * @default -1
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get selectionAnchorPosition(): number {
            var end = this.$TextField[sys.TextKeys.selectionAnchorPosition];
            if (isNone(end))
                end = this.text.length;
            return end;
        }

        /**
         * @language en_US
         * Selects a specified range of characters.<br/>
         * If either position is negative, it will deselect the text range.
         * @param anchorPosition The character position specifying the end of the selection that stays fixed when the selection is extended.
         * @param activePosition The character position specifying the end of the selection that moves when the selection is extended.
         * @see #selectionAnchorPosition
         * @see #selectionActivePosition
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 选择指定范围的字符。<br/>
         * 如果任一位置为负，则它将取消选择该文本范围。
         * @param anchorPosition 字符位置，用于指定扩展选区时保持固定的选区的未端。
         * @param activePosition 字符位置，用于指定扩展选区时移动的选区的未端。
         * @see #selectionAnchorPosition
         * @see #selectionActivePosition
         * @version Lark 1.0
         * @platform Web,Native
         */
        public selectRange(anchorPosition: number, activePosition: number): void {
            anchorPosition = anchorPosition | 0;
            activePosition = activePosition | 0;
            if (anchorPosition == this.$TextField[sys.TextKeys.selectionAnchorPosition]
                && activePosition == this.$TextField[sys.TextKeys.selectionActivePosition])
                return;
            this.$TextField[sys.TextKeys.selectionAnchorPosition] = anchorPosition;
            this.$TextField[sys.TextKeys.selectionActivePosition] = activePosition;
            if (this._isFocus) {
                var layer = sys.$getTextAdapter(this);
                layer.$selectRange(anchorPosition, activePosition);
            }
        }

        /**
         * @private
         */
        private _isTyping:boolean = false;
        /**
         * @private
         */
        private _isFocus:boolean = false;


        /**
         * @private
         */
        private handleTouchBegin(e:TouchEvent) {
            if (this._isFocus)
                return;
            this._isFocus = true;
            this.setAsCurrent();
        }

        /**
         * @private
         */
        private setAsCurrent() {
            var layer = sys.$getTextAdapter(this);
            layer.$setCurrentTextInput(this);
        }

        /**
         * @private
         * Call by TextAdapter set text
         */
        $setUserInputText(text:string) {
            if (text == this.text)
                return;
            this.$setText(text);
            this.dispatchEventWith(Event.CHANGE);
        }

        /**
         * @private
         */
        $startInput() {
            this._isTyping = true;
            this.$invalidateContentBounds();
            this.dispatchEventWith(Event.FOCUS_IN);
        }

        /**
         * @private
         */
        $endInput() {
            this._isTyping = false;
            this._isFocus = false;
            this.$invalidateContentBounds();
            this.dispatchEventWith(Event.FOCUS_OUT);
        }

        /**
         * @private
         */
        $setX(value:number):boolean {
            this.updateTextAdapter();
            return super.$setX(value);
        }

        /**
         * @private
         */
        $setY(value:number):boolean {
            this.updateTextAdapter();
            return super.$setY(value);
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            super.$measureContentBounds(bounds);
            this.updateTextAdapter();
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            if (this._isTyping) {
                return;
            }
            super.$render(context);
        }

        /**
         * @private
         */
        private timeoutId:number = -1;

        /**
         * @private
         */
        private updateTextAdapter() {
            if (!this._isFocus) {
                return;
            }

            if (this.timeoutId != -1)
                clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(()=> {
                if(this._isFocus) {
                    var layer = sys.$getTextAdapter(this);
                    layer.$initializeInput();
                }
                this.timeoutId = -1;
            }, this, 0);
        }

        /**
         * @private
         */
        protected $splitWords(line:string):string[] {
            var words = new Array<string>(line.length);
            for (var i = 0; i < line.length; i++)
                words[i] = line.charAt(i);
            return words;
        }
    }

    registerClass(TextInput, Types.TextInput);
}