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
    export interface IHitTextElement {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineIndex:number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        textElementIndex:number;
    }


    /**
     * Text Style
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 文本样式
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface ITextStyle {
        /**
         * text color
         * @version Egret 2.4
         * @platform Web,Native
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         * @language en_US
         */
        /**
         * 颜色值
         * @version Egret 2.4
         * @platform Web,Native
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         * @language zh_CN
         */
        textColor?:number;
        /**
         * stroke color
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 描边颜色值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        strokeColor?:number;
        /**
         * size
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 字号
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        size?:number;
        /**
         * stroke width
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 描边大小
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        stroke?:number;
        /**
         * whether bold
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否加粗
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        bold?:boolean;
        /**
         * whether italic
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否倾斜
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        italic?:boolean;
        /**
         * fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 字体名称
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        fontFamily?:string;
        /**
         * Link events or address
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 链接事件或者地址
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        href?:string;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        target?:string;
        /**
         * Is underlined
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否加下划线
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        underline?:boolean;
    }

    /**
     * Used to build the basic structure of text with a variety of mixed styles, mainly for setting textFlow property
     * @see http://edn.egret.com/cn/docs/page/146 Text mixed in a variety of style
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 用于建立多种样式混合文本的基本结构，主要用于设置 textFlow 属性
     * @see http://edn.egret.com/cn/docs/page/146 多种样式文本混合
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface ITextElement {
        /**
         * String Content
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 字符串内容
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        text:string;
        /**
         * Text Style
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本样式
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        style?:ITextStyle;
    }

    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface IWTextElement extends ITextElement {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        width:number;
    }

    /**
     * 文本最终解析的一行数据格式
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface ILineElement {
        /**
         * 文本占用宽度
         * @version Egret 2.4
         * @platform Web,Native
         */
        width:number;
        /**
         * 文本占用高度
         * @version Egret 2.4
         * @platform Web,Native
         */
        height:number;
        /**
         * 当前文本字符总数量（包括换行符）
         * @version Egret 2.4
         * @platform Web,Native
         */
        charNum:number;
        /**
         * 是否含有换行符
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasNextLine:boolean;
        /**
         * 本行文本内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        elements:Array<IWTextElement>;
    }
}