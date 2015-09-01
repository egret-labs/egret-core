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
     * The XMLNode class is the base class for all xml node.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XML节点基类
     * @version Lark 1.0
     * @platform Web,Native
     */
    export interface XMLNode {
        /**
         * @language en_US
         * a integer representing the type of the node, 1：XML，2：XMLAttribute，3：XMLText
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点类型，1：XML，2：XMLAttribute，3：XMLText
         * @version Lark 1.0
         * @platform Web,Native
         */
        nodeType:number;
        /**
         * @language en_US
         * the parent node of this xml node.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点所属的父级节点
         * @version Lark 1.0
         * @platform Web,Native
         */
        parent: XML;
    }

    /**
     * @language en_US
     * The XML class contains properties for working with XML objects.
     * @version Lark 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/lark/utils/XMLExample.ts
     */
    /**
     * @language zh_CN
     * XML 类包含用于处理 XML 对象的属性。
     * @version Lark 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/lark/utils/XMLExample.ts
     */
    export interface XML extends XMLNode {
        /**
         * @language en_US
         * the attributes of this xml node.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前节点上的属性列表
         * @version Lark 1.0
         * @platform Web,Native
         */
        attributes:any;
        /**
         * @language en_US
         * the children of the xml node.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前节点的子节点列表
         * @version Lark 1.0
         * @platform Web,Native
         */
        children:XMLNode[];
        /**
         * @language en_US
         * the full name of this xml node. For example,the name of <s:Button/> is "s:Button".
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点完整名称。例如节点 <s:Button/> 的 name 为："s:Button"
         * @version Lark 1.0
         * @platform Web,Native
         */
        name:string;
        /**
         * @language en_US
         * thie namesapce prefix of this xml node.For example,the prefix of <s:Button/> is "s".
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的命名空间前缀。例如节点 <s:Button/> 的 prefix 为：s
         * @version Lark 1.0
         * @platform Web,Native
         */
        prefix: string;
        /**
         * @language en_US
         * the local name of this xml node. For example,the local name of <s:Button/> is "Button".
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的本地名称。例如节点 <s:Button/> 的 localName 为：Button
         * @version Lark 1.0
         * @platform Web,Native
         */
        localName:string;
        /**
         * @language en_US
         * the namesapce uri of this xml node.For example,the namespace uri of <s:Skin xmlns:s="http://ns.egret.com/eui"/> is "http://ns.egret.com/eui".
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的命名空间地址。例如节点 <s:Skin xmlns:s="http://ns.egret.com/eui"/> 的 namespace 为： http://ns.egret.com/eui
         * @version Lark 1.0
         * @platform Web,Native
         */
        namespace: string;
    }

    /**
     * @language en_US
     * The XMLText class represents a string node in the XML.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XMLText 类表示在XML中的文本节点
     * @version Lark 1.0
     * @platform Web,Native
     */
    export interface XMLText extends XMLNode {
        /**
         * @language en_US
         * the text content
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本内容
         * @version Lark 1.0
         * @platform Web,Native
         */
        text:string;
    }

    /**
     * @language en_US
     * The XML class contains properties for working with XML objects.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XML 类包含用于处理 XML 对象的属性。
     * @version Lark 1.0
     * @platform Web,Native
     */
    export var XML:{
        /**
         * @language en_US
         * parses a text to XML instance.
         * @param text the text to be parsed.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 解析字符串为XML对象
         * @param text 要解析的XML对象。
         * @version Lark 1.0
         * @platform Web,Native
         */
        parse(text:string):XML;
    };
}