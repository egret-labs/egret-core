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
     * @private
     * @language en_US
     * The Loader class is used to load image (JPG, PNG, or GIF) files. Use the load() method to initiate loading.
     * The loaded image data is in the data property of ImageLoader.
     * @event egret.Event.COMPLETE Emitted when the net request is complete.
     * @event egret.Event.IO_ERROR Emitted when the net request is failed.
     * @see egret.HttpRequest
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @private
     * @language zh_CN
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     * @event egret.Event.COMPLETE 加载完成
     * @event egret.Event.IO_ERROR 加载失败
     * @see egret.HttpRequest
     * @version Egret 2.0
     * @platform Web,Native
     */
    export interface GameImageLoader extends BaseImageLoader {
        /**
         * 
         * @param url 
         * @param callback 
         * @version Egret 2.0
         * @platform Web,Native
         */
        load(url:string, callback:(code:number, bitmapData:any)=>void):void;

    }

    /**
     * @private
     * @language en_US
     * Creates a ImageLoader object
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @private
     * @language zh_CN
     * 创建一个 ImageLoader 实例
     * @version Egret 2.0
     * @platform Web,Native
     */
    export var GameImageLoader:{
        new():GameImageLoader;
        disposeBitmapData(bitmapData:any):void;
    };
}