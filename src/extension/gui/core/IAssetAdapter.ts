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

module ns_egret {
    /**
     * @class ns_egret.IAssetAdapter
     * @interface
     * @classdesc
     * 素材适配器接口。
     * 若项目需要自定义UIAsset.source的解析规则，需要实现这个接口，
     * 然后调用Injector.mapClass("ns_egret.IAssetAdapter",YourAssetAdapter)注入到框架即可。
     */
    export interface IAssetAdapter{
        /**
         * 解析素材
         * @method ns_egret.IAssetAdapter#getAsset
         * @param source {any} 待解析的新素材标识符
         * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
         * 回调参数content接受两种类型：DisplayObject或Texture。
         * @param thisObject {any} compFunc的this引用
         * @param oldDisplay {DisplayObject} 旧的内容显示对象,传入值有可能为null。
         * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
         */
        getAsset(source:any,compFunc:Function,thisObject:any,oldDisplay:DisplayObject):void;
    }
}