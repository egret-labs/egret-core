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

/// <reference path="Ticker.ts"/>
/// <reference path="devices/DeviceContext.ts"/>
/// <reference path="interactive/TouchContext.ts"/>
/// <reference path="net/NetContext.ts"/>
/// <reference path="renderer/RendererContext.ts"/>
/// <reference path="sound/SoundContext.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../display/Stage.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../utils/Recycler.ts"/>
/// <reference path="../utils/callLater.ts"/>

module ns_egret{
    /**
	 * @class ns_egret.MainContext
	 * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
	 * @extends ns_egret.EventDispatcher
     */
    export class MainContext extends EventDispatcher {

        constructor() {
            super();
        }

        /**
         * 渲染Context
		 * @member ns_egret.MainContext#rendererContext
         */
        public rendererContext:RendererContext;

        /**
         * 触摸Context
		 * @member ns_egret.MainContext#touchContext
         */
        public touchContext:TouchContext;

        /**
         * 声音Context
		 * @member ns_egret.MainContext#soundContext
         */
        public soundContext:SoundContext;

        /**
         * 网络Context
		 * @member ns_egret.MainContext#netContext
         */
        public netContext:NetContext;

        /**
         * 设备divice
		 * @member ns_egret.MainContext#deviceContext
         */
        public deviceContext:DeviceContext;

        /**
         * 舞台
		 * @member ns_egret.MainContext#stage
         */
        public stage:Stage;

        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
		 * @method ns_egret.MainContext#run
         */
        public run() {
            Ticker.getInstance().run();
            Ticker.getInstance().register(this.renderLoop, this, Number.NEGATIVE_INFINITY);
            Ticker.getInstance().register(this.broadcastEnterFrame, this, Number.POSITIVE_INFINITY);
            this.touchContext.run();
        }

        /**
         * 滑动跑道模型，渲染部分
         */
        private renderLoop(frameTime:number) {
            var context = this.rendererContext;
            context.clearScreen();
            this.dispatchEventWith(Event.RENDER);
            if(Stage._invalidateRenderFlag){
                this.broadcastRender();
                Stage._invalidateRenderFlag = false;
            }
            this.doCallLaterList();
            this.stage._updateTransform();
            this.dispatchEventWith(Event.FINISH_UPDATE_TRANSFORM);
            this.stage._draw(context);
            this.dispatchEventWith(Event.FINISH_RENDER);
        }

        private reuseEvent:Event = new Event("")
        /**
         * 广播EnterFrame事件。
         */
        private broadcastEnterFrame(frameTime:number):void {

            var event:Event = this.reuseEvent;
            event._type = Event.ENTER_FRAME;
            this.dispatchEvent(event);
            var list:Array<any> = DisplayObject._enterFrameCallBackList.concat();
            var length:number = list.length;
            for(var i:number = 0;i<length;i++){
                var eventBin:any = list[i];
                event._target = eventBin.display;
                event._setCurrentTarget(eventBin.display);
                eventBin.listener.call(eventBin.thisObject,event);
            }

            list = Recycler._callBackList;
            for(i=list.length-1;i>=0;i--){
                list[i]._checkFrame();
            }
        }
        /**
         * 广播Render事件。
         */
        private broadcastRender():void{
            var event:Event = this.reuseEvent;
            event._type = Event.RENDER;
            var list:Array<any> = DisplayObject._renderCallBackList.concat();
            var length:number = list.length;
            for(var i:number = 0;i<length;i++){
                var eventBin:any = list[i];
                event._target = eventBin.display;
                event._setCurrentTarget(eventBin.display);
                eventBin.listener.call(eventBin.thisObject,event);
            }
        }
        /**
         * 执行callLater回调函数列表
         */
        private doCallLaterList():void{
            if(__callLaterFunctionList.length==0){
                return;
            }
            var funcList:Array<any> = __callLaterFunctionList;
            __callLaterFunctionList = [];
            var thisList:Array<any> = __callLaterThisList;
            __callLaterThisList = [];
            var argsList:Array<any> = __callLaterArgsList;
            __callLaterArgsList = [];
            var length:number = funcList.length;
            for(var i:number=0;i<length;i++){
                var func:Function = funcList[i];
                if(func!=null){
                    func.apply(thisList[i],argsList[i]);
                }
            }
        }

		/**
		 * @member ns_egret.MainContext.instance
		 */
        public static instance:ns_egret.MainContext;

    }
}

ns_egret.MainContext.instance = new ns_egret.MainContext();