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
     * @private
     * @language en_US
     * The GraphicsGradient interface represents an opaque object describing a gradient. It is returned by the static methods
     * Graphics.createLinearGradient() or Graphics.createRadialGradient().
     * @see egret.Graphics#createLinearGradient()
     * @see egret.Graphics#createRadialGradient()
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @private
     * @language zh_CN
     * GraphicsGradient 接口表示描述渐变的不透明对象。通过 Graphics.createLinearGradient() 或 Graphics.createRadialGradient() 等静态方法的返回值得到.
     * @see egret.Graphics#createLinearGradient()
     * @see egret.Graphics#createRadialGradient()
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface GraphicsGradient {
        /**
         * @language en_US
         * Adds a new stop, defined by an offset and a color, to the gradient. If the offset is not between 0 and 1 an
         * error is thrown, if the color can't be parsed as a color, an error is thrown.
         * @param offset the value between 0 and 1.
         * @param color the color to add.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 添加一个由偏移值和颜色值指定的断点到渐变。如果偏移值不在0到1之间，将抛出错误，如果 color 不能被解析为有效的颜色值，也将抛出错误。
         * @param offset 0到1之间的值
         * @param color 要设置颜色值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        addColorStop(offset:number, color:string): void;
    }
}