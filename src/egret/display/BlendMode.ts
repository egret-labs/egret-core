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
     * @classdesc 提供混合模式可视效果的常量值的类。
     */
    export class BlendMode {

        /**
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。
         * @constant {string} egret.BlendMode.NORMAL
         */
        public static NORMAL = "normal";
        /**
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。
         * @constant {string} egret.BlendMode.ADD
         */
        public static ADD = "add";
        /**
         * 强制为该显示对象创建一个透明度组。这意味着在对显示对象进行进一步处理之前，该对象已在临时缓冲区中预先构成。
         * 在以下情况下将会自动完成预先构成操作：显示对象通过位图缓存进行预缓存，或者显示对象是一个显示对象容器，
         * 该容器至少具有一个带有 blendMode 设置（而不是 "normal"）的子对象。
         * @constant {string} egret.BlendMode.LAYER
         */
        public static LAYER = "layer";

    }
}