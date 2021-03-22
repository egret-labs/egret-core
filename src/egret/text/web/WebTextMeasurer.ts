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


namespace egret.web {

    /**
     * @private
     */
    let context: CanvasRenderingContext2D = null;
    /**
     * @private
     */
    let fontCache: any = {};

    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    function measureText(text: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): number {
        if (!context) {
            createContext();
        }
        let font = "";
        if (italic)
            font += "italic ";
        if (bold)
            font += "bold ";
        font += ((typeof fontSize == "number" && fontSize >= 0) ? fontSize : 12) + "px ";
        font += ((typeof fontFamily == "string" && fontFamily != "") ? fontFamily : "Arial");
        context.font = font;
        return egret.sys.measureTextWith(context, text);
    }

    /**
     * @private
     */
    function createContext(): void {
        context = sys.canvasHitTestBuffer.context;
        context.textAlign = "left";
        context.textBaseline = "middle";
    }

    sys.measureText = measureText;



    function measureFontHeight(fontFamily: string, fontSize: number, bold: boolean, italic: boolean) {
        if (!context) {
            createContext();
        }

        let font = "";
        if (italic)
            font += "italic ";
        if (bold)
            font += "bold ";
        font += ((typeof fontSize == "number" && fontSize >= 0) ? fontSize : 12) + "px ";
        font += ((typeof fontFamily == "string" && fontFamily != "") ? fontFamily : "Arial");
        context.font = font;


        const canvas = sys.canvasHitTestBuffer.surface;
        const metricsString = METRICS_STRING + BASELINE_SYMBOL;
        const width = Math.ceil(context.measureText(metricsString).width);
        let baseline = Math.ceil(context.measureText(BASELINE_SYMBOL).width);
        const height = HEIGHT_MULTIPLIER * baseline;

        baseline = baseline * BASELINE_MULTIPLIER | 0;

        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);

        context.font = font;

        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.fillText(metricsString, 0, baseline);

        const imagedata = context.getImageData(0, 0, width, height).data;
        const pixels = imagedata.length;
        const line = width * 4;

        let ascent: number, descent: number;

        let i = 0;
        let idx = 0;
        let stop = false;

        // ascent. scan from top to bottom until we find a non red pixel
        for (i = 0; i < baseline; ++i) {
            for (let j = 0; j < line; j += 4) {
                if (imagedata[idx + j] !== 255) {
                    stop = true;
                    break;
                }
            }
            if (!stop) {
                idx += line;
            }
            else {
                break;
            }
        }

        ascent = baseline - i;

        idx = pixels - line;
        stop = false;

        // descent. scan from bottom to top until we find a non red pixel
        for (i = height; i > baseline; --i) {
            for (let j = 0; j < line; j += 4) {
                if (imagedata[idx + j] !== 255) {
                    stop = true;
                    break;
                }
            }

            if (!stop) {
                idx -= line;
            }
            else {
                break;
            }
        }

        descent = i - baseline;
        let fontHeight = ascent + descent;
        return fontHeight;
    }

    sys.measureFontHeight = measureFontHeight;

    const METRICS_STRING = '|ÉqÅ';

    const BASELINE_SYMBOL = 'M';

    const BASELINE_MULTIPLIER = 1.4;

    const HEIGHT_MULTIPLIER = 2.0;



}