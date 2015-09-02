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
     * @class egret.gui.BitmapLabel
     * @classdesc
     * 一行或多行不可编辑的位图文本控件
     * @extends egret.gui.UIComponent
     */
    export class BitmapLabel extends UIComponent implements IDisplayText {

        private _bitmapText:BitmapText = null;

        /**
         * @method egret.gui.Label#constructor
         */
        public constructor() {
            super();
            this.addEventListener(UIEvent.UPDATE_COMPLETE, this.updateCompleteHandler, this);
        }

        /**
         * 一个验证阶段完成
         */
        private updateCompleteHandler(event:UIEvent):void {
            this.lastUnscaledWidth = NaN;
        }

        private _textChanged:boolean = false;
        private _text:string = "";
        /**
         * @member egret.gui.BitmapLabel#text
         * 设置或获取显示文本
         */
        public set text(value:string) {
            if (this._text == value)
                return;
            this._text = value;
            this._textChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        public get text():string {
            return this._text;
        }

        private fontChanged:boolean = false;

        public _font:any;
        /**
         * 位图字体标识符，可以是BitmapFont对象或者在资源表中的key。
         * @member egret.gui.BitmapLabel#font
         */
        public get font():any {
            return this._font;
        }

        public set font(value:any) {
            if (this._font == value)
                return;
            this._font = value;
            if (this.createChildrenCalled) {
                this.parseFont();
            }
            else {
                this.fontChanged = true;
            }
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private _isLetterSpacingChanged:boolean = false;
        public _letterSpacing:number = 0;
        /**
         * 字符之间的距离
         * @default 0
         * @param value
         */
        public set letterSpacing(value:number) {
            this._setLetterSpacing(value);
        }

        public _setLetterSpacing(value:number):void {
            this._letterSpacing = value;

            this._isLetterSpacingChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        public get letterSpacing():number {
            return this._letterSpacing;
        }

        private _isLineSpacingChanged:boolean = false;
        public _lineSpacing:number = 0;
        /**
         * 行与行之间的距离
         * @default 0
         * @param value
         */
        public set lineSpacing(value:number) {
            this._setLineSpacing(value);
        }

        public _setLineSpacing(value:number):void {
            this._lineSpacing = value;

            this._isLineSpacingChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        public get lineSpacing():number {
            return this._lineSpacing;
        }

        private createChildrenCalled:boolean = false;

        /**
         * 创建子对象
         */
        public createChildren():void {
            super.createChildren();
            if (!this._bitmapText) {
                this.checkBitmapText();
            }
            if (this.fontChanged) {
                this.parseFont();
            }
            this.createChildrenCalled = true;
        }

        /**
         * 皮肤解析适配器
         */
        private static assetAdapter:IAssetAdapter;

        /**
         * 解析source
         */
        private parseFont():void {
            this.fontChanged = false;
            var adapter:IAssetAdapter = BitmapLabel.assetAdapter;
            if (!adapter) {
                adapter = this.getAdapter();
            }
            if (!this._font) {
                this.onFontChanged(null, null);
            }
            else {
                adapter.getAsset(this._font, this.onFontChanged, this, null);
            }
        }

        /**
         * 获取资源适配器
         */
        private getAdapter():IAssetAdapter {
            var adapter:IAssetAdapter;
            try {
                adapter = $getAdapter("egret.gui.IAssetAdapter");
            }
            catch (e) {
                adapter = new DefaultAssetAdapter();
            }
            BitmapLabel.assetAdapter = adapter;
            return adapter;
        }

        /**
         * 皮肤发生改变
         */
        private onFontChanged(bitmapFont:any, font:any):void {
            if (font !== this._font)
                return;
            this._bitmapText.font = bitmapFont;
            this.invalidateSize();
            this.invalidateDisplayList();
        }


        /**
         * 上一次测量的宽度
         */
        private lastUnscaledWidth:number = NaN;

        private _padding:number = 0;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.BitmapLabel#padding
         */
        public get padding():number {
            return this._padding;
        }

        public set padding(value:number) {
            if (this._padding == value)
                return;
            this._padding = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private _paddingLeft:number = NaN;
        /**
         * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingLeft
         */
        public get paddingLeft():number {
            return this._paddingLeft;
        }

        public set paddingLeft(value:number) {
            if (this._paddingLeft == value)
                return;

            this._paddingLeft = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         *
         * @type {number}
         * @private
         */
        private _paddingRight:number = NaN;
        /**
         * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingRight
         */
        public get paddingRight():number {
            return this._paddingRight;
        }

        public set paddingRight(value:number) {
            if (this._paddingRight == value)
                return;

            this._paddingRight = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         *
         * @type {number}
         * @private
         */
        private _paddingTop:number = NaN;
        /**
         * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingTop
         */
        public get paddingTop():number {
            return this._paddingTop;
        }

        public set paddingTop(value:number) {
            if (this._paddingTop == value)
                return;

            this._paddingTop = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         *
         * @type {number}
         * @private
         */
        private _paddingBottom:number = NaN;
        /**
         * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingBottom
         */
        public get paddingBottom():number {
            return this._paddingBottom;
        }

        public set paddingBottom(value:number) {
            if (this._paddingBottom == value)
                return;

            this._paddingBottom = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * 计算  容器默认大小的最小值和最大值
         * @method egret.gui.BitmapLabel#measure
         */
        public measure():void {
            //先提交属性，防止样式发生改变导致的测量不准确问题。
            if (this._UIC_Props_._invalidatePropertiesFlag)
                this.validateProperties();
            if (this.isSpecialCase()) {
                if (isNaN(this.lastUnscaledWidth)) {
                    this._UIC_Props_._oldPreferWidth = NaN;
                    this._UIC_Props_._oldPreferHeight = NaN;
                }
                else {
                    this.measureUsingWidth(this.lastUnscaledWidth);
                    return;
                }
            }

            var availableWidth:number;

            if (!isNaN(this.$getExplicitWidth())) {
                availableWidth = this.$getExplicitWidth();
            }
            else if (this.maxWidth != 10000)
                availableWidth = this.maxWidth;

            this.measureUsingWidth(availableWidth);
        }

        /**
         * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
         */
        private isSpecialCase():boolean {
            return (!isNaN(this.percentWidth) || (!isNaN(this.left) && !isNaN(this.right))) &&
                isNaN(this.$getExplicitWidth()) &&
                isNaN(this.percentHeight);
        }

        /**
         * 使用指定的宽度进行测量
         */
        private measureUsingWidth(w:number):void {
            if (this._textChanged) {
                this._bitmapText.text = this._text;
            }

            if (this._isLetterSpacingChanged) {
                this._bitmapText.letterSpacing = this._letterSpacing;
            }
            if (this._isLineSpacingChanged) {
                this._bitmapText.lineSpacing = this._lineSpacing;
            }

            var padding:number = isNaN(this._padding) ? 0 : this._padding;
            var paddingL:number = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight) ? padding : this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop) ? padding : this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom) ? padding : this._paddingBottom;

            this._bitmapText.width = NaN;
            this._bitmapText.height = NaN;
            if (!isNaN(w)) {
                this._bitmapText.width = w - paddingL - paddingR;
                this.measuredWidth = Math.ceil(this._bitmapText.width);
                this.measuredHeight = Math.ceil(this._bitmapText.height);
            }
            else {
                this.measuredWidth = Math.ceil(this._bitmapText.width);
                this.measuredHeight = Math.ceil(this._bitmapText.height);
            }
            this.measuredWidth += paddingL + paddingR;
            this.measuredHeight += paddingT + paddingB;

        }

        /**
         * 通过设置此容器子项的位置和大小来响应大小更改
         * @method egret.gui.BitmapLabel#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (!this._bitmapText)
                return;
            var padding:number = isNaN(this._padding) ? 0 : this._padding;
            var paddingL:number = isNaN(this._paddingLeft) ? padding : this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight) ? padding : this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop) ? padding : this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom) ? padding : this._paddingBottom;

            this._bitmapText.x = paddingL;
            this._bitmapText.y = paddingT;
            if (this.isSpecialCase()) {
                var firstTime:boolean = isNaN(this.lastUnscaledWidth) ||
                    this.lastUnscaledWidth != unscaledWidth;
                this.lastUnscaledWidth = unscaledWidth;
                if (firstTime) {
                    this._UIC_Props_._oldPreferWidth = NaN;
                    this._UIC_Props_._oldPreferHeight = NaN;
                    this.invalidateSize();
                    return;
                }
            }
            //防止在父级validateDisplayList()阶段改变的text属性值，
            //接下来直接调用自身的updateDisplayList()而没有经过measure(),使用的测量尺寸是上一次的错误值。
            if (this._UIC_Props_._invalidateSizeFlag)
                this.validateSize();

            if (!this._bitmapText.visible)//解决初始化时文本闪烁问题
                this._bitmapText.visible = true;

            this._bitmapText.width = unscaledWidth - paddingL - paddingR;
            var unscaledTextHeight:number = unscaledHeight - paddingT - paddingB;
            this._bitmapText.height = unscaledTextHeight;

        }

        private checkBitmapText() {
            if (this._bitmapText)
                return;
            this._bitmapText = new BitmapText();
            this._bitmapText.text = this._text;
            this._bitmapText.letterSpacing = this._letterSpacing;
            this._bitmapText.lineSpacing = this._lineSpacing;
            this._textChanged = false;
            this._isLetterSpacingChanged = false;
            this._isLineSpacingChanged = false;
            this._addToDisplayList(this._bitmapText);
        }

        /**
         * 处理对组件设置的属性
         */
        public commitProperties():void {
            super.commitProperties();

            if (!this._bitmapText) {
                this.checkBitmapText();
            }
            if (this._textChanged) {
                this._bitmapText.text = this._text;
                this._textChanged = false;
            }
            if (this._isLetterSpacingChanged) {
                this._bitmapText.letterSpacing = this._letterSpacing;
                this._isLetterSpacingChanged = false;
            }
            if (this._isLineSpacingChanged) {
                this._bitmapText.lineSpacing = this._lineSpacing;
                this._isLineSpacingChanged = false;
            }
        }

    }
}