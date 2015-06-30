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
     */
    /**
     * @language zh_CN
     * 为Lark框架内的类或接口定义的枚举值。通常作为实例检查类型 egret.is() 方法的参数。
     * @see egret.is()
     */
    export const enum Types {
        /**
         * @copy egret.IEventDispatcher
         */
        IEventDispatcher = 1,
        /**
         * @copy egret.EventDispatcher
         */
        EventDispatcher = 2,
        /**
         * @copy egret.DisplayObject
         */
        DisplayObject = 3,
        /**
         * @copy egret.DisplayObjectContainer
         */
        DisplayObjectContainer = 4,
        /**
         * @copy egret.Sprite
         */
        Sprite = 5,
        /**
         * @copy egret.Bitmap
         */
        Bitmap = 6,
        /**
         * @copy egret.BitmapData
         */
        BitmapData = 7,
        /**
         * @copy egret.Graphics
         */
        Graphics = 8,
        /**
         * @copy egret.Shape
         */
        Shape = 9,
        /**
         * @copy egret.Stage
         */
        Stage = 10,
        /**
         * @copy egret.Event
         */
        Event = 11,
        /**
         * @copy egret.TimerEvent
         */
        TimerEvent = 12,
        /**
         * @copy egret.TouchEvent
         */
        TouchEvent = 13,
        /**
         * @copy egret.ProgressEvent
         */
        ProgressEvent = 14,
        /**
         * @copy egret.Matrix
         */
        Matrix = 15,
        /**
         * @copy egret.Point
         */
        Point = 16,
        /**
         * @copy egret.Rectangle
         */
        Rectangle = 17,
        /**
         * @copy egret.TextField
         */
        TextField = 18,
        /**
         * @copy egret.HttpRequest
         */
        HttpRequest = 19,
        /**
         * @copy egret.ImageLoader
         */
        ImageLoader = 20,
        /**
         * @copy egret.TextInput
         */
        TextInput = 21,
        /**
         * @copy egret.IDisplayObjectContainer
         */
        IDisplayObjectContainer = 22,

        /**
         * @copy egret.GraGraphicsRenderContextphics
         */
        GraphicsRenderContext = 23,

        /**
         * @copy egret.ScrollView
         */
        ScrollView = 24,

    }
}