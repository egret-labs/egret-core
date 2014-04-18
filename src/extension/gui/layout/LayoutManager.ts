///<reference path="../../../egret/events/EventDispatcher.ts" />

module ns_egret{
    export class LayoutManager extends EventDispatcher {

        constructor() {
            super();
        }

        private targetLevel:number = Number.MAX_VALUE;
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
        private updateCompleteQueue:DepthQueue = new DepthQueue();//todo

        private invalidatePropertiesFlag:Boolean = false;

        private invalidateClientPropertiesFlag:Boolean = false;

        private invalidatePropertiesQueue:DepthQueue = new DepthQueue();

        /**
         * 标记组件提交过属性
         */
        public invalidateProperties(client:ILayoutManagerClient):void {
            if (!this.invalidatePropertiesFlag) {
                this.invalidatePropertiesFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.nestLevel)
                this.invalidateClientPropertiesFlag = true;
            this.invalidatePropertiesQueue.insert(client);
        }

        /**
         * 使提交的属性生效
         */
        private validateProperties():void {
            var client:ILayoutManagerClient = this.invalidatePropertiesQueue.shift();
            while (client) {
                if (client.parent) {
                    client.validateProperties();
                    if (!client.updateCompletePendingFlag) {
                        this.updateCompleteQueue.insert(client);
                        client.updateCompletePendingFlag = true;
                    }
                }
                client = this.invalidatePropertiesQueue.shift();
            }
            if (this.invalidatePropertiesQueue.isEmpty())
                this.invalidatePropertiesFlag = false;
        }

        private invalidateSizeFlag:Boolean = false;

        private invalidateClientSizeFlag:Boolean = false;

        private invalidateSizeQueue:DepthQueue = new DepthQueue();

        /**
         * 标记需要重新测量尺寸
         */
        public invalidateSize(client:ILayoutManagerClient):void {
            if (!this.invalidateSizeFlag) {
                this.invalidateSizeFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.nestLevel)
                this.invalidateClientSizeFlag = true;
            this.invalidateSizeQueue.insert(client);
        }

        /**
         * 测量属性
         */
        private validateSize():void {
            var client:ILayoutManagerClient = this.invalidateSizeQueue.pop();
            while (client) {
                if (client.parent) {
                    client.validateSize();
                    if (!client.updateCompletePendingFlag) {
                        this.updateCompleteQueue.insert(client);
                        client.updateCompletePendingFlag = true;
                    }
                }
                client = this.invalidateSizeQueue.pop();
            }
            if (this.invalidateSizeQueue.isEmpty())
                this.invalidateSizeFlag = false;
        }


        private invalidateDisplayListFlag:Boolean = false;

        private invalidateDisplayListQueue:DepthQueue = new DepthQueue();

        /**
         * 标记需要重新测量尺寸
         */
        public invalidateDisplayList(client:ILayoutManagerClient):void {
            if (!this.invalidateDisplayListFlag) {
                this.invalidateDisplayListFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            this.invalidateDisplayListQueue.insert(client);
        }

        /**
         * 测量属性
         */
        private validateDisplayList():void {
            var client:ILayoutManagerClient = this.invalidateDisplayListQueue.shift();
            while (client) {
                if (client.parent) {
                    client.validateDisplayList();
                    if (!client.updateCompletePendingFlag) {
                        this.updateCompleteQueue.insert(client);
                        client.updateCompletePendingFlag = true;
                    }
                }
                client = this.invalidateDisplayListQueue.shift();
            }
            if (this.invalidateDisplayListQueue.isEmpty())
                this.invalidateDisplayListFlag = false;
        }

        /**
         * 是否已经添加了事件监听
         */
        private listenersAttached:Boolean = false;

        /**
         * 添加事件监听
         */
        private attachListeners():void {
            var context:MainContext = MainContext.instance;
            context.addEventListener(MainContext.EVENT_ENTER_FRAME, this.doPhasedInstantiation, this);
            context.addEventListener(MainContext.EVENT_START_RENDER, this.doPhasedInstantiation, this);
//        stage.addEventListener(Event.ENTER_FRAME, this.doPhasedInstantiation);
//        stage.addEventListener(Event.RENDER, this.doPhasedInstantiation);
//        stage.invalidate();
            this.listenersAttached = true;
        }

        /**
         * 执行属性应用
         */
        private doPhasedInstantiation(event:Event = null):void {

            var context:MainContext = MainContext.instance;
            context.removeEventListener(MainContext.EVENT_ENTER_FRAME, this.doPhasedInstantiation, this);
            context.removeEventListener(MainContext.EVENT_START_RENDER, this.doPhasedInstantiation, this);
//        var stage = MainContext.instance.stage;
//        stage.removeEventListener(Event.ENTER_FRAME, this.doPhasedInstantiation);
//        stage.removeEventListener(Event.RENDER, this.doPhasedInstantiation);
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
                var client:ILayoutManagerClient = this.updateCompleteQueue.pop();
                while (client) {
                    if (!client.initialized)
                        client.initialized = true;
//                if (client.hasEventListener(UIEvent.UPDATE_COMPLETE)) todo
//                    client.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
                    client.updateCompletePendingFlag = false;
                    client = this.updateCompleteQueue.pop();
                }

//            this.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
            }
        }

        /**
         * 立即应用所有延迟的属性
         */
        public validateNow():void {
            var infiniteLoopGuard:number = 0;
            while (this.listenersAttached && infiniteLoopGuard++ < 100)
                this.doPhasedInstantiation();
        }

        /**
         * 使大于等于指定组件层级的元素立即应用属性
         * @param target 要立即应用属性的组件
         * @param skipDisplayList 是否跳过更新显示列表阶段
         */
        public validateClient(target:ILayoutManagerClient, skipDisplayList:Boolean = false):void {

            var obj:ILayoutManagerClient;
            var i:number = 0;
            var done:Boolean = false;
            var oldTargetLevel:number = this.targetLevel;

            if (this.targetLevel == Number.MAX_VALUE)
                this.targetLevel = target.nestLevel;

            while (!done) {
                done = true;

                obj = <ILayoutManagerClient>this.invalidatePropertiesQueue.removeSmallestChild(target);
                while (obj) {
                    if (obj.parent) {
                        obj.validateProperties();
                        if (!obj.updateCompletePendingFlag) {
                            this.updateCompleteQueue.insert(obj);
                            obj.updateCompletePendingFlag = true;
                        }
                    }
                    obj = <ILayoutManagerClient>this.invalidatePropertiesQueue.removeSmallestChild(target);
                }

                if (this.invalidatePropertiesQueue.isEmpty()) {
                    this.invalidatePropertiesFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;

                obj = <ILayoutManagerClient>this.invalidateSizeQueue.removeLargestChild(target);
                while (obj) {
                    if (obj.parent) {
                        obj.validateSize();
                        if (!obj.updateCompletePendingFlag) {
                            this.updateCompleteQueue.insert(obj);
                            obj.updateCompletePendingFlag = true;
                        }
                    }
                    if (this.invalidateClientPropertiesFlag) {
                        obj = <ILayoutManagerClient>this.invalidatePropertiesQueue.removeSmallestChild(target);
                        if (obj) {
                            this.invalidatePropertiesQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    obj = <ILayoutManagerClient>this.invalidateSizeQueue.removeLargestChild(target);
                }

                if (this.invalidateSizeQueue.isEmpty()) {
                    this.invalidateSizeFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;
                this.invalidateClientSizeFlag = false;

                if (!skipDisplayList) {
                    obj = <ILayoutManagerClient>this.invalidateDisplayListQueue.removeSmallestChild(target);
                    while (obj) {
                        if (obj.parent) {
                            obj.validateDisplayList();
                            if (!obj.updateCompletePendingFlag) {
                                this.updateCompleteQueue.insert(obj);
                                obj.updateCompletePendingFlag = true;
                            }
                        }
                        if (this.invalidateClientPropertiesFlag) {
                            obj = <ILayoutManagerClient>this.invalidatePropertiesQueue.removeSmallestChild(target);
                            if (obj) {
                                this.invalidatePropertiesQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }

                        if (this.invalidateClientSizeFlag) {
                            obj = <ILayoutManagerClient>this.invalidateSizeQueue.removeLargestChild(target);
                            if (obj) {
                                this.invalidateSizeQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }

                        obj = <ILayoutManagerClient>this.invalidateDisplayListQueue.removeSmallestChild(target);
                    }


                    if (this.invalidateDisplayListQueue.isEmpty()) {
                        this.invalidateDisplayListFlag = false;
                    }
                }
            }

            if (oldTargetLevel == Number.MAX_VALUE) {
                this.targetLevel = Number.MAX_VALUE;
                if (!skipDisplayList) {
                    obj = <ILayoutManagerClient>this.updateCompleteQueue.removeLargestChild(target);
                    while (obj) {
                        if (!obj.initialized)
                            obj.initialized = true;

//                    if (obj.hasEventListener(UIEvent.UPDATE_COMPLETE))    todo
//                        obj.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
                        obj.updateCompletePendingFlag = false;
                        obj = <ILayoutManagerClient>this.updateCompleteQueue.removeLargestChild(target);
                    }
                }
            }
        }

    }


    export interface ILayoutManagerClient {//extends EventDispatcher{

        validateDisplayList();

        validateProperties();

        validateSize();

        initialized;

        updateCompletePendingFlag;

        parent;

        nestLevel;

    }


    export class DepthQueue {


        /**
         * 深度队列
         */
        private depthBins;

        /**
         * 最小深度
         */
        private minDepth:number = 0;

        /**
         * 最大深度
         */
        private maxDepth:number = -1;


        constructor() {
            this.depthBins = [];
        }

        /**
         * 插入一个元素
         */
        public insert(client:ILayoutManagerClient):void {
            var depth:number = client.nestLevel;
            if (this.maxDepth < this.minDepth) {
                this.minDepth = this.maxDepth = depth;
            }
            else {
                if (depth < this.minDepth)
                    this.minDepth = depth;
                if (depth > this.maxDepth)
                    this.maxDepth = depth;
            }

            var bin:DepthBin = this.depthBins[depth];

            if (!bin) {
                bin = new DepthBin();
                this.depthBins[depth] = bin;
                bin.items[client] = true;
                bin.length++;
            }
            else {
                if (bin.items[client] == null) {
                    bin.items[client] = true;
                    bin.length++;
                }
            }
        }

        /**
         * 从队列尾弹出深度最大的一个对象
         */
        public pop():ILayoutManagerClient {
            var client:ILayoutManagerClient = null;

            if (this.minDepth <= this.maxDepth) {
                var bin:DepthBin = this.depthBins[this.maxDepth];
                while (!bin || bin.length == 0) {
                    this.maxDepth--;
                    if (this.maxDepth < this.minDepth)
                        return null;
                    bin = this.depthBins[this.maxDepth];
                }

                for (var key in bin.items) {
                    client = <ILayoutManagerClient>key;
                    this.remove(client, this.maxDepth);
                    break;
                }

                while (!bin || bin.length == 0) {
                    this.maxDepth--;
                    if (this.maxDepth < this.minDepth)
                        break;
                    bin = this.depthBins[this.maxDepth];
                }

            }

            return client;
        }

        /**
         * 从队列首弹出深度最小的一个对象
         */
        public shift():ILayoutManagerClient {
            var client:ILayoutManagerClient = null;

            if (this.minDepth <= this.maxDepth) {
                var bin:DepthBin = this.depthBins[this.minDepth];
                while (!bin || bin.length == 0) {
                    this.minDepth++;
                    if (this.minDepth > this.maxDepth)
                        return null;
                    bin = this.depthBins[this.minDepth];
                }

                for (var key in bin.items) {
                    client = <ILayoutManagerClient>key;
                    this.remove(client, this.minDepth);
                    break;
                }

                while (!bin || bin.length == 0) {
                    this.minDepth++;
                    if (this.minDepth > this.maxDepth)
                        break;
                    bin = this.depthBins[this.minDepth];
                }
            }

            return client;
        }

        /**
         * 移除大于等于指定组件层级的元素中最大的元素
         */
        public removeLargestChild(client:ILayoutManagerClient):Object {
            var max:number = this.maxDepth;
            var min:number = client.nestLevel;

            while (min <= max) {
                var bin:DepthBin = this.depthBins[max];
                if (bin && bin.length > 0) {
                    if (max == client.nestLevel) {
                        if (bin.items[client]) {
                            this.remove(client, max);
                            return client;
                        }
                    }
                    else {
//                    for (var key:Object in bin.items) {
//                        if ((key is DisplayObject) &&
//                        ( client is DisplayObjectContainer ) &&
//                        (client as DisplayObjectContainer).contains(DisplayObject(key)))
//                        {
//                            this.remove(ILayoutManagerClient(key), max);
//                            return key;
//                        }
//                    }
                    }
                    max--;
                }
                else {
                    if (max == this.maxDepth)
                        this.maxDepth--;
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
        public removeSmallestChild(client:ILayoutManagerClient):Object {
            var min:number = client.nestLevel;

            while (min <= this.maxDepth) {
                var bin:DepthBin = this.depthBins[min];
                if (bin && bin.length > 0) {
                    if (min == client.nestLevel) {
                        if (bin.items[client]) {
                            this.remove(client, min);
                            return client;
                        }
                    }
                    else {
//                    for (var key:Object in bin.items) {
//                        if ((key is DisplayObject) &&
//                        (client is DisplayObjectContainer) &&
//                        (client as DisplayObjectContainer).contains(DisplayObject(key)))
//                        {
//                            this.remove(ILayoutManagerClient(key), min);
//                            return key;
//                        }
//                    }
                    }

                    min++;
                }
                else {
                    if (min == this.minDepth)
                        this.minDepth++;
                    min++;
                    if (min > this.maxDepth)
                        break;
                }
            }

            return null;
        }

        /**
         * 移除一个元素
         */
        public remove(client:ILayoutManagerClient, level:number = -1):ILayoutManagerClient {
            var depth:number = (level >= 0) ? level : client.nestLevel;
            var bin:DepthBin = this.depthBins[depth];
            if (bin && bin.items[client] != null) {
                delete bin.items[client];
                bin.length--;
                return client;
            }
            return null;
        }

        /**
         * 清空队列
         */
        public removeAll():void {
            this.depthBins.length = 0;
            this.minDepth = 0;
            this.maxDepth = -1;
        }

        /**
         * 队列是否为空
         */
        public isEmpty():Boolean {
            return this.minDepth > this.maxDepth;
        }
    }

    /**
     * 列表项
     */
    export class DepthBin {
        constructor(){
            this.items = {};
        }

        public length:number;
        public items;
    }
}