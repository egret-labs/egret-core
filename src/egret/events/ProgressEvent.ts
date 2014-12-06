/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module egret {
    export class ProgressEvent extends egret.Event {

        /**
         * @constant {string} egret.ProgressEvent.PROGRESS
         */
        public static PROGRESS:string = "progress";

        /**
         * @constant {string} egret.ProgressEvent.SOCKET_DATA
         */
        public static SOCKET_DATA:string = "socketData";

        public bytesLoaded:number;
        public bytesTotal:number;

        /**
         * @method egret.ProgressEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param bytesLoaded {number}
         * @param bytesTotal {number}
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, bytesLoaded:number = 0, bytesTotal:number = 0) {
            super(type, bubbles, cancelable);

            this.bytesLoaded = bytesLoaded;
            this.bytesTotal = bytesTotal;
        }

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.ProgressEvent.dispatchIOErrorEvent
         * @param target {egret.IEventDispatcher}
         */
        public static dispatchProgressEvent(target:IEventDispatcher, type:string, bytesLoaded:number = 0, bytesTotal:number = 0):void {
            Event._dispatchByTarget(ProgressEvent, target, type, {"bytesLoaded":bytesLoaded, "bytesTotal":bytesTotal});
        }
    }
}