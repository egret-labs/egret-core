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
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     */
    export class Recycler extends HashObject{

        public constructor(autoDisposeTime:number = 300){
            super();
            if(autoDisposeTime<1)
                autoDisposeTime = 1;
            this.autoDisposeTime = autoDisposeTime;
            this.frameCount = 0;
        }

        public static _callBackList:Array<any> = [];
        /**
         * 多少帧后自动销毁对象。
         */
        private autoDisposeTime:number;

        private frameCount:number;

        public _checkFrame():void{
            this.frameCount--;
            if(this.frameCount<=0){
                this.dispose();
            }
        }

        private objectPool:Array<any> = [];

        private _length:number = 0;
        /**
         * 缓存的对象数量
         */
        public get length():number{
            return this._length;
        }
        /**
         * 缓存一个对象以复用
         * @param object
         */
        public push(object:any):void{
            var pool:Array<any> = this.objectPool;
            if(pool.indexOf(object)==-1){
                pool.push(object);
                this._length++;
                if(this.frameCount==0){
                    this.frameCount = this.autoDisposeTime;
                    Recycler._callBackList.push(this);
                }
            }
        }
        /**
         * 获取一个缓存的对象
         */
        public pop():any{
            if(this._length==0)
                return null;
            this._length--;
            return this.objectPool.pop();
        }
        /**
         * 立即清空所有缓存的对象。
         */
        public dispose():void{
            if(this._length>0){
                this.objectPool = [];
                this._length = 0;
            }
            this.frameCount = 0;
            var list:Array<any> = Recycler._callBackList;
            var index:number = list.indexOf(this);
            if(index!=-1){
                list.splice(index,1);
            }
        }
    }
}