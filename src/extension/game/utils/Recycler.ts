//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


namespace egret {
    /**
     * Tool class for object cache repeat use, which can be used to construct an object pool. Objects are automatically recycled after a certain duration.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     * @private
     * @language en_US
     */
    /**
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     * @private
     * @language zh_CN
     */
    export class Recycler extends HashObject{

		/**
         * Create an egret.Recycler object
		 * @param autoDisposeTime {number} Number of frames when objects are destroyed automatically. Default value: 300
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * 创建一个 egret.Recycler 对象
		 * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public constructor(autoDisposeTime:number = 300){
            super();
            if(autoDisposeTime<1)
                autoDisposeTime = 1;
            this.autoDisposeTime = autoDisposeTime;
            this.frameCount = 0;
        }

        /**
         * @private
         */
        public static _callBackList:any[] = [];

        public static $init():void {
            ticker.$startTick(Recycler.onUpdate, Recycler);
        }

        public static onUpdate(timeStamp:number):boolean {
            let list = Recycler._callBackList;
            for (let i = list.length - 1; i >= 0; i--) {
                list[i].$checkFrame();
            }
            return false;
        }

        /**
         * @private
         * 多少帧后自动销毁对象。
         */
        private autoDisposeTime:number;

        /**
         * @private
         */
        private frameCount:number;

        /**
         * @private
         * 
         */
        public $checkFrame():void{
            this.frameCount--;
            if(this.frameCount<=0){
                this.dispose();
            }
        }

        /**
         * @private
         */
        private objectPool:any[] = [];

        /**
         * @private
         */
        private _length:number = 0;
        /**
         * Number of cached objects"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 缓存的对象数量
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get length():number{
            return this._length;
        }
        /**
         * Cache an object for repeat use
         * @param object {any} The object to be cached
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 缓存一个对象以复用
         * @param object {any} 需要缓存的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public push(object:any):void{
            let pool:any[] = this.objectPool;
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
         * Obtain a cached object
		 * @returns {any} The obtained cached object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取一个缓存的对象
		 * @returns {any} 获得的缓存对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public pop():any{
            if(this._length==0)
                return null;
            this._length--;
            return this.objectPool.pop();
        }
        /**
         * Immediately clear all cached objects.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 立即清空所有缓存的对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public dispose():void{
            if(this._length>0){
                this.objectPool = [];
                this._length = 0;
            }
            this.frameCount = 0;
            let list:any[] = Recycler._callBackList;
            let index:number = list.indexOf(this);
            if(index!=-1){
                list.splice(index,1);
            }
        }
    }

    Recycler.$init();
}