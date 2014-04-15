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

    export class Event {

        public static ADDED_TO_STAGE:string = "addedToStage";
        public static REMOVED_FROM_STAGE:string = "removedFromStage";
        public static ADDED:string = "added";
        public static REMOVED:string = "removed";

        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         */
        public constructor(type:string, bubbles:boolean, cancelable:boolean){
            this._type = type;
            this._bubbles = bubbles;
            this._cancelable = cancelable;
        }

        private _type:string;
        /**
         * 事件的类型。类型区分大小写。
         */
        public get type():string{
            return this._type;
        }

        private _bubbles:boolean;
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        public get bubbles():boolean{
            return this.bubbles;
        }

        private _cancelable:boolean;
        /**
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         */
        public get cancelable():boolean{
            return this._cancelable;
        }

    }
}