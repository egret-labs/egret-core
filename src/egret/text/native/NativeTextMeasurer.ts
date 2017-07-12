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


namespace egret.native {
    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    function measureText(text:string, fontFamily:string, fontSize:number, bold:boolean, italic:boolean):number {
        let font:string;
        var arr:string[];
        if(fontFamily.indexOf(", ") != -1) {
            arr = fontFamily.split(", ");
        }
        else if(fontFamily.indexOf(",") != -1) {
            arr = fontFamily.split(",");
        }
        if(arr) {
            let length:number = arr.length;
            for(let i = 0 ; i < length ; i++) {
                let fontFamily = arr[i];
                //暂时先不考虑带有引号的情况
                if(fontMapping[fontFamily]) {
                    font = fontMapping[fontFamily];
                    break;
                }
            }
        }
        else {
            font = fontMapping[fontFamily];
        }
        if(!font) {
            font= "/system/fonts/DroidSansFallback.ttf";
        }
        egret_native.Label.createLabel(font, fontSize, "", 0);
        return egret_native.Label.getTextSize(text)[0];
    }

    sys.measureText = measureText;
}