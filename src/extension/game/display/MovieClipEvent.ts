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
     * @language en_US
     * When the movieClip's current frame have a frameLabel, dispatches MovieClipEvent object. FrameLabel Event type: MovieClipEvent.FRAME_LABEL
     * @version Egret 2.4
     * @platform Web,Native
     */
  	/**
     * @language zh_CN
     * 当动画的当前帧有事件，将调度 MovieClipEvent 对象。帧事件类型 MovieClipEvent.FRAME_LABEL.
  	 * @version Egret 2.4
     * @platform Web,Native
  	 */
    export class MovieClipEvent extends Event {

        /**
         * @language en_US
         * TextEvent create an object that contains information about movieClip events.
         * @param type Type of event, you can access the MovieClipEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param frameLabel When the current frame have a frameLabel, the event listeners can access this information through the frameLabel property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 MovieClipEvent 对象，其中包含有关帧事件的信息。
         * @param type 事件的类型，可以作为 MovieClipEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param frameLabel 动画上的帧事件。事件侦听器可以通过 frameLabel 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, frameLabel: string = null) {
            super(type, bubbles, cancelable);
            this.frameLabel = frameLabel;
        }     

        /**
         * @language en_US
         * Dispatched whenever the current frame have a frameLabel.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画的当前帧上有事件时调度
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FRAME_LABEL: string = "frame_label";

        /**
         * @language en_US
         * In MovieClipEvent.FRAME_LABEL event, event corresponding string.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在 MovieClipEvent.FRAME_LABEL 事件中，event对应的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public frameLabel: string = null;

        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown MovieClipEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param frameLabel  MovieClipEvent object frameLabel
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出 MovieClipEvent 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param frameLabel  MovieClipEvent 对象的 frameLabel 赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel: string = null): boolean {
            var event: MovieClipEvent = Event.create(MovieClipEvent, type);
            event.frameLabel = frameLabel;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}
