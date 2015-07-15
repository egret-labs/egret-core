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
     * @class egret.BlendMode
     * @classdesc
     * 提供混合模式可视效果的常量值的类。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=48 BlendMode实例代码
     */
    export class BlendMode {

        /**
         * 该显示对象出现在背景前面。显示对象的像素值会覆盖背景的像素值。在显示对象为透明的区域，背景是可见的。
         * @constant {string} egret.BlendMode.NORMAL
         */
        public static NORMAL:string = "normal";
        /**
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。
         * 例如，如果显示对象的某个像素的 RGB 值为 0xAAA633，背景像素的 RGB 值为 0xDD2200，则显示像素的结果 RGB 值为 0xFFC833（因为 0xAA + 0xDD > 0xFF，0xA6 + 0x22 = 0xC8，且 0x33 + 0x00 = 0x33）。
         * @constant {string} egret.BlendMode.ADD
         */
        public static ADD:string = "add";
        /**
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值不为0的区域将被擦除。
         * @constant {string} egret.BlendMode.ERASE
         * @private
         */
        public static ERASE:string = "erase";

        /**
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值为0的区域将被擦除。
         * 注意：由于 CanvasAPI 的限制，只会保留 Alpha 值不为1的区域。
         * @constant {string} egret.BlendMode.ERASE
         */
        public static ERASE_REVERSE:string = "eraseReverse";
    }
}