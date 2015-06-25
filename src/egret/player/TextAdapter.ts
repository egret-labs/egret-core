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

module egret.sys{

    /**
     * @private
     * 平台实现输入文本的接口
     */
    export interface ITextAdapter {

        /**
         * @private
         * 当用户点击TextInput时，将它设置为正在输入的TextInput对象，HTML text input 会显示出来并获得焦点
         * @param currentTextInput 要输入的TextInput对象
         */
        $setCurrentTextInput(currentTextInput:TextInput):void;

        /**
         * @private
         * 清空正在输入的TextInput，隐藏HTML text input。
         */
        $removeCurrentTextInput():void;

        /**
         * @private
         * 更新HTML5 或 runtime 中 text input 的属性值
         */
        $initializeInput(): void;

        /**
         * @private
         */
        $selectRange(anchorPosition: number, activePosition: number): void

        /**
         * @private
         */
        $stage:Stage;
    }

    var stageToTextLayerMap:any = {};

    /**
     * @private
     * 获取
     */
    export function $getTextAdapter(textInput:TextInput):ITextAdapter{
        var stageHash = textInput.stage?textInput.stage.$hashCode:0;
        return stageToTextLayerMap[stageHash];
    }
    /**
     * @private
     */
    export function $cacheTextAdapter( adapter:ITextAdapter){
        stageToTextLayerMap[adapter.$stage.$hashCode] = adapter;
    }
}