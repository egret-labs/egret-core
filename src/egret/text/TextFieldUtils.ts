//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class TextFieldUtils {

        /**
         * 获取第一个绘制的行数
         * @param textfield 文本
         * @returns {number} 行数，从0开始
         * @private
         */
        static $getStartLine(textfield:egret.TextField):number {
            let values = textfield.$TextField;
            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            let startLine:number = 0;
            let textFieldHeight: number = values[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight)) {//
                if (textHeight < textFieldHeight) {//最大高度比需要显示的高度小

                }
                else if (textHeight > textFieldHeight) {//最大高度比需要显示的高度大
                    startLine = Math.max(values[sys.TextKeys.scrollV] - 1, 0);
                    startLine = Math.min(values[sys.TextKeys.numLines] - 1, startLine);
                }

                if (!values[sys.TextKeys.multiline]) {
                    startLine = Math.max(values[sys.TextKeys.scrollV] - 1, 0);
                    if (values[sys.TextKeys.numLines] > 0) {
                        startLine = Math.min(values[sys.TextKeys.numLines] - 1, startLine);    
                    }
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
        static $getHalign(textfield:egret.TextField):number {
            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr();
            let halign:number = 0;
            if (textfield.$TextField[sys.TextKeys.textAlign] == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield.$TextField[sys.TextKeys.textAlign] == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            if (textfield.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT && !textfield.$TextField[sys.TextKeys.multiline] && lineArr.length > 1) {
                halign = 0;
            }

            return halign;
        }

        /**
         * @private
         * 
         * @param textfield 
         * @returns 
         */
        static $getTextHeight(textfield:egret.TextField):number {
            let textHeight:number = (egret.TextFieldType.INPUT == textfield.$TextField[sys.TextKeys.type]
                && !textfield.$TextField[sys.TextKeys.multiline]) ? textfield.$TextField[sys.TextKeys.fontSize] : (textfield.$TextField[sys.TextKeys.textHeight] + (textfield.$TextField[sys.TextKeys.numLines] - 1) * textfield.$TextField[sys.TextKeys.lineSpacing]);
            return textHeight;
        }

        /**
         * 获取垂直比例
         * @param textfield 文本
         * @returns {number} 垂直比例
         * @private
         */
        static $getValign(textfield:egret.TextField):number{
            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            //if (textfield.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
            //    if (textfield.$TextField[sys.TextKeys.multiline]) {
                    //return 0;
                //}
                //return 0.5;
            //}
            let textFieldHeight:number = textfield.$TextField[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight)) {//
                if (textHeight < textFieldHeight) {//最大高度比需要显示的高度小
                    let valign:number = 0;
                    if (textfield.$TextField[sys.TextKeys.verticalAlign] == VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield.$TextField[sys.TextKeys.verticalAlign] == VerticalAlign.BOTTOM)
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
        static $getTextElement(textfield:egret.TextField, x:number, y:number):ITextElement {
            let hitTextEle:IHitTextElement = TextFieldUtils.$getHit(textfield, x, y);

            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr();
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
        static $getHit(textfield:egret.TextField, x:number, y:number):IHitTextElement {
            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr();
            if (textfield.$TextField[sys.TextKeys.textFieldWidth] == 0) {//文本可点击区域
                return null;
            }
            let line:number = 0;

            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            let startY:number = 0;
            let textFieldHeight:number = textfield.$TextField[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                let valign:number = TextFieldUtils.$getValign(textfield);
                startY = valign * (textFieldHeight - textHeight);
                if (startY != 0) {
                    y -= startY;
                }
            }

            let startLine:number = TextFieldUtils.$getStartLine(textfield);
            let lineH:number = 0;
            for (let i:number = startLine; i < lineArr.length; i++) {
                let lineEle:egret.ILineElement = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    if (lineH < y) {
                        line = i + 1;
                    }
                    break;
                }
                else {
                    lineH += lineEle.height;
                }

                if (lineH + textfield.$TextField[sys.TextKeys.lineSpacing] > y) {
                    return null;
                }

                lineH += textfield.$TextField[sys.TextKeys.lineSpacing];
            }
            if(line == 0) {
                return null;
            }
            let lineElement:egret.ILineElement = lineArr[line - 1];


            let textFieldWidth:number = textfield.$TextField[sys.TextKeys.textFieldWidth];
            if (isNaN(textFieldWidth)) {
                textFieldWidth = textfield.textWidth;
            }
            let halign:number = TextFieldUtils.$getHalign(textfield);
            x -= halign * (textFieldWidth - lineElement.width);
            let lineW:number = 0;
            for (let i = 0; i < lineElement.elements.length; i++) {
                let iwTE:IWTextElement = lineElement.elements[i];

                if (lineW + iwTE.width <= x) {
                    lineW += iwTE.width;
                }
                else if (lineW < x) {
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
        static $getScrollNum(textfield:egret.TextField):number {
            let scrollNum:number = 1;
            if (textfield.$TextField[sys.TextKeys.multiline]) {
                let height = textfield.height;
                let size = textfield.size;
                let lineSpacing = textfield.lineSpacing;
                scrollNum = Math.floor(height / (size + lineSpacing));
                let leftH = height - (size + lineSpacing) * scrollNum;
                if (leftH > size / 2) {
                    scrollNum++;
                }
            }
            return scrollNum;
        }

    }
}