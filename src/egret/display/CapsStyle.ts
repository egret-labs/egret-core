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
     * The CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines.
     * The constants are provided for use as values in the caps parameter of the egret.Graphics.lineStyle() method.
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     * @language en_US
     */
    /**
     * CapsStyle 类是可指定在绘制线条中使用的端点样式的常量值枚举。常量可用作 egret.Graphics.lineStyle() 方法的 caps 参数中的值。
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     * @language zh_CN
     */
    export const CapsStyle = {
        /**
         * Used to specify no caps in the caps parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 用于在 egret.Graphics.lineStyle() 方法的 caps 参数中指定没有端点。
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        NONE: "none",
        /**
         * Used to specify round caps in the caps parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 用于在 egret.Graphics.lineStyle() 方法的 caps 参数中指定圆头端点。
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        ROUND: "round",
        /**
         * Used to specify square caps in the caps parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 用于在 egret.Graphics.lineStyle() 方法的 caps 参数中指定方头端点。
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        SQUARE: "square"
    }
}