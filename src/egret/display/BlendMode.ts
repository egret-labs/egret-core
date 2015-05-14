/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module egret {
    /**
     * @class egret.BlendMode
     * @classdesc
     * 提供混合模式可视效果的常量值的类。
     * @link http://docs.egret-labs.org/as2ts/webglcode/blendMode.html BlendMode实例代码对比
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