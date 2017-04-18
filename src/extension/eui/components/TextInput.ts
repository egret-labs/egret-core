namespace eui.sys {
    /**
     * @private
     */
    export const enum TextInputKeys {
        prompt,
        displayAsPassword,
        textColor,
        maxChars,
        maxWidth,
        maxHeight,
        text,
        restrict,
        inputType
    }
}
namespace eui {
    import FocusEvent = egret.FocusEvent;
    /**
     *
     */
    /**
     * The TextInput is a textfield input component, the user can input and edit the text.
     *
     * @version Egret 2.5.7
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TextInputExample.ts
     * @language en_US
     */
    /**
     * TextInput 是一个文本输入控件，供用户输入和编辑统一格式文本
     *
     * @version Egret 2.5.7
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TextInputExample.ts
     * @language zh_CN
     */
    export class TextInput extends Component {
        constructor() {
            super();
            this.$TextInput = {
                0: null,          //prompt,
                1: null,          //displayAsPassword
                2: null,          //textColor
                3: null,          //maxChars
                4: null,          //maxWidth
                5: null,          //maxHeight
                6: "",            //text
                7: null,          //restrict
                8:egret.TextFieldInputType.TEXT //inputType
            }
        }

        /**
         * @private
         */
        $TextInput:Object;
        /**
         * [SkinPart] The TextInput display
         * @skinPart
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * [SkinPart] 实体文本输入组件
         * @skinPart
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public textDisplay:EditableText;
        /**
         * [SkinPart] When the property of the text is empty, it will show the defalut string.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        /**
         * [SkinPart] 当text属性为空字符串时要显示的文本。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public promptDisplay:Label;

        /**
         * @copy eui.EditableText#prompt
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get prompt():string {
            if (this.promptDisplay) {
                return this.promptDisplay.text;
            }
            return this.$TextInput[sys.TextInputKeys.prompt];
        }

        /**
         * @copy eui.EditableText#prompt
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set prompt(value:string) {
            this.$TextInput[sys.TextInputKeys.prompt] = value;
            if (this.promptDisplay) {
                this.promptDisplay.text = value;
            }
            this.invalidateProperties();
            this.invalidateState();
        }

        /**
         * @copy egret.TextField#displayAsPassword
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get displayAsPassword(): boolean {
            if (this.textDisplay) {
                return this.textDisplay.displayAsPassword;
            }
            let v = this.$TextInput[sys.TextInputKeys.displayAsPassword];
            return v ? v : false;
        }

        /**
         * @copy egret.TextField#displayAsPassword
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set displayAsPassword(value: boolean) {
            this.$TextInput[sys.TextInputKeys.displayAsPassword] = value;
            if (this.textDisplay) {
                this.textDisplay.displayAsPassword = value;
            }
            this.invalidateProperties();
        }
        /**
         * @copy egret.TextField#inputType
         *
         * @version Egret 3.1.6
         * @version eui 1.0
         * @platform Web,Native
         */
        public set inputType(value: string) {
            this.$TextInput[sys.TextInputKeys.inputType] = value;
            if (this.textDisplay) {
                this.textDisplay.inputType = value;
            }
            this.invalidateProperties();
        }
        /**
         * @copy egret.TextField#inputType
         *
         * @version Egret 3.1.6
         * @version eui 1.0
         * @platform Web,Native
         */
        public get inputType(): string {
            if (this.textDisplay) {
                return this.textDisplay.inputType;
            }
            return this.$TextInput[sys.TextInputKeys.inputType];
        }


        /**
         * @copy egret.TextField#textColor
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get textColor():number {
            if (this.textDisplay) {
                return this.textDisplay.textColor;
            }
            return this.$TextInput[sys.TextInputKeys.textColor];
        }

        /**
         * @copy egret.TextField#textColor
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set textColor(value:number) {
            this.$TextInput[sys.TextInputKeys.textColor] = value;
            if (this.textDisplay) {
                this.textDisplay.textColor = value;
            }
            this.invalidateProperties();
        }

        /**
         * @copy egret.TextField#maxChars
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get maxChars():number {
            if (this.textDisplay) {
                return this.textDisplay.maxChars;
            }
            let v = this.$TextInput[sys.TextInputKeys.maxChars];
            return v ? v : 0;
        }

        /**
         * @copy egret.TextField#maxChars
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set maxChars(value:number) {
            this.$TextInput[sys.TextInputKeys.maxChars] = value;
            if (this.textDisplay) {
                this.textDisplay.maxChars = value;
            }
            this.invalidateProperties();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get maxWidth():number {
            if (this.textDisplay) {
                return this.textDisplay.maxWidth;
            }
            let v = this.$TextInput[sys.TextInputKeys.maxWidth];
            return v ? v : 100000;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set maxWidth(value:number) {
            this.$TextInput[sys.TextInputKeys.maxWidth] = value;
            if (this.textDisplay) {
                this.textDisplay.maxWidth = value;
            }
            this.invalidateProperties();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get maxHeight():number {
            if (this.textDisplay) {
                //return this.textDisplay.maxHeight;
            }
            let v = this.$TextInput[sys.TextInputKeys.maxHeight];
            return v ? v : 100000;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set maxHeight(value:number) {
            this.$TextInput[sys.TextInputKeys.maxHeight] = value;
            if (this.textDisplay) {
                this.textDisplay.maxHeight = value;
            }
            this.invalidateProperties();
        }

        /**
         * @copy egret.TextField#text
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get text():string {
            if (this.textDisplay) {
                return this.textDisplay.text;
            }
            return this.$TextInput[sys.TextInputKeys.text];
        }

        /**
         * @copy egret.TextField#text
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set text(value:string) {
            this.$TextInput[sys.TextInputKeys.text] = value;
            if (this.textDisplay) {
                this.textDisplay.text = value;
            }
            this.invalidateProperties();
            this.invalidateState();
        }

        /**
         * @copy egret.TextField#restrict
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public get restrict():string {
            if (this.textDisplay) {
                return this.textDisplay.restrict;
            }
            return this.$TextInput[sys.TextInputKeys.restrict];
        }

        /**
         * @copy egret.TextField#restrict
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        public set restrict(value:string) {
            this.$TextInput[sys.TextInputKeys.restrict] = value;
            if (this.textDisplay) {
                this.textDisplay.restrict = value;
            }
            this.invalidateProperties();
        }

        /**
         * @private
         */
        private isFocus:boolean = false;

        /**
         * @private
         * 焦点移入
         */
        private focusInHandler(event:FocusEvent):void {
            this.isFocus = true;
            this.invalidateState();
        }

        /**
         * @private
         * 焦点移出
         */
        private focusOutHandler(event:FocusEvent):void {
            this.isFocus = false;
            this.invalidateState();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState():string {
            let skin = this.skin;
            if (this.prompt && !this.isFocus && !this.text) {
                if (this.enabled && skin.hasState("normalWithPrompt")) {
                    return "normalWithPrompt";
                }
                else if (!this.enabled && skin.hasState("disabledWithPrompt")) {
                    return "disabledWithPrompt";
                }
            }
            else {
                if (this.enabled) {
                    return "normal";
                }
                else {
                    return "disabled";
                }
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            let values = this.$TextInput;
            if (instance == this.textDisplay) {
                this.textDisplayAdded();
                if (this.textDisplay instanceof EditableText) {
                    this.textDisplay.addEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    this.textDisplay.addEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }
            }
            else if (instance == this.promptDisplay) {
                if (values[sys.TextInputKeys.prompt]) {
                    this.promptDisplay.text = values[sys.TextInputKeys.prompt];
                }
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);
            if (instance == this.textDisplay) {
                this.textDisplayRemoved();
                if (this.textDisplay instanceof EditableText) {
                    this.textDisplay.removeEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    this.textDisplay.removeEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }
            }
            else if (instance == this.promptDisplay) {
                this.$TextInput[sys.TextInputKeys.prompt] = this.promptDisplay.text
            }
        }

        /**
         * @private
         */
        private textDisplayAdded():void {
            let values = this.$TextInput;
            if (values[sys.TextInputKeys.displayAsPassword]) {
                this.textDisplay.displayAsPassword = values[sys.TextInputKeys.displayAsPassword];
            }
            if (values[sys.TextInputKeys.textColor]) {
                this.textDisplay.textColor = values[sys.TextInputKeys.textColor];
            }
            if (values[sys.TextInputKeys.maxChars]) {
                this.textDisplay.maxChars = values[sys.TextInputKeys.maxChars];
            }
            if (values[sys.TextInputKeys.maxWidth]) {
                this.textDisplay.maxWidth = values[sys.TextInputKeys.maxWidth];
            }
            if (values[sys.TextInputKeys.maxHeight]) {
                this.textDisplay.maxHeight = values[sys.TextInputKeys.maxHeight];
            }
            if (values[sys.TextInputKeys.text]) {
                this.textDisplay.text = values[sys.TextInputKeys.text];
            }
            if (values[sys.TextInputKeys.restrict]) {
                this.textDisplay.restrict = values[sys.TextInputKeys.restrict];
            }
            if (values[sys.TextInputKeys.inputType]) {
                this.textDisplay.inputType = values[sys.TextInputKeys.inputType];
            }
        }
        /**
         * @private
         */
        private textDisplayRemoved() {
            let values = this.$TextInput;
            values[sys.TextInputKeys.displayAsPassword] = this.textDisplay.displayAsPassword;
            values[sys.TextInputKeys.textColor] = this.textDisplay.textColor;
            values[sys.TextInputKeys.maxChars] = this.textDisplay.maxChars;
            values[sys.TextInputKeys.maxWidth] = this.textDisplay.maxWidth;
            values[sys.TextInputKeys.maxHeight] = this.textDisplay.maxHeight;
            values[sys.TextInputKeys.text] = this.textDisplay.text;
            values[sys.TextInputKeys.restrict] = this.textDisplay.restrict;
            values[sys.TextInputKeys.inputType] = this.textDisplay.inputType;
        }
    }
}
