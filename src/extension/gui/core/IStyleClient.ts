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

module egret.gui {

    /**
     * @class egret.gui.IStyleClient
     * @interface
     * @classdesc
     * 能够设置样式的组件接口
     */
    export interface IStyleClient{
        /**
         * 获取指定的名称的样式属性值
         * @param styleProp 样式名称
         */
        getStyle(styleProp:String):any;
        /**
         * 对此组件实例设置样式属性。在此组件上设置的样式会覆盖父级容器的同名样式。
         * @param styleProp 样式名称
         * @param newValue 样式值
         */
        setStyle(styleProp:String, newValue:any):void;
        /**
         * 清除在此组件实例上设置过的指定样式名。
         * @param styleProp 样式名称
         */
        clearStyle(styleProp:string):void;
        /**
         * 组件上的样式发生改变
         * @param styleProp 发生改变的样式名称，若为null表示所有样式都发生了改变。
         */
        styleChanged(styleProp:string):void;
        /**
         * 通知项列表样式发生改变
         * @param styleProp 样式名称
         */
        notifyStyleChangeInChildren(styleProp:string):void;
        /**
         * 重新生成自身以及所有子项的原型链
         * @param parentChain
         */
        regenerateStyleCache(parentChain:any):void;
    }
}