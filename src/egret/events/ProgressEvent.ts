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

/// <reference path="Event.ts"/>
/// <reference path="IEventDispatcher.ts"/>

module ns_egret {

    export class ProgressEvent extends Event {

        public static PROGRESS:string = "progress";

        public constructor(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                           bytesLoaded:Number = 0, bytesTotal:Number = 0) {
            super(type, bubbles, cancelable);
            this.bytesLoaded = bytesLoaded;
            this.bytesTotal = bytesTotal;
        }

        public bytesLoaded:number;

        public bytesTotal:number;

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.ProgressEvent.dispathProgressEvent
         */
        public static dispatchProgressEvent(target:IEventDispatcher,bytesLoaded:Number = 0, bytesTotal:Number = 0):void{
            var eventClass:any = ProgressEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.bytesLoaded = bytesLoaded;
            props.bytesTotal = bytesTotal;
            Event._dispatchByTarget(eventClass,target,ProgressEvent.PROGRESS,props);
        }
    }
}