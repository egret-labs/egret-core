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
     * Interface of asset adapter.
     * If your project need to custom the resource parsing rule, you need to implement the <code>IAssetAdapter</code>.
     * And use the following code to inject it to the system:
     * <pre>
     *      var assetAdapter = new YourAssetAdapter();
     *      Stage.registerImplementation("eui.IAssetAdapter",assetAdapter)
     * </pre>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 素材适配器接口。
     * 若项目需要自定义 Image.source的解析规则，需要实现这个接口，
     * 然后调用如下代码注入自定义实现到框架即可：
     * <pre>
     *      var assetAdapter = new YourAssetAdapter();
     *      Stage.registerImplementation("eui.IAssetAdapter",assetAdapter)
     * </pre>
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export interface IAssetAdapter{
        /**
         * @language en_US
         * parsing a source to asset.
         * @param source identifier of a new asset need to be resolved.
         * @param callBack called when complete resolving. Example：callBack(content:any,source:string):void;
         * @param thisObject <code>this</code> object of callback.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 解析素材。
         * @param source 待解析的新素材标识符。
         * @param callBack 解析完成回调函数，示例：callBack(content:any,source:string):void;。
         * @param thisObject callBack的this引用。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        getAsset(source: string, callBack: (content: any, source: string) => void, thisObject: any): void;
    }
}