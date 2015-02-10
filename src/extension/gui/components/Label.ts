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
     * @class egret.gui.Label
     * @classdesc
     * 一行或多行不可编辑的文本控件
     * @extends egret.gui.TextBase
     */
    export class Label extends TextBase{
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
        private updateCompleteHandler(event:UIEvent):void{
            this.lastUnscaledWidth = NaN;
        }

        private _maxDisplayedLines:number = 0;
        /**
         * 最大显示行数,0或负值代表不限制。
         * @member egret.gui.Label#maxDisplayedLines
         */
        public get maxDisplayedLines():number{
            return this._maxDisplayedLines;
        }

        public set maxDisplayedLines(value:number){
            if(this._maxDisplayedLines==value)
                return;
            this._maxDisplayedLines = value;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * 上一次测量的宽度
         */
        private lastUnscaledWidth:number = NaN;

        private strokeColorChanged:boolean = false;
        private _strokeColor:number = 0x000000;
        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0x000000。
         * @member {number} egret.TextField#strokeColor
         */
        public get strokeColor():number {
            return this._strokeColor;
        }

        public set strokeColor(value:number) {
            this._setStrokeColor(value);
        }

        public _setStrokeColor(value:number):void {
            if (this._strokeColor == value) {
                return;
            }
            this._strokeColor = value;
            this.strokeColorChanged = true;
            this.invalidateProperties();
        }

        /**
         * 表示描边宽度。
         * 0为没有描边。
         * 默认值为 0。
         * @member {number} egret.TextField#stroke
         */
        private _stroke:number = 0;
        private strokeChanged:boolean = false;

        public get stroke():number {
            return this._stroke;
        }

        public set stroke(value:number) {
            if(this._stroke==value){
                return;
            }
            this._stroke = value;
            this.strokeChanged = true;
            this.invalidateProperties();
        }

        private _padding:number = 0;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.Label#padding
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
         * @member egret.gui.Label#paddingLeft
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
         * @member egret.gui.Label#paddingRight
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
         * @member egret.gui.Label#paddingTop
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
         * @member egret.gui.Label#paddingBottom
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
         * 处理对组件设置的属性
         * @method egret.gui.TextBase#commitProperties
         */
        public commitProperties():void {
            super.commitProperties();

            if (this.strokeColorChanged) {
                this._textField.strokeColor = this._strokeColor;
                this.strokeColorChanged = false;
            }
            if (this.strokeChanged) {
                this._textField.stroke = this._stroke;
                this.strokeChanged = false;
            }

        }
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.Label#measure
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
            return this._maxDisplayedLines!=1&&
                (!isNaN(this.percentWidth) || (!isNaN(this.left) && !isNaN(this.right))) &&
                isNaN(this.explicitHeight) &&
                isNaN(this.percentHeight);
        }

        /**
         * 使用指定的宽度进行测量
         */
        private measureUsingWidth(w:number):void{
            if(this._textChanged){
                this._textField.text = this._text;
            }
            if (this._textFlowChanged) { 
                this._textField.textFlow = this._textFlow;
            }

            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._textField.width = NaN;
            this._textField.height = NaN;
            if (!isNaN(w)){
                this._textField.width = w - paddingL - paddingR;
                this.measuredWidth = Math.ceil(this._textField.measuredWidth);
                this.measuredHeight = Math.ceil(this._textField.measuredHeight);
            }
            else{
                this.measuredWidth = Math.ceil(this._textField.measuredWidth);
                this.measuredHeight = Math.ceil(this._textField.measuredHeight);
            }

            if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
                var size:number = this._textField.size;
                var lineSpacing:number = this._textField.lineSpacing;
                this.measuredHeight = (size+lineSpacing)*this._maxDisplayedLines-lineSpacing;
            }

            this.measuredWidth += paddingL + paddingR;
            this.measuredHeight += paddingT + paddingB;

        }

        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.Label#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number,unscaledHeight:number):void{
            this.$updateDisplayList(unscaledWidth,unscaledHeight);

            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._textField.x = paddingL;
            this._textField.y = paddingT;
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

            if(!this._textField.visible)//解决初始化时文本闪烁问题
                this._textField.visible = true;

            this._textField.width = unscaledWidth - paddingL - paddingR;
            var unscaledTextHeight:number = unscaledHeight - paddingT - paddingB;
            this._textField.height = unscaledTextHeight;

            if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
                var size:number = this._textField.size;
                var lineSpacing:number = this._textField.lineSpacing;
                var h:number = (size+lineSpacing)*this._maxDisplayedLines-lineSpacing;
                this._textField.height = Math.min(unscaledTextHeight,h);
            }
        }
    }
}