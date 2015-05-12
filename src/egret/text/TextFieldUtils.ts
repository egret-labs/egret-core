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
     * @private
     */
    export class TextFieldUtils {

        /**
         * 获取第一个绘制的行数
         * @param textfield 文本
         * @returns {number} 行数，从0开始
         * @private
         */
        public static _getStartLine(textfield:egret.TextField):number {
            var textHeight:number = TextFieldUtils._getTextHeight(textfield);
            var startLine:number = 0;
            if (textfield._DO_Props_._hasHeightSet) {//
                if (textHeight < textfield._DO_Props_._explicitHeight) {//最大高度比需要显示的高度小

                }
                else if (textHeight > textfield._DO_Props_._explicitHeight) {//最大高度比需要显示的高度大
                    startLine = Math.max(textfield._TF_Props_._scrollV - 1, 0);
                    startLine = Math.min(textfield._TF_Props_._numLines - 1, startLine);
                }

                if (!textfield._TF_Props_._multiline) {
                    startLine = Math.max(textfield._TF_Props_._scrollV - 1, 0);
                    startLine = Math.min(textfield._TF_Props_._numLines - 1, startLine);
                }
            }

            return startLine;
        }

        /**
         * 获取水平比例
         * @param textfield 文本
         * @returns {number} 水平比例
         * @private
         */
        public static _getHalign(textfield:egret.TextField):number {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            var halign:number = 0;
            if (textfield._TF_Props_._textAlign == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield._TF_Props_._textAlign == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            if (textfield._TF_Props_._type == egret.TextFieldType.INPUT && !textfield._TF_Props_._multiline && lineArr.length > 1) {
                halign = 0;
            }

            return halign;
        }

        public static _getTextHeight(textfield:egret.TextField):number {
            var textHeight:number = (egret.TextFieldType.INPUT == textfield._TF_Props_._type && !textfield._TF_Props_._multiline) ? textfield._TF_Props_._size : (textfield._TF_Props_._textMaxHeight + (textfield._TF_Props_._numLines - 1) * textfield._TF_Props_._lineSpacing);
            return textHeight;
        }

        /**
         * 获取垂直比例
         * @param textfield 文本
         * @returns {number} 垂直比例
         * @private
         */
        public static _getValign(textfield:egret.TextField):number{
            var textHeight:number = TextFieldUtils._getTextHeight(textfield);
            if (textfield._TF_Props_._type == egret.TextFieldType.INPUT) {
                if (textfield._TF_Props_._multiline) {
                    return 0;
                }
                return 0.5;
            }
            if (textfield._DO_Props_._hasHeightSet) {//
                if (textHeight < textfield._DO_Props_._explicitHeight) {//最大高度比需要显示的高度小
                    var valign:number = 0;
                    if (textfield._TF_Props_._verticalAlign == VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield._TF_Props_._verticalAlign == VerticalAlign.BOTTOM)
                        valign = 1;

                    return valign;
                }
            }
            return 0;
        }

        /**
         * 根据x、y获取文本项
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本单项
         * @private
         */
        public static _getTextElement(textfield:egret.TextField, x:number, y:number):ITextElement {
            var hitTextEle:IHitTextElement = TextFieldUtils._getHit(textfield, x, y);

            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            if (hitTextEle && lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        }

        /**
         * 获取文本点击块
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本点击块
         * @private
         */
        public static _getHit(textfield:egret.TextField, x:number, y:number):IHitTextElement {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            if (textfield._TF_Props_._textMaxWidth == 0) {//文本可点击区域
                return null;
            }
            var line:number = 0;

            var lineH:number = 0;
            for (var i:number = 0; i < lineArr.length; i++) {
                var lineEle:egret.ILineElement = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    line = i + 1;
                    break;
                }
                else {
                    lineH += lineEle.height;
                }

                if (lineH + textfield._TF_Props_._lineSpacing > y) {
                    return null;
                }

                lineH += textfield._TF_Props_._lineSpacing;
            }
            if(line === 0) {
                return null;
            }
            var lineElement:egret.ILineElement = lineArr[line - 1];
            var lineW:number = 0;
            for (i = 0; i < lineElement.elements.length; i++) {
                var iwTE:IWTextElement = lineElement.elements[i];

                if (lineW + iwTE.width < x) {
                    lineW += iwTE.width;
                }
                else {
                    return {"lineIndex" : line - 1, "textElementIndex" : i};
                }
            }

            return null;
        }

        /**
         * 获取当前显示多少行
         * @param textfield 文本
         * @returns {number} 显示的行数
         * @private
         */
        public static _getScrollNum(textfield:egret.TextField):number {
            var scrollNum:number = 1;
            if (textfield._TF_Props_._multiline) {
                var height = textfield.height;
                var size = textfield.size;
                var lineSpacing = textfield.lineSpacing;
                scrollNum = Math.floor(height / (size + lineSpacing));
                var leftH = height - (size + lineSpacing) * scrollNum;
                if (leftH > size / 2) {
                    scrollNum++;
                }
            }
            return scrollNum;
        }

    }
}