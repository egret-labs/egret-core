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
     * @class egret.gui.BitmapLabel
     * @classdesc
     * 一行或多行不可编辑的位图文本控件
     * @extends egret.gui.TextBase
     */
    export class BitmapLabel extends UIComponent implements IDisplayText{
        private _bitmapText: BitmapText = null;
        /**
         * @method egret.gui.Label#constructor
         */
        public constructor(){
            super();
            this.addEventListener(UIEvent.UPDATE_COMPLETE, this.updateCompleteHandler, this);
        }
        /**
         * 一个验证阶段完成
         */
        private updateCompleteHandler(event: UIEvent): void {
            this.lastUnscaledWidth = NaN;
        }
        private _textChanged: boolean = false;
        private _text: string = null;
        /**
		 * @member egret.gui.BitmapLabel#text
         * 设置或获取显示文本
		 */
        public set text(val:string) { 
            if (this._text == val)
                return;
            this._text = val;
            this._textChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }
        public get text():string { 
            return this._text;
        }

        private _spriteSheetChanged: boolean = false;
        private _spriteSheet: BitmapTextSpriteSheet = null;
        private _spriteSheetNotLoaded: boolean = false;



        private _font: any = null;
        private _sourceChanged: boolean = false;
        /**
         * @member egret.gui.BitmapLabel#font
         * 位图字体数据源，可以为 BitmapTextSpriteSheet 实例或在资源文件中的key
         */
        public get font() {
            return this._font;
        }

        public set font(val: any) {
            if (this._font == val)
                return;
            this._font = val;
            if (val instanceof BitmapTextSpriteSheet) { 
                this._spriteSheet = val;
            }
            this._sourceChanged = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }


        /**
         * 上一次测量的宽度
         */
        private lastUnscaledWidth: number = NaN;

        private _padding:number = 0;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.BitmapLabel#padding
         */
        public get padding():number{
            return this._padding;
        }
        public set padding(value:number){
            if(this._padding==value)
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
        public get paddingLeft():number{
            return this._paddingLeft;
        }

        public set paddingLeft(value:number){
            if (this._paddingLeft == value)
                return;

            this._paddingLeft = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private _paddingRight:number = NaN;
        /**
         * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingRight
         */
        public get paddingRight():number{
            return this._paddingRight;
        }

        public set paddingRight(value:number){
            if (this._paddingRight == value)
                return;

            this._paddingRight = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private _paddingTop:number = NaN;
        /**
         * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingTop
         */
        public get paddingTop():number{
            return this._paddingTop;
        }

        public set paddingTop(value:number){
            if (this._paddingTop == value)
                return;

            this._paddingTop = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        private _paddingBottom:number = NaN;
        /**
         * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingBottom
         */
        public get paddingBottom():number{
            return this._paddingBottom;
        }

        public set paddingBottom(value:number){
            if (this._paddingBottom == value)
                return;

            this._paddingBottom = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * @method egret.gui.BitmapLabel#measure
         */
        public measure():void{
            //先提交属性，防止样式发生改变导致的测量不准确问题。
            if(this._invalidatePropertiesFlag)
                this.validateProperties();
            if (this.isSpecialCase()){
                if (isNaN(this.lastUnscaledWidth)){
                    this._oldPreferWidth = NaN;
                    this._oldPreferHeight = NaN;
                }
                else{
                    this.measureUsingWidth(this.lastUnscaledWidth);
                    return;
                }
            }

            var availableWidth:number;

            if (!isNaN(this.explicitWidth))
                availableWidth = this.explicitWidth;
            else if (this.maxWidth!=10000)
                availableWidth = this.maxWidth;

            this.measureUsingWidth(availableWidth);
        }

        /**
         * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
         */
        private isSpecialCase():boolean{
            return (!isNaN(this.percentWidth) || (!isNaN(this.left) && !isNaN(this.right))) &&
                isNaN(this.explicitHeight) &&
                isNaN(this.percentHeight);
        }

        /**
         * 使用指定的宽度进行测量
         */
        private measureUsingWidth(w:number):void{
            if (this._spriteSheetNotLoaded)
                return;
            if(this._textChanged){
                this._bitmapText.text = this._text;
            }

            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._bitmapText.width = NaN;
            this._bitmapText.height = NaN;
            if (!isNaN(w)){
                this._bitmapText.width = w - paddingL - paddingR;
                this.measuredWidth = Math.ceil(this._bitmapText.measuredWidth);
                this.measuredHeight = Math.ceil(this._bitmapText.measuredHeight);
            }
            else{
                this.measuredWidth = Math.ceil(this._bitmapText.measuredWidth);
                this.measuredHeight = Math.ceil(this._bitmapText.measuredHeight);
            }


            this.measuredWidth += paddingL + paddingR;
            this.measuredHeight += paddingT + paddingB;

        }

        /**
         * @method egret.gui.BitmapLabel#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number,unscaledHeight:number):void{
            super.updateDisplayList(unscaledWidth,unscaledHeight);
            if (this._bitmapText == null)
                return;
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._bitmapText.x = paddingL;
            this._bitmapText.y = paddingT;
            if (this.isSpecialCase()){
                var firstTime:boolean = isNaN(this.lastUnscaledWidth) ||
                    this.lastUnscaledWidth != unscaledWidth;
                this.lastUnscaledWidth = unscaledWidth;
                if (firstTime){
                    this._oldPreferWidth = NaN;
                    this._oldPreferHeight = NaN;
                    this.invalidateSize();
                    return;
                }
            }
            //防止在父级validateDisplayList()阶段改变的text属性值，
            //接下来直接调用自身的updateDisplayList()而没有经过measure(),使用的测量尺寸是上一次的错误值。
            if(this._invalidateSizeFlag)
                this.validateSize();

            if(!this._bitmapText.visible)//解决初始化时文本闪烁问题
                this._bitmapText.visible = true;

            this._bitmapText.width = unscaledWidth - paddingL - paddingR;
            var unscaledTextHeight:number = unscaledHeight - paddingT - paddingB;
            this._bitmapText.height = unscaledTextHeight;

        }


        public createChildren(): void {
            super.createChildren();
            this.checkBitmapText();
        }
        private checkBitmapText() {
            if (this._bitmapText != null)
                return; 
            if (this._spriteSheetNotLoaded)
                return;
        
            this._createBitmapText();
            if (this._spriteSheetNotLoaded)
                return;
            this._bitmapText.text = this._text;
            this._textChanged = true;
            this._addToDisplayList(this._bitmapText);
            this.invalidateProperties();
            
        }

        private _createBitmapText() { 
            if (!this._font) {
                Logger.warning("BitmapLabel 的 spriteSheet 为空"); 
                this._spriteSheetNotLoaded = true;
                return;
            }
            var spriteSheet = this._spriteSheet;
            spriteSheet = spriteSheet || RES.getRes(this._font);

            if (spriteSheet) {
                this._bitmapText = new BitmapText();
                this._bitmapText.spriteSheet = spriteSheet;
                this._bitmapText.cacheAsBitmap = true;
            }
            else {
                this.loadSpriteSheet();
            }
        }

        public commitProperties(): void {
            super.commitProperties();

            if (!this._bitmapText) {
                this.checkBitmapText();
            }
            if (this._spriteSheetNotLoaded)
                return;
            if (this._textChanged) {
                this._bitmapText.text = this._text;
                this._textChanged = false;
            }
            if (this._sourceChanged) { 
                this.loadSpriteSheet();
                this._sourceChanged = false;
            }
            if (this._spriteSheetChanged) { 
                this._bitmapText.spriteSheet = this._spriteSheet;
                this._spriteSheetChanged = false;
            }
        }

        private loadSpriteSheet() { 
            this._spriteSheetNotLoaded = true;
            var adapter = this.getAdapter();
            adapter.getAsset(this._font, this.spriteSheetLoaded, this, null);
        }

        private spriteSheetLoaded(content: any, source: any) {
            if (!content) {
                Logger.warning("加载SpriteSheet失败:" + this._font);
            }
            else {
                this._spriteSheetNotLoaded = false;
                this._spriteSheet = content;
                this.checkBitmapText();
                this._spriteSheetChanged = true;
                this.invalidateProperties();
                this.invalidateSize();
                this.invalidateDisplayList();
            }
        }

        private static assetAdapter: IAssetAdapter = null;
        /**
         * 获取资源适配器
         */
        private getAdapter(): IAssetAdapter {
            if (BitmapLabel.assetAdapter)
                return BitmapLabel.assetAdapter;
            var adapter: IAssetAdapter;
            try {
                adapter = Injector.getInstance("egret.gui.IAssetAdapter");
            }
            catch (e) {
                adapter = new DefaultAssetAdapter();
            }
            BitmapLabel.assetAdapter = adapter;
            return adapter;
        }
    }
}