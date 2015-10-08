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
     * @language en_US
     * The EventPhase class provides values for the eventPhase property of the Event class.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventPhase.ts
     */
    /**
     * @language zh_CN
     * EventPhase 可为 Event 类的 eventPhase 属性提供值。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventPhase.ts
     */
    export const enum EventPhase{

        /**
         * @language en_US
         * The capturing phase, which is the first phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 捕获阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        CAPTURING_PHASE = 1,
        /**
         * @language en_US
         * The target phase, which is the second phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 目标阶段，是事件流的第二个阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        AT_TARGET = 2,
        /**
         * @language en_US
         * The bubbling phase, which is the third phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 冒泡阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BUBBLING_PHASE = 3
    }
}