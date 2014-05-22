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

/// <reference path="../../../egret/events/Event.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.UIEvent
	 * @classdesc
	 * UI事件
	 * @extends ns_egret.Event
	 */
	export class UIEvent extends Event{
		/**
		 * @method ns_egret.UIEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
			super(type, bubbles, cancelable);
		}
		/**
		 * 组件初始化开始 
		 * @constant ns_egret.UIEvent.INITIALIZE
		 */		
		public static INITIALIZE:string = "initialize";
		/**
		 * 组件创建完成 
		 * @constant ns_egret.UIEvent.CREATION_COMPLETE
		 */		
		public static CREATION_COMPLETE:string = "creationComplete";
		/**
		 * 组件的一次三个延迟验证渲染阶段全部完成 
		 * @constant ns_egret.UIEvent.UPDATE_COMPLETE
		 */		
		public static UPDATE_COMPLETE:string = "updateComplete";
		/**
		 * 当用户按下ButtonBase控件时分派。如果 autoRepeat属性为 true，则只要按钮处于按下状态，就将重复分派此事件。
		 * @constant ns_egret.UIEvent.BUTTON_DOWN
		 */		
		public static BUTTON_DOWN:string = "buttonDown";
		/**
		 * 改变结束
		 * @constant ns_egret.UIEvent.CHANGE_END
		 */		
		public static CHANGE_END:string = "changeEnd";
		
		/**
		 * 改变开始
		 * @constant ns_egret.UIEvent.CHANGE_START
		 */		
		public static CHANGE_START:string = "changeStart";
		
		/**
		 * 正在改变中
		 * @constant ns_egret.UIEvent.CHANGING
		 */	
		public static CHANGING:string = "changing";
		/**
		 * 值发生改变
		 * @constant ns_egret.UIEvent.VALUE_COMMIT
		 */		
		public static VALUE_COMMIT:string = "valueCommit";
		/**
		 * SkinnableComponent皮肤发生改变
		 * @constant ns_egret.UIEvent.SKIN_CHANGED
		 */		
		public static SKIN_CHANGED:string = "skinChanged";

		/**
		 * UIAsset的content属性解析完成
		 * @constant ns_egret.UIEvent.CONTENT_CHANGED
		 */
		public static CONTENT_CHANGED:string = "contentChanged";

		/**
		 * 下拉框弹出事件
		 * @constant ns_egret.UIEvent.OPEN
		 */		
		public static OPEN:string = "open";
		/**
		 * 下拉框关闭事件
		 * @constant ns_egret.UIEvent.CLOSE
		 */		
		public static CLOSE:string = "close";
		
		/**
		 * UIMoveClip一次播放完成事件。仅当UIMovieClip.totalFrames>1时会抛出此事件。 
		 * @constant ns_egret.UIEvent.PLAY_COMPLETE
		 */		
		public static PLAY_COMPLETE:string = "playComplete"

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.UIEvent.dispatchUIEvent
         */
        public static dispatchUIEvent(target:IEventDispatcher,type:string):void{
            var eventClass:any = UIEvent;
            Event._dispatchByTarget(eventClass,target,type);
        }
	}
}