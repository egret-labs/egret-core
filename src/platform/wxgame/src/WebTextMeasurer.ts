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


namespace egret.wxapp {

    /**
     * @private
     */
    let context:CanvasRenderingContext2D = null;
    /**
     * @private
     */
    let fontCache:any = {};

    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    function measureText(text:string, fontFamily:string, fontSize:number, bold:boolean, italic:boolean):number {
        if(!context) {
            createContext();
        }
        let font = "";
        if (italic)
            font += "italic ";
        if (bold)
            font += "bold ";
        font += (fontSize || 12) + "px ";
        font += (fontFamily || "Arial");
        context.font = font;
        return context.measureText(text).width;
    }

    /**
     * @private
     */
    function createContext():void {
        context = sys.canvasHitTestBuffer.context;
        context.textAlign = "left";
        context.textBaseline = "middle";
    }

    sys.measureText = measureText;
}