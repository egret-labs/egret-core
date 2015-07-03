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
    //1~1000预留给lark包下的类和接口
    /**
     * @language en_US
     * Provides constant enum values for type checking in the module of Lark. It is usually passed as the parameters of the egret.is() method.
     * @see egret.is()
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 为Lark框架内的类或接口定义的枚举值。通常作为实例检查类型 egret.is() 方法的参数。
     * @see egret.is()
     * @version Egret 2.0
     * @platform Web,Native
     */
    export const enum Types {
        /**
         * @copy egret.IEventDispatcher
         * @version Egret 2.0
         * @platform Web,Native
         */
        IEventDispatcher = 1,
        /**
         * @copy egret.EventDispatcher
         * @version Egret 2.0
         * @platform Web,Native
         */
        EventDispatcher = 2,
        /**
         * @copy egret.DisplayObject
         * @version Egret 2.0
         * @platform Web,Native
         */
        DisplayObject = 3,
        /**
         * @copy egret.DisplayObjectContainer
         * @version Egret 2.0
         * @platform Web,Native
         */
        DisplayObjectContainer = 4,
        /**
         * @copy egret.Sprite
         * @version Egret 2.0
         * @platform Web,Native
         */
        Sprite = 5,
        /**
         * @copy egret.Bitmap
         * @version Egret 2.0
         * @platform Web,Native
         */
        Bitmap = 6,
        /**
         * @copy egret.BitmapData
         * @version Egret 2.0
         * @platform Web,Native
         */
        BitmapData = 7,
        /**
         * @copy egret.Graphics
         * @version Egret 2.0
         * @platform Web,Native
         */
        Graphics = 8,
        /**
         * @copy egret.Shape
         * @version Egret 2.0
         * @platform Web,Native
         */
        Shape = 9,
        /**
         * @copy egret.Stage
         * @version Egret 2.0
         * @platform Web,Native
         */
        Stage = 10,
        /**
         * @copy egret.Event
         * @version Egret 2.0
         * @platform Web,Native
         */
        Event = 11,
        /**
         * @copy egret.TimerEvent
         * @version Egret 2.0
         * @platform Web,Native
         */
        TimerEvent = 12,
        /**
         * @copy egret.TouchEvent
         * @version Egret 2.0
         * @platform Web,Native
         */
        TouchEvent = 13,
        /**
         * @copy egret.ProgressEvent
         * @version Egret 2.0
         * @platform Web,Native
         */
        ProgressEvent = 14,
        /**
         * @copy egret.Matrix
         * @version Egret 2.0
         * @platform Web,Native
         */
        Matrix = 15,
        /**
         * @copy egret.Point
         * @version Egret 2.0
         * @platform Web,Native
         */
        Point = 16,
        /**
         * @copy egret.Rectangle
         * @version Egret 2.0
         * @platform Web,Native
         */
        Rectangle = 17,
        /**
         * @copy egret.TextField
         * @version Egret 2.0
         * @platform Web,Native
         */
        TextField = 18,
        /**
         * @copy egret.HttpRequest
         * @version Egret 2.0
         * @platform Web,Native
         */
        HttpRequest = 19,
        /**
         * @copy egret.ImageLoader
         * @version Egret 2.0
         * @platform Web,Native
         */
        ImageLoader = 20,
        /**
         * @copy egret.TextInput
         * @version Egret 2.0
         * @platform Web,Native
         */
        TextInput = 21,
        /**
         * @copy egret.IDisplayObjectContainer
         * @version Egret 2.0
         * @platform Web,Native
         */
        IDisplayObjectContainer = 22,

        /**
         * @copy egret.GraGraphicsRenderContextphics
         * @version Egret 2.0
         * @platform Web,Native
         */
        GraphicsRenderContext = 23,

        /**
         * @copy egret.ScrollView
         * @version Egret 2.0
         * @platform Web,Native
         */
        ScrollView = 24,

    }
}