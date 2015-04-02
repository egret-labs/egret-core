/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, textfield list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, textfield list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from textfield software without specific prior written permission.
 *
 * textfield SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF textfield
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @private
     */
    export class TextFieldUtils {
        /**
         * 根据点击的坐标获取当前光标的位置
         * @param x
         * @param y
         * @return 光标的位置
         * @private
         */
        public static _getHitIndex(textfield:egret.TextField, x:number, y:number):number {
            if (textfield._textMaxHeight == 0) {//文本可点击区域
                return 0;
            }
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();

            var idx:number = 0;
            var line:number = -1;
            var lineH:number = 0;
            var startLine:number = Math.max(textfield._scrollV - 1, 0);
            var startY:number = TextFieldUtils.getStartY(textfield, TextFieldUtils._getValign(textfield));
            var scrollNum:number = TextFieldUtils._getScrollNum(textfield);
            var i:number = 0;
            for (; i < lineArr.length && i < scrollNum + startLine; i++) {
                var lineEle:egret.ILineElement = lineArr[i];

                if (i < startLine) {
                }
                else {
                    if (lineH + lineEle.height + startY >= y) {
                        line = i;
                        break;
                    }
                    else {
                        lineH += lineEle.height;
                    }

                    if (lineH + textfield._lineSpacing + startY >= y) {
                        line = i;
                        break;
                    }
                }

                if (i == scrollNum + startLine - 1) {
                    line = i;
                }
                else {
                    idx += lineEle.charNum;
                }
            }

            if(i == lineArr.length) {//最下面
                return textfield._text.length;
            }

            var lineEle:egret.ILineElement = lineArr[line];
            var startWidth:number = TextFieldUtils._getStartXAtLine(textfield, line, TextFieldUtils._getHalign(textfield));

            var rendererContext = egret.MainContext.instance.rendererContext;
            rendererContext.setupFont(textfield);
            if (lineEle.elements.length) {
                var iwTE:IWTextElement = lineEle.elements[0];
                var startX:number = TextFieldUtils._getStartXAtLine(textfield, line, TextFieldUtils._getHalign(textfield));
                if (x < startX) {//在前面

                }
                else if (startX + iwTE.width < x) {//在最外面
                    idx += iwTE.text.length;
                }
                else {//在
                    var lineW:number = 0;
                    for (var j = 0; j < iwTE.text.length; j++) {
                        var w:number = rendererContext.measureText(iwTE.text.charAt(j));
                        if (lineW + w / 2 + startWidth > x) {//在半个字前面
                            break;
                        }
                        else {
                            idx++;
                            lineW += w;
                        }
                    }
                }
            }

            return idx;
        }

        public static _getStartLine(textfield:egret.TextField):number {
            var textHeight:number = textfield._multiline ? textfield._textMaxHeight + (textfield._numLines - 1) * textfield._lineSpacing : textfield._size;
            var startLine:number = 0;
            if (textfield._hasHeightSet) {//
                if (textHeight < textfield._explicitHeight) {//最大高度比需要显示的高度小

                }
                else if (textHeight > textfield._explicitHeight) {//最大高度比需要显示的高度大
                    startLine = Math.max(textfield._scrollV - 1, 0);
                    startLine = Math.min(textfield._numLines - 1, startLine);
                }

                if (!textfield._multiline) {
                    startLine = Math.max(textfield._scrollV - 1, 0);
                    startLine = Math.min(textfield._numLines - 1, startLine);
                }
            }

            return startLine;
        }

        /**
         * 某一行绘制的起始x坐标
         * @param line
         * @param halign
         * @returns {number}
         */
        public static _getStartXAtLine(textfield:egret.TextField, line:number, halign:number):number {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            var maxWidth:number = textfield._hasWidthSet ? textfield._explicitWidth : textfield._textMaxWidth;

            return halign * (maxWidth - lineArr[line].width);
        }

        public static _getHalign(textfield:egret.TextField):number {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            var halign:number = 0;
            if (textfield._textAlign == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield._textAlign == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            if (!textfield._multiline && lineArr.length > 1) {
                halign = 0;
            }

            return halign;
        }

        /**
         * 获取某一行绘制的起始y坐标
         * @param line
         * @param valign
         * @returns {number}
         */
        public static _getStartYAtLine(textfield:egret.TextField, line:number, valign:number):number {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            var startY:number = TextFieldUtils.getStartY(textfield, valign);
            var startLine:number = Math.max(textfield._scrollV - 1, 0);
            for (var i:number = startLine; i < lineArr.length; i++) {
                if (i == line) {
                    break;
                }
                startY += lineArr[i].height + textfield._lineSpacing;
            }

            return startY;
        }

        /**
         * 整体绘制的起始y坐标
         * @param valign
         * @returns {number}
         */
        private static getStartY(textfield:egret.TextField, valign:number):number {
            var textHeight:number = textfield._multiline ? textfield._textMaxHeight + (textfield._numLines - 1) * textfield._lineSpacing : textfield._size;
            if (textfield._hasHeightSet && textHeight < textfield._explicitHeight) {
                return valign * (textfield._explicitHeight - textHeight);
            }
            else {
                return 0;
            }
        }
        public static _getValign(textfield:egret.TextField):number{
            var textHeight:number = textfield._multiline ? textfield._textMaxHeight + (textfield._numLines - 1) * textfield._lineSpacing : textfield._size;
            if (textfield._type == egret.TextFieldType.INPUT) {
                if (textfield._multiline) {
                    return 0;
                }
                return 0.5;
            }
            if (textfield._hasHeightSet) {//
                if (textHeight < textfield._explicitHeight) {//最大高度比需要显示的高度小
                    var valign:number = 0;
                    if (textfield._verticalAlign == VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield._verticalAlign == VerticalAlign.BOTTOM)
                        valign = 1;

                    return valign;
                }
            }
            return 0;
        }

        public static _getScrollNum(textfield:egret.TextField):number {
            var scrollNum:number = 1;
            if (textfield._multiline) {
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

        public static _getSelectionScrollV(textfield:egret.TextField, oppositeSelectionEnd:number, isBack:boolean):number {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            var selection:number = textfield._text.length - oppositeSelectionEnd;
            var chars:number = 0;
            var selectionScrollV:number = 0;
            for (var i:number = 0; i < lineArr.length; i++) {
                chars += lineArr[i].charNum;
                if (chars >= selection) {
                    if (chars == selection && lineArr[i].hasNextLine) {
                        selectionScrollV = i + 2;
                    }
                    else {
                        selectionScrollV = i + 1;
                    }
                    break;
                }
            }

            var scrollNum:number = TextFieldUtils._getScrollNum(textfield);

            if (isBack) {
                if (selectionScrollV - 1 + scrollNum  >= lineArr.length) {
                    return Math.max(lineArr.length - scrollNum + 1, 1);
                }
            }

            if (textfield._scrollV <= selectionScrollV && textfield._scrollV + scrollNum - 1 >= selectionScrollV) {
                return textfield._scrollV;
            }

            if (isBack) {
                return selectionScrollV;
            }

            return Math.max(selectionScrollV - scrollNum + 1, 1);
        }


        public static _getTextElement(textfield:egret.TextField, x:number, y:number):ITextElement {
            var hitTextEle:IHitTextElement = TextFieldUtils._getHit(textfield, x, y);

            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            if (hitTextEle && lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        }

        public static _getHit(textfield:egret.TextField, x:number, y:number):IHitTextElement {
            var lineArr:Array<egret.ILineElement>  = textfield._getLinesArr();
            if (textfield._textMaxWidth == 0) {//文本可点击区域
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

                if (lineH + textfield._lineSpacing > y) {
                    return null;
                }

                lineH += textfield._lineSpacing;
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

    }
}