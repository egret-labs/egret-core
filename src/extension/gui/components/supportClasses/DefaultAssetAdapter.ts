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
     * @class egret.gui.DefaultAssetAdapter
     * @classdesc
     * 默认的IAssetAdapter接口实现
     * @implements egret.gui.IAssetAdapter
     */
    export class DefaultAssetAdapter implements IAssetAdapter{
        /**
         * 构造函数
         * @method egret.gui.DefaultSkinAdapter#constructor
         */
        public constructor(){
        }
        /**
         * 解析素材
         * @param source {any} 待解析的新素材标识符
         * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
         * 回调参数content接受两种类型：DisplayObject或Texture。
         * @param thisObject {any} compFunc的this引用
         * @param oldContent any 旧的内容对象,传入值有可能为null。
         * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
         */
        public getAsset(source:any,compFunc:Function,thisObject:any,oldContent:any):void{
            var content:any = source;
            if(source.prototype){
                content = new source();
            }
            if(content instanceof DisplayObject||content instanceof Texture){
                compFunc.call(thisObject,content,source);
            }
            else if(typeof(source)=="string"){
                var url:string = <string>source;
                var loader:ImageLoader = new ImageLoader();
                loader.addEventListener(Event.COMPLETE, function(event:Event){
                    content = new egret.Texture();
                    content._setBitmapData(loader.data);
                    compFunc.call(thisObject,content,source);
                }, this);
                loader.load(url);
            }
            else{
                compFunc.call(thisObject,content,source);
            }
        }

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
            var loader:egret.HttpRequest = new HttpRequest();
            loader.addEventListener(Event.COMPLETE,onGet,thisObject);
            loader.addEventListener(IOErrorEvent.IO_ERROR,errorFunc,thisObject);
            loader.responseType = egret.HttpResponseType.TEXT;
            loader.open(url);
            loader.send();
        }
    }
}