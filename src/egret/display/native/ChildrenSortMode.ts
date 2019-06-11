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
     * The ChildrenSortMode class defines a pattern enumeration for children sort mode of egret.DisplayObjectContainer.
     * @version Egret 5.2.19
     * @platform Native
     * @language en_US
     */
    /**
     * BitmapFillMode 类定义egret.DisplayObjectContainer的子项目排序方式。
     * @version Egret 5.2.19
     * @platform Native
     * @language zh_CN
     */
    export const ChildrenSortMode = {

        /**
         * Default mode.
         * @version Egret 5.2.19
         * @platform Native
         * @language en_US
         */
        /**
         * 默认方式。
         * @version Egret 5.2.19
         * @platform Native
         * @language zh_CN
         */
        DEFAULT: "default",
        /**
         * Y increase mode. Automatic sorted ascending by y coordinates.
         * @version Egret 5.2.19
         * @platform Native
         * @language en_US
         */
        /**
         * Y递增模式。自动按y坐标升序排序。
         * @version Egret 5.2.19
         * @platform Native
         * @language en_US
         */
        INCREASE_Y: "increaseY",
        /**
         * Y decrease mode. Automatic sorted descending by y coordinates.
         * @version Egret 5.2.19
         * @platform Native
         * @language en_US
         */
        /**
         * Y递减模式。自动按y坐标降序排序。
         * @version Egret 5.2.19
         * @platform Native
         * @language en_US
         */
        DECREASE_Y: "decreaseY"
    }
}