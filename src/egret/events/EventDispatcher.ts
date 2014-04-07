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

/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../debug/DEBUG.ts"/>
/// <reference path="IEventDispatcher.ts"/>
module ns_egret{
    /**
     * @class EventDispatcher
     * EventDispatcher是egret的事件派发器类，负责进行事件的发送和侦听。
     * @stable A
     */
    export class EventDispatcher implements IEventDispatcher{

        /**
         * 引擎内部调用
         * @private
         */
        public _eventDataList;

        /**
         * 引擎内部调用
         * @private
         */
        public _isUseCapture:Boolean = false;

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
        public addEventListener(eventName:string, func:Function, thisObj, useCapture:Boolean = false, priority:number = 0):void {
            if(DEBUG && DEBUG.ADD_EVENT_LISTENER)
            {
                DEBUG.checkAddEventListener(eventName, func, thisObj, useCapture, priority);
            }
            if (!this._eventDataList) {
                this._eventDataList = [];
            }
            var addIndex:number = -1;
            var addObj = {eventName: eventName, func: func, thisObj: thisObj, useCapture: useCapture, priority: priority};
            var l:number = this._eventDataList.length;
            for (var i:number = 0; i < l; i++) {
                var obj = this._eventDataList[i];
                if (obj.eventName == eventName && obj.func == func && obj.thisObj == thisObj && obj.useCapture == useCapture) {//加了2个相同的
                    return;
                }
                if (obj.priority >= priority && addIndex == -1) {
                    addIndex = i - 1;
                }
            }
            if (addIndex != -1) {
                this._eventDataList.splice(i - 1, 0, addObj);
            }
            else {
                this._eventDataList.unshift(addObj);
            }
        }

        /**
         * 移除事件侦听器
         * @param eventName 事件名
         * @param func 侦听函数
         * @param thisObj 侦听函数绑定的this对象
         * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
         */
        public removeEventListener(eventName:string, func:Function, thisObj, useCapture:Boolean = false):void {
            if (!this._eventDataList) return;
            var l:number = this._eventDataList.length;
            for (var i:number = 0; i < l; i++) {
                var eventData = this._eventDataList[i];
                if (eventData.eventName == eventName && eventData.func == func
                    && eventData.thisObj == thisObj && eventData.useCapture == useCapture) {
                    this._eventDataList.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * 检测是否存在监听器
         * @param eventName 事件名
         * @param thisObj 侦听函数绑定的this对象
         * @returns {*}
         * @stable B,需要讨论下是否需要判断thisObj【@陈仁建】
         */
        public hasEventListener(eventName:string, thisObj):boolean{
            if (!this._eventDataList) return false;
            var boo:Boolean = false;
            var l = this._eventDataList.length;
            for (var i:number = 0; i < l; i++) {
                var obj = this._eventDataList[i];
                if (obj.eventName == eventName && obj.thisObj == thisObj) {
                    boo = true;
                }
            }
            return boo;
        }

        /**
         * 派发事件
         * @param eventName 事件名
         * @param arg 数据对象
         * @returns {*}
         */
        public dispatchEvent(eventName:string, ...arg):boolean {
            if (!this._eventDataList) return false;
            var result:Boolean = false;
            var isStop:Boolean = false;
            var l = this._eventDataList.length;
            for (var i:number = 0; i < l; i++) {
                var obj = this._eventDataList[i];
                if (!obj) {
                    continue;
                }
                //显示对象需要判断一下捕获还是冒泡
                if (obj.eventName == eventName
                    && (!(this instanceof DisplayObject) || this._isUseCapture == obj.useCapture)) {
                    isStop = obj.func.apply(obj.thisObj, arguments);
                    result = result || isStop;
                }
            }
            return result;
        }
    }
}
