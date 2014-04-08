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
module ns_egret{
    /**
     * @class IEventDispatcher
     * IEventDispatcher是egret的事件派发器接口，负责进行事件的发送和侦听。
     * @stable A
     */
    export interface IEventDispatcher {

        /**
         * 添加事件侦听器
         * 重复添加的事件侦听器只会被侦听一次
         * @param eventName 事件名
         * @param func 侦听函数，侦听函数模板为  function (eventName,eventData1,eventData2...);
         * @param thisObj 侦听函数绑定的this对象
         * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
         * @param priority 事件优先级
         * @stable A
         * todo:GitHub文档
         */
        addEventListener(eventName:string, func:Function, thisObj, useCapture:Boolean = false, priority:number = 0):void;

        /**
         * 移除事件侦听器
         * @param eventName 事件名
         * @param func 侦听函数
         * @param thisObj 侦听函数绑定的this对象
         * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
         */
        removeEventListener(eventName:string, func:Function, thisObj, useCapture:Boolean = false):void;

        /**
         * 检测是否存在监听器
         * @param eventName 事件名
         * @param thisObj 侦听函数绑定的this对象
         * @returns {*}
         * @stable B,需要讨论下是否需要判断thisObj【@陈仁建】
         */
        hasEventListener(eventName:string, thisObj):boolean;

        /**
         * 派发事件
         * @param eventName 事件名
         * @param arg 数据对象
         * @returns {*}
         */
        dispatchEvent(eventName:string, ...arg):boolean;
    }
}
