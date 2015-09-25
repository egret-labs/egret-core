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
	 * @class egret.gui.UIEvent
	 * @classdesc
	 * UI事件
	 * @extends egret.Event
	 */
	export class UIEvent extends Event{
		/**
		 * @method egret.gui.UIEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
			super(type, bubbles, cancelable);
		}
		/**
		 * 组件初始化开始 
		 * @constant egret.gui.UIEvent.INITIALIZE
		 */		
		public static INITIALIZE:string = "initialize";
		/**
		 * 组件创建完成 
		 * @constant egret.gui.UIEvent.CREATION_COMPLETE
		 */		
		public static CREATION_COMPLETE:string = "creationComplete";
		/**
		 * 组件的一次三个延迟验证渲染阶段全部完成 
		 * @constant egret.gui.UIEvent.UPDATE_COMPLETE
		 */		
		public static UPDATE_COMPLETE:string = "updateComplete";
		/**
		 * 当用户按下ButtonBase控件时分派。如果 autoRepeat属性为 true，则只要按钮处于按下状态，就将重复分派此事件。
		 * @constant egret.gui.UIEvent.BUTTON_DOWN
		 */		
		public static BUTTON_DOWN:string = "buttonDown";
		/**
		 * 改变结束
		 * @constant egret.gui.UIEvent.CHANGE_END
		 */		
		public static CHANGE_END:string = "changeEnd";
		
		/**
		 * 改变开始
		 * @constant egret.gui.UIEvent.CHANGE_START
		 */		
		public static CHANGE_START:string = "changeStart";
		
		/**
		 * 正在改变中
		 * @constant egret.gui.UIEvent.CHANGING
		 */	
		public static CHANGING:string = "changing";
		/**
		 * 值发生改变
		 * @constant egret.gui.UIEvent.VALUE_COMMIT
		 */		
		public static VALUE_COMMIT:string = "valueCommit";
		/**
		 * SkinnableComponent皮肤发生改变
		 * @constant egret.gui.UIEvent.SKIN_CHANGED
		 */		
		public static SKIN_CHANGED:string = "skinChanged";

		/**
		 * UIAsset的content属性解析完成
		 * @constant egret.gui.UIEvent.CONTENT_CHANGED
		 */
		public static CONTENT_CHANGED:string = "contentChanged";

		/**
		 * 下拉框弹出事件
		 * @constant egret.gui.UIEvent.OPEN
		 */		
		public static OPEN:string = "open";
		/**
		 * 下拉框关闭事件
		 * @constant egret.gui.UIEvent.CLOSE
		 */		
		public static CLOSE:string = "close";
		
		/**
		 * UIMoveClip一次播放完成事件。仅当UIMovieClip.totalFrames>1时会抛出此事件。 
		 * @constant egret.gui.UIEvent.PLAY_COMPLETE
		 */		
		public static PLAY_COMPLETE:string = "playComplete"

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.UIEvent.dispatchUIEvent
         */
        public static dispatchUIEvent(target:IEventDispatcher,type:string):boolean{
			var event:UIEvent = Event.create(UIEvent, type);
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }
	}
}