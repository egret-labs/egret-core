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


module egret.gui {

    /**
     * @class egret.gui.RendererExistenceEvent
     * @classdesc
     * 在DataGroup添加或删除项呈示器时分派的事件。
     * @extends egret.Event
     */
    export class RendererExistenceEvent extends Event {
        /**
         * 添加了项呈示器
         * @constant egret.gui.RendererExistenceEvent.RENDERER_ADD
         */
        public static RENDERER_ADD:string = "rendererAdd";
        /**
         * 移除了项呈示器
         * @constant egret.gui.RendererExistenceEvent.RENDERER_REMOVE
         */
        public static RENDERER_REMOVE:string = "rendererRemove";

        /**
         * @method egret.gui.RendererExistenceEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param renderer {IItemRenderer}
         * @param index {number}
         * @param data {any}
         */
        public constructor(type:string, bubbles:boolean = false,
                           cancelable:boolean = false, renderer:IItemRenderer = null,
                           index:number = -1, data:any = null) {
            super(type, bubbles, cancelable);

            this.renderer = renderer;
            this.index = index;
            this.data = data;
        }

        /**
         * 呈示器的数据项目。
         * @member egret.gui.RendererExistenceEvent#data
         */
        public data:any = null;

        /**
         * 指向已添加或删除项呈示器的位置的索引。
         * @member egret.gui.RendererExistenceEvent#index
         */
        public index:number = NaN;

        /**
         * 对已添加或删除的项呈示器的引用。
         * @member egret.gui.RendererExistenceEvent#renderer
         */
        public renderer:IItemRenderer = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.RendererExistenceEvent.dispatchRendererExistenceEvent
         */
        public static dispatchRendererExistenceEvent(target:IEventDispatcher, type:string, renderer:IItemRenderer = null,
                                                     index:number = -1, data:any = null):boolean {
            var event:RendererExistenceEvent = Event.create(RendererExistenceEvent, type);
            event.renderer = renderer;
            event.index = index;
            event.data = data;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }

        public clean():void {
            super.clean();
            this.data = null;
            this.index = NaN;
            this.renderer = null;
        }
    }
}