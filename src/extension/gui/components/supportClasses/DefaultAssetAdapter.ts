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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/net/URLLoader.ts"/>
/// <reference path="../../../../egret/net/URLLoaderDataFormat.ts"/>
/// <reference path="../../../../egret/net/URLRequest.ts"/>
/// <reference path="../../../../egret/texture/Texture.ts"/>
/// <reference path="../../core/IAssetAdapter.ts"/>

module ns_egret {
    /**
     * @class ns_egret.DefaultAssetAdapter
     * @classdesc
     * 默认的IAssetAdapter接口实现
     * @implements ns_egret.IAssetAdapter
     */
    export class DefaultAssetAdapter implements IAssetAdapter{
        /**
         * 构造函数
         * @method ns_egret.DefaultSkinAdapter#constructor
         */
        public constructor(){
        }
        /**
         * 解析素材
         * @method ns_egret.DefaultAssetAdapter#getAsset
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
                var loader:URLLoader = new URLLoader();
                loader.dataFormat = URLLoaderDataFormat.TEXTURE;
                loader.addEventListener(Event.COMPLETE, function(event:Event){
                    content = loader.data;
                    compFunc.call(thisObject,content,source);
                }, this);
                loader.load(new URLRequest(url));
            }
            else{
                compFunc.call(thisObject,content,source);
            }
        }
    }
}