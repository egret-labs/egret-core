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


module eui.sys {

    /**
     * @private
     * 失效验证管理器
     */
    export class Validator extends egret.EventDispatcher {
        /**
         * @private
         * 创建一个Validator对象
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        private targetLevel:number = Number.POSITIVE_INFINITY;

        /**
         * @private
         */
        private invalidatePropertiesFlag:boolean = false;

        /**
         * @private
         */
        private invalidateClientPropertiesFlag:boolean = false;

        /**
         * @private
         */
        private invalidatePropertiesQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * 标记组件属性失效
         */
        public invalidateProperties(client:UIComponent):void {
            if (!this.invalidatePropertiesFlag) {
                this.invalidatePropertiesFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.$nestLevel)
                this.invalidateClientPropertiesFlag = true;
            this.invalidatePropertiesQueue.insert(client);
        }

        /**
         * @private
         * 验证失效的属性
         */
        private validateProperties():void {
            var queue = this.invalidatePropertiesQueue;
            var client:UIComponent = queue.shift();
            while (client) {
                if (client.$stage) {
                    client.validateProperties();
                }
                client = queue.shift();
            }
            if (queue.isEmpty())
                this.invalidatePropertiesFlag = false;
        }

        /**
         * @private
         */
        private invalidateSizeFlag:boolean = false;

        /**
         * @private
         */
        private invalidateClientSizeFlag:boolean = false;

        /**
         * @private
         */
        private invalidateSizeQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * 标记需要重新测量尺寸
         */
        public invalidateSize(client:UIComponent):void {
            if (!this.invalidateSizeFlag) {
                this.invalidateSizeFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.$nestLevel)
                this.invalidateClientSizeFlag = true;
            this.invalidateSizeQueue.insert(client);
        }

        /**
         * @private
         * 测量尺寸
         */
        private validateSize():void {
            var queue = this.invalidateSizeQueue;
            var client:UIComponent = queue.pop();
            while (client) {
                if (client.$stage) {
                    client.validateSize();
                }
                client = queue.pop();
            }
            if (queue.isEmpty())
                this.invalidateSizeFlag = false;
        }


        /**
         * @private
         */
        private invalidateDisplayListFlag:boolean = false;

        /**
         * @private
         */
        private invalidateDisplayListQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * 标记需要重新布局
         */
        public invalidateDisplayList(client:UIComponent):void {
            if (!this.invalidateDisplayListFlag) {
                this.invalidateDisplayListFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            this.invalidateDisplayListQueue.insert(client);
        }

        /**
         * @private
         * 重新布局
         */
        private validateDisplayList():void {
            var queue = this.invalidateDisplayListQueue;
            var client:UIComponent = queue.shift();
            while (client) {
                if (client.$stage) {
                    client.validateDisplayList();
                }
                client = queue.shift();
            }
            if (queue.isEmpty())
                this.invalidateDisplayListFlag = false;
        }

        /**
         * @private
         */
        private eventDisplay:egret.Bitmap = new egret.Bitmap();
        /**
         * @private
         * 是否已经添加了事件监听
         */
        private listenersAttached:boolean = false;

        /**
         * @private
         * 添加事件监听
         */
        private attachListeners():void {
            this.eventDisplay.addEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
            this.eventDisplay.addEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
            egret.sys.$invalidateRenderFlag = true;
            this.listenersAttached = true;
        }

        /**
         * @private
         * 执行属性应用
         */
        private doPhasedInstantiationCallBack(event?:egret.Event):void {
            this.eventDisplay.removeEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
            this.eventDisplay.removeEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
            this.doPhasedInstantiation();
        }

        /**
         * @private
         * 
         */
        private doPhasedInstantiation():void {
            if (this.invalidatePropertiesFlag) {
                this.validateProperties();
            }
            if (this.invalidateSizeFlag) {
                this.validateSize();
            }

            if (this.invalidateDisplayListFlag) {
                this.validateDisplayList();
            }

            if (this.invalidatePropertiesFlag ||
                this.invalidateSizeFlag ||
                this.invalidateDisplayListFlag) {
                this.attachListeners();
            }
            else {
                this.listenersAttached = false;
            }
        }

        /**
         * @private
         * 使大于等于指定组件层级的元素立即应用属性
         * @param target 要立即应用属性的组件
         */
        public validateClient(target:UIComponent):void {

            var obj:UIComponent;
            var done = false;
            var oldTargetLevel = this.targetLevel;

            if (this.targetLevel === Number.POSITIVE_INFINITY)
                this.targetLevel = target.$nestLevel;

            var propertiesQueue = this.invalidatePropertiesQueue;
            var sizeQueue = this.invalidateSizeQueue;
            var displayListQueue = this.invalidateDisplayListQueue;
            while (!done) {
                done = true;

                obj = propertiesQueue.removeSmallestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateProperties();
                    }
                    obj = propertiesQueue.removeSmallestChild(target);
                }

                if (propertiesQueue.isEmpty()) {
                    this.invalidatePropertiesFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;

                obj = sizeQueue.removeLargestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateSize();
                    }
                    if (this.invalidateClientPropertiesFlag) {
                        obj = <UIComponent> (propertiesQueue.removeSmallestChild(target));
                        if (obj) {
                            propertiesQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    obj = sizeQueue.removeLargestChild(target);
                }

                if (sizeQueue.isEmpty()) {
                    this.invalidateSizeFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;
                this.invalidateClientSizeFlag = false;

                obj = displayListQueue.removeSmallestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateDisplayList();
                    }
                    if (this.invalidateClientPropertiesFlag) {
                        obj = propertiesQueue.removeSmallestChild(target);
                        if (obj) {
                            propertiesQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    if (this.invalidateClientSizeFlag) {
                        obj =sizeQueue.removeLargestChild(target);
                        if (obj) {
                            sizeQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    obj = displayListQueue.removeSmallestChild(target);
                }


                if (displayListQueue.isEmpty()) {
                    this.invalidateDisplayListFlag = false;
                }
            }

            if (oldTargetLevel === Number.POSITIVE_INFINITY) {
                this.targetLevel = Number.POSITIVE_INFINITY;
            }
        }

    }


    /**
     * @private
     * 显示列表嵌套深度排序队列
     */
    class DepthQueue {
        /**
         * 深度队列
         */
        private depthBins:{[key:number]:DepthBin} = {};

        /**
         * 最小深度
         */
        private minDepth:number = 0;

        /**
         * 最大深度
         */
        private maxDepth:number = -1;

        /**
         * 插入一个元素
         */
        public insert(client:UIComponent):void {
            var depth = client.$nestLevel;
            if (this.maxDepth < this.minDepth) {
                this.minDepth = this.maxDepth = depth;
            }
            else {
                if (depth < this.minDepth)
                    this.minDepth = depth;
                if (depth > this.maxDepth)
                    this.maxDepth = depth;
            }

            var bin = this.depthBins[depth];

            if (!bin) {
                bin = this.depthBins[depth] = new DepthBin();
            }
            bin.insert(client);
        }

        /**
         * 从队列尾弹出深度最大的一个对象
         */
        public pop():UIComponent {
            var client:UIComponent;

            var minDepth = this.minDepth;
            if (minDepth <= this.maxDepth) {
                var bin = this.depthBins[this.maxDepth];
                while (!bin || bin.length === 0) {
                    this.maxDepth--;
                    if (this.maxDepth < minDepth)
                        return null;
                    bin = this.depthBins[this.maxDepth];
                }

                client = bin.shift();

                while (!bin || bin.length == 0) {
                    this.maxDepth--;
                    if (this.maxDepth < minDepth)
                        break;
                    bin = this.depthBins[this.maxDepth];
                }

            }

            return client;
        }

        /**
         * 从队列首弹出深度最小的一个对象
         */
        public shift():UIComponent {
            var client:UIComponent;

            var maxDepth = this.maxDepth;
            if (this.minDepth <= maxDepth) {
                var bin = this.depthBins[this.minDepth];
                while (!bin || bin.length === 0) {
                    this.minDepth++;
                    if (this.minDepth > maxDepth)
                        return null;
                    bin = this.depthBins[this.minDepth];
                }

                client = bin.shift();

                while (!bin || bin.length == 0) {
                    this.minDepth++;
                    if (this.minDepth > maxDepth)
                        break;
                    bin = this.depthBins[this.minDepth];
                }
            }

            return client;
        }

        /**
         * 移除大于等于指定组件层级的元素中最大的元素
         */
        public removeLargestChild(client:UIComponent):UIComponent {
            var hashCode = client.$hashCode;
            var nestLevel = client.$nestLevel;
            var max = this.maxDepth;
            var min = nestLevel;

            while (min <= max) {
                var bin = this.depthBins[max];
                if (bin && bin.length > 0) {
                    if (max === nestLevel) {
                        if (bin.map[hashCode]) {
                            bin.remove(client);
                            return client;
                        }
                    }
                    else if(egret.is(client,"egret.DisplayObjectContainer")){

                        var items = bin.items;
                        var length = bin.length;
                        for (var i = 0; i < length; i++) {
                            var value = items[i];
                            if ((<egret.DisplayObjectContainer><any> client).contains(value)) {
                                bin.remove(value);
                                return value;
                            }
                        }
                    }
                    else{
                        break;
                    }
                    max--;
                }
                else {
                    if (max == this.maxDepth){
                        this.maxDepth--;
                    }
                    max--;
                    if (max < min)
                        break;
                }
            }

            return null;
        }

        /**
         * 移除大于等于指定组件层级的元素中最小的元素
         */
        public removeSmallestChild(client:UIComponent):UIComponent {
            var nestLevel = client.$nestLevel;
            var min = nestLevel;
            var max = this.maxDepth;
            var hashCode = client.$hashCode;
            while (min <= max) {
                var bin = this.depthBins[min];
                if (bin && bin.length > 0) {
                    if (min === nestLevel) {
                        if (bin.map[hashCode]) {
                            bin.remove(client);
                            return client;
                        }
                    }
                    else if(egret.is(client,"egret.DisplayObjectContainer")){
                        var items = bin.items;
                        var length = bin.length;
                        for (var i = 0; i < length; i++) {
                            var value = items[i];
                            if ((<egret.DisplayObjectContainer><any> client).contains(value)) {
                                bin.remove(value);
                                return value;
                            }
                        }
                    }
                    else{
                        break;
                    }

                    min++;
                }
                else {
                    if (min == this.minDepth)
                        this.minDepth++;
                    min++;
                    if (min > max)
                        break;
                }
            }

            return null;
        }

        /**
         * 队列是否为空
         */
        public isEmpty():boolean {
            return this.minDepth > this.maxDepth;
        }
    }
    /**
     * @private
     * 列表项
     */
    class DepthBin {
        public map:{[key:number]:boolean} = {};
        public items:UIComponent[] = [];
        public length:number = 0;

        public insert(client:UIComponent):void {
            var hashCode = client.$hashCode;
            if (this.map[hashCode]) {
                return;
            }
            this.map[hashCode] = true;
            this.length++;
            this.items.push(client);
        }

        public shift():UIComponent {
            var client = this.items.shift();
            if (client) {
                this.map[client.$hashCode] = false;
                this.length--;
            }
            return client;
        }

        public remove(client:UIComponent):void {
            var index = this.items.indexOf(client);
            if (index >= 0) {
                this.items.splice(index, 1);
                this.map[client.$hashCode] = false;
                this.length--;
            }
        }
    }
}