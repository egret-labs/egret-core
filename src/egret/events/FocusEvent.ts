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
module egret {
    /**
     * @class egret.FocusEvent
     * @classdesc
     * 用户将焦点从显示列表中的一个对象更改到另一个对象时，对象将调度 FocusEvent 对象。目前只支持输入文本。
     * 有四种类型的焦点事件：FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     */
    export class FocusEvent extends egret.Event {

        /**
         * 获得焦点
         * @constant {string} egret.FocusEvent.FOCUS_IN
         */
        public static FOCUS_IN:string = "focusIn";

        /**
         * 失去焦点
         * @constant {string} egret.FocusEvent.FOCUS_OUT
         */
        public static FOCUS_OUT:string = "focusOut";

        /**
         * 创建一个 egret.FocusEvent 对象
         * @param type {string} 事件类型
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param bytesLoaded {number}
         * @param bytesTotal {number}
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
            super(type, bubbles, cancelable);

        }
    }
}