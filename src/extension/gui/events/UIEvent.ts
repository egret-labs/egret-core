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

	export class UIEvent extends Event{
		public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
			super(type, bubbles, cancelable);
		}
		/**
		 * 组件初始化开始 
		 */		
		public static INITIALIZE:string = "initialize";
		/**
		 * 组件创建完成 
		 */		
		public static CREATION_COMPLETE:string = "creationComplete";
		/**
		 * 组件的一次三个延迟验证渲染阶段全部完成 
		 */		
		public static UPDATE_COMPLETE:string = "updateComplete";
		/**
		 * 当用户按下ButtonBase控件时分派。如果 autoRepeat属性为 true，则只要按钮处于按下状态，就将重复分派此事件。
		 */		
		public static BUTTON_DOWN:string = "buttonDown";
		/**
		 * 改变结束
		 */		
		public static CHANGE_END:string = "changeEnd";
		
		/**
		 * 改变开始
		 */		
		public static CHANGE_START:string = "changeStart";
		
		/**
		 * 正在改变中
		 */	
		public static CHANGING:string = "changing";
		/**
		 * 值发生改变
		 */		
		public static VALUE_COMMIT:string = "valueCommit";
		/**
		 * 皮肤发生改变
		 */		
		public static SKIN_CHANGED:string = "skinChanged";
		
		/**
		 * 下拉框弹出事件
		 */		
		public static OPEN:string = "open";
		/**
		 * 下拉框关闭事件
		 */		
		public static CLOSE:string = "close";
		
		/**
		 * UIMoveClip一次播放完成事件。仅当UIMovieClip.totalFrames>1时会抛出此事件。 
		 */		
		public static PLAY_COMPLETE:string = "playComplete"
	}
}