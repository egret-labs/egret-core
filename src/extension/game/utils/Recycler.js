//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var egret;
(function (egret) {
    /**
     * @language en_US
     * Tool class for object cache repeat use, which can be used to construct an object pool. Objects are automatically recycled after a certain duration.
     * @version Egret 2.0
     * @platform Web,Native
     * @includeExample egret/utils/Recycler.ts
     */
    /**
     * @language zh_CN
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     * @version Egret 2.0
     * @platform Web,Native
     * @includeExample egret/utils/Recycler.ts
     */
    var Recycler = (function (_super) {
        __extends(Recycler, _super);
        /**
         * @language en_US
         * Create an egret.Recycler object
         * @param autoDisposeTime {number} Number of frames when objects are destroyed automatically. Default value: 300
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Recycler 对象
         * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
         * @version Egret 2.0
         * @platform Web,Native
         */
        function Recycler(autoDisposeTime) {
            if (autoDisposeTime === void 0) { autoDisposeTime = 300; }
            _super.call(this);
            /**
             * @private
             */
            this.objectPool = [];
            /**
             * @private
             */
            this._length = 0;
            if (autoDisposeTime < 1)
                autoDisposeTime = 1;
            this.autoDisposeTime = autoDisposeTime;
            this.frameCount = 0;
        }
        Recycler.$init = function () {
            sys.$ticker.$startTick(Recycler.onUpdate, Recycler);
        };
        Recycler.onUpdate = function (timeStamp) {
            var list = Recycler._callBackList;
            for (var i = list.length - 1; i >= 0; i--) {
                list[i].$checkFrame();
            }
            return false;
        };
        /**
         * @private
         *
         */
        Recycler.prototype.$checkFrame = function () {
            this.frameCount--;
            if (this.frameCount <= 0) {
                this.dispose();
            }
        };
        Object.defineProperty(Recycler.prototype, "length", {
            /**
             * @language en_US
             * Number of cached objects"
             * @version Egret 2.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 缓存的对象数量
             * @version Egret 2.0
             * @platform Web,Native
             */
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language en_US
         * Cache an object for repeat use
         * @param object {any} The object to be cached
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缓存一个对象以复用
         * @param object {any} 需要缓存的对象
         * @version Egret 2.0
         * @platform Web,Native
         */
        Recycler.prototype.push = function (object) {
            var pool = this.objectPool;
            if (pool.indexOf(object) == -1) {
                pool.push(object);
                if (object.__recycle) {
                    object.__recycle();
                }
                this._length++;
                if (this.frameCount == 0) {
                    this.frameCount = this.autoDisposeTime;
                    Recycler._callBackList.push(this);
                }
            }
        };
        /**
         * @language en_US
         * Obtain a cached object
         * @returns {any} The obtained cached object
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取一个缓存的对象
         * @returns {any} 获得的缓存对象
         * @version Egret 2.0
         * @platform Web,Native
         */
        Recycler.prototype.pop = function () {
            if (this._length == 0)
                return null;
            this._length--;
            return this.objectPool.pop();
        };
        /**
         * @language en_US
         * Immediately clear all cached objects.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 立即清空所有缓存的对象。
         * @version Egret 2.0
         * @platform Web,Native
         */
        Recycler.prototype.dispose = function () {
            if (this._length > 0) {
                this.objectPool = [];
                this._length = 0;
            }
            this.frameCount = 0;
            var list = Recycler._callBackList;
            var index = list.indexOf(this);
            if (index != -1) {
                list.splice(index, 1);
            }
        };
        /**
         * @private
         */
        Recycler._callBackList = [];
        return Recycler;
    })(HashObject);
    egret.Recycler = Recycler;
    Recycler.$init();
})(egret || (egret = {}));
//# sourceMappingURL=Recycler.js.map