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
	 * @class egret.EventPhase
	 * @classdesc
     * EventPhase 类可为 Event 类的 eventPhase 属性提供值。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=113&terms1_id=25&terms2_id=29 事件的执行流程
     * @includeExample egret/events/EventPhase.ts
     */
    export class EventPhase {

        /**
         * 捕获阶段，是事件流的第一个阶段。
		 * @constant {number} egret.EventPhase.CAPTURING_PHASE
         */
        public static CAPTURING_PHASE:number = 1;
        /**
         * 目标阶段，是事件流的第二个阶段。
		 * @constant {number} egret.EventPhase.AT_TARGET
         */
        public static AT_TARGET:number = 2;
        /**
         * 冒泡阶段，是事件流的第三个阶段。
		 * @constant {number} egret.EventPhase.BUBBLING_PHASE
         */
        public static BUBBLING_PHASE:number = 3;
    }
}