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

module EXML {

    var parser = new swan.sys.EXMLParser();

    var loaderPool:egret.URLLoader[] = [];
    var callBackMap:any = {};
    var loaderMap:any = {};

    /**
     * @language en_US
     * Parsing a text of EXML file for a definition of class. You can declare the <code>class</code> property in the root
     * node of the EXML to register to the global as a class name.
     *
     * It will be fail to register and output a warning if the specified name already exists. You can get a definition
     * of a class through <code>egret.getDefinitionByName(className)</code>.
     *
     * @param text the text of a EXML file.
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 解析一个 EXML 文件的文本内容为一个类定义。您可以在 EXML 文件的根节点上声明 class 属性作为要注册到全局的类名。
     * 若指定的类名已经存在，将会注册失败，并输出一个警告。注册成功后，您也可以通过 egret.getDefinitionByName(className) 方法获取这个 EXML 文件对应的类定义。
     *
     * @param text 要解析的 EXML 文件内容。
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     */
    export function parse(text:string):{new():any} {
        return parser.parse(text);
    }

    /**
     * @language en_US
     * Load and parse an external EXML file for a class definition. You can declare the <code>class</code> property in the root
     * node of the EXML to register to the global as a class name.
     *
     * It will be fail to register and output a warning if the specified name already exists. You can get a definition
     * of a class through <code>egret.getDefinitionByName(className)</code>.
     *
     * @param url the path of an EXML file
     * @param callBack method to invoke with an argument of the result when load and parse completed or failed. The argument will be
     * <code>undefined</code> if load or parse failed.
     * @param thisObject <code>this</code> object of callBack
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 加载并解析一个外部的 EXML 文件为一个类定义。您可以在 EXML 文件的根节点上声明 class 属性作为要注册到全局的类名。
     * 若指定的类名已经存在，将会注册失败，并输出一个警告。注册成功后，您也可以通过 egret.getDefinitionByName(className) 方法获取这个 EXML 文件对应的类定义。
     *
     * @param url 要加载的 EXML 文件路径
     * @param callBack 加载并解析完成后的回调函数，无论加载成功还是失败，此函数均会被回调。失败时将传入 undefined 作为回调函数参数。
     * @param thisObject 回调函数的 this 引用。
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     */
    export function load(url:string, callBack?:(clazz:any, url:string)=>void, thisObject?:any):void {
        if (DEBUG) {
            if (!url) {
                egret.$error(1003, "url");
            }
        }
        var list = callBackMap[url];
        if (list) {
            list.push([callBack, thisObject]);
            return;
        }
        var loader = loaderPool.pop();
        if (!loader) {
            var loader:egret.URLLoader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        }
        callBackMap[url] = [[callBack, thisObject]];
        loaderMap[loader.$hashCode] = url;
        loader.addEventListener(egret.Event.COMPLETE, onLoadFinish, null);
        loader.addEventListener(egret.Event.IO_ERROR, onLoadFinish, null);
        loader.load(new egret.URLRequest(url));
    }

    /**
     * @private
     * 
     * @param event 
     */
    function onLoadFinish(event:egret.Event):void {
        var loader:egret.URLLoader = <egret.URLLoader> (event.target);

        loader.removeEventListener(egret.Event.COMPLETE, onLoadFinish, null);
        loader.removeEventListener(egret.Event.IO_ERROR, onLoadFinish, null);
        var text:string = event.type == egret.Event.COMPLETE ? loader.data : "";
        if (text) {
            var clazz = parse(text);
        }
        loaderPool.push(loader);
        var url = loaderMap[loader.$hashCode];
        delete loaderMap[loader.$hashCode];
        var list:any[] = callBackMap[url];
        delete callBackMap[url];
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var arr = list[i];
            if (arr[0] && arr[1])
                arr[0].call(arr[1], clazz, url);
        }
    }

}