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

module ns_egret {
    /**
     * MultitouchInputMode 类提供 Multitouch 类的 inputMode 属性值。
     * 这些值设置用户与启用触屏的设备交互时 Egret 调度的接触事件类型。
     */
    export class MultitouchInputMode {
        /**
         * 指定为当前环境支持的相关用户交互调度 TransformGestureEvent、PressAndTapGestureEvent
         * 和 GestureEvent 事件并将其他触摸事件（例如，轻敲）解释为鼠标事件。
         */
        public static GESTURE:String = "gesture";
        /**
         * 指定将用户触摸启用触摸设备的所有行为解释为鼠标事件类型。
         */
        public static NONE:String = "none";
        /**
         * 指定仅为基本触摸事件调度事件，如单个手指点击。使用此设置时，会调度 TouchEvent 类中列出的事件；
         * 不调度 TransformGestureEvent、PressAndTapGestureEvent 和 GestureEvent 类中列出的事件。
         */
        public static TOUCH_POINT:String = "touchPoint";
    }
}