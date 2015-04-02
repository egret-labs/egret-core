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
    export interface IHitTextElement {
        lineIndex:number;
        textElementIndex:number;
    }


    /**
     * @private
     */
    export interface ITextStyle {
        textColor?:number;
        strokeColor?:number;
        size?:number;
        stroke?:number;
        bold?:boolean;
        italic?:boolean;
        fontFamily?:string;
        href?:string;
    }

    /**
     * 用于建立多种样式混合文本的基本结构，主要用于设置 textFlow 属性
     * @link http://docs.egret-labs.org/jkdoc/manual-text-multiformat.html 多种样式文本混合
     */
    export interface ITextElement {
        text:string;
        style?:ITextStyle;
    }

    /**
     * @private
     */
    export interface IWTextElement extends ITextElement {
        width:number;
    }

    /**
     * 文本最终解析的一行数据格式
     * @private
     */
    export interface ILineElement {
        /**
         * 文本占用宽度
         */
        width:number;
        /**
         * 文本占用高度
         */
        height:number;
        /**
         * 当前文本字符总数量（包括换行符）
         */
        charNum:number;
        /**
         * 是否含有换行符
         */
        hasNextLine:boolean;
        /**
         * 本行文本内容
         */
        elements:Array<IWTextElement>;
    }
}