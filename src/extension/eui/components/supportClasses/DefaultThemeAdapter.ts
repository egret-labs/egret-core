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


module eui {

    /**
     * @language en_US
     * Default instance of interface <code>IThemeAdapter</code>.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 默认的IThemeAdapter接口实现。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class DefaultThemeAdapter implements IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
            function onGet(event:egret.Event):void {
                var loader:egret.HttpRequest = <egret.HttpRequest> (event.target);
                compFunc.call(thisObject, loader.response);
            }
            function onError(event:egret.Event):void {
                errorFunc.call(thisObject);
            }
            var loader:egret.HttpRequest = new egret.HttpRequest();
            loader.addEventListener(egret.Event.COMPLETE,onGet,thisObject);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR,onError,thisObject);
            loader.responseType = egret.HttpResponseType.TEXT;
            loader.open(url);
            loader.send();
        }
    }
}