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
    /**
     * @private
     */
    export class TextFieldProperties {
        //文本类型
        public _type:string = "";
        //文本内容
        public _text:string = "";
        //是否加密
        public _displayAsPassword:boolean = false;
        //文本字体
        public _fontFamily = TextField.default_fontFamily;
        //文本字号
        public _size:number = 30;
        //是否斜体
        public _italic:boolean = false;
        //是否加粗
        public _bold:boolean = false;
        //文本颜色
        public _textColorString:string = "#FFFFFF";
        public _textColor:number = 0xFFFFFF;
        //文本描边颜色
        public _strokeColorString:string = "#000000";
        public _strokeColor:number = 0x000000;
        //描边细度
        public _stroke:number = 0;
        //是否需要背景框
        public _border:boolean = false;
        //背景框颜色
        public _borderColor:number = 0x000000;
        //是否需要背景
        public _background:boolean = false;
        //背景颜色
        public _backgroundColor:number = 0xFFFFFF;
        //水平对齐方式
        public _textAlign:string = "left";
        //垂直对齐方式
        public _verticalAlign:string = "top";
        //文本全部显示时宽
        public _textMaxWidth:number = 0;
        //文本全部显示时高（无行间距）
        public _textMaxHeight:number = 0;
        //最多可包含的字符数
        public _maxChars:number = 0;
        //文本在文本字段中的垂直位置
        public _scrollV:number = -1;
        //行间距
        public _lineSpacing:number = 0;
        //行数
        public _numLines:number = 0;
        //输入文本是否是多行
        public _multiline:boolean = false;

        constructor() {
        }
    }
}