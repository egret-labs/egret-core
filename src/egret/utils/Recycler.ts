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
    /**
	 * @class egret.Recycler
	 * @classdesc
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
	 * @extends egret.HashObject
     */
    export class Recycler extends HashObject{

		/**
         * 创建一个 egret.Recycler 对象
		 * @method egret.Recycler#constructor
		 * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
		 */
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
		 * @member {number} egret.Recycler#length
         */
        public get length():number{
            return this._length;
        }
        /**
         * 缓存一个对象以复用
		 * @method egret.Recycler#push
         * @param object {any} 需要缓存的对象
         */
        public push(object:any):void{
            var pool:Array<any> = this.objectPool;
            if(pool.indexOf(object)==-1){
                pool.push(object);
                if (object.__recycle) {
                    object.__recycle();
                }

                this._length++;
                if(this.frameCount==0){
                    this.frameCount = this.autoDisposeTime;
                    Recycler._callBackList.push(this);
                }
            }
        }
        /**
         * 获取一个缓存的对象
		 * @method egret.Recycler#pop
		 * @returns {any} 获得的缓存对象
         */
        public pop():any{
            if(this._length==0)
                return null;
            this._length--;
            return this.objectPool.pop();
        }
        /**
         * 立即清空所有缓存的对象。
		 * @method egret.Recycler#dispose
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