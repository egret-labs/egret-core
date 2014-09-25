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


module egret {
    export class TextInput extends Sprite {

        private _text:TextField;
        private stageText:egret.StageText;
        private _isFocus:boolean = false;

        constructor() {
            super();
            this._text = new egret.TextField();
            this.addChild(this._text);
            this._text.size = 30;

            this.stageText = egret.StageText.create();
            var point = this.localToGlobal();
            this.stageText._open(point.x, point.y, this._explicitWidth, this._explicitHeight);
        }

        public _onAddToStage():void {
            super._onAddToStage();

            this.graphics.beginFill(0xffffff, 0);
            this.graphics.drawRect(0, 0, this.width, this.height);
            this.graphics.endFill();

            this.touchEnabled = true;

            this.stageText._addListeners();

            this.stageText.addEventListener("blur", this.onBlurHandler, this);
            this.stageText.addEventListener("focus", this.onFocusHandler, this);
            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
        }

        private onFocusHandler(event):void {
            this.hideText();
        }

        //显示文本
        private onBlurHandler(event):void {
            this.showText();
        }

        //点中文本
        private onMouseDownHandler(event:TouchEvent) {
            event.stopPropagation();

            this.stageText._show();
        }

        //未点中文本
        private onStageDownHandler(event:TouchEvent) {
            this.stageText._hide();

            this.showText();
        }

        private showText():void {
            if (this._isFocus) {
                this._isFocus = false;
                this._text.visible = true;

                this.resetText();
            }
        }

        private hideText():void {
            if (!this._isFocus) {
                this._text.visible = false;
                this._isFocus = true;
            }
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();

            this.stageText._remove();
            this.stageText._removeListeners();

            this.stageText.removeEventListener("blur", this.onBlurHandler, this);
            this.stageText.removeEventListener("focus", this.onFocusHandler, this);
            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
        }

        private updateTextHandler(event):void {
            this.resetText();
        }

        /**
         * @deprecated
         * @param value
         */
        public setText(value:string):void {
            Logger.warning("TextInput.setText()已废弃，请使用TextInput.text设置");
            this.stageText._setText(value);

            this.resetText();
        }

        /**
         * @deprecated
         * @returns {string}
         */
        public getText():string {
            Logger.warning("TextInput.getText()已废弃，请使用TextInput.text获取");
            return this.stageText._getText();
        }

        public set text(value:string) {
            this.stageText._setText(value);

            this.resetText();
        }

        public get text():string {
            return this.stageText._getText();
        }

        public setTextType(type:string):void {
            this.stageText._setTextType(type);

            this.resetText();
        }

        public getTextType():string {
            return this.stageText._getTextType();
        }

        private resetText():void {
            if (this.getTextType() == "password") {
                this._text.text = "";
                for (var i:number = 0, num = this.stageText._getText().length; i < num; i++) {
                    this._text.text += "*";
                }
            }
            else {
                this._text.text = this.stageText._getText();
            }
        }

        public _updateTransform():void {
            //todo 等待worldTransform的性能优化完成，合并这块代码
            var oldTransFormA = this._worldTransform.a;
            var oldTransFormB = this._worldTransform.b;
            var oldTransFormC = this._worldTransform.c;
            var oldTransFormD = this._worldTransform.d;
            var oldTransFormTx = this._worldTransform.tx;
            var oldTransFormTy = this._worldTransform.ty;
            super._updateTransform();
            var newTransForm = this._worldTransform;
            if (oldTransFormA != newTransForm.a ||
                oldTransFormB != newTransForm.b ||
                oldTransFormC != newTransForm.c ||
                oldTransFormD != newTransForm.d ||
                oldTransFormTx != newTransForm.tx ||
                oldTransFormTy != newTransForm.ty) {
                var point = this.localToGlobal();
                this.stageText.changePosition(point.x, point.y);
                this.stageText.changeSize(this._explicitWidth, this._explicitHeight);
            }
        }

        public _draw(renderContext:RendererContext):void {
            super._draw(renderContext);
            this.stageText._draw();
        }

        /**
         * 字号
         * @member {number} egret.TextField#size
         */
        public _size:number = 30;

        public get size():number {
            return this._size;
        }

        public set size(value:number) {
            if (this._size != value) {
                this._size = value;
                this._text.size = value;
                this.stageText.setSize(this._size);
            }
        }

        public _textColorString:string = "#FFFFFF";

        private _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
         * @member {number} egret.TextField#textColor
         */
        public get textColor():number {
            return this._textColor;
        }

        public set textColor(value:number) {
            if (this._textColor != value) {
                this._textColor = value;
                this._textColorString = toColorString(value);
                this._text.textColor = value;
                this.stageText.setTextColor(this._textColorString);
            }
        }

        /**
         * 字体
         * @member {any} egret.TextField#fontFamily
         */
        public _fontFamily = "Arial";

        public get fontFamily():string {
            return this._fontFamily;
        }

        public set fontFamily(value:string) {
            this._setFontFamily(value);
        }

        public _setFontFamily(value:string):void {
            if (this._fontFamily != value) {
                this._fontFamily = value;
                this.stageText.setTextFontFamily(value);
            }
        }

        public _setWidth(value:number):void {
            this._text.width = value;
            this.stageText.setWidth(value);

            super._setWidth(value);
        }

        public _setHeight(value:number):void {
            this._text.height = value;
            this.stageText.setHeight(value);

            super._setHeight(value);
        }


        private _multiline:boolean = false;
        public set multiline(value:boolean) {
            this._setMultiline(value);
        }
        public _setMultiline(value:boolean):void {
            this._multiline = value;
            this.stageText._setMultiline(value);
        }

        /**
         * 表示字段是否为多行文本字段。如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。如果将文本粘贴到其 multiline 值为 false 的 TextField 中，则文本中将除去新行。
         * 默认值为 false。
         * @returns {boolean}
         */
        public get multiline():boolean {
            return this._multiline;
        }
    }
}