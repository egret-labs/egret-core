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

	export class EffectEvent extends Event{
		/**
		 * 动画播放结束
		 */		
		public static EFFECT_END:string = "effectEnd";
		/**
		 * 动画播放被停止
		 */		
		public static EFFECT_STOP:string = "effectStop";
		/**
		 * 动画播放开始
		 */		
		public static EFFECT_START:string = "effectStart";
		/**
		 * 动画开始重复播放
		 */		
		public static EFFECT_REPEAT:string = "effectRepeat";
		/**
		 * 动画播放更新
		 */		
		public static EFFECT_UPDATE:string = "effectUpdate";
		
		/**
		 * 构造函数
		 */		
		public constructor(eventType:string, bubbles:boolean = false,
									cancelable:boolean = false){
			super(eventType, bubbles, cancelable);
		}
	}
	
}
