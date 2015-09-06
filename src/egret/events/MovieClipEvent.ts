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


module egret {

  	/**
  	 * @class egret.MovieClipEvent
  	 * @classdesc
     * 使用 MovieClipEvent 类，可以获取帧标签触发的事件
  	 */
    export class MovieClipEvent extends Event {

        /**
         * 创建一个 egret.MovieClipEvent 对象
         * @method egret.MovieClipEvent#constructor
         * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles {boolean} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         */
        public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, frameLabel: string = null) {
            super(type, bubbles, cancelable);
            this.frameLabel = frameLabel;
        }
        /**
         * 当前的帧标签
         * @type {string}
         */
        public frameLabel: string = null;
        /**
         * 动画的某一帧上有标签时会触发事件
         * @type {string}
         */
        public static FRAME_LABEL: string = "frame_label";

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
  		   * @method egret.TimerEvent.dispatchMovieClipEvent
  		   * @param target {egret.IEventDispatcher} 派发事件目标
  		   * @param type {string} 事件类型
  		   * @param type {string} 具体的自定义帧事件
         */
        public static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel: string = null): void {
            var eventClass: any = MovieClipEvent;
            var props: any = egret.Event._getPropertyData(eventClass);
            props.frameLabel = frameLabel;
            Event._dispatchByTarget(eventClass, target, type, props);
        }
    }
}
